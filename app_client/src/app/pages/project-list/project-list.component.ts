import { Component } from '@angular/core';
import { Observable } from "rxjs/Observable";

import { Project, ProjectService } from '../../common/services/projects.service';

@Component({
  selector: 'mmw-project-list-page',
  styleUrls: ['timeline.css'],
  templateUrl: 'project-list.html'
})
export default class ProjectListComponent {
  public projects: Observable<Project[]>;
  public pageHeader: any;
  public sidebar: any;
  public sidebarTitle: string;
  public message: string;
  public searchInput: string = ''; // both not null and not undefined

  constructor(private _projectService: ProjectService) {
    this.projects = this._projectService.getProjects();

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
}
