import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';

import { AuthService } from '../../common/services/auth.service';

@Component({
  selector: 'mmw-login-page',
  styleUrls: ['login.scss'],
  templateUrl: 'login.html'
})
export default class LoginComponent {
  public pageHeader: Object;
  public formModel: FormGroup;
  public loginAlert: Object = { visible: false }; // hidden by default
  public isWaiting: boolean = false; // enable button's spinner
  public showFormError: boolean = false;

  public facebookOauthUrl: string = 'api/auth/facebook';
  public googleOauthUrl: string = 'api/auth/google';
  public githubOauthUrl: string = 'api/auth/github';
  public linkedinOauthUrl: string = 'api/auth/linkedin';
  public twitterOauthUrl: string = 'api/auth/twitter';

  constructor(private _authService: AuthService, private _router: Router) {
    this.pageHeader = {
      title: 'Sign in',
      strapline: ''
    };

    const fb = new FormBuilder();
    this.formModel = fb.group({
      'email': [null, null],
      'password': [null, null]
    });
  }

  onLogin() {
    if (this.formModel.valid) {
      this.isWaiting = true;
      console.log('Calling login...');
      this._authService.login({
        email: this.formModel.value.email,
        password: this.formModel.value.password
      }).subscribe(
        response => {
          console.log('Response login');
          console.log(response);
          this.isWaiting = false;
          this._authService.getLoggedUser().subscribe(
            response => {

              console.log('**************************');
              console.log(response);
              console.log('**************************');

              this.loginAlert = {
                visible: true,
                status: 'success',
                strong : 'Success',
                message: response.message
              };
              this._authService.loginEvent.emit(response);
              this._router.navigate(['/profile']);
            },
            err => {
              console.error(err);
              this.loginAlert = {
                visible: true,
                status: 'danger',
                strong : 'Error',
                message: JSON.parse(err._body).message
              };
              this.isWaiting = false;
              this.showFormError = true;
            },
            () => console.log('Done')
          );
        },
        err => {
          console.error(err);
          this.loginAlert = {
            visible: true,
            status: 'danger',
            strong : 'Error',
            message: JSON.parse(err._body).message
          };
          this.isWaiting = false;
          this.showFormError = true;
        },
        () => console.log('Done')
      );
    }
  }
}
