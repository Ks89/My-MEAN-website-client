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
  pageHeader: any;
  formModel: FormGroup;
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
            console.log("Response");
            console.log(response);
          },
          (err)=>console.error(err),
          ()=>console.log("Done")
        );
      }
    }

  ngOnDestroy(): any {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
