import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

@Component({
  selector: 'navigation',
  styleUrls: ['app/common/navbar/navbar.css'],
  templateUrl: 'app/common/navbar/navbar.html',
  directives: [ROUTER_DIRECTIVES]
})
export default class NavbarComponent {

  //TODO FIXME replace with a real impl calling the service
  isLoggedIn: boolean = false;
  currentUser: any = {name : 'fake'};
  currentPath: string = 'fakeString';
}
