import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { routing, appRoutingProviders }  from './admin.routing';

import ApplicationComponent from './application/application.component';
import HomeComponent from './pages/home/home.component';

import FooterComponent from './common/components/footer/footer.component';

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
    routing
  ],
  declarations: [
    ApplicationComponent,
    HomeComponent,
    FooterComponent
  ],
  providers: [
    appRoutingProviders
  ],
  bootstrap: [ ApplicationComponent ]
})

export class AdminModule { }
