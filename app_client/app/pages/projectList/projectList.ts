import {Component} from '@angular/core';
import {Observable} from "rxjs/Observable";

import {Project, ProjectService} from '../../services/project-service';
// import CarouselComponent from '../carousel/carousel';


@Component({
  selector: 'projectList-page',
  providers: [],
  // directives: [
  // ],
  // styleUrls: ['app/pages/projectList/projectList.css'],
  templateUrl: 'app/pages/projectList/projectList.html'
})
export default class ProjectListComponent {
  projects: Observable<Project[]>;

  constructor(private projectService: ProjectService) {
    this.projects = this.projectService.getProjects();
  }
}
