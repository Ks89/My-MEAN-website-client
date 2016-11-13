import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import {BaMenu} from './components/baMenu/baMenu.component';
import {BaMenuItem} from './components/baMenu/components/baMenuItem/baMenuItem.component';

import {BaMenuService} from './components/baMenu/baMenu.service';

import {
  BaScrollPosition,
  BaSlimScroll
} from './directives';


import {
  BaSidebar
} from './components';

const NGA_COMPONENTS = [
  BaSidebar,
  BaMenuItem, BaMenu
];

const NGA_DIRECTIVES = [
  BaScrollPosition,
  BaSlimScroll
];

@NgModule({
  declarations: [
    ...NGA_DIRECTIVES,
    ...NGA_COMPONENTS
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    ...NGA_DIRECTIVES,
    ...NGA_COMPONENTS
  ],
  providers: [BaMenuService]
})
export class SidebarModule {
}
