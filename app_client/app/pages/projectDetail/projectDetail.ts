import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from "rxjs/Observable";

import {Project, ProjectService} from '../../common/services/projects';

@Component({
  selector: 'projectDetail-page',
  providers: [],
  styleUrls: ['app/pages/projectDetail/bs_doc.css'],
  templateUrl: 'app/pages/projectDetail/projectDetail.html'
})
export default class ProjectDetailComponent {
  project: Project;
  projectId: string;
  pageHeader: any;

  images: Object[];

  private subscription: Subscription;

  constructor(route: ActivatedRoute, private projectService: ProjectService) {
    this.projectId = route.snapshot.params['projectId'];

    this.pageHeader = {
      title: 'Project', //that will be replaced by the projectName
      strapline: ''
    };

    this.projectService.getProjectsById(this.projectId).subscribe(
      project => {
        this.project = project;
        this.images = project.gallery;
        this.pageHeader.title = this.project.name;
      }, error => console.error(error)
    );
  }

  ngOnDestroy(): any {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
