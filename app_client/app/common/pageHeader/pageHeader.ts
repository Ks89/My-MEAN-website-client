import {Component, Input} from '@angular/core';

@Component({
  selector: 'page-header',
  properties: ['title', 'strapline'],
  styleUrls: ['app/common/pageHeader/pageHeader.css'],
  templateUrl: 'app/common/pageHeader/pageHeader.html'
})
export default class PageHeaderComponent {
  title: string;
  strapline: string;
}
