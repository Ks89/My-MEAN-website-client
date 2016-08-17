import {Component} from '@angular/core';
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'about-page',
  providers: [],
  // styleUrls: ['app/pages/about/about.css'],
  templateUrl: 'app/pages/about/about.html'
})
export default class AboutComponent {
  pageHeader: any;

  constructor() {
    this.pageHeader = {
      title: 'About',
      strapline: ''
    };
  }
}
