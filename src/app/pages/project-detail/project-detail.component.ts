import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Image } from 'angular-modal-gallery';

import { Project, ProjectService } from '../../shared/services/services';
import { ProjectGallery } from "../../shared/services/projects.service";

@Component({
  selector: 'mmw-project-detail-page',
  styleUrls: ['project-detail.scss'],
  templateUrl: 'project-detail.html'
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  public project: Project;
  public projectId: string;
  public pageHeader: any;
  public images: Image[] = [];

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
    console.log("Projectid:" + this.projectId);

    this.subscription = this.projectService.getProjectsById(this.projectId).subscribe(
      project => {
        this.project = project;
        this.images = project.gallery.map((val: ProjectGallery) => new Image(val.img, val.thumb, val.description, null));
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
