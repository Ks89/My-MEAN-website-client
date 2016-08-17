import {Component} from '@angular/core';
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'register-page',
  providers: [],
  styleUrls: [],
  templateUrl: 'app/pages/register/register.html'
})
export default class RegisterComponent {
  pageHeader: any;

  constructor() {
    this.pageHeader = {
      title: 'Create a new accout',
      strapline: ''
    };
  }
}
