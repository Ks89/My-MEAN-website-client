import { enableProdMode } from '@angular/core';
import { bootloader } from "@angularclass/hmr";
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {AppModule} from "./app/app.module";

if (webpack.ENV === 'prod') {
  enableProdMode();
}

// to be able to use Hot Module Replacement by AngularClass
export function main(): any {
  return platformBrowserDynamic().bootstrapModule(AppModule);
}

// boot on document ready
// uses Hot Module Replacement by AngularClass
bootloader(main);