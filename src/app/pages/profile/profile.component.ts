import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmailValidators } from 'ng2-validators';

import { AuthService, ProfileService } from '../../core/services/services';

@Component({
  selector: 'mmw-profile-page',
  styleUrls: ['profile.scss'],
  templateUrl: 'profile.html'
})
export class ProfileComponent implements OnInit, OnDestroy {
  pageHeader: any;
  formModel: FormGroup;
  token: string;
  bigProfileImage = 'assets/images/profile/bigProfile.png';
  profileAlert: any = {visible: false}; // hidden by default
  isWaiting = false; // enable button's spinner

  sidebar: any = {
    title: 'Other services',
    strapline: ' '
  };

  // 3dparty connect links
  facebookConnectOauthUrl = 'api/connect/facebook';
  googleConnectOauthUrl = 'api/connect/google';
  githubConnectOauthUrl = 'api/connect/github';
  twitterConnectOauthUrl = 'api/connect/twitter';
  linkedinConnectOauthUrl = 'api/connect/linkedin';

  // local model
  local = {
    name: '',
    email: ''
  };
  // 3dparty model
  github = this.buildJsonUserData();
  google = this.buildJsonUserData();
  facebook = this.buildJsonUserData();
  twitter = this.buildJsonUserData();
  linkedin = this.buildJsonUserData();

  // profile model
  profileData = {
    localUserEmail: '',
    id: '',
    serviceName: '',
    name: '',
    surname: '',
    nickname: '',
    email: ''
  };

  // used to get a reference to the modal dialog content
  @ViewChild('modalDialogContent') modalDialogContent: any;

  private postAuthSubscription: Subscription;
  private updateSubscription: Subscription;
  private unlinkSubscription: Subscription;
  private unlinkSubscription2: Subscription;

  constructor(private profileService: ProfileService,
              private route: ActivatedRoute, private router: Router,
              private authService: AuthService, private modalService: NgbModal) {
    this.token = route.snapshot.params['token'];

    if (this.token === null || this.token === undefined) {
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
      'email': [null, EmailValidators.simple]
    });
  }

  ngOnInit() {
    console.log('ngOnInit');
    // 3dparty authentication

    const postAuth$: Observable<any> = this.authService.post3dAuthAfterCallback();
    const user$: Observable<any> = this.authService.getLoggedUser();

    this.postAuthSubscription = Observable.combineLatest(postAuth$, user$,
      (postAuth, user) => ({jwtTokenAsString: postAuth, user}))
      .subscribe(
        res => {
          console.log('**************************');
          console.log(res.jwtTokenAsString);
          console.log('**************************');

          console.log('#########################');
          console.log(res.user);
          console.log('#########################');

          console.log('setting data.........................');
          setObjectValuesLocal(res.user.local, this.local);
          setObjectValues(res.user.facebook, this.facebook);
          setObjectValues(res.user.github, this.github);
          setObjectValues(res.user.google, this.google);
          setObjectValues(res.user.twitter, this.twitter);
          setObjectValues(res.user.linkedin, this.linkedin);
          if (res.user.profile) {
            this.formModel.get('name').setValue(res.user.profile.name);
            this.formModel.get('surname').setValue(res.user.profile.surname);
            this.formModel.get('nickname').setValue(res.user.profile.nickname);
            this.formModel.get('email').setValue(res.user.profile.email);
          }
          console.log('---------------set----------------');

          this.authService.loginEvent.emit(res.user);
        },
        err => console.error(err),
        () => {
          console.log('Done');
        }
      );

    function setObjectValues(originData: any, destData: any) {
      if (originData) {
        destData.id = originData.id;
        destData.email = originData.email;
        destData.name = originData.name ? originData.name : originData.username;
        destData.token = originData.token;
      }
    }

    function setObjectValuesLocal(originData: any, destData: any) {
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
      this.updateSubscription = this.profileService.update(this.profileData).subscribe(
        response => {
          console.log('Response');
          console.log(response);
          this.profileAlert = {
            visible: true,
            status: 'success',
            strong: 'Success',
            message: response.message
          };
          this.isWaiting = false;
        },
        err => {
          console.error(err);
          this.profileAlert = {
            visible: true,
            status: 'danger',
            strong: 'Error',
            message: err.message
          };
          this.isWaiting = false;
        },
        () => console.log('Done')
      );
    }
  }

  unlink(serviceName: string) {
    console.log('unlink ' + serviceName + ' called');

    if (this.checkIfLastUnlinkProfile(serviceName)) {
      console.log('Last unlink - processing...');

      this.modalService.open(this.modalDialogContent).result.then((result) => {
        console.log(`Closed with: ${result}`);

        const unlink$: Observable<any> = this.authService.unlink(serviceName);
        const logout$: Observable<any> = this.authService.logout();

        this.unlinkSubscription = Observable.combineLatest(unlink$, logout$,
          (unlink, logout) => ({unlink, logout}))
          .subscribe(
            res => {
              console.log('Unlink + Logout res = ');
              console.log(res);
              this.authService.loginEvent.emit(null);
            },
            err => console.error('Impossible to either unlink or logout', err),
            () => {
              console.log('Last unlink - both unlink and logout completed');
              this.router.navigate(['/']);
            }
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
        this.unlinkSubscription2 = this.authService.unlink(serviceName)
          .subscribe(
            res => {
              console.log(serviceName + ' Unlinked with res user: ');
              console.log(res);
              this.router.navigate(['/post3dauth']);
              console.log('redirected to profile');
            },
            err => {
              // logServer.error('profile impossible to unlink', reason);
              console.log('Impossible to unlink: ' + err);
              this.router.navigate(['/']);
            },
            () => console.log('not last unlink: done')
          );
      } else {
        // logServer.error('Unknown service. Aborting operation!');
        console.error('Unknown service. Aborting operation!');
      }
    }
  }

  is3dPartyServiceConnected(serviceName: string) {
    return (this[serviceName].email && this[serviceName].email.length > 0) || (this[serviceName].name && this[serviceName].name.length > 0);
  }

  ngOnDestroy() {
    if (this.postAuthSubscription) {
      this.postAuthSubscription.unsubscribe();
    }
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
    if (this.unlinkSubscription) {
      this.unlinkSubscription.unsubscribe();
    }
    if (this.unlinkSubscription2) {
      this.unlinkSubscription2.unsubscribe();
    }
  }

  private buildJsonUserData(): any {
    return {
      id: '',
      email: '',
      name: '',
      token: '',
    };
  }

  private checkIfLastUnlinkProfile(serviceName: string) {
    console.log('checkIfLastUnlinkProfile with serviceName: ' + serviceName);
    switch (serviceName) {
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
