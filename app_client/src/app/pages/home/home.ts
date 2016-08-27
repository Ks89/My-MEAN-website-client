import {Component} from '@angular/core';
import {Observable} from "rxjs/Observable";

import {Project, ProjectService} from '../../common/services/projects';

@Component({
  selector: 'home-page',
  styles: [require('./home.css')],
  template: require('./home.html')
})
export default class HomeComponent {
  products: Observable<Project[]>;
  thumbs: Observable<Project[]>;

  pageHeader: Object;
  message: string;

  constructor(private projectService: ProjectService) {
    this.products = this.projectService.getProjects();
    this.thumbs = this.projectService.getProjectsForHomepage().share();

    this.pageHeader = {
      title: 'KS',
      strapline: 'Welcome'
    };

    this.message = "Welcome to my website";
  }
}
