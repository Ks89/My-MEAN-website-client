import {Component} from '@angular/core';
import {AuthService} from '../../services/auth';

@Component({
  selector: 'navigation',
  styleUrls: [],
  templateUrl: 'app/common/components/navbar/navbar.html',
})
export default class NavbarComponent {

  //TODO FIXME replace with a real impl calling the service
  isLoggedIn: boolean = false;
  currentUser: any = {name : 'fake'};
  currentPath: string = 'fakeString';

  constructor(private authService: AuthService) {

    this.authService.loginEvent
        .subscribe(res =>
        {
          console.log("NAVIGATION: ");
          console.log(res);

          this.currentUser = {name: res.local.name};
          this.isLoggedIn = true;

        },err =>  console.log("Can't get logged user"),
        () => console.log('DONE')
      );
  }
}
