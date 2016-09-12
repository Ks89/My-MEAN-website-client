import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
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
  selector: 'reset-page',
  templateUrl: 'reset.html'
})
export default class ResetComponent {
  pageHeader: Object;
  formModel: FormGroup;
  emailToken: string;
  resetAlert: Object = { visible: false }; //hidden by default
  isWaiting: boolean = false; //enable button's spinner
  showFormError: boolean = false;

  //this class is used when you click on the email to reset your password

  constructor(private authService: AuthService,
              route: ActivatedRoute,
              private router: Router) {
    this.emailToken = route.snapshot.params['emailToken'];

    this.pageHeader = {
      title: 'Password reset',
      strapline: ''
    };

    const fb = new FormBuilder();
    this.formModel = fb.group({
      'password': [null, Validators.compose([Validators.required, Validators.minLength(8)])]
    })
  }

  onReset() {
    if (this.formModel.valid) {
      this.isWaiting = true;
      console.log("Calling reset...");
      this.authService.reset(this.emailToken, this.formModel.value.password).subscribe(
        response => {
          console.log("Response");
          console.log(response);
          this.resetAlert = {
            visible: true,
            status: 'success',
            strong : 'Success',
            message: response.message
          };
          this.isWaiting = false;
          this.showFormError = false;
        },
        err => {
          console.error(err);
          this.resetAlert = {
            visible: true,
            status: 'danger',
            strong : 'Danger',
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
