import {Component} from '@angular/core';
import {Observable} from "rxjs/Observable";
import PageHeaderComponent from '../../common/pageHeader/pageHeader';

@Component({
  selector: 'register-page',
  providers: [],
  directives: [PageHeaderComponent],
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
