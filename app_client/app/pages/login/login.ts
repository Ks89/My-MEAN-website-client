import {Component} from '@angular/core';
import {Observable} from "rxjs/Observable";
import PageHeaderComponent from '../../common/pageHeader/pageHeader';

@Component({
  selector: 'login-page',
  providers: [],
  directives: [PageHeaderComponent],
  styleUrls: ['app/pages/login/login.css'],
  templateUrl: 'app/pages/login/login.html'
})
export default class LoginComponent {
  pageHeader: any;

  constructor() {
    this.pageHeader = {
      title: 'Sign in',
      strapline: ''
    };
  }
}
