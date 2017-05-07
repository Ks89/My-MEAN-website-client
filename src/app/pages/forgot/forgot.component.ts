import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '../../core/services/services';

import { EmailValidators } from 'ng2-validators';

@Component({
  selector: 'mmw-forgot-page',
  templateUrl: 'forgot.html'
})
export class ForgotComponent implements OnDestroy {
  public pageHeader: any;
  public formModel: FormGroup;
  public forgotAlert: any = {visible: false}; // hidden by default
  public isWaiting = false; // enable button's spinner
  public showFormError = false;
  private forgotSubscription: Subscription;
  // this class is used when you click on the 'forgot password' to reset your password

  constructor(private authService: AuthService, private router: Router) {
    this.pageHeader = {
      title: 'Forgot',
      strapline: ''
    };

    const fb = new FormBuilder();
    this.formModel = fb.group({
      'email': [null, EmailValidators.simple]
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
            strong: 'Danger',
            message: JSON.parse(err._body).message
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
  }
}
