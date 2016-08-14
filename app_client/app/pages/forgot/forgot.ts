import {Component} from '@angular/core';
import {Observable} from "rxjs/Observable";
import PageHeaderComponent from '../../common/pageHeader/pageHeader';

@Component({
  selector: 'forgot-page',
  providers: [],
  directives: [PageHeaderComponent],
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
