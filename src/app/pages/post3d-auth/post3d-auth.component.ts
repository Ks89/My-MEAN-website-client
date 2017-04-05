import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {Observable} from 'rxjs/Observable';
import {Subscription} from "rxjs/Subscription";
import 'rxjs/add/observable/combineLatest';

import {AuthService} from '../../shared/services/services';

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

    const postAuth$: Observable<any> = this.authService.post3dAuthAfterCallback();
    const user$: Observable<any> = this.authService.getLoggedUser();

    this.postAuthSubscription = Observable.combineLatest(postAuth$, user$,
      (postAuth, user) => ({jwtTokenAsString: postAuth, user}))
      .subscribe(
        result => {
          console.log("post3dauth - getLoggedUser");
          console.log('**************************');
          console.log(result.jwtTokenAsString);
          console.log('**************************');

          console.log("redirecting to profile");
          this.authService.loginEvent.emit(result.user);
          this.router.navigate(['/profile']);
        },
        err => {
          console.error(err);
          this.router.navigate(['/login']);
        },
        () => console.log('Done')
      );
  }

  ngOnDestroy() {
    if (this.postAuthSubscription) {
      this.postAuthSubscription.unsubscribe();
    }
  }
}
