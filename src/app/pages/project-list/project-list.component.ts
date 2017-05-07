import { Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from "rxjs/Subscription";
import { Store } from "@ngrx/store";

import { Project, ProjectService } from '../../core/services/services';
import { SET_PAGE } from "../../shared/reducers/page-num.reducer";

@Component({
  selector: 'mmw-project-list-page',
  styleUrls: ['timeline.scss'],
  templateUrl: 'project-list.html'
})
export class ProjectListComponent implements OnDestroy {
  fullProjects: Project[];
  visibleProjects: Project[];

  pageHeader: any;
  sidebar: any;
  sidebarTitle: string;
  message: string;
  searchInput = ''; // both not null and not undefined

  page = 1;
  elementsPerPage = 3;
  collectionSize = 0;

  private subscription: Subscription;

  constructor(private pageStore: Store<number>, private projectService: ProjectService) {
    this.subscription = this.projectService.getProjects().subscribe((values: Project[]) => {
      this.fullProjects = values;
      this.collectionSize = values.length;
      this.visibleProjects = values.slice(this.page - 1, this.elementsPerPage);
    });

    this.pageStore.dispatch({type: SET_PAGE, payload: 4});

    this.pageStore.select('pageNum').subscribe(val => {
      console.log(`Retrieve page num ${val}`);
    });

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
      ]};

      this.message = 'Searching for projects';
  }

  onPageChange(event: Event) {
    let startindex: number = (this.page - 1) * this.elementsPerPage;
    let endIndex: number = Math.min((this.page * this.elementsPerPage), this.collectionSize);
    this.visibleProjects = this.fullProjects.slice(startindex, endIndex);
  }

  ngOnDestroy() {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
