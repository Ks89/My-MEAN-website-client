[![Build Status](https://travis-ci.org/Ks89/My-MEAN-website-client.svg?branch=master)](https://travis-ci.org/Ks89/My-MEAN-website-client)   [![Build status](https://ci.appveyor.com/api/projects/status/0t64vgb13qmvrocc?svg=true)](https://ci.appveyor.com/project/Ks89/my-mean-website-client)
   [![Code Climate](https://codeclimate.com/github/Ks89/My-MEAN-Website-client/badges/gpa.svg)](https://codeclimate.com/github/Ks89/My-MEAN-Website-client)   [![Test Coverage](https://codeclimate.com/github/Ks89/My-MEAN-Website-client/badges/coverage.svg)](https://codeclimate.com/github/Ks89/My-MEAN-Website-client/coverage)   [![Known Vulnerabilities](https://snyk.io/test/github/ks89/my-mean-website-client/badge.svg)](https://snyk.io/test/github/ks89/my-mean-website-client)
<br>
# My M.E.A.N. website client/front-end (Alpha)
<br>
**This is the client side.** Server side is available [HERE](https://github.com/Ks89/My-MEAN-website-server)
<br>
## Informations
My MEAN website is a MEAN's web application that I'm creating as a personal website, but also for other users.
It's composed by:
- A: a front-end in Angular 2
- N + E: a back-end in Node.js + Express js (and other useful libs like PassportJs)
- M: a MongoDb's database
- redis
- webpack + gulp
- and other stuff

A possible extension of this project will be a configurable template to build a custom web app very quickly. This is my final goal, please be patient :)

Attention! This project is still an alpha, so it's not production ready. Please be careful.
If you are interested, star this project on GitHub.

Testing:
- front-end unit: coverage >80%
- front-end e2e: work in progress, In future alphas I'll complete everything

## Requirements
- Node.js and npm
- My-MEAN-website server Alpha4 or greater
- npm
- PhantomJS, Google Chrome and Firefox (mandatory for testing)
- some global npm dependencies, for instance karma-cli, mocha, webpack, typescript, gulp 4.0 alpha, remap-istanbul, webdriver-manager, protractor
- work in progress... (this is only an alpha, please be patient)


## News
- *12/30/2016* - **My MEAN website** Alpha 4 public release [HERE](https://github.com/Ks89/My-MEAN-website-client/releases/tag/v.alpha-4)
- *11/28/2016* - **My MEAN website** Alpha 3 public release [HERE](https://github.com/Ks89/My-MEAN-website-client/releases/tag/v.alpha-3)
- *10/27/2016* - **My MEAN website** Alpha 2 public release [HERE](https://github.com/Ks89/My-MEAN-website-server/releases/tag/v.alpha-2.2)
- *08/15/2016* - **My MEAN website** Alpha 1 public release [HERE](https://github.com/Ks89/My-MEAN-website-server/releases/tag/v.alpha-1)

## How to install (MacOS)
- from the `setup` folder of this project, run `bash install-macos.sh`

## How to install (Linux)
- from the `setup` folder of this project, run `bash install-linux.sh`

## How to install (Windows)
- install Node.js, MongoDb, redis-server and so on
- from the `setup` folder of this project, run `bash install-windows.sh`
- TODO improve this tutorial :)

## How to setup
1. install all necessary tools
2. execute `npm install` into the root folder
3. start My-MEAN-website server with `gulp`
7. execute `npm start` into the root folder to start this application (client/front-end)

This will start this application at http://localhost:3300

## How to run tests (client-side)
Execute `npm test`

## How to start
- cd MyWebsite (if necessary rename server-side's main folder)
- `gulp`
- cd ..
- cd 'main folder of this project'
- `npm start` (or `npm run build` for production)
- Open your browser **http://localhost:3300** (if not automatically opened)

If you want to start the admin page, go to **http://localhost:3300/admin.html**
Attention: it's very unstable, because I decided to implement only some basic features. I'll improve it in the next alphas.

## Features
Work in progress... (this is only an alpha, please be patient)


## Future extensions
Work in progress... (this is only an alpha, please be patient)


## Images

![alt tag](http://www.stefanocappa.it/publicfiles/Github_repositories_images/MyMeanWebsite/home.png)
<br/><br/>
![alt tag](http://www.stefanocappa.it/publicfiles/Github_repositories_images/MyMeanWebsite/projects.png)
<br/><br/>
![alt tag](http://www.stefanocappa.it/publicfiles/Github_repositories_images/MyMeanWebsite/projectDetail.png)
<br/><br/>
![alt tag](http://www.stefanocappa.it/publicfiles/Github_repositories_images/MyMeanWebsite/projectDetail-image.png)
<br/><br/>
![alt tag](http://www.stefanocappa.it/publicfiles/Github_repositories_images/MyMeanWebsite/contact.png)
<br/><br/>
![alt tag](http://www.stefanocappa.it/publicfiles/Github_repositories_images/MyMeanWebsite/contact-images.png)
<br/><br/>
![alt tag](http://www.stefanocappa.it/publicfiles/Github_repositories_images/MyMeanWebsite/signin.png)
<br/><br/>
![alt tag](http://www.stefanocappa.it/publicfiles/Github_repositories_images/MyMeanWebsite/register.png)
<br/><br/>
Note: updated local profile info
![alt tag](http://www.stefanocappa.it/publicfiles/Github_repositories_images/MyMeanWebsite/profile-updated.png)
<br/><br/>
Note: multiple account connected (Local, Facebook, Github, Google and Linkedin)
![alt tag](http://www.stefanocappa.it/publicfiles/Github_repositories_images/MyMeanWebsite/profile-multiple.png)
<br/><br/>
Admin web page (list of users)
![alt tag](http://www.stefanocappa.it/publicfiles/Github_repositories_images/MyMeanWebsite/admin-users.png)


## Configuration
Work in progress... (this is only an alpha, please be patient)


## Thanks
A special thanks to the authors of these books, because very useful to understand how to develop a modern web application: [BOOK1](https://www.manning.com/books/getting-mean-with-mongo-express-angular-and-node) and [BOOK2](https://www.manning.com/books/angular-2-development-with-typescript). Also to [this project](https://github.com/AngularClass/angular2-webpack-starter)


## License

Copyright 2015-2017 Stefano Cappa

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

<br/>
**Created by Stefano Cappa**
