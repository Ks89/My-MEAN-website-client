import {NgModule, ApplicationRef} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { routing }  from './app.routing';

// Third party opensource libraries (that are using scss/css)
import 'bootstrap-loader';
import 'font-awesome/css/font-awesome.css';
import '../loading.css'; // css to show a centered spinner before angular's booting

import ApplicationComponent from './application/application.component';
import HomeComponent from './pages/home/home.component';
import ProjectListComponent from './pages/project-list/project-list.component';
// REMOVE THIS FOR LAZY LOADING issue #44
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

import { SERVICES } from './common/services/services';

import { ReCaptchaModule } from 'angular2-recaptcha/angular2-recaptcha';
import { ImageModal } from 'angular2-image-popup/directives/angular2-image-popup/image-modal-popup';
import { Ng2SimplePageScrollModule } from 'ng2-simple-page-scroll';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LaddaModule } from 'angular2-ladda';
import {removeNgStyles, createNewHosts, createInputTransfer} from "@angularclass/hmr";

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    Ng2SimplePageScrollModule.forRoot(),
    LaddaModule,
    ReCaptchaModule,
    routing
  ],
  declarations: [
    ApplicationComponent,
    HomeComponent,
    ProjectListComponent,
    // REMOVE THIS FOR LAZY LOADING issue #44
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
    ImageModal
  ],
  providers: [
    SERVICES
  ],
  bootstrap: [ ApplicationComponent ]
})

export class AppModule {

  // ----------- Hot Module Replacement via AngularClass library - BEGIN ------------
  constructor(public appRef: ApplicationRef) {}
  hmrOnInit(store) {
    if (!store || !store.state) return;
    console.log('HMR store', store);
    console.log('store.state.data:', store.state.data)
    // inject AppStore here and update it
    // this.AppStore.update(store.state)
    if ('restoreInputValues' in store) {
      store.restoreInputValues();
    }
    // change detection
    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }
  hmrOnDestroy(store) {
    var cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // recreate elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // inject your AppStore and grab state then set it on store
    // var appState = this.AppStore.get()
    store.state = {data: 'example value'};
    // store.state = Object.assign({}, appState)
    // save input values
    store.restoreInputValues  = createInputTransfer();
    // remove styles
    removeNgStyles();
  }
  hmrAfterDestroy(store) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
    // anything you need done the component is removed
  }
  // ----------- Hot Module Replacement via AngularClass library - END ------------
}




