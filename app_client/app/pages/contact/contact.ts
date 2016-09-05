import {Component} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Subscription} from 'rxjs/Subscription';
import {ContactService} from '../../common/services/contact';

import {
    FormControl,
    FormGroup,
    FormBuilder,
    Validators
} from '@angular/forms';

@Component({
  selector: 'contact-page',
  templateUrl: 'app/pages/contact/contact.html'
})
export default class ContactComponent {
  pageHeader: Object;
  formModel: FormGroup;
  contactAlert: Object = { visible: false }; //hidden by default
  isWaiting: boolean = false; //enable button's spinner
  private subscription: Subscription;
  private recaptchaResponse: any;

  constructor(private contactService: ContactService) {
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
    this.recaptchaResponse = captchaResponse;
  }

  onSend() {
    if (this.formModel.valid) {
      this.isWaiting = true;
      console.log("Sending email...");
      console.log(this.formModel.value);
      let dataToSend = {
          response: this.recaptchaResponse,
          emailFormData: {
            email : this.formModel.value.email,
            messageText : this.formModel.value.message,
            object : this.formModel.value.subject
          }
      };
      this.contactService.sendFormWithCaptcha(dataToSend).subscribe(
        response => {
          console.log("/api/email called -> OK");
          console.log(response);
          this.contactAlert = {
            visible: true,
            status: 'success',
            strong : 'Success',
            message: response.message
          };
          this.isWaiting = false;
        },
        err => {
          console.log("/api/email called -> ERROR");
          console.error(err);
          this.contactAlert = {
            visible: true,
            status: 'danger',
            strong : 'Danger',
            message: JSON.parse(err._body).message
          };
          this.isWaiting = false;
        },
        () => console.log("Done")
      );
    }
  }

  ngOnDestroy(): any {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
