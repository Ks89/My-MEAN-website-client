import {Component, Input} from '@angular/core';

@Component({
  selector: 'page-header',
  templateUrl: 'pageHeader.html'
})
export default class PageHeaderComponent {
  @Input() title: string;
  @Input() strapline: string;
}
