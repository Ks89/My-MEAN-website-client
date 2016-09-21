import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'about-page',
  templateUrl: 'about.html'
})
export default class AboutComponent implements OnInit {
  pageHeader: any;

  constructor() {
    this.pageHeader = {
      title: 'About',
      strapline: ''
    };
  }

  ngOnInit(){

  }
}
