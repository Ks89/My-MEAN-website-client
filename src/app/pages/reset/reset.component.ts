import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Observable } from "rxjs/Observable";
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '../../core/services/services';

import { PasswordValidators } from 'ng2-validators';

@Component({
  selector: 'mmw-reset-page',
  templateUrl: 'reset.html'
})
export class ResetComponent implements OnDestroy {
  pageHeader: any;
  formModel: FormGroup;
  resetAlert: any = { visible: false }; // hidden by default
  isWaiting = false; // enable button's spinner
  showFormError = false;
  alreadyChanged = false;

  emailToken$: Observable<string>;

  private resetSubscription: Subscription;

  // this class is used when you click on the email to reset your password

  constructor(private authService: AuthService, private route: ActivatedRoute) {
    this.emailToken$ = this.route.queryParams.map(params => params['emailToken'] || 'Not valid');

    this.pageHeader = {
      title: 'Password reset',
      strapline: ''
    };

    const passwordValidator = Validators.compose([
      PasswordValidators.alphabeticalCharacterRule(1),
      PasswordValidators.digitCharacterRule(1),
      PasswordValidators.lowercaseCharacterRule(1),
      PasswordValidators.uppercaseCharacterRule(1),
      PasswordValidators.repeatCharacterRegexRule(3),
      Validators.minLength(8),
      Validators.required]);

    const fb = new FormBuilder();
    this.formModel = fb.group({
      'password': [null, passwordValidator],
      'passwordConfirm': [null, Validators.required]
    });
  }

  onReset() {
    if (!this.formModel.valid) {
      return;
    }

    if (this.formModel.value.password !== this.formModel.value.passwordConfirm) {
      this.resetAlert = {
        visible: true,
        status: 'danger',
        strong : 'Error',
        message: `'Password' and 'Password confirm' must be equals`
      };
      this.isWaiting = false;
      this.showFormError = true;
      return;
    }

    this.isWaiting = true;
    console.log('Calling reset...');

    this.resetSubscription = this.emailToken$
      .map(emailToken => this.authService.reset(emailToken, this.formModel.value.password))
      .concatAll() // equivalent to mergeAll(1)
      .subscribe(
        response => {
          console.log('Response');
          console.log(response);
          this.resetAlert = {
            visible: true,
            status: 'success',
            strong : 'Success',
            message: response.message
          };
          this.isWaiting = false;
          this.showFormError = false;
          this.alreadyChanged = true; // disable button
        },
        err => {
          console.error(err);
          this.resetAlert = {
            visible: true,
            status: 'danger',
            strong : 'Error',
            message: err.message
          };
          this.isWaiting = false;
          this.showFormError = true;
        },
        () => console.log('Done')
      );
  }

  ngOnDestroy() {
    if(this.resetSubscription) {
      this.resetSubscription.unsubscribe();
    }
  }
}
