import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'cv-page',
  templateUrl: 'cv.html'
})
export default class CvComponent implements OnInit {
  public pageHeader: any;

  constructor() {
    this.pageHeader = {
      title: 'CV',
      strapline: ''
    };
  }

  ngOnInit(){

  }
}
