import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'activate-page',
  providers: [],
  directives: [],
  styleUrls: [],
  templateUrl: 'app/pages/activate/activate.html'
})
export default class ActivateComponent {
  emailToken: string;
  userName: string;

  constructor(route: ActivatedRoute) {
    this.emailToken = route.snapshot.params['emailToken'];
    this.userName = route.snapshot.params['userName'];
  }
}
