import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {AuthService} from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.getLoggedUser()
      .map(data => {
          console.log('canActivate data is:');
          console.log(data);

          if (data && data._id) {
            console.log('canActivate data is true');
            console.log('canActivate id: ' + data._id);
            return true;
          } else {
            console.log('canActivate data is false');
            this.router.navigate(['/login']);
            return false;
          }
      }).catch(error => {
        console.log('canActivate error');
        this.router.navigate(['/login']);
        return Observable.throw(false);
      });
  }
}
