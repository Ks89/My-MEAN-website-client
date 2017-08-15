import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { TranslateService } from '@ngx-translate/core';

import { AuthService } from '../../core/services/services';

@Component({
  selector: 'mmw-login-page',
  styleUrls: ['login.scss'],
  templateUrl: 'login.html'
})
export class LoginComponent implements OnInit, OnDestroy {
  pageHeader: any = { title:'', strapline: '' };
  formModel: FormGroup;
  loginAlert: any = {visible: false}; // hidden by default
  isWaiting = false; // enable button's spinner
  showFormError = false;

  facebookOauthUrl = 'api/auth/facebook';
  googleOauthUrl = 'api/auth/google';
  githubOauthUrl = 'api/auth/github';
  linkedinOauthUrl = 'api/auth/linkedin';
  twitterOauthUrl = 'api/auth/twitter';

  private i18nSubscription: Subscription;

  constructor(private authService: AuthService,
              private router: Router,
              private translate: TranslateService) {

    const fb = new FormBuilder();
    this.formModel = fb.group({
      'email': [null, null],
      'password': [null, null]
    });
  }

  ngOnInit() {
    this.i18nSubscription = this.translate.get('LOGIN')
      .subscribe((res: any) => {
        this.pageHeader = {
          title: res['TITLE'],
          strapline: res['STRAPLINE']
        };
      });
  }

  onLogin() {
    if (!this.formModel.valid) {
      return;
    }
    this.isWaiting = true;
    console.log('Calling login...');
    this.authService.login({
      email: this.formModel.value.email,
      password: this.formModel.value.password
    }).subscribe(
      response => {
        console.log('Response login');
        console.log(response);
        this.isWaiting = false;
        this.authService.getLoggedUser().subscribe(
          result => {

            console.log('**************************');
            console.log(result);
            console.log('**************************');

            this.loginAlert = {
              visible: true,
              status: 'success',
              strong: 'Success',
              message: result.message
            };
            this.authService.loginEvent.emit(result);
            this.router.navigate(['/profile']);
          },
          err => {
            console.error('login error while getting user', err);
            this.loginAlert = {
              visible: true,
              status: 'danger',
              strong: 'Error',
              message: err.message
            };
            this.isWaiting = false;
            this.showFormError = true;
          },
          () => console.log('Done')
        );
      },
      err => {
        console.error('login error', err);
        this.loginAlert = {
          visible: true,
          status: 'danger',
          strong: 'Error',
          message: err.message
        };
        this.isWaiting = false;
        this.showFormError = true;
      },
      () => console.log('Done')
    );
  }

  ngOnDestroy() {
    if (this.i18nSubscription) {
      this.i18nSubscription.unsubscribe();
    }
  }
}
