System.config({
  transpiler: 'typescript',
  typescriptOptions: {
    emitDecoratorMetadata: true,
    module: 'system'
  },
  map: {
    'app'     : 'app',
    'rxjs'    : 'node_modules/rxjs',
    '@angular': 'node_modules/@angular',
    'angular2-recaptcha': 'node_modules/angular2-recaptcha'
  },
  paths: {
    'node_modules/@angular/*': 'node_modules/@angular/*/bundles'
  },
  meta: {
    '@angular/*': {'format': 'cjs'}
  },
  packages: {
    'app'                              : {main: 'main', defaultExtension: 'ts'},
    'rxjs'                             : {main: 'index'},
    '@angular/http'                    : {main: 'http.umd.min.js'},
    '@angular/common'                  : {main: 'common.umd.min.js'},
    '@angular/compiler'                : {main: 'compiler.umd.min.js'},
    '@angular/core'                    : {main: 'core.umd.min.js'},
    '@angular/forms'                   : {main: 'forms.umd.min.js'},
    '@angular/platform-browser'        : {main: 'platform-browser.umd.min.js'},
    '@angular/platform-browser-dynamic': {main: 'platform-browser-dynamic.umd.min.js'},
    '@angular/router'                  : {main: 'router.umd.min.js'},
    'angular2-recaptcha'                : {defaultExtension: 'ts'}
  }
});
