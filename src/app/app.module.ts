import { NgModule, ApplicationRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { ROUTES }  from './app.routing';

// Third party opensource libraries (that are using scss/css)
import 'bootstrap-loader';
import '../styles/styles.scss';
import '../styles/headings.css';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { COMPONENTS } from './pages/components';
import { AppComponent } from './app.component';

import 'hammerjs';
import 'mousetrap';
import { ModalGalleryModule } from 'angular-modal-gallery';
import { ReCaptchaModule } from 'angular2-recaptcha/angular2-recaptcha';
import { Ng2PageScrollModule, PageScrollConfig } from 'ng2-page-scroll';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LaddaModule } from 'angular2-ladda';
import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';
import { IdlePreloadModule } from '@angularclass/idle-preload';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { StoreModule } from "@ngrx/store";

import { pageNum } from "./shared/reducers/page-num.reducer";

@NgModule({
  imports: [
    IdlePreloadModule.forRoot(), // forRoot ensures the providers are only created once
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(), // forRoot ensures the providers are only created once
    RouterModule.forRoot(ROUTES, { useHash: false, preloadingStrategy: PreloadAllModules }),
    SharedModule,
    CoreModule,
    Ng2PageScrollModule.forRoot(),
    ModalGalleryModule.forRoot(),
    LaddaModule,
    ReCaptchaModule,

    StoreModule.provideStore({
      pageNum: pageNum
    }),

    StoreDevtoolsModule.instrumentOnlyWithExtension(),
  ],
  declarations: [
    AppComponent,
    COMPONENTS
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})

export class AppModule {

  constructor(public appRef: ApplicationRef) {
    PageScrollConfig.defaultScrollOffset = 56;
    PageScrollConfig.defaultDuration = 0;
    PageScrollConfig.defaultInterruptible = true;
  }
  // ----------- Hot Module Replacement via AngularClass library - BEGIN ------------
  hmrOnInit(store: any): any {
    if (!store || !store.state) {
      return;
    }
    console.log('HMR store', store);
    console.log('store.state.data:', store.state.data);
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
  hmrOnDestroy(store: any): any {
    let cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
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
  hmrAfterDestroy(store: any): any {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
    // anything you need done the component is removed
  }
  // ----------- Hot Module Replacement via AngularClass library - END ------------
}




