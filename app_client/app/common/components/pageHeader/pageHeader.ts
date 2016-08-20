import {Component, Input} from '@angular/core';

@Component({
  selector: 'page-header',
  properties: ['title', 'strapline'],
  styleUrls: ['app/common/components/pageHeader/pageHeader.css'],
  templateUrl: 'app/common/components/pageHeader/pageHeader.html'
})
export default class PageHeaderComponent {
  title: string;
  strapline: string;
}
