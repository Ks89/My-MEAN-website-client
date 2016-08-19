import {Component} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {
    FormControl,
    FormGroup,
    FormBuilder,
    Validators
} from '@angular/forms';

@Component({
  selector: 'forgot-page',
  providers: [],
  styleUrls: [],
  templateUrl: 'app/pages/forgot/forgot.html'
})
export default class ForgotComponent {
  pageHeader: any;
  formModel: FormGroup;

  constructor() {
    this.pageHeader = {
      title: 'Forgot',
      strapline: ''
    };

    const fb = new FormBuilder();
    this.formModel = fb.group({
      'email': [null, Validators.minLength(3)]
    })
  }

  onForgot() {
    if (this.formModel.valid) {
      console.log("Calling forgot...");
      //this.authService.forgotEvent.emit(this.formModel.value);
    }
  }
}
