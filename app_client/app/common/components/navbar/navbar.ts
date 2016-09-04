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
  currentUser: any = {name : ''}
  currentPath: string = 'fakeString';

  constructor(private authService: AuthService, private router: Router) {

    this.authService.loginEvent
    .subscribe(user => {
        console.log("NAVIGATION: ");
        console.log(user);

        if(user==null) {
          this.isLoggedIn = false;
          this.currentUser = {name : ''};
        } else {
          this.isLoggedIn = true;
          if(user.local) {
            this.setCurrentUser(user.local);
          } else if(user.github) {
            this.setCurrentUser(user.github);
          } else if(user.facebook) {
            this.setCurrentUser(user.facebook);
          } else if(user.google) {
            this.setCurrentUser(user.google);
          } else if(user.twitter) {
            this.setCurrentUser(user.twitter);
          } else if(user.linkedin) {
            this.setCurrentUser(user.linkedin);
          }
        }
      },
      err => console.log("Can't get logged user"),
      () => console.log('DONE')
    );
  }

  private setCurrentUser(originData): void {
    if(originData) {
      this.currentUser = {
        name : originData.name
      };
    }
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
