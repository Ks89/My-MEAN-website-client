import { NgModule, Provider } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import {HTTP_PROVIDERS} from '@angular/http';

import ApplicationComponent from './application/application';
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

import CarouselComponent from './common/components/carousel/carousel';
import FooterComponent from './common/components/footer/footer';
import NavbarComponent from './common/components/navbar/navbar';
import PageHeaderComponent from './common/components/pageHeader/pageHeader';
import {ProjectSearchPipe} from './common/pipes/projectSearch/projectSearch';

import {ProjectService} from './common/services/projects';
import {ProfileService} from './common/services/profile';
import {ContactService} from './common/services/contact';
import {AuthService} from './common/services/auth';
import {AuthGuard} from './common/services/authGuard';
import {SERVICES} from './common/services/services';

import {ReCaptchaModule} from 'angular2-recaptcha/angular2-recaptcha';
// import {ImageModal} from 'angular2-image-popup/directives/angular2-image-popup/image-modal-popup';
// import {ComponentOutlet} from 'angular2-component-outlet-modified';
import {LocalStorage, SessionStorage, SESSION_STROAGE_PROVIDER, LOCAL_STORAGE_PROVIDER, WEB_STORAGE_PROVIDERS} from 'h5webstorage';
// import {SimplePageScroll} from 'ng2-simple-page-scroll';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { LaddaModule } from 'angular2-ladda';
// import { UPLOAD_DIRECTIVES } from 'ng2-uploader/ng2-uploader';

@NgModule({
  imports: [BrowserModule,
            HttpModule,
            FormsModule,
            ReactiveFormsModule,
            RouterModule.forRoot([
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
              //TODO in angular2 '?' isn't working -> find a better approach to do that
              {path: 'profile',                         component: ProfileComponent, canActivate: [AuthGuard] },
              {path: 'profile/:token',                  component: ProfileComponent, canActivate: [AuthGuard] },
              {path: 'post3dauth',                      component: Post3dAuthComponent}
            ]),
            NgbModule,
            LaddaModule,
            ReCaptchaModule
  ],
  declarations: [
    ApplicationComponent,
    HomeComponent,
    ProjectListComponent,
    CvComponent,
    AboutComponent,
    ContactComponent,
    ProjectDetailComponent,
    RegisterComponent,
    LoginComponent,
    ResetComponent,
    ForgotComponent,
    ActivateComponent,
    ProfileComponent,
    Post3dAuthComponent,
    CarouselComponent,
    FooterComponent,
    NavbarComponent,
    PageHeaderComponent,
    ProjectSearchPipe,
    // ImageModal,
    // ComponentOutlet,
    // SimplePageScroll,
  //  UPLOAD_DIRECTIVES
  ],
  providers: [
      { provide: LocationStrategy, useClass: HashLocationStrategy },
      ProjectService,
      ProfileService,
      ContactService,
      AuthService,
      HTTP_PROVIDERS,
      WEB_STORAGE_PROVIDERS, SESSION_STROAGE_PROVIDER, LOCAL_STORAGE_PROVIDER,
      SERVICES,
      AuthGuard
  ],
  bootstrap: [ ApplicationComponent ]
})

export class AppModule { }
