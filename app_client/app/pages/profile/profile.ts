import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from "rxjs/Observable";

import {
    FormControl,
    FormGroup,
    FormBuilder,
    Validators
} from '@angular/forms';

@Component({
  selector: 'profile-page',
  providers: [],
  styleUrls: [],
  templateUrl: 'app/pages/profile/profile.html'
})
export default class ProfileComponent {
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
  github: Object;
  google: Object;
  facebook: Object;
  twitter: Object;
  linkedin: Object;

  constructor(route: ActivatedRoute) {
    this.token = route.snapshot.params['token'];

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

  onProfileUpdate() {
    if (this.formModel.valid) {
      console.log("Calling updateProfile...");
      //this.authService.loginEvent.emit(this.formModel.value);
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
