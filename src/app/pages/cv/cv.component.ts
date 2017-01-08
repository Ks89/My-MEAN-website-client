import { Component } from '@angular/core';

@Component({
  selector: 'mmw-cv-page',
  templateUrl: 'cv.html'
})
export class CvComponent {
  public pageHeader: any;

  constructor() {
    this.pageHeader = {
      title: 'CV',
      strapline: ''
    };
  }
}
