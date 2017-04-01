import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share';

import { Project, ProjectService } from '../../shared/services/services';

@Component({
  selector: 'mmw-home-page',
  styleUrls: ['home.scss'],
  templateUrl: 'home.html'
})
export class HomeComponent implements OnInit {
  public products: Observable<Project[]>;
  public thumbs: Observable<Project[]>;

  public pageHeader: any;
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
