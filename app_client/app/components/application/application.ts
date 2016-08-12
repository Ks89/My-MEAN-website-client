import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import HomeComponent from '../home/home';
import NavbarComponent from '../navbar/navbar';
import FooterComponent from '../footer/footer';

@Component({
  selector: 'auction-application',
  templateUrl: 'app/components/application/application.html',
  directives: [
    ROUTER_DIRECTIVES,
    NavbarComponent,
    FooterComponent,
    HomeComponent
  ]
})
export default class ApplicationComponent {}
