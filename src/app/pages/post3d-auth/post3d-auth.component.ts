import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../common/services';

@Component({
  selector: 'mmw-post3d-auth-page',
  templateUrl: 'post3d-auth.html'
})
export default class Post3dAuthComponent implements OnInit {
  public pageHeader: any;

  constructor(private authService: AuthService,
              private router: Router) {
    this.pageHeader = {
      title: 'Activate',
      strapline: ''
    };
  }

  ngOnInit() {
    console.log('INIT post3dAuth');
    // 3dparty authentication
    this.authService.post3dAuthAfterCallback().subscribe(
      jwtTokenAsString => {
        // console.log(jwtTokenAsString);
        this.authService.getLoggedUser().subscribe(
          user => {
            // console.log(user);
            this.authService.loginEvent.emit(user);
            this.router.navigate(['/profile']);
          }
        );
      },
      (err) => {
        console.error(err);
        this.router.navigate(['/login']);
      },
      () => console.log('Done')
    );
  }
}
