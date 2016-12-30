# Changelog


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