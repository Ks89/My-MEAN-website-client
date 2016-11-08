import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

import { Project, ProjectService } from '../../common/services';

@Component({
  selector: 'mmw-project-detail-page',
  styleUrls: ['bs_doc.scss'],
  templateUrl: 'project-detail.html'
})
export default class ProjectDetailComponent implements OnInit, OnDestroy {
  public project: Project;
  public projectId: string;
  public pageHeader: any;
  public images: Object[];

  public self = this;
  public descriptionHtml: any;
  public changelogHtml: any;
  public releasesHtml: any;
  public featuresHtml: any;
  public futureExtensionsHtml: any;
  public licenseHtml: any;

  private subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private router: Router
  ) {

    this.projectId = route.snapshot.params['projectId'];

    this.pageHeader = {
      title: 'Project', // that will be replaced by the projectName
      strapline: ''
    };
  }

  ngOnInit() {
    this.projectService.getProjectsById(this.projectId).subscribe(
      project => {
        this.project = project;
        this.images = project.gallery;
        this.pageHeader.title = this.project.name; // replace pageHeader's title with projectName
        this.descriptionHtml = this.project.description;
        this.changelogHtml = this.project.changelog;
        this.releasesHtml = this.project.releases;
        this.featuresHtml = this.project.features;
        this.futureExtensionsHtml = this.project.futureExtensions;
        this.licenseHtml = this.project.licenseText;
      }, error => console.error(error)
    );
  }

  ngOnDestroy(): any {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
