import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from "rxjs/Observable";
import {Profile, ProfileService} from '../../common/services/profile';
import {Subscription} from 'rxjs/Subscription';
import {AuthService} from '../../common/services/auth';
import {Router} from '@angular/router';

import {
    FormControl,
    FormGroup,
    FormBuilder,
    Validators
} from '@angular/forms';

@Component({
  selector: 'profile-page',
  styleUrls: [],
  templateUrl: 'app/pages/profile/profile.html'
})
export default class ProfileComponent implements OnInit {
  pageHeader: any;
  formModel: FormGroup;
  token: string;
  bigProfileImage: string = 'assets/images/profile/bigProfile.png';

  sidebar: Object = {
    title: 'Other services',
    strapline: ' '
  };

  profileData = {
    localUserEmail: "",
    id: "",
    serviceName: "",
    name : "",
    surname: "",
    nickname: "",
    email : ""
  };

  facebookConnectOauthUrl: Object = 'api/connect/facebook';
  googleConnectOauthUrl: Object = 'api/connect/google';
  githubConnectOauthUrl: Object = 'api/connect/github';
  twitterConnectOauthUrl: Object = 'api/connect/twitter';
  linkedinConnectOauthUrl: Object = 'api/connect/linkedin';

  local: any = {
    name: '',
    email: ''
  };
  github: any = buildJsonUserData();
  google: any = buildJsonUserData();
  facebook: any = buildJsonUserData();
  twitter: any = buildJsonUserData();
  linkedin: any = buildJsonUserData();

  private subscription: Subscription;

