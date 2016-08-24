import {Component} from '@angular/core';

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
}
