import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from "rxjs/Observable";
import {Profile, ProfileService} from '../../common/services/profile';
import {Subscription} from 'rxjs/Subscription';
import {AuthService} from '../../common/services/auth';

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

  facebookConnectOauthUrl: Object = 'api/connect/facebook';
  googleConnectOauthUrl: Object = 'api/connect/google';
  githubConnectOauthUrl: Object = 'api/connect/github';
  twitterConnectOauthUrl: Object = 'api/connect/twitter';
  linkedinConnectOauthUrl: Object = 'api/connect/linkedin';

  local: Object = {
    name: '',
    email: ''
  };
  credentials: Object = {
    localUserEmail: "",
    id: "",
    serviceName: "",
    name : "",
    surname: "",
    nickname: "",
    email : ""
  };
  github: Object = buildJsonUserData();
  google: Object = buildJsonUserData();
  facebook: Object = buildJsonUserData();
  twitter: Object = buildJsonUserData();
  linkedin: Object = buildJsonUserData();

  private subscription: Subscription;

  constructor(private profileService: ProfileService,
              route: ActivatedRoute,
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
              this.credentials = user.profile;
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
      console.log("Calling updateProfile...");
      console.log(this.formModel.value);
      this.profileService.update(this.formModel.value).subscribe(
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
}

function buildJsonUserData(): any {
  return {
    id : '',
    email : '',
    name : '',
    token : '',
  };
}

function unlink (serviceName: string): any {

}
