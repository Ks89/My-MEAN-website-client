import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardAdminComponent } from './pages/dashboard/dashboard.component';
import { UsersAdminComponent } from './pages/users/users.component';
import { NewsletterAdminComponent } from './pages/newsletter/newsletter.component';
import { NotFound404Component } from "./pages/404/not-found404.component";

const appRoutes: Routes = [
  // use http://localhost:3300/admin.html to login
  {path: '',                    component: DashboardAdminComponent},
  {path: 'allUsers',           component: UsersAdminComponent},
  {path: 'newsletterSearch',   component: NewsletterAdminComponent},
  {path: '**',                 component: NotFound404Component}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
