import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from "rxjs/Observable";
import {AuthService} from '../../common/services/auth';
import {Router} from '@angular/router';

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
      },
      (err)=>console.error(err),
      ()=>console.log("Done")
    );
  }
}
