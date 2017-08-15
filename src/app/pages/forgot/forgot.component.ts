import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '../../core/services/services';

import { EmailValidators } from 'ng2-validators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'mmw-forgot-page',
  templateUrl: 'forgot.html'
})
export class ForgotComponent implements OnInit, OnDestroy {
  // this class is used when you click on the 'forgot password' to reset your password

  pageHeader: any = { title:'', strapline: '' };
  formModel: FormGroup;
  forgotAlert: any = {visible: false}; // hidden by default
  isWaiting = false; // enable button's spinner
  showFormError = false;

  private forgotSubscription: Subscription;
  private i18nSubscription: Subscription;

  constructor(private authService: AuthService,
              private router: Router,
              private translate: TranslateService) {

    const fb = new FormBuilder();
    this.formModel = fb.group({
      'email': [null, EmailValidators.simple]
    });
  }

  ngOnInit() {
    this.i18nSubscription = this.translate.get('FORGOT')
      .subscribe((res: any) => {
        this.pageHeader = {
          title: res['TITLE'],
          strapline: res['STRAPLINE']
        };
      });
  }

  onForgot() {
    if (!this.formModel.valid) {
      return;
    }

    this.isWaiting = true;
    console.log('Calling forgot password...');
    this.forgotSubscription = this.authService.forgot(this.formModel.value.email)
      .subscribe(
        response => {
          console.log('Response');
          console.log(response);
          this.forgotAlert = {
            visible: true,
            status: 'success',
            strong: 'Success',
            message: response.message
          };
          this.isWaiting = false;
          this.showFormError = false;
          this.router.navigate(['/login']);
        },
        err => {
          console.error(err);
          this.forgotAlert = {
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

  ngOnDestroy(): any {
    if (this.forgotSubscription) {
      this.forgotSubscription.unsubscribe();
    }

    if (this.i18nSubscription) {
      this.i18nSubscription.unsubscribe();
    }
  }
}
