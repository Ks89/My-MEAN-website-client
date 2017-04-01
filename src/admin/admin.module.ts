import { NgModule, ApplicationRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ROUTES }  from './admin.routing';

// Third party opensource libraries (that are using scss/css)
import 'bootstrap-loader';
import '../styles/styles.scss';
import '../styles/headings.css';

import 'jquery-slimscroll';

import { SharedModule } from './shared/shared.module';
import { SidebarModule } from './sidebar-module/sidebar.module';
import { ADMIN_COMPONENTS } from './pages/components';
import { ApplicationAdminComponent } from './application/application.component';

import { LaddaModule } from "angular2-ladda";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { createNewHosts, createInputTransfer, removeNgStyles } from '@angularclass/hmr';
import { IdlePreloadModule } from '@angularclass/idle-preload';
import { RouterModule, PreloadAllModules } from '@angular/router';

@NgModule({
  imports: [
    IdlePreloadModule.forRoot(), // forRoot ensures the providers are only created once
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(ROUTES, { useHash: false, preloadingStrategy: PreloadAllModules }),
    LaddaModule,
    SidebarModule,
    SharedModule
  ],
  declarations: [
    ApplicationAdminComponent,
    ADMIN_COMPONENTS
  ],
  providers: [],
  bootstrap: [ ApplicationAdminComponent ]
})

export class AdminModule {

  // ----------- Hot Module Replacement via AngularClass library - BEGIN ------------
  constructor(public appRef: ApplicationRef) {}
  hmrOnInit(store: any): any {
    if (!store || !store.state) return;
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
  hmrAfterDestroy(store: any): any {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
    // anything you need done the component is removed
  }
  // ----------- Hot Module Replacement via AngularClass library - END ------------
}