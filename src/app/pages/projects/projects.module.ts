/*
 * MIT License
 *
 * Copyright (c) 2017 Stefano Cappa
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { routing } from './projects.routes';
import { SharedModule } from '../../shared/shared.module';
import { FEATURES_COMPONENTS } from './components';

import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers';

// ********************** angular-modal-gallery *****************************
import 'hammerjs'; // Mandatory for angular-modal-gallery 3.x.x or greater (`npm i --save hammerjs @types/hammerjs`)
import 'mousetrap'; // Mandatory for angular-modal-gallery 3.x.x or greater (`npm i --save mousetrap @types/mousetrap`)
import { ModalGalleryModule } from 'angular-modal-gallery';
// **************************************************************************

import { Ng2PageScrollModule, PageScrollConfig } from 'ng2-page-scroll';
import { TranslateModule } from '@ngx-translate/core';

console.log('`Projects` bundle loaded asynchronously');

/**
 * Lazy loaded module (asynchronously) to reduce the initial boot time required to start the application.
 * This module is loaded asynchronously with a network call when the app is ready to use.
 */
@NgModule({
  imports: [
    CommonModule,
    routing,
    SharedModule,
    RouterModule,
    NgbModule,
    Ng2PageScrollModule,
    ModalGalleryModule,
    TranslateModule.forChild({ isolate: false }),

    // add ngrx to this lazy loaded module
    StoreModule.forFeature('pageNum', reducers)
  ],
  declarations: [
    FEATURES_COMPONENTS
  ]
})
export class ProjectsModule {
  constructor() {
    PageScrollConfig.defaultScrollOffset = 30;
    PageScrollConfig.defaultDuration = 200;
    PageScrollConfig.defaultInterruptible = false;
  }
}