import {Component} from '@angular/core';
import {Observable} from "rxjs/Observable";

import {
    FormControl,
    FormGroup,
    FormBuilder,
    Validators
} from '@angular/forms';

@Component({
  selector: 'login-page',
  providers: [],
  styleUrls: ['app/pages/login/login.css'],
  templateUrl: 'app/pages/login/login.html'
})
export default class LoginComponent {
  pageHeader: any;

  formModel: FormGroup;

  facebookOauthUrl: string = 'api/auth/facebook';
  googleOauthUrl: string = 'api/auth/google';
  githubOauthUrl: string = 'api/auth/github';
  linkedinOauthUrl: string = 'api/auth/linkedin';
  twitterOauthUrl: string = 'api/auth/twitter';

  constructor() {
    this.pageHeader = {
      title: 'Sign in',
      strapline: ''
    };

    const fb = new FormBuilder();
    this.formModel = fb.group({
      'email': [null, Validators.minLength(3)],
      'password': [null, positiveNumberValidator]
    })
  }

  onLogin() {
    if (this.formModel.valid) {
      console.log("Calling login...");
      //this.authService.loginEvent.emit(this.formModel.value);
    }
  }
}

function positiveNumberValidator(control: FormControl): any {
  return true;
  // if (!control.value) return null;
  // const price = parseInt(control.value);
  // return price === null ||
  // typeof price === 'number' &&
  // price > 0 ? null : {positivenumber: true};
}
