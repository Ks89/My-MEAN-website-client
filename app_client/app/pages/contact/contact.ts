import {Component} from '@angular/core';
import {Observable} from "rxjs/Observable";

import {
    FormControl,
    FormGroup,
    FormBuilder,
    Validators
} from '@angular/forms';

@Component({
  selector: 'contact-page',
  providers: [],
  // styleUrls: ['app/pages/contact/contact.css'],
  templateUrl: 'app/pages/contact/contact.html'
})
export default class ContactComponent {
  pageHeader: any;
  
  formModel: FormGroup;

  constructor() {
    this.pageHeader = {
      title: 'Contact',
      strapline: ''
    };

    const fb = new FormBuilder();
    this.formModel = fb.group({
      'email': [null, Validators.minLength(3)],
      'subject': [null, Validators.minLength(3)],
      'message': [null, Validators.minLength(3)],
    });
  }

  handleCorrectCaptcha(captchaResponse: string) {
    console.log(`Resolved captcha with response ${captchaResponse}:`);
  }

  onSend() {
    if (this.formModel.valid) {
        console.log("Sending email...");
        //this.authService.loginEvent.emit(this.formModel.value);
      }
    }
  }
