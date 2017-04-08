import { Routes } from '@angular/router';

import { DashboardAdminComponent } from './pages/dashboard/dashboard.component';
import { UsersAdminComponent } from './pages/users/users.component';
import { NewsletterAdminComponent } from './pages/newsletter/newsletter.component';
import { NotFound404Component } from './pages/404/not-found404.component';

export const ROUTES: Routes = [
  // use http://localhost:PORT/admin.html to login
  {path: '',                   component: DashboardAdminComponent},
  {path: 'allUsers',           component: UsersAdminComponent},
  {path: 'newsletterSearch',   component: NewsletterAdminComponent},
  {path: '**',                 component: NotFound404Component}
];