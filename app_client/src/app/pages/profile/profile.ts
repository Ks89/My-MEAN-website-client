import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ProfileService } from '../../common/services/profile';
import { AuthService } from '../../common/services/auth';

@Component({
  selector: 'mmw-profile-page',
  styleUrls: ['profile.scss'],
  templateUrl: 'profile.html'
})
export default class ProfileComponent implements OnInit, OnDestroy {
  public pageHeader: Object;
  public formModel: FormGroup;
  public token: string;
  public bigProfileImage: string = 'assets/images/profile/bigProfile.png';
  public profileAlert: Object = { visible: false }; // hidden by default
  public isWaiting: boolean = false; // enable button's spinner

  public sidebar: Object = {
    title: 'Other services',
    strapline: ' '
  };

  // 3dparty connect links
  public facebookConnectOauthUrl: Object = 'api/connect/facebook';
  public googleConnectOauthUrl: Object = 'api/connect/google';
  public githubConnectOauthUrl: Object = 'api/connect/github';
  public twitterConnectOauthUrl: Object = 'api/connect/twitter';
  public linkedinConnectOauthUrl: Object = 'api/connect/linkedin';

  // local model
  public local: any = {
    name: '',
    email: ''
  };
  // 3dparty model
  public github: any = this.buildJsonUserData();
  public google: any = this.buildJsonUserData();
  public facebook: any = this.buildJsonUserData();
  public twitter: any = this.buildJsonUserData();
  public linkedin: any = this.buildJsonUserData();

  // profile model
  public profileData = {
    localUserEmail: '',
    id: '',
    serviceName: '',
    name : '',
    surname: '',
    nickname: '',
    email : ''
  };

  // used to get a reference to the modal dialog content
  @ViewChild('modalDialogContent') modalDialogContent;

  private _subscription: Subscription;

  constructor(private _profileService: ProfileService,
    private _route: ActivatedRoute, private _router: Router,
    private _authService: AuthService, private _modalService: NgbModal) {
      this.token = _route.snapshot.params['token'];

      if (this.token === null || this.token === undefined ) {
        console.log('profile page loaded without token');
      } else {
        console.log(`Profile page loaded with token ${this.token}`);
      }

      this.pageHeader = {
        title: 'Profile',
        strapline: 'Welcome'
      };

      const fb = new FormBuilder();
      this.formModel = fb.group({
        'name': [null, Validators.minLength(3)],
        'surname': [null, Validators.minLength(3)],
        'nickname': [null, Validators.minLength(3)],
        'email': [null, Validators.minLength(3)]
      })
    }

    ngOnInit() {
      console.log('INIT');
      // 3dparty authentication
      this._authService.post3dAuthAfterCallback().subscribe(
        jwtTokenAsString => {
          console.log('**************************');
          console.log(jwtTokenAsString);
          console.log('**************************');
          this._authService.getLoggedUser().subscribe(
            user => {
              console.log('#########################');
              console.log(user);
              console.log('#########################');

              console.log('setting data.........................');
              setObjectValuesLocal(user.local, this.local);
              setObjectValues(user.facebook, this.facebook);
              setObjectValues(user.github, this.github);
              setObjectValues(user.google, this.google);
              setObjectValues(user.twitter, this.twitter);
              setObjectValues(user.linkedin, this.linkedin);
              if (user.profile) {
                this.formModel.get('name').setValue(user.profile.name);
                this.formModel.get('surname').setValue(user.profile.surname);
                this.formModel.get('nickname').setValue(user.profile.nickname);
                this.formModel.get('email').setValue(user.profile.email);
              }
              console.log('---------------setted----------------');

              this._authService.loginEvent.emit(user);
            }
          );
        },
        (err) => console.error(err),
        () => console.log('Done')
      );

      function setObjectValues(originData, destData) {
        if (originData) {
          destData.id = originData.id;
          destData.email = originData.email;
          destData.name = originData.name ? originData.name : originData.username;
          destData.token = originData.token;
        }
      }
      function setObjectValuesLocal(originData, destData) {
        if (originData) {
          destData.email = originData.email;
          destData.name = originData.name;
        }
      }
    }

