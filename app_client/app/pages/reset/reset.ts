import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from "rxjs/Observable";
import PageHeaderComponent from '../../common/pageHeader/pageHeader';

@Component({
  selector: 'reset-page',
  providers: [],
  directives: [PageHeaderComponent],
  styleUrls: [],
  templateUrl: 'app/pages/reset/reset.html'
})
export default class ResetComponent {
  emailToken: string;
  pageHeader: any;

  constructor(route: ActivatedRoute) {
    this.emailToken = route.snapshot.params['emailToken'];

    this.pageHeader = {
      title: 'Password reset',
      strapline: ''
    };
  }
}
