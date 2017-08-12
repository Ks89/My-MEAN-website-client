import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SHARED_COMPONENTS } from './components/components';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CookieLawModule } from 'angular2-cookie-law';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CookieLawModule,
    NgbModule // without forRoot, because this is a child module
  ],
  exports: [
    SHARED_COMPONENTS
  ],
  declarations: [
    SHARED_COMPONENTS
  ]
})

export class SharedModule {}

