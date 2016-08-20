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

  images = [
    { thumb: 'assets/images/projects/byamanager/2.png', img: 'assets/images/projects/byamanager/2.png', description: 'Image 1' },
    { thumb: 'assets/images/projects/byamanager/3.png', img: 'assets/images/projects/byamanager/3.png', description: 'Image 2' },
    { thumb: 'assets/images/projects/byamanager/4.png', img: 'assets/images/projects/byamanager/4.png', description: 'Image 3' },
    { thumb: 'assets/images/projects/byamanager/5.png', img: 'assets/images/projects/byamanager/5.png', description: 'Image 4' },
    { thumb: 'assets/images/projects/byamanager/6.png', img: 'assets/images/projects/byamanager/6.png', description: 'Image 5' }
  ];

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