  constructor(private profileService: ProfileService,
              route: ActivatedRoute,
              private router: Router,
              private authService: AuthService) {
    this.token = route.snapshot.params['token'];

    if(this.token == null || this.token == undefined ) {
      console.log("profile page loaded without token");
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

    this.github = buildJsonUserData();
    this.google = buildJsonUserData();
    this.facebook = buildJsonUserData();
    this.twitter = buildJsonUserData();
    this.linkedin = buildJsonUserData();
  }

  ngOnInit() {
    console.log('INIT');
    //3dparty authentication
    this.authService.post3dAuthAfterCallback().subscribe(
      jwtTokenAsString => {
        console.log("**************************");
        console.log(jwtTokenAsString);
        console.log("**************************");
        this.authService.getLoggedUser().subscribe(
          user => {
            console.log("#########################");
            console.log(user);
            console.log("#########################");

            console.log("setting data.........................");
            setObjectValuesLocal(user.local, this.local);
            setObjectValues(user.github, this.github);
            setObjectValues(user.facebook, this.facebook);
            setObjectValues(user.google, this.google);
            setObjectValues(user.twitter, this.twitter);
            setObjectValues(user.linkedin, this.linkedin);
            if(user.profile) {
              console.log(this.formModel.get("name"));
              this.formModel.get("name").setValue(user.profile.name);
              this.formModel.get("surname").setValue(user.profile.surname);
              this.formModel.get("nickname").setValue(user.profile.nickname);
              this.formModel.get("email").setValue(user.profile.email);
            }
            console.log("---------------setted----------------");

            this.authService.loginEvent.emit(user);
          }
        );
      },
      (err)=>console.error(err),
      ()=>console.log("Done")
    );

    function setObjectValues(originData, destData) {
      if(originData) {
        destData.id = originData.id;
        destData.email = originData.email;
        destData.name = originData.name ? originData.name : originData.username;
        destData.token = originData.token;
      }
    }
    function setObjectValuesLocal(originData, destData) {
      if(originData) {
        destData.email = originData.email;
        destData.name = originData.name;
      }
    }
  }

  onProfileUpdate() {
    if (this.formModel.valid) {

      this.profileData.name = this.formModel.value.name;
      this.profileData.surname = this.formModel.value.surname;
      this.profileData.nickname = this.formModel.value.nickname;
      this.profileData.email = this.formModel.value.email;

      if(this.local.email) {
        this.profileData.localUserEmail = this.local.email;
        this.profileData.serviceName = 'local';
      } else if(this.facebook.id) {
        this.profileData.id = this.facebook.id;
        this.profileData.serviceName = 'facebook';
      } else if(this.google.id) {
        this.profileData.id = this.google.id;
        this.profileData.serviceName = 'google';
      } else if(this.github.id) {
        this.profileData.id = this.github.id;
        this.profileData.serviceName = 'github';
      } else if(this.linkedin.id) {
        this.profileData.id = this.linkedin.id;
        this.profileData.serviceName = 'linkedin';
      } else if(this.twitter.id) {
        this.profileData.id = this.twitter.id;
        this.profileData.serviceName = 'twitter';
      }

      console.log("Calling updateProfile...");
      console.log(this.profileData);
      this.profileService.update(this.profileData).subscribe(
        response => {
          console.log("Response");
          console.log(response);
        },
        (err)=>console.error(err),
        ()=>console.log("Done")
      );
      //this.authService.loginEvent.emit(this.formModel.value);
    }
  }

  ngOnDestroy(): any {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  unlink (serviceName: string): any {
    console.log("unlink " + serviceName + " called");

    if(checkIfLastUnlinkProfile(serviceName)) {
      console.log('Last unlink - processing...');
      this.authService.unlink(serviceName)
      .subscribe(
        result => {
          console.log('Unlinked: ' + result);
          this.authService.logout()
          .subscribe(
            result => {
              console.log('Logged out: ' + result);
              this.router.navigate(['/home']);
            },
            err => {
              //logServer.error("profile impossible to logout", err);
              console.log('Impossible to logout: ' + err);
              this.router.navigate(['/home']);
            },
            () => console.log("Last unlink - unlink done")
          )
        },
        err => {
          //logServer.error("profile error unlink", err);
          console.log('Impossible to unlink: ' + err);
        },
        () => console.log("Last unlink - unlink done")
      );
    } else {
      console.log('NOT last unlink - checking...');
      if(serviceName=='facebook' || serviceName=='google' ||
        serviceName=='github' || serviceName=='local' ||
        serviceName=='linkedin' || serviceName=='twitter') {
          console.log('NOT last unlink - but service recognized, processing...');
          this.authService.unlink(serviceName)
          .subscribe(
            result => {
              console.log(serviceName + ' Unlinked with result user: ');
              console.log(result);
              this.router.navigate(['/profile']);
              console.log("redirected to profile");
            },
            err => {
              //logServer.error("profile impossible to unlink", reason);
              console.log('Impossible to unlink: ' + err);
              this.router.navigate(['/home']);
            },
            () => console.log("not last unlink: done")
          );
      } else {
        //logServer.error("Unknown service. Aborting operation!");
        console.error("Unknown service. Aborting operation!");
      }
    }
  }

}

function buildJsonUserData(): any {
  return {
    id : '',
    email : '',
    name : '',
    token : '',
  };
}

function checkIfLastUnlinkProfile(serviceName) {
  switch(serviceName) {
    case 'github':
      return this.facebook.name=='' && this.google.name=='' && this.local.name=='' && this.linkedin.name=='' && this.twitter.name=='';
    case 'google':
      return this.github.name=='' && this.facebook.name=='' && this.local.name=='' && this.linkedin.name=='' && this.twitter.name=='';
    case 'facebook':
      return this.github.name=='' && this.google.name=='' && this.local.name=='' && this.linkedin.name=='' && this.twitter.name=='';
    case 'local':
      return this.github.name=='' && this.facebook.name=='' && this.google.name=='' && this.linkedin.name=='' && this.twitter.name=='';
    case 'linkedin':
      return this.facebook.name=='' && this.google.name=='' && this.local.name=='' && this.github.name=='' && this.twitter.name=='';
    case 'twitter':
      return this.facebook.name=='' && this.google.name=='' && this.local.name=='' && this.github.name=='' && this.linkedin.name=='';
    default:
      //logServer.error("Service name not recognized in profile checkIfLastUnlink");
      console.log('Service name not recognized in profile checkIfLastUnlink');
      return false;
  }
}
