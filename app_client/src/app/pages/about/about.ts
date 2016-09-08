import {Component} from '@angular/core';
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'about-page',
  templateUrl: 'about.html'
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
