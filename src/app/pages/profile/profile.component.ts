import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

import {Observable} from "rxjs/Observable";
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EmailValidators} from "ng2-validators";

import {AuthService, ProfileService} from '../../shared/services/services';

@Component({
  selector: 'mmw-profile-page',
  styleUrls: ['profile.scss'],
  templateUrl: 'profile.html'
})
export class ProfileComponent implements OnInit, OnDestroy {
  public pageHeader: any;
  public formModel: FormGroup;
  public token: string;
  public bigProfileImage: string = 'assets/images/profile/bigProfile.png';
  public profileAlert: any = {visible: false}; // hidden by default
  public isWaiting: boolean = false; // enable button's spinner

  public sidebar: any = {
    title: 'Other services',
    strapline: ' '
  };

  // 3dparty connect links
  public facebookConnectOauthUrl: string = 'api/connect/facebook';
  public googleConnectOauthUrl: string = 'api/connect/google';
  public githubConnectOauthUrl: string = 'api/connect/github';
  public twitterConnectOauthUrl: string = 'api/connect/twitter';
  public linkedinConnectOauthUrl: string = 'api/connect/linkedin';

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
    })
  }

  ngOnInit() {
    console.log('ngOnInit');
    // 3dparty authentication

    const postAuth$: Observable<any> = this.authService.post3dAuthAfterCallback();
    const user$: Observable<any> = this.authService.getLoggedUser();

    this.postAuthSubscription = Observable.combineLatest(postAuth$, user$,
      (postAuth, user) => ({ jwtTokenAsString: postAuth, user }))
      .subscribe(
        result => {
          console.log('**************************');
          console.log(result.jwtTokenAsString);
          console.log('**************************');

          console.log('#########################');
          console.log(result.user);
          console.log('#########################');

          console.log('setting data.........................');
          setObjectValuesLocal(result.user.local, this.local);
          setObjectValues(result.user.facebook, this.facebook);
          setObjectValues(result.user.github, this.github);
          setObjectValues(result.user.google, this.google);
          setObjectValues(result.user.twitter, this.twitter);
          setObjectValues(result.user.linkedin, this.linkedin);
          if (result.user.profile) {
            this.formModel.get('name').setValue(result.user.profile.name);
            this.formModel.get('surname').setValue(result.user.profile.surname);
            this.formModel.get('nickname').setValue(result.user.profile.nickname);
            this.formModel.get('email').setValue(result.user.profile.email);
          }
          console.log('---------------setted----------------');

          this.authService.loginEvent.emit(result.user);
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
            message: JSON.parse(err._body).message
          };
          this.isWaiting = false;
        },
        () => console.log('Done')
      );
    }
  }

  unlink(serviceName: string): any {
    console.log('unlink ' + serviceName + ' called');

    if (this.checkIfLastUnlinkProfile(serviceName)) {
      console.log('Last unlink - processing...');

      this.modalService.open(this.modalDialogContent).result.then((result) => {
        console.log(`Closed with: ${result}`);

        const unlink$: Observable<any> = this.authService.unlink(serviceName);
        const logout$: Observable<any> = this.authService.logout();

        this.unlinkSubscription = Observable.combineLatest(unlink$, logout$,
          (unlink, logout) => ({ unlink, logout }))
          .subscribe(
            result => {
              console.log('Unlink + Logout result = ');
              console.log(result);
              this.authService.loginEvent.emit(null);
            },
            err => console.error('Impossible to either unlink or logout: ' + err),
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
            result => {
              console.log(serviceName + ' Unlinked with result user: ');
              console.log(result);
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

  ngOnDestroy(): any {
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

  private checkIfLastUnlinkProfile(serviceName: any) {
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
