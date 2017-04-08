import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { BaMenuComponent } from './components/baMenu/baMenu.component';
import { BaMenuItemComponent } from './components/baMenu/components/baMenuItem/baMenuItem.component';
import { BaMenuService } from './components/baMenu/baMenu.service';

import {
  BaScrollPositionDirective,
  BaSlimScrollDirective
} from './directives';


import {
  BaSidebarComponent
} from './components';

const NGA_COMPONENTS = [
  BaSidebarComponent,
  BaMenuItemComponent,
  BaMenuComponent
];

const NGA_DIRECTIVES = [
  BaScrollPositionDirective,
  BaSlimScrollDirective
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
