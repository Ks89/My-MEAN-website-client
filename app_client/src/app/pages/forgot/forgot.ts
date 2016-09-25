import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EmailValidators } from 'ng2-validators';
import { FormGroup, FormBuilder } from '@angular/forms';

import { AuthService } from '../../common/services/auth';

@Component({
  selector: 'mmw-forgot-page',
  templateUrl: 'forgot.html'
})
export default class ForgotComponent {
  public pageHeader: Object;
  public formModel: FormGroup;
  public forgotAlert: Object = { visible: false }; // hidden by default
  public isWaiting: boolean = false; // enable button's spinner
  public showFormError: boolean = false;
  // this class is used when you click on the 'forgot password' to reset your password

  constructor(private _authService: AuthService,
              private _router: Router) {
    this.pageHeader = {
      title: 'Forgot',
      strapline: ''
    };

    const fb = new FormBuilder();
    this.formModel = fb.group({
      'email': [null, EmailValidators.simple()]
    });
  }

  onForgot() {
    if (this.formModel.valid) {
      this.isWaiting = true;
      console.log('Calling forgot password...');
      this._authService.forgot(this.formModel.value.email).subscribe(
        response => {
          console.log('Response');
          console.log(response);
          this.forgotAlert = {
            visible: true,
            status: 'success',
            strong : 'Success',
            message: response.message
          };
          this.isWaiting = false;
          this.showFormError = false;
          this._router.navigate(['/login']);
        },
        err => {
          console.error(err);
          this.forgotAlert = {
            visible: true,
            status: 'danger',
            strong : 'Danger',
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
