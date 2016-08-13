import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'reset-page',
  providers: [],
  directives: [],
  styleUrls: [],
  templateUrl: 'app/pages/reset/reset.html'
})
export default class ResetComponent {
  emailToken: string;

  constructor(route: ActivatedRoute) {
    this.emailToken = route.snapshot.params['emailToken'];
  }
}
