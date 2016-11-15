import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import DashboardAdminComponent from './pages/dashboard/dashboard.component';
import UsersAdminComponent from './pages/users/users.component';
import NewsletterAdminComponent from './pages/newsletter/newsletter.component';

const appRoutes: Routes = [
  // use http://localhost:3300/admin to login
  {path: '',                    component: DashboardAdminComponent},
  {path: 'allUsers',           component: UsersAdminComponent},
  {path: 'newsletterSearch',   component: NewsletterAdminComponent}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
