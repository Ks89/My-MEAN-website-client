import {Component} from '@angular/core';
import {Observable} from "rxjs/Observable";

import {Project, ProjectService} from '../../services/project-service';

@Component({
  selector: 'projectList-page',
  providers: [],
  directives: [],
  styleUrls: [],
  templateUrl: 'app/pages/projectList/projectList.html'
})
export default class ProjectListComponent {
  projects: Observable<Project[]>;

  constructor(private projectService: ProjectService) {
    this.projects = this.projectService.getProjects();
  }
}
