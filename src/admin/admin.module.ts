import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { routing }  from './admin.routing';

// Third party opensource libraries (that are using scss/css)
import 'bootstrap-loader';
import 'font-awesome/css/font-awesome.css';
import '../loading.css'; // css to show a centered spinner before angular's booting

import ApplicationAdminComponent from './application/application.component';
import NotFound404Component from './pages/404/not-found404.component';
import DashboardAdminComponent from './pages/dashboard/dashboard.component';
import UsersAdminComponent from './pages/users/users.component';
import NewsletterAdminComponent from './pages/newsletter/newsletter.component';

import NavbarAdminComponent from "./common/components/navbar/navbar.component";
import { SidebarModule } from './sidebar-module/sidebar.module';

import { SERVICES } from './common/services/services';

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
    NotFound404Component,
    DashboardAdminComponent,
    UsersAdminComponent,
    NewsletterAdminComponent,
    NavbarAdminComponent
  ],
  providers: [
    SERVICES
  ],
  bootstrap: [ ApplicationAdminComponent ]
})

export class AdminModule { }
