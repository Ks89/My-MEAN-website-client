import { Component, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs/Subscription";
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';

import { Project, ProjectService } from '../../core/services/services';
import * as fromRoot from '../../core/reducers/hello-example';
import * as example from '../../core/actions/hello-example';

@Component({
  selector: 'mmw-project-list-page',
  styleUrls: ['timeline.scss'],
  templateUrl: 'project-list.html'
})
export class ProjectListComponent implements OnDestroy {
  fullProjects: Project[];
  originalProjects: Project[];
  visibleProjects: Project[];

  pageHeader: any;
  sidebar: any;
  sidebarTitle: string;
  message: string;

  page = 1;
  elementsPerPage = 3;
  totalNumElements = 0;

  helloExample$: Observable<string>;

  private subscription: Subscription;

  constructor(private store: Store<fromRoot.State>,
              private projectService: ProjectService) {
    this.subscription = this.projectService.getProjects().subscribe((values: Project[]) => {
      this.fullProjects = values;
      this.originalProjects = values;
      this.totalNumElements = values.length;
      this.visibleProjects = values.slice(this.page - 1, this.elementsPerPage);
    });

    this.helloExample$ = this.store.select(fromRoot.getHelloExample);
    // 'pageNum').subscribe(val => {
    //   this.page = +val;
    // });

    this.pageHeader = {
      title: 'Projects',
      strapline: ''
    };

    // init the timeline into the sidebar
    this.sidebarTitle = 'What can you do?';
    this.sidebar = {
      timeline: [
        {
          title: 'Discover',
          body: 'Check my projects on GitHub.',
          icon: 'search',
          color: 'badge'
        },
        {
          title: 'Like',
          body: 'Star the project that you like.',
          icon: 'star',
          color: 'danger'
        },
        {
          title: 'Improve',
          body: 'Fork a project to enhance it.',
          icon: 'plus',
          color: 'warning'
        },
        {
          title: 'Collaborate',
          body: 'Create a pull request with your improvements.',
          icon: 'user',
          color: 'info'
        },
        {
          title: 'Share',
          body: 'Share the project with your friends or on the web.',
          icon: 'globe',
          color: 'success'
        }
      ]
    };

    this.message = 'Searching for projects';
  }

  onKeyupFilter(value: string) {
    if (!value || value === '') {
      this.fullProjects = this.originalProjects;
    }

    this.fullProjects = this.fullProjects.filter(project => this.filterCallback(project, value));
    this.totalNumElements = this.fullProjects.length;
    this.page = 1;
    this.onPageChange();
  }

  onPageChange() {
    let startindex: number = (this.page - 1) * this.elementsPerPage;
    let endIndex: number = Math.min((this.page * this.elementsPerPage), this.totalNumElements);
    this.visibleProjects = this.fullProjects.slice(startindex, endIndex);
    // this.pageStore.dispatch({type: SET_PAGE, payload: this.page});
    this.store.dispatch(new example.SayHelloAction());
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // this should be private and I should test onKeyupFilter with mocked projects
  filterCallback(project: Project, value: string) {
    if (_.isNil(value)) {
      return true;
    }
    if (_.isNil(project)) {
      return false;
    } else {
      return project.name.toLowerCase().includes(value.toLowerCase()) || project.shortDescription.toLowerCase().includes(value.toLowerCase());
    }
  }
}
