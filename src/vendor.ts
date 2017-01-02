import '@angular/forms';
import '@angular/platform-browser-dynamic';
import '@angular/http';
import '@angular/router';

// import 'rxjs'; removed because it's better to import
// only necessary objects, operators and so on
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/skip';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/toArray';
import 'rxjs/Observable';
import 'rxjs/Subject';
import 'rxjs/Subscription';


// Third party opensource libraries
import 'angular2-image-popup';
import 'angular2-ladda';
import 'ng2-simple-page-scroll';
import 'angular2-recaptcha/angular2-recaptcha';
import '@ng-bootstrap/ng-bootstrap';
import 'ng2-validators';

// Other famous libraries
import 'jquery';
import 'lodash';
import 'bootstrap-loader'; // used to import bootstrap as scss

// if you want to remove my custom css to show the initial spinner
// remove the css import and use the following
// import 'font-awesome-sass-loader'; // used to import font-awesome as scss

// use this if you want to see the spinner before angular's booting
import 'font-awesome/css/font-awesome.css';
// css to show a centered spinner before angular's booting
import '../src/loading.css';


import 'jquery-slimscroll';