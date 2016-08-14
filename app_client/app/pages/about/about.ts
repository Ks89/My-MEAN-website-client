import {Component} from '@angular/core';
import {Observable} from "rxjs/Observable";
import PageHeaderComponent from '../../common/pageHeader/pageHeader';

@Component({
  selector: 'about-page',
  providers: [],
  directives: [PageHeaderComponent],
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
