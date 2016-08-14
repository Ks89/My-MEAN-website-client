import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from "rxjs/Observable";
import PageHeaderComponent from '../../common/pageHeader/pageHeader';
import {Project, ProjectService} from '../../services/project-service';

@Component({
  selector: 'projectDetail-page',
  providers: [],
  directives: [PageHeaderComponent],
  styleUrls: [],
  templateUrl: 'app/pages/projectDetail/projectDetail.html'
})
export default class ProjectDetailComponent {
  projects: Observable<Project[]>;
  projectId: string;
  pageHeader: any;

  constructor(route: ActivatedRoute, private projectService: ProjectService) {
    this.projectId = route.snapshot.params['projectId'];
    this.projects = this.projectService.getProjects();

    this.pageHeader = {
      title: 'Project',
      strapline: ''
    };
  }
}
