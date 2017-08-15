import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { EmailValidators, PasswordValidators } from 'ng2-validators';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from '../../core/services/services';

@Component({
  selector: 'mmw-register-page',
  templateUrl: 'register.html'
})
export class RegisterComponent implements OnInit, OnDestroy {
  pageHeader: any = { title:'', strapline: '' };
  formModel: FormGroup;
  registerAlert: any = {visible: false}; // hidden by default
  showFormError = false;
  isWaiting = false; // enable button's spinner

  private registerSubscription: Subscription;
  private i18nSubscription: Subscription;

  constructor(private authService: AuthService,
              private router: Router,
              private translate: TranslateService) {

    const passwordValidator = Validators.compose([
      PasswordValidators.alphabeticalCharacterRule(1),
      PasswordValidators.digitCharacterRule(1),
      PasswordValidators.lowercaseCharacterRule(1),
      PasswordValidators.uppercaseCharacterRule(1),
      PasswordValidators.repeatCharacterRegexRule(3),
      Validators.minLength(8)]);

    const fb = new FormBuilder();
    this.formModel = fb.group({
      'name': [null, Validators.compose([Validators.required, Validators.minLength(3)])],
      'email': [null, EmailValidators.simple],
      'emailConfirm': [null, EmailValidators.simple],
      'password': [null, passwordValidator],
      'passwordConfirm': [null, null]
    });
  }

  ngOnInit() {
    this.i18nSubscription = this.translate.get('REGISTER')
      .subscribe((res: any) => {
        this.pageHeader = {
          title: res['TITLE'],
          strapline: res['STRAPLINE']
        };
      });
  }

  onRegister() {
    if (!this.formModel.valid) {
      return;
    }
    if (this.formModel.value.password !== this.formModel.value.passwordConfirm) {
      this.registerAlert = {
        visible: true,
        status: 'danger',
        strong: 'Error',
        message: 'Password and Password confirm must be equals'
      };
      this.isWaiting = false;
      this.showFormError = true;
      return;
    }
    if (this.formModel.value.email !== this.formModel.value.emailConfirm) {
      this.registerAlert = {
        visible: true,
        status: 'danger',
        strong: 'Error',
        message: 'Email and Email confirm must be equals'
      };
      this.isWaiting = false;
      this.showFormError = true;
      return;
    }

    this.isWaiting = true;

    const registerPayload: any = {
      name: this.formModel.value.name,
      email: this.formModel.value.email,
      password: this.formModel.value.password
    };

    console.log('Calling register...');
    this.registerSubscription = this.authService.register(registerPayload)
      .subscribe(
        response => {
          console.log('Response');
          console.log(response);
          this.registerAlert = {
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
          this.registerAlert = {
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
    if (this.registerSubscription) {
      this.registerSubscription.unsubscribe();
    }
    if (this.i18nSubscription) {
      this.i18nSubscription.unsubscribe();
    }
  }
}
