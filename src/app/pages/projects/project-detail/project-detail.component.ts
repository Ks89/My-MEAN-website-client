import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Project, ProjectService } from '../../../core/services/services';
import { ProjectGallery } from '../../../core/services/projects.service';

import { Image } from 'angular-modal-gallery';

@Component({
  selector: 'mmw-project-detail-page',
  styleUrls: ['project-detail.scss'],
  templateUrl: 'project-detail.html'
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  project: Project;
  projectId: string;
  pageHeader: any;
  images: Image[] = [];

  descriptionHtml: any;
  changelogHtml: any;
  releasesHtml: any;
  featuresHtml: any;
  futureExtensionsHtml: any;
  licenseHtml: any;

  private projectSubscription: Subscription;

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
    console.log('Projectid:' + this.projectId);

    this.projectSubscription = this.projectService.getProjectsById(this.projectId)
      .subscribe(
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
    if (this.projectSubscription) {
      this.projectSubscription.unsubscribe();
    }
  }
}
