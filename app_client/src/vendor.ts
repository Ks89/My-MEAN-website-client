// Polyfills

import 'ie-shim'; // Internet Explorer 9 support

// import 'core-js/es6';
// Added parts of es6 which are necessary for your project or your browser support requirements.
import 'core-js/es6/symbol';
import 'core-js/es6/object';
import 'core-js/es6/function';
import 'core-js/es6/parse-int';
import 'core-js/es6/parse-float';
import 'core-js/es6/number';
import 'core-js/es6/math';
import 'core-js/es6/string';
import 'core-js/es6/date';
import 'core-js/es6/array';
import 'core-js/es6/regexp';
import 'core-js/es6/map';
import 'core-js/es6/set';
import 'core-js/es6/weak-map';
import 'core-js/es6/weak-set';
import 'core-js/es6/typed';
import 'core-js/es6/reflect';
import 'core-js/es6/promise';

import 'core-js/es7/reflect';
import 'zone.js/dist/zone';
import 'zone.js/dist/long-stack-trace-zone';

import 'reflect-metadata/Reflect.js';

// Angular modules
// import '@angular/core';
// import '@angular/common';
// import '@angular/compiler';
import '@angular/forms';
// import '@angular/platform-browser';
import '@angular/platform-browser-dynamic';
import '@angular/http';
import '@angular/router';

// RxJS
import 'rxjs';

//---------------------------------------------------------------
//TODO FIXME - BROKEN PACKAGE temporary removed
import 'ng2-simple-page-scroll';
// import 'angular2-component-outlet-modified/index.js';
// import "angular2-image-popup/app/main";

//---------------------------------------------------------------
import 'angular2-recaptcha/angular2-recaptcha'; //IT SHOULD WORK, I don't know it returns an error
import '@ng-bootstrap/ng-bootstrap';
// import 'angular2-ladda';

// Other vendor libraries
import 'jquery';
import 'tether/dist/js/tether.min.js';

//-------------------------------------------------------------------------
//TODO FIXME remove bootstrap.min.css from index.html and switch to bootstrap-loader,
// using this package https://github.com/shakacode/bootstrap-loader
// import 'bootstrap/dist/css/bootstrap.min.css';
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
//TODO FIXME add this css files when angular2-image-popup will work.
// import 'angular2-image-popup/directives/angular2-image-popup/css/style.css';
// import 'angular2-image-popup/app/assets/css/main.css';
//-------------------------------------------------------------------------
