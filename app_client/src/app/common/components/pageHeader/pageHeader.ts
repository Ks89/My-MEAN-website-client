import {Component, Input} from '@angular/core';

@Component({
  selector: 'page-header',
  properties: ['title', 'strapline'],
  styles: [require('./pageHeader.css')],
  template: require('./pageHeader.html')
})
export default class PageHeaderComponent {
  title: string;
  strapline: string;
}
