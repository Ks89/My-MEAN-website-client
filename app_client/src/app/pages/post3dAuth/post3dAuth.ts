import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from "rxjs/Observable";
import {AuthService} from '../../common/services/auth';
import {Router} from '@angular/router';

@Component({
  selector: 'post3d-auth-page',
  templateUrl: 'post3dAuth.html'
})
export default class Post3dAuthComponent {
  pageHeader: any;

  constructor(private authService: AuthService,
              route: ActivatedRoute,
              private router: Router) {
    this.pageHeader = {
      title: 'Activate',
      strapline: ''
    };
  }

  ngOnInit() {
    console.log('INIT post3dAuth');
    //3dparty authentication
    this.authService.post3dAuthAfterCallback().subscribe(
      jwtTokenAsString => {
        console.log("[[[[[[[[[]]]]]]]]]");
        console.log(jwtTokenAsString);
        console.log("[[[[[[[[[]]]]]]]]]");
        this.authService.getLoggedUser().subscribe(
          user => {
            console.log("{{{{{{{{{}}}}}}}}}");
            console.log(user);
            console.log("{{{{{{{{{}}}}}}}}}");
            this.authService.loginEvent.emit(user);
            this.router.navigate(['/profile']);
          }
        );
      },
      (err)=>{
        console.error(err);
        this.router.navigate(['/login']);
      },
      ()=>console.log("Done")
    );
  }
}
