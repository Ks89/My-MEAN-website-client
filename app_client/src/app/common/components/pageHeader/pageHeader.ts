import {Component, Input} from '@angular/core';

@Component({
  selector: 'page-header',
  styleUrls: ['pageHeader.css'],
  templateUrl: 'pageHeader.html'
})
export default class PageHeaderComponent {
  @Input() title: string;
  @Input() strapline: string;
}
