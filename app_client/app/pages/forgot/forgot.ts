import {Component} from '@angular/core';
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'forgot-page',
  providers: [],
  styleUrls: [],
  templateUrl: 'app/pages/forgot/forgot.html'
})
export default class ForgotComponent {
  pageHeader: any;

  constructor() {
    this.pageHeader = {
      title: 'Forgot',
      strapline: ''
    };
  }
}
