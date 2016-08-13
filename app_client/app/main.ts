import {bootstrap} from '@angular/platform-browser-dynamic';
import {disableDeprecatedForms, provideForms} from '@angular/forms';
import {provideRouter} from '@angular/router';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {HTTP_PROVIDERS} from '@angular/http';

import ApplicationComponent from './common/application/application';

//import pages
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

//import services
import {ProjectService} from './services/project-service';
import {SERVICES} from './services/services';

bootstrap(ApplicationComponent, [
  provideRouter([
    {path: '',                                component: HomeComponent},
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

    //TODO in angular2 '?' isn't working -> replace with an optional queryParam
    {path: 'profile/:token?',                 component: ProfileComponent}
  ]),
  {provide: LocationStrategy, useClass: HashLocationStrategy},
  disableDeprecatedForms(),
  provideForms(),
  HTTP_PROVIDERS,
  ProjectService,
  SERVICES
]);
