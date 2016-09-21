import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from "rxjs/Observable";
import {AuthService} from '../../common/services/auth';
import {Router} from '@angular/router';

@Component({
  selector: 'post3d-auth-page',
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
    //3dparty authentication
    this._authService.post3dAuthAfterCallback().subscribe(
      jwtTokenAsString => {
        console.log("[[[[[[[[[]]]]]]]]]");
        console.log(jwtTokenAsString);
        console.log("[[[[[[[[[]]]]]]]]]");
        this._authService.getLoggedUser().subscribe(
          user => {
            console.log("{{{{{{{{{}}}}}}}}}");
            console.log(user);
            console.log("{{{{{{{{{}}}}}}}}}");
            this._authService.loginEvent.emit(user);
            this._router.navigate(['/profile']);
          }
        );
      },
      (err)=>{
        console.error(err);
        this._router.navigate(['/login']);
      },
      ()=>console.log("Done")
    );
  }
}
