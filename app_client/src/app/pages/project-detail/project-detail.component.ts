import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

import { Project, ProjectService } from '../../common/services';

@Component({
  selector: 'mmw-project-detail-page',
  styleUrls: ['bs_doc.css'],
  templateUrl: 'project-detail.html'
})
export default class ProjectDetailComponent implements OnInit, OnDestroy {
  public project: Project;
  public projectId: string;
  public pageHeader: any;
  public images: Object[];

  public self = this;
  public descriptionUrl: any;
  public changelogUrl: any;
  public releasesUrl: any;
  public featuresUrl: any;
  public futureExtensionsUrl: any;
  public licenseUrl: any;

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
        this.descriptionUrl = this.project.description;
        this.changelogUrl = this.project.changelog;
        this.releasesUrl = this.project.releases;
        this.featuresUrl = this.project.features;
        this.futureExtensionsUrl = this.project.futureExtensions;
        this.licenseUrl = this.project.licenseText;
      }, error => console.error(error)
    );
  }

  getInnerUrl(anchor: string) {
    console.log(this.router.url);
    return this.router.url + '#' + anchor;

  }

  ngOnDestroy(): any {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
