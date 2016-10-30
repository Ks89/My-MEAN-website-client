import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import HomeComponent from './pages/home/home.component';

const appRoutes: Routes = [
  // use http://localhost:3001/admin.html to login
  {path: 'admin.html',                  component: HomeComponent},
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
