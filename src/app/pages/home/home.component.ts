import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Project, ProjectService } from '../../common/services';

@Component({
  selector: 'mmw-home-page',
  styleUrls: ['home.scss'],
  templateUrl: 'home.html'
})
export default class HomeComponent implements OnInit {
  public products: Observable<Project[]>;
  public thumbs: Observable<Project[]>;

  public pageHeader: Object;
  public message: string;

  constructor(private projectService: ProjectService) {
    this.pageHeader = {
      title: 'KS',
      strapline: 'Welcome'
    };
    this.message = 'Welcome to my website';
  }

  ngOnInit() {
    this.products = this.projectService.getProjects();
    this.thumbs = this.projectService.getProjectsForHomepage().share();
  }
}
