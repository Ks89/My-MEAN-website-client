import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

@Component({
  selector: 'navigation',
  styleUrls: ['app/common/navbar/navbar.css'],
  templateUrl: 'app/common/navbar/navbar.html',
  directives: [ROUTER_DIRECTIVES]
})
export default class NavbarComponent {}
