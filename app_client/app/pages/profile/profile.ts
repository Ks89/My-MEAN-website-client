import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from "rxjs/Observable";
import PageHeaderComponent from '../../common/pageHeader/pageHeader';

@Component({
  selector: 'profile-page',
  providers: [],
  directives: [PageHeaderComponent],
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
