import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { AuthService } from '../../common/services/auth';

@Component({
  selector: 'mmw-post3d-auth-page',
  templateUrl: 'post3dAuth.html'
})
export default class Post3dAuthComponent implements OnInit {
  public pageHeader: any;

  constructor(private _authService: AuthService,
              private _route: ActivatedRoute,
              private _router: Router) {
    this.pageHeader = {
      title: 'Activate',
      strapline: ''
    };
  }

  ngOnInit() {
    console.log('INIT post3dAuth');
    // 3dparty authentication
    this._authService.post3dAuthAfterCallback().subscribe(
      jwtTokenAsString => {
        // console.log(jwtTokenAsString);
        this._authService.getLoggedUser().subscribe(
          user => {
            // console.log(user);
            this._authService.loginEvent.emit(user);
            this._router.navigate(['/profile']);
          }
        );
      },
      (err) => {
        console.error(err);
        this._router.navigate(['/login']);
      },
      () => console.log('Done')
    );
  }
}
