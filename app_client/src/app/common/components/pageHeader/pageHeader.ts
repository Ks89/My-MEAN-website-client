import {Component, Input} from '@angular/core';

@Component({
  selector: 'page-header',
  properties: ['title', 'strapline'],
  styleUrls: ['pageHeader.css'],
  templateUrl: 'pageHeader.html'
})
export default class PageHeaderComponent {
  title: string;
  strapline: string;
}
