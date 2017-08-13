

import { Routes, RouterModule } from '@angular/router';

import { ProjectsComponent } from './projects.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';

export const routes: Routes = [
  { path: '',
    component: ProjectsComponent,
    children: [
      { path: '',                       component: ProjectListComponent },
      { path: 'projects',               component: ProjectListComponent },
      { path: ':projectId',    component: ProjectDetailComponent }
    ]
  }
];

export const routing = RouterModule.forChild(routes);