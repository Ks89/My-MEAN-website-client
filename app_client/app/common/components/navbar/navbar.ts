import {Component} from '@angular/core';
import {AuthService} from '../../services/auth';
import {Router} from '@angular/router';

@Component({
  selector: 'navigation',
  styleUrls: [],
  templateUrl: 'app/common/components/navbar/navbar.html',
})
export default class NavbarComponent {

  //TODO FIXME replace with a real impl calling the service
  isLoggedIn: boolean = false;
  currentUser: any = null;
  currentPath: string = 'fakeString';

  constructor(private authService: AuthService, private router: Router) {

    this.authService.loginEvent
    .subscribe(res => {
        console.log("NAVIGATION: ");
        console.log(res);
        this.currentUser = {name: res.local.name};
        this.isLoggedIn = true;
      },err =>  console.log("Can't get logged user"),
      () => console.log('DONE')
    );
  }

  logout() {
    this.authService.logout()
    .subscribe(
      result => {
        console.log('Logout result: ');
        console.log(result.message);
        this.isLoggedIn = false;
        this.currentUser = null;
      }, err => {
        console.log('Impossibile to logout: ' + err);
        this.isLoggedIn = false; //FIXME, Choose the value, I don't know, but I suppose "false"
        this.currentUser = null;
      }, () => {
        console.log("logout finished");
        this.router.navigate(['/']);
      }
    );
  }
}
