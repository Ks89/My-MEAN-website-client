import {Component, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../shared/services/services';
import {Subscription} from "rxjs";

@Component({
  selector: 'mmw-post3d-auth-page',
  templateUrl: 'post3d-auth.html'
})
export class Post3dAuthComponent implements OnInit, OnDestroy {
  public pageHeader: any;

  private postAuthSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router) {
    this.pageHeader = {
      title: 'PostLogin',
      strapline: ''
    };
  }

  ngOnInit() {
    console.log('INIT post3dAuth');
    // 3dparty authentication
    this.postAuthSubscription = this.authService.post3dAuthAfterCallback().subscribe(
      jwtTokenAsString => {
        console.log("post3dauth - getLoggedUser called");
        this.authService.getLoggedUser().subscribe(
          user => {
            console.log("post3dauth - redirecting");
            this.authService.loginEvent.emit(user);
            this.router.navigate(['/profile']);
          },
          (err) => {
            console.error(err);
          },
          () => console.log('getLoggedUser Done')
        );
      },
      (err) => {
        console.error(err);
        this.router.navigate(['/login']);
      },
      () => console.log('post3dAuthAfterCallback Done')
    );
  }

  ngOnDestroy() {
    if(this.postAuthSubscription) {
      this.postAuthSubscription.unsubscribe();
    }
  }
}
