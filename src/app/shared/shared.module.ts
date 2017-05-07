import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SHARED_COMPONENTS } from './components/components';
import { SHARED_PIPES } from './pipes/pipes';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule // without forRoot, because this is a child module
  ],
  exports: [
    SHARED_COMPONENTS,
    SHARED_PIPES
  ],
  declarations: [
    SHARED_COMPONENTS,
    SHARED_PIPES
  ]
})

export class SharedModule {}