    onProfileUpdate() {
      if (this.formModel.valid) {
        this.isWaiting = true;
        this.profileData.name = this.formModel.value.name;
        this.profileData.surname = this.formModel.value.surname;
        this.profileData.nickname = this.formModel.value.nickname;
        this.profileData.email = this.formModel.value.email;
        if (this.local.email) {
          this.profileData.localUserEmail = this.local.email;
          this.profileData.serviceName = 'local';
        } else if (this.facebook.id) {
          this.profileData.id = this.facebook.id;
          this.profileData.serviceName = 'facebook';
        } else if (this.google.id) {
          this.profileData.id = this.google.id;
          this.profileData.serviceName = 'google';
        } else if (this.github.id) {
          this.profileData.id = this.github.id;
          this.profileData.serviceName = 'github';
        } else if (this.linkedin.id) {
          this.profileData.id = this.linkedin.id;
          this.profileData.serviceName = 'linkedin';
        } else if (this.twitter.id) {
          this.profileData.id = this.twitter.id;
          this.profileData.serviceName = 'twitter';
        }

        console.log('Calling updateProfile...');
        console.log(this.profileData);
        this._profileService.update(this.profileData).subscribe(
          response => {
            console.log('Response');
            console.log(response);
            this.profileAlert = {
              visible: true,
              status: 'success',
              strong : 'Success',
              message: response.message
            };
            this.isWaiting = false;
          },
          err => {
            console.error(err);
            this.profileAlert = {
              visible: true,
              status: 'danger',
              strong : 'Error',
              message: JSON.parse(err._body).message
            };
            this.isWaiting = false;
          },
          () => console.log('Done')
        );
      }
    }

    ngOnDestroy(): any {
      if (this._subscription) {
        this._subscription.unsubscribe();
      }
    }

    unlink (serviceName: string): any {
      console.log('unlink ' + serviceName + ' called');

      if (this.checkIfLastUnlinkProfile(serviceName)) {
        console.log('Last unlink - processing...');

        this._modalService.open(this.modalDialogContent).result.then((result) => {
          console.log(`Closed with: ${result}`);
          this._authService.unlink(serviceName)
          .subscribe(
            result => {
              console.log('Unlinked: ' + result);
              this._authService.loginEvent.emit(null);
              this._authService.logout()
              .subscribe(
                result => {
                  console.log('Logged out: ' + result);
                  this._router.navigate(['/']);
                },
                err => {
                  // logServer.error('profile impossible to logout', err);
                  console.log('Impossible to logout: ' + err);
                  this._router.navigate(['/']);
                },
                () => console.log('Last unlink - unlink done')
              );
            },
            err => {
              // logServer.error('profile error unlink', err);
              console.log('Impossible to unlink: ' + err);
            },
            () => console.log('Last unlink - unlink done')
          );

        }, (reason) => {
          console.log(`Dismissed ${reason}`);
        });
      } else {
        console.log('NOT last unlink - checking...');
        if (serviceName === 'facebook' || serviceName === 'google' ||
        serviceName === 'github' || serviceName === 'local' ||
        serviceName === 'linkedin' || serviceName === 'twitter') {
          console.log('NOT last unlink - but service recognized, processing...');
          this._authService.unlink(serviceName)
          .subscribe(
            result => {
              console.log(serviceName + ' Unlinked with result user: ');
              console.log(result);
              this._router.navigate(['/post3dauth']);
              console.log('redirected to profile');
            },
            err => {
              // logServer.error('profile impossible to unlink', reason);
              console.log('Impossible to unlink: ' + err);
              this._router.navigate(['/']);
            },
            () => console.log('not last unlink: done')
          );
        } else {
          // logServer.error('Unknown service. Aborting operation!');
          console.error('Unknown service. Aborting operation!');
        }
      }
    }

    private buildJsonUserData(): any {
      return {
        id : '',
        email : '',
        name : '',
        token : '',
      };
    }

    private checkIfLastUnlinkProfile(serviceName) {
      console.log('checkIfLastUnlinkProfile with serviceName: ' + serviceName);
      switch(serviceName) {
        case 'github':
        return this.facebook.name === '' && this.google.name === '' && this.local.name === '' && this.linkedin.name === '' && this.twitter.name === '';
        case 'google':
        return this.github.name === '' && this.facebook.name === '' && this.local.name === '' && this.linkedin.name === '' && this.twitter.name === '';
        case 'facebook':
        return this.github.name === '' && this.google.name === '' && this.local.name === '' && this.linkedin.name === '' && this.twitter.name === '';
        case 'local':
        return this.github.name === '' && this.facebook.name === '' && this.google.name === '' && this.linkedin.name === '' && this.twitter.name === '';
        case 'linkedin':
        return this.facebook.name === '' && this.google.name === '' && this.local.name === '' && this.github.name === '' && this.twitter.name === '';
        case 'twitter':
        return this.facebook.name === '' && this.google.name === '' && this.local.name === '' && this.github.name === '' && this.linkedin.name === '';
        default:
        // logServer.error('Service name not recognized in profile checkIfLastUnlink');
        console.log('Service name not recognized in profile checkIfLastUnlink');
        return false;
      }
    }
  }
