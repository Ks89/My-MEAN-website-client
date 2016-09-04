import {Component} from '@angular/core';
import {Observable} from "rxjs/Observable";

import {Project, ProjectService} from '../../common/services/projects';

@Component({
  selector: 'home-page',
  styleUrls: ['app/pages/home/home.css'],
  templateUrl: 'app/pages/home/home.html'
})
export default class HomeComponent {
  products: Observable<Project[]>;
  thumbs: Observable<Project[]>;

  pageHeader: Object;
  message: string;

  constructor(private productService: ProjectService) {
    this.products = this.productService.getProjects();
    this.thumbs = this.productService.getProjectsForHomepage();

    this.pageHeader = {
      title: 'KS',
      strapline: 'Welcome'
    };

    this.message = "Welcome to my website";
  }
}
