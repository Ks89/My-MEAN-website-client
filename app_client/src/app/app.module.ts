import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { routing, appRoutingProviders }  from './app.routing';

import ApplicationComponent from './application/application.component';
import HomeComponent from './pages/home/home.component';
import ProjectListComponent from './pages/project-list/project-list.component';
import CvComponent from './pages/cv/cv.component';
import AboutComponent from './pages/about/about.component';
import ContactComponent from './pages/contact/contact.component';
import ProjectDetailComponent from './pages/project-detail/project-detail.component';
import RegisterComponent from './pages/register/register.component';
import LoginComponent from './pages/login/login.component';
import ResetComponent from './pages/reset/reset.component';
import ForgotComponent from './pages/forgot/forgot.component';
import ActivateComponent from './pages/activate/activate.component';
import ProfileComponent from './pages/profile/profile.component';
import Post3dAuthComponent from './pages/post3d-auth/post3d-auth.component';

import CarouselComponent from './common/components/carousel/carousel.component';
import FooterComponent from './common/components/footer/footer.component';
import NavbarComponent from './common/components/navbar/navbar.component';
import PageHeaderComponent from './common/components/page-header/page-header.component';

import { ProjectSearchPipe } from './common/pipes/project-search/project-search.pipe';

import { ProjectService } from './common/services/projects.service';
import { ProfileService } from './common/services/profile.service';
import { ContactService } from './common/services/contact.service';
import { AuthService } from './common/services/auth.service';
import { AuthGuard } from './common/services/auth-guard.service';
import { SERVICES } from './common/services/services';

import { ReCaptchaModule } from 'angular2-recaptcha/angular2-recaptcha';
import { ImageModal } from 'angular2-image-popup/directives/angular2-image-popup/image-modal-popup';
// import { ComponentOutlet } from 'angular2-component-outlet';
import { SimplePageScroll } from 'ng2-simple-page-scroll';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { LaddaModule } from 'angular2-ladda';
// import { UPLOAD_DIRECTIVES } from 'ng2-uploader/ng2-uploader';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    // LaddaModule,
    ReCaptchaModule,
    routing
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
    ImageModal,
    // ComponentOutlet,
    SimplePageScroll,
  //  UPLOAD_DIRECTIVES
  ],
  providers: [
    appRoutingProviders,
    ProjectService,
    ProfileService,
    ContactService,
    AuthService,
    SERVICES,
    AuthGuard
  ],
  bootstrap: [ ApplicationComponent ]
})

export class AppModule { }
