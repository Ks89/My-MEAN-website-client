import {Component} from '@angular/core';
import {AuthService} from '../../services/auth';

@Component({
  selector: 'navigation',
  styleUrls: [],
  templateUrl: 'app/common/components/navbar/navbar.html',
})
export default class NavbarComponent {

  isLoggedIn: boolean = false;
  currentUser: any = {name : 'fake'};
  currentPath: string = 'fakeString';

  // this.authService.isLoggedIn().subscribe(
  //   x => {
  //     console.log('Next: ' + x)
  //   },
  //   err => {
  //     console.log('Error: ' + err)
  //   },
  //   () => {
  //     console.log('Completed')
  //   });
  // }
}
