import {Component} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {AuthService} from '../../common/services/auth';
import {Router} from '@angular/router';
import { EmailValidators } from 'ng2-validators';
import {
    FormControl,
    FormGroup,
    FormBuilder,
    Validators
} from '@angular/forms';

@Component({
  selector: 'login-page',
  styleUrls: ['login.scss'],
  templateUrl: 'login.html'
})
export default class LoginComponent {
  pageHeader: Object;
  formModel: FormGroup;
  loginAlert: Object = { visible: false }; //hidden by default
  isWaiting: boolean = false; //enable button's spinner
  showFormError: boolean = false;

  facebookOauthUrl: string = 'api/auth/facebook';
  googleOauthUrl: string = 'api/auth/google';
  githubOauthUrl: string = 'api/auth/github';
  linkedinOauthUrl: string = 'api/auth/linkedin';
  twitterOauthUrl: string = 'api/auth/twitter';

  constructor(private authService: AuthService, private router: Router) {

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
      console.log("Calling login...");
      this.authService.login({
        email: this.formModel.value.email,
        password: this.formModel.value.password
      }).subscribe(
        response => {
          console.log("Response login");
          console.log(response);
          this.isWaiting = false;
          this.authService.getLoggedUser().subscribe(
            response => {

              console.log("**************************");
              console.log(response);
              console.log("**************************");

              this.loginAlert = {
                visible: true,
                status: 'success',
                strong : 'Success',
                message: response.message
              };
              this.authService.loginEvent.emit(response);
              this.router.navigate(['/profile']);
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
            ()=>console.log("Done")
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
        () => console.log("Done")
      );
    }
  }
}
