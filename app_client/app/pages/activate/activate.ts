import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from "rxjs/Observable";
import {AuthService} from '../../common/services/auth';
import {Router} from '@angular/router';

@Component({
  selector: 'activate-page',
  template: require('./activate.html')
})
export default class ActivateComponent {
  pageHeader: Object;
  emailToken: string;
  userName: string;
  activateAlert: Object = { visible: false }; //hidden by default

  constructor(private authService: AuthService,
              route: ActivatedRoute,
              private router: Router) {
    this.emailToken = route.snapshot.params['emailToken'];
    this.userName = route.snapshot.params['userName'];

    this.pageHeader = {
      title: 'Activate',
      strapline: ''
    };

    this.onActivate();
  }

  onActivate() {
    console.log("Calling activate...");

    this.authService.activate(this.emailToken, this.userName)
    .subscribe(response => {
        console.log("Response");
        console.log(response);
        this.activateAlert = {
          visible: true,
          status: 'success',
          strong : 'Success',
          message: response.message
        }
      },
      err => {
        console.error(err);
        this.activateAlert = {
          visible: true,
          status: 'danger',
          strong : 'Danger',
          message: JSON.parse(err._body).message
        }
      },
      () => console.log("Done")
    );
  }
}
