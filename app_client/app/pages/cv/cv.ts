import {Component} from '@angular/core';
import {Observable} from "rxjs/Observable";
import PageHeaderComponent from '../../common/pageHeader/pageHeader';

@Component({
  selector: 'cv-page',
  providers: [],
  directives: [PageHeaderComponent],
  // styleUrls: ['app/pages/cv/cv.css'],
  templateUrl: 'app/pages/cv/cv.html'
})
export default class CvComponent {
  pageHeader: any;

  constructor() {
    this.pageHeader = {
      title: 'CV',
      strapline: ''
    };
  }
}
