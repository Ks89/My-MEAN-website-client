import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import HomeComponent from '../../pages/home/home';
import NavbarComponent from '../navbar/navbar';
import FooterComponent from '../footer/footer';

@Component({
  selector: 'my-application',
  templateUrl: 'app/common/application/application.html',
  directives: [
    ROUTER_DIRECTIVES,
    NavbarComponent,
    FooterComponent,
    HomeComponent
  ]
})
export default class ApplicationComponent {}
