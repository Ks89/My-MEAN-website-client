import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Subscription} from 'rxjs/Subscription';
import {ContactService} from '../../common/services/contact';
import { EmailValidators } from 'ng2-validators';

import {
    FormControl,
    FormGroup,
    FormBuilder,
    Validators
} from '@angular/forms';

@Component({
  selector: 'contact-page',
  templateUrl: 'contact.html'
})
export default class ContactComponent implements OnInit {
  public pageHeader: Object;
  public formModel: FormGroup;
  public contactAlert: Object = { visible: false }; //hidden by default
  public isWaiting: boolean = false; //enable button's spinner
  public showFormError: boolean = false;
  private _subscription: Subscription;
  private _recaptchaResponse: any;

  constructor(private _contactService: ContactService) {
    this.pageHeader = {
      title: 'Contact',
      strapline: ''
    };

    const fb = new FormBuilder();
    this.formModel = fb.group({
      'email': [null, EmailValidators.simple()],
      'subject': [null, Validators.minLength(4)],
      'message': [null, Validators.minLength(15)],
    });
  }

  ngOnInit(){

  }

  handleCorrectCaptcha(captchaResponse: string) {
    console.log(`Resolved captcha with response ${captchaResponse}:`);
    this._recaptchaResponse = captchaResponse;
  }

  onSend() {
    if (this.formModel.valid) {
      this.isWaiting = true;
      console.log("Sending email...");
      console.log(this.formModel.value);
      let dataToSend = {
          response: this._recaptchaResponse,
          emailFormData: {
            email : this.formModel.value.email,
            messageText : this.formModel.value.message,
            object : this.formModel.value.subject
          }
      };
      this._contactService.sendFormWithCaptcha(dataToSend).subscribe(
        response => {
          console.log("/api/email called -> OK");
          console.log(response);
          this.contactAlert = {
            visible: true,
            status: 'success',
            strong : 'Success',
            message: response['message']
          };
          this.isWaiting = false;
          this.showFormError = false;
        },
        err => {
          console.log("/api/email called -> ERROR");
          console.error(err);
          this.contactAlert = {
            visible: true,
            status: 'danger',
            strong : 'Error',
            message: JSON.parse(err._body).message
          };
          this.isWaiting = false;
          this.showFormError = true;
        },
        () => console.log("Done")
      );
    }
  }

  ngOnDestroy(): any {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
