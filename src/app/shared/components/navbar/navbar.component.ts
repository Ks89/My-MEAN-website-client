import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../core/services/services';

@Component({
  selector: 'mmw-navigation',
  templateUrl: 'navbar.html'
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  currentUser: any = {name: ''};

  private authLoginSubscription: Subscription;
  private authLogoutSubscription: Subscription;

  constructor(private authService: AuthService,
              private router: Router,
              // required to use ngx-translate inside the template
              private translate: TranslateService) {}

  ngOnInit() {
    this.authLoginSubscription = this.authService.loginEvent
      .subscribe((user: any) => {
          console.log('NAVIGATION: ');
          console.log(user);

          if (user === null) {
            this.isLoggedIn = false;
            this.currentUser = {name: ''};
          } else {
            this.isLoggedIn = true;
            if (user.local) {
              this.setCurrentUser(user.local);
            } else if (user.github) {
              this.setCurrentUser(user.github);
            } else if (user.facebook) {
              this.setCurrentUser(user.facebook);
            } else if (user.google) {
              this.setCurrentUser(user.google);
            } else if (user.twitter) {
              this.setCurrentUser(user.twitter);
            } else if (user.linkedin) {
              this.setCurrentUser(user.linkedin);
            }
          }
        },
        (err: any) => console.log('Can\'t get logged user'),
        () => console.log('DONE')
      );
  }

  isNavItemActive(location: any) {
    return location === this.router.url ? 'active' : '';
  };

  logout() {
    this.authLogoutSubscription = this.authService.logout()
      .subscribe(
        result => {
          console.log('Logout result: ');
          console.log(result.message);
          this.isLoggedIn = false;
          this.currentUser = null;
        }, err => {
          console.log('Impossibile to logout: ' + err);
          this.isLoggedIn = false; // FIXME, Choose the value, I don't know, but I suppose 'false'
          this.currentUser = null;
        }, () => {
          console.log('logout finished');
          this.router.navigate(['/']);
        }
      );
  }

  ngOnDestroy() {
    if (this.authLoginSubscription) {
      this.authLoginSubscription.unsubscribe();
    }
    if (this.authLogoutSubscription) {
      this.authLogoutSubscription.unsubscribe();
    }
  }

  private setCurrentUser(originData: any): void {
    if (originData) {
      this.currentUser = {
        name: originData.name
      };
    }
  }
}
