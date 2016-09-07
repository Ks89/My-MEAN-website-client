import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/take";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
      return this.authService.getLoggedUser()
      .map(
        data => {
          console.log("canActivate data is: ");
          console.log(data);

          if(data && data._id) {
            console.log("canActivate data is true ");
            console.log("canActivate id: " + data._id);
            return true;
          } else {
            console.log("canActivate data is false ");
            this.router.navigate(['/login']);
            return false;
          }
        },
        error => {
          console.log("canActivate error ");
          this.router.navigate(['/login']);
          return false
        }
      )
    }

  }
