# Changelog

## Alpha 7

### **Features**
- #89 Add Circle Ci
- #88 Add pagination to project-list component
- #82 add ngrx-store
- #90 favicon

### **Chore**
- #84 update to tslint 5

### **Bugfixes**
- #94 login,register,activate,reset... aren't displaying errors with alerts
- #92 Fix CI's unit testing issues
- #91 Replace searchpipe with a custom login to filter elements into project-list

### **Refactor**
- #87 Apply Angular's style-guide

and all dependencies updated


## Alpha 6

### **Features**
- #10 **Implement AOT**
- #59 **Update to Angular 4**
- #78 route.queryparam instead of pathparam for some routes
- #79 change package.json scripts and add a property.js file to read npm flags

### **Chore**
- #86 Fix GUI problems after the update to Bootstrap alpha 6
- #76 Refactor npm scripts
- #81 replace ng2-simple-page-scroll with ng2-page-scroll to support AOT

### **Bugfixes**
- #65 Fix angular2-image-popup with `npm run build` (production)

### **Refactor**
- #80 rxjs - unsubscribe correctly
- #85 refactoring to fix tslint warnings and to improve code quality
- #83 rxjs prevent subscribe inside another one
- #75 refactor front-end to improve imports of components, modules and so on...

and other small changes everywhere... :)


## Alpha 5

A crazy amount of new small features and fixes

### **Features**
- #9 implement **tree shaking**
- #44 Implement **Lazy Loading**
- #8 webpack **HotModuleReplacementPlugin**
- #36 Firefox and Internet Explorer on AppVeyor
- #38 Add macOS to Travis CI
- #34 appveyor and travis are sending coverage report to codeclimate?
- #41 add coveralls service
- #50 `MyWebsite` folder should be a configuration param
- #58 improve bootstrap-loader config for production builds
- #27 Validate password in reset page
- #60 Add noContent / 404 page in angular router for both app and admin
- #70 karma single run
- #72 Add angular2-idle-preload that uses both requestIdleCallback and Cooperative Scheduling of Background Tasks
- #37 Chrome and Firefox on Travis CI

### **Chore**
- #40 regenerate and hide codeclimate repo toke
- #43 limit rxjs imports
- #49 improve windows and general documentation (install/setup)
- #53 Limit core.js imports in vendor.ts
- #55 Protractor - improve configuration
- #71 Manage bootstrapModule.then/catch

### **Bugfixes**
- #42 travis config osx+linux + nodejs multiple versions + multiple env vars (also secured)
- #6 bootstrap-loader error messages only on Window
- #73 update to webpack 2.2.0 rc6 or greater

### **Refactor**
- #66 replace all `form.controls.name` with `form.get('controlName')`
- #69 add any to variables `var: any` and replace wrong types both Object and string
- #67 Remove all `export default` to be able to try AOT

and other small changes everywhere... :)


## Alpha 4

New version with many improvements. In particular, I implemented front-end unit-tests with Angular TestBed (#3).

### **Features**
- **unit testing angular (giant feature, more than 60 commits.)** #3  👍 🥇
- AppVeyor #5
- build and test with TravisCI #33
- Initial Protractor configuration for e2e testing #26

### **Chore**
- update to tslint 4 #20
- Update from webpack 2.1.0 beta 25 to beta 27 #19
- Update to istanbul-instrument-loader 1.x.x #24

### **Bugfixes**
- fix label for id bug in projectlist template #30
- Fix home page layout on bigger screens #18

and other small changes everywhere... :)


## Alpha 3

Starting from this version, **server side and client side will be in two standalone projects on Github.**
This is the client side.

### **Features**
- Admin web page - initial implementation, still experimental and unstable (composed by sidebarmenu, fake services, webpack config and so on...This issue is the biggest part of Alpha 3) #2
- carousel component should creates slides from db [HERE](https://github.com/Ks89/My-MEAN-website-server/issues/7)
- add a progress bar before that angular starts [HERE](https://github.com/Ks89/My-MEAN-website-server/issues/5)
- Moved from Atom to Webstorm

### **Bugfixes**
- navigation bar dropdown broken without hash location strategy #1
- projects.service.ts:88 Unexpected token < in JSON at position 0 [HERE](https://github.com/Ks89/My-MEAN-website-server/issues/1)
- fix Travisci  #15
- If you register an account with a name like this: "dasdsaò," you won't able to activate it [HERE](https://github.com/Ks89/My-MEAN-website-server/issues/2)

and other small changes everywhere... :)