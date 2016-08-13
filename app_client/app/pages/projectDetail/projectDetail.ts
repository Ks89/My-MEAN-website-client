import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from "rxjs/Observable";

import {Project, ProjectService} from '../../services/project-service';

@Component({
  selector: 'projectDetail-page',
  providers: [],
  // directives: [
  // ],
  // styleUrls: ['app/pages/projectDetail/projectDetail.css'],
  templateUrl: 'app/pages/projectDetail/projectDetail.html'
})
export default class ProjectDetailComponent {
  projects: Observable<Project[]>;
  projectId: string;

  constructor(route: ActivatedRoute, private projectService: ProjectService) {

    this.projectId = route.snapshot.params['projectId'];

    console.log("projectId: " + this.projectId);

    this.projects = this.projectService.getProjects();

    this.projectService.searchEvent
      .subscribe(
        params => this.projects = this.projectService.searchEvent(params),
          err =>  console.log("Can't get projects. Error code: %s, URL: %s "),
        () => console.log('DONE')
      );
  }
}
