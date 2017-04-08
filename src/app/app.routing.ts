import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { ProjectListComponent } from './pages/project-list/project-list.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ProjectDetailComponent } from './pages/project-detail/project-detail.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { ResetComponent } from './pages/reset/reset.component';
import { ForgotComponent } from './pages/forgot/forgot.component';
import { ActivateComponent } from './pages/activate/activate.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { Post3dAuthComponent } from './pages/post3d-auth/post3d-auth.component';
import { NotFound404Component } from './pages/404/not-found404.component';

import { AuthGuard } from './shared/services/auth-guard.service';

export const ROUTES: Routes = [
  {path: '',                                component: HomeComponent},
  {path: 'dashboard',                       component: HomeComponent},
  {path: 'projects',                        component: ProjectListComponent},
  {path: 'projects/:projectId',             component: ProjectDetailComponent},
  {path: 'cv',                              loadChildren: './pages/cv/cv.module#CvModule'}, // lazy loading
  {path: 'contact',                         component: ContactComponent},
  {path: 'about',                           component: AboutComponent},
  {path: 'register',                        component: RegisterComponent},
  {path: 'login',                           component: LoginComponent},
  {path: 'reset',                           component: ResetComponent},
  {path: 'forgot',                          component: ForgotComponent},
  {path: 'activate',                        component: ActivateComponent},
  // TODO in angular2 '?' isn't working -> find a better approach to do that
  {path: 'profile',                         component: ProfileComponent, canActivate: [AuthGuard] },
  {path: 'profile/:token',                  component: ProfileComponent, canActivate: [AuthGuard] },
  {path: 'post3dauth',                      component: Post3dAuthComponent},
  {path: '**',                              component: NotFound404Component}
];