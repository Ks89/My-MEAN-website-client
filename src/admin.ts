import { enableProdMode } from '@angular/core';
import { bootloader } from "@angularclass/hmr";
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AdminModule }  from './admin/admin.module';

if (webpack.ENV === 'prod') {
  enableProdMode();
}

// to be able to use Hot Module Replacement by AngularClass
export function main(): any {
  return platformBrowserDynamic().bootstrapModule(AdminModule);
}

// boot on document ready
// uses Hot Module Replacement by AngularClass
bootloader(main);