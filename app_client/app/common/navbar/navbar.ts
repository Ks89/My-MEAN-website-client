import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

@Component({
  selector: 'navigation',
  templateUrl: 'app/common/navbar/navbar.html',
  directives: [ROUTER_DIRECTIVES]
})
export default class NavbarComponent {}
