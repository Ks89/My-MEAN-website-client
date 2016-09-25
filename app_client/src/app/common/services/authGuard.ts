import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private _authService: AuthService, private _router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
      return this._authService.getLoggedUser()
      .map(
        data => {
          console.log('canActivate data is: ');
          console.log(data);

          if (data && data._id) {
            console.log('canActivate data is true ');
            console.log('canActivate id: ' + data._id);
            return true;
          } else {
            console.log('canActivate data is false ');
            this._router.navigate(['/login']);
            return false;
          }
        },
        error => {
          console.log('canActivate error ');
          this._router.navigate(['/login']);
          return false;
        }
      );
    }

  }
