import {Component} from '@angular/core';
import {Observable} from "rxjs/Observable";
import PageHeaderComponent from '../../common/pageHeader/pageHeader';

@Component({
  selector: 'contact-page',
  providers: [],
  directives: [PageHeaderComponent],
  // styleUrls: ['app/pages/contact/contact.css'],
  templateUrl: 'app/pages/contact/contact.html'
})
export default class ContactComponent {
  pageHeader: any;

  constructor() {
    this.pageHeader = {
      title: 'Contact',
      strapline: ''
    };
  }
}
