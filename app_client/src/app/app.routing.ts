import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import HomeComponent from './pages/home/home';
import ProjectListComponent from './pages/projectList/projectList';
import CvComponent from './pages/cv/cv';
import AboutComponent from './pages/about/about';
import ContactComponent from './pages/contact/contact';
import ProjectDetailComponent from './pages/projectDetail/projectDetail';
import RegisterComponent from './pages/register/register';
import LoginComponent from './pages/login/login';
import ResetComponent from './pages/reset/reset';
import ForgotComponent from './pages/forgot/forgot';
import ActivateComponent from './pages/activate/activate';
import ProfileComponent from './pages/profile/profile';
import Post3dAuthComponent from './pages/post3dAuth/post3dAuth';

import { AuthGuard } from './common/services/authGuard';

const appRoutes: Routes = [

  {path: '',                                component: HomeComponent},
  {path: 'home',                            component: HomeComponent},
  {path: 'projects',                        component: ProjectListComponent},
  {path: 'projects/:projectId',             component: ProjectDetailComponent},
  {path: 'cv',                              component: CvComponent},
  {path: 'contact',                         component: ContactComponent},
  {path: 'about',                           component: AboutComponent},
  {path: 'register',                        component: RegisterComponent},
  {path: 'login',                           component: LoginComponent},
  {path: 'reset/:emailToken',               component: ResetComponent},
  {path: 'forgot',                          component: ForgotComponent},
  {path: 'activate/:emailToken/:userName',  component: ActivateComponent},
  // TODO in angular2 '?' isn't working -> find a better approach to do that
  {path: 'profile',                         component: ProfileComponent, canActivate: [AuthGuard] },
  {path: 'profile/:token',                  component: ProfileComponent, canActivate: [AuthGuard] },
  {path: 'post3dauth',                      component: Post3dAuthComponent}
];

export const appRoutingProviders: any[] = [
  { provide: LocationStrategy, useClass: HashLocationStrategy }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
