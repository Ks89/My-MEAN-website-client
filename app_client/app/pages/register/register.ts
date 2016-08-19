import {Component} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {
    FormControl,
    FormGroup,
    FormBuilder,
    Validators
} from '@angular/forms';

@Component({
  selector: 'register-page',
  providers: [],
  styleUrls: [],
  templateUrl: 'app/pages/register/register.html'
})
export default class RegisterComponent {
  pageHeader: any;
  formModel: FormGroup;

  constructor() {
    this.pageHeader = {
      title: 'Create a new accout',
      strapline: ''
    };

    const fb = new FormBuilder();
    this.formModel = fb.group({
      'name': [null, Validators.minLength(3)],
      'email': [null, Validators.minLength(3)],
      'password': [null, Validators.minLength(3)]
    })
  }

  onRegister() {
    if (this.formModel.valid) {
      console.log("Calling register...");
      //this.authService.registerEvent.emit(this.formModel.value);
    }
  }
}
