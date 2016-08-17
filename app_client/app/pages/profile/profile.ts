import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'profile-page',
  providers: [],
  styleUrls: [],
  templateUrl: 'app/pages/profile/profile.html'
})
export default class ProfileComponent {
  token: string;
  pageHeader: any;

  constructor(route: ActivatedRoute) {
    this.token = route.snapshot.params['token'];

    this.pageHeader = {
      title: 'Profile',
      strapline: 'Welcome'
    };
  }
}
