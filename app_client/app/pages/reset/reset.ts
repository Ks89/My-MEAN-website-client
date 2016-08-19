import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from "rxjs/Observable";
import {
    FormControl,
    FormGroup,
    FormBuilder,
    Validators
} from '@angular/forms';

@Component({
  selector: 'reset-page',
  providers: [],
  styleUrls: [],
  templateUrl: 'app/pages/reset/reset.html'
})
export default class ResetComponent {
  pageHeader: any;
  formModel: FormGroup;
  emailToken: string;

  constructor(route: ActivatedRoute) {
    this.emailToken = route.snapshot.params['emailToken'];

    this.pageHeader = {
      title: 'Password reset',
      strapline: ''
    };

    const fb = new FormBuilder();
    this.formModel = fb.group({
      'password': [null, Validators.minLength(3)]
    })
  }

  onReset() {
    if (this.formModel.valid) {
      console.log("Calling reset...");
      //this.authService.resetEvent.emit(this.formModel.value);
    }
  }
}
