import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from "rxjs/Observable";
import {Router} from '@angular/router';

import {ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {Project, ProjectService} from '../../common/services/projects';

@Component({
  selector: 'projectDetail-page',
  styleUrls: ['bs_doc.css'],
  templateUrl: 'projectDetail.html'
})
export default class ProjectDetailComponent implements OnInit {
  public project: Project;
  public projectId: string;
  public pageHeader: any;
  public images: Object[];
  private _subscription: Subscription;

  public self = this;
  public descriptionUrl : any;
  public changelogUrl : any;
  public releasesUrl : any;
  public featuresUrl : any;
  public futureExtensionsUrl : any;
  public licenseUrl : any;

  constructor(
    private _route: ActivatedRoute,
    private _projectService: ProjectService,
    private _router: Router
  ) {

    this.projectId = _route.snapshot.params['projectId'];

    this.pageHeader = {
      title: 'Project', //that will be replaced by the projectName
      strapline: ''
    };
  }

  ngOnInit(){
    this._projectService.getProjectsById(this.projectId).subscribe(
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

  getInnerUrl(anchor: string) {
    console.log(this._router.url);
    return this._router.url + '#' + anchor;

  }

  ngOnDestroy(): any {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
