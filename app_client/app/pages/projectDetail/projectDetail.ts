import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from "rxjs/Observable";

import {Project, ProjectService} from '../../common/services/projects';
import {ComponentOutlet} from 'angular2-component-outlet';

@Component({
  selector: 'projectDetail-page',
  providers: [],
  styleUrls: ['app/pages/projectDetail/bs_doc.css'],
  templateUrl: 'app/pages/projectDetail/projectDetail.html',
  directives: [ComponentOutlet]
})
export default class ProjectDetailComponent {
  project: Project;
  projectId: string;
  pageHeader: any;
  images: Object[];
  private subscription: Subscription;

  self = this;
  descriptionUrl : any;
  changelogUrl : any;
  releasesUrl : any;
  featuresUrl : any;
  futureExtensionsUrl : any;
  licenseUrl : any;

  constructor(
    route: ActivatedRoute,
    private projectService: ProjectService,
  ) {

    this.projectId = route.snapshot.params['projectId'];

    this.pageHeader = {
      title: 'Project', //that will be replaced by the projectName
      strapline: ''
    };

    this.projectService.getProjectsById(this.projectId).subscribe(
      project => {
        this.project = project;
        this.images = project.gallery;
        this.pageHeader.title = this.project.name; //replace pageHeader's title with projectName
        this.descriptionUrl = this.project.description;
        this.changelogUrl = this.project.changelog;
        this.releasesUrl = this.project.releases;
        this.featuresUrl = this.project.features;
        this.futureExtensionsUrl = this.project.futureExtensions;
        this.licenseUrl = this.project.licenseText;
      }, error => console.error(error)
    );
  }

  ngOnDestroy(): any {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
