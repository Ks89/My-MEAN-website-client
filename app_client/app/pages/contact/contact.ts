import {Component} from '@angular/core';
import {Observable} from "rxjs/Observable";
import PageHeaderComponent from '../../common/pageHeader/pageHeader';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {
    FormControl,
    FormGroup,
    FormBuilder,
    Validators,
    REACTIVE_FORM_DIRECTIVES
} from '@angular/forms';
// import {ReCaptchaComponent} from 'angular2-recaptcha/angular2-recaptcha';

@Component({
  selector: 'contact-page',
  providers: [],
  directives: [ROUTER_DIRECTIVES, REACTIVE_FORM_DIRECTIVES,
               PageHeaderComponent/*, ReCaptchaComponent*/],
  // styleUrls: ['app/pages/contact/contact.css'],
  templateUrl: 'app/pages/contact/contact.html'
})
export default class ContactComponent {
  pageHeader: any;

  publicKey: string = "6Lf0jxQTAAAAAIDxhvAqGseKy_KV2_4iViVeQWYi"; //not secret, no problem ;)

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

  onSend() {
    if (this.formModel.valid) {
        console.log("Sending email...");
        //this.authService.loginEvent.emit(this.formModel.value);
      }
    }
  }
