import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'page-header',
  templateUrl: 'pageHeader.html'
})
export default class PageHeaderComponent implements OnInit {
  @Input() title: string;
  @Input() strapline: string;

  ngOnInit(){}
}
