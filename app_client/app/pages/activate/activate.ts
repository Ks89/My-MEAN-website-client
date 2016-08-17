import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'activate-page',
  providers: [],
  styleUrls: [],
  templateUrl: 'app/pages/activate/activate.html'
})
export default class ActivateComponent {
  emailToken: string;
  userName: string;
  pageHeader: any;

  constructor(route: ActivatedRoute) {
    this.emailToken = route.snapshot.params['emailToken'];
    this.userName = route.snapshot.params['userName'];

    this.pageHeader = {
      title: 'Activate',
      strapline: ''
    };
  }
}
