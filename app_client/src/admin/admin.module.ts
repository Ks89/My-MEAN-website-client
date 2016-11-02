import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { routing }  from './admin.routing';

import ApplicationAdminComponent from './application/application.component';
import HomeAdminComponent from './pages/home/home.component';

import FooterAdminComponent from './common/components/footer/footer.component';
import { SidebarModule } from './sidebar-module/sidebar.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LaddaModule } from 'angular2-ladda';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    LaddaModule,
    SidebarModule,
    routing
  ],
  declarations: [
    ApplicationAdminComponent,
    HomeAdminComponent,
    FooterAdminComponent
  ],
  providers: [],
  bootstrap: [ ApplicationAdminComponent ]
})

export class AdminModule { }
