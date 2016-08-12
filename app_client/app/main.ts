import {bootstrap} from '@angular/platform-browser-dynamic';
import {disableDeprecatedForms, provideForms} from '@angular/forms';
import {provideRouter} from '@angular/router';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {HTTP_PROVIDERS} from '@angular/http';

import ApplicationComponent from './components/application/application';
import HomeComponent from './components/home/home';
import {ProductService} from './services/product-service';
import {SERVICES} from './services/services';

bootstrap(ApplicationComponent, [
  provideRouter([
    {path: '',                    component: HomeComponent},
    //{path: 'project/:projectId', component: ProjectDetailComponent}
  ]),
  {provide: LocationStrategy, useClass: HashLocationStrategy},
  disableDeprecatedForms(),
  provideForms(),
  HTTP_PROVIDERS,
  ProductService,
  SERVICES
]);
