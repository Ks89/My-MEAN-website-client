[![Travis Build](https://travis-ci.org/Ks89/My-MEAN-website-client.svg?branch=master)](https://travis-ci.org/Ks89/My-MEAN-website-client)   [![AppVeyor Build](https://ci.appveyor.com/api/projects/status/x7r2v139hi84cvsj/branch/master?svg=true)](https://ci.appveyor.com/project/Ks89/my-mean-website-server/branch/master)   [![Code Climate](https://codeclimate.com/github/Ks89/My-MEAN-website-client/badges/gpa.svg)](https://codeclimate.com/github/Ks89/My-MEAN-website-client)   [![CodeClimate Coverage](https://codeclimate.com/github/Ks89/My-MEAN-website-client/badges/coverage.svg)](https://codeclimate.com/github/Ks89/My-MEAN-website-client/coverage)   [![Coveralls Coverage](https://coveralls.io/repos/github/Ks89/My-MEAN-website-client/badge.svg?branch=master)](https://coveralls.io/github/Ks89/My-MEAN-website-client?branch=master)   [![Known Vulnerabilities](https://snyk.io/test/github/ks89/my-mean-website-client/badge.svg)](https://snyk.io/test/github/ks89/my-mean-website-client)

<br>

# My M.E.A.N. website client/front-end (Alpha)

<br>

**This is the client side.** Server side is available [HERE](https://github.com/Ks89/My-MEAN-website-server)

<br>

## Informations
My MEAN website is a MEAN's web application that I'm creating as a personal website, but also for other users.
It's composed by:
- M: a MongoDb's database
- E: a back-end with Express js
- A: a front-end in Angular 2
- N: a back-end in Node.js
- redis
- webpack and gulp
- and other stuff

A possible extension of this project will be a configurable template to build a custom web app very quickly. This is my final goal, please be patient :)

Attention! This project is still an alpha, so it's not production ready. Please be careful.
If you are interested, star this project on GitHub, share it and create pull requests.

Testing:
- front-end unit: coverage >80%
- front-end e2e: work in progress, In future alphas I'll complete everything

## Requirements
- macOS, Linux or Windows 10 **with admin privileges**
- Node.js + npm
- some global npm dependencies
- [My-MEAN-website server](https://github.com/Ks89/My-MEAN-website-server) Alpha4 or greater
- Google Chrome and Mozilla Firefox (mandatory if you want to run `npm test`) (also Internet Explorer if you are using Windows)
- work in progress... (this is only an alpha, please be patient)

## News
- *04/09/2017* - **My MEAN website** Alpha 6 public release [HERE](https://github.com/Ks89/My-MEAN-website-client/releases/tag/v.alpha-6)
- *01/21/2017* - **My MEAN website** Alpha 5 public release [HERE](https://github.com/Ks89/My-MEAN-website-client/releases/tag/v.alpha-5)
- *12/30/2016* - **My MEAN website** Alpha 4 public release [HERE](https://github.com/Ks89/My-MEAN-website-client/releases/tag/v.alpha-4)
- *11/28/2016* - **My MEAN website** Alpha 3 public release [HERE](https://github.com/Ks89/My-MEAN-website-client/releases/tag/v.alpha-3)
- *10/27/2016* - **My MEAN website** Alpha 2 public release [HERE](https://github.com/Ks89/My-MEAN-website-server/releases/tag/v.alpha-2.2)
- *08/15/2016* - **My MEAN website** Alpha 1 public release [HERE](https://github.com/Ks89/My-MEAN-website-server/releases/tag/v.alpha-1)


## How to install (MacOS)
- install both [Mozilla Firefox](https://www.mozilla.org/en-US/firefox/new/) and [Google Chrome](https://www.google.com/chrome/browser/desktop/index.html)
- from the `setup` folder of this project, run `bash install-macos.sh`
- import the db dump (.json) from `docs`'s folder using MongoChef or another software

## How to install (Linux)
- install both [Mozilla Firefox](https://www.mozilla.org/en-US/firefox/new/) and [Google Chrome](https://www.google.com/chrome/browser/desktop/index.html)
- from the `setup` folder of this project, run `bash install-linux.sh`
- import the db dump (.json) from `docs`'s folder using MongoChef or another software

## How to install (Windows 10)
*Tested only on Windows 10*

- install both [Mozilla Firefox](https://www.mozilla.org/en-US/firefox/new/) and [Google Chrome](https://www.google.com/chrome/browser/desktop/index.html)
- install Node.js from the [official website](https://www.nodejs.org)
- install MongoDb Community from the [official website](https://www.mongodb.com)
- import the db dump (.json) from `docs`'s folder using MongoChef or another software [HERE](http://3t.io/mongochef/download/)
- install redis-server for Windows (file .msi) [HERE](https://github.com/MSOpenTech/redis/releases)
- install Python 2.7.x from the [official website](https://www.python.org)
- from the `setup` folder of this project, run with PowerShell as administator `bash install-windows.sh`

If you'll have problems with `node-zopfli`, you have to install it properly following [this tutorial](https://github.com/nodejs/node-gyp#installation). There are two options, try with the first one `npm install --global --production windows-build-tools`, if it will fail, use option 2.
Both options will require to download really big files from microsoft.com (manually or automatically). So, be careful.

## How to setup
1. if necessary rename (case-sensitive) the main folder of this project into `My-MEAN-website-client` to match `FRONT_END_PATH` in `.env` file of [server-side](https://github.com/Ks89/My-MEAN-website-server)
2. put the main folder of this project near `My-MEAN-website-server` (in the future I'll give you a way to configure this)
3. execute `npm install` into the root folder (if it will fail, run it again)
4. follow [the tutorial](https://github.com/Ks89/My-MEAN-website-server) to prepare [My-MEAN-website server](https://github.com/Ks89/My-MEAN-website-server)  (remember to start both MongoDb and redis-server)
5. start [My-MEAN-website server](https://github.com/Ks89/My-MEAN-website-server)  with `npm start`
6. execute `npm start` into the root folder to start this application (client/front-end)

This will start this application at http://localhost:3300

PS: If you didn't start server-side before, you won't be able to see the entire home page (because created using data taken from DB)

## How to run unit tests (with karma)
- `npm test`

## How to run e2e tests (with protractor)
- `npm run e2e`

## How to start (development mode with HMR and BrowserSync)
1. cd `My-MEAN-website-server`
2. `npm start`
3. cd ..
4. cd `My-MEAN-website-client` (if necessary rename it (case-sensitive) to match `FRONT_END_PATH` in `.env` file of [server-side](https://github.com/Ks89/My-MEAN-website-server))
5. `npm start` (or `npm run build` for production)
6. Surf to **http://localhost:3300**

If you want to start the admin page, go to **http://localhost:3300/admin.html**
Attention: it's very unstable, because I decided to implement only some basic features. I'll improve it in the next alphas.

## How to start (development mode bundle)
1. cd `My-MEAN-website-server`
2. `npm start`
3. cd ..
4. cd `My-MEAN-website-client` (if necessary rename it (case-sensitive) to match `FRONT_END_PATH` in `.env` file of [server-side](https://github.com/Ks89/My-MEAN-website-server))
5. `npm run buildDev`
6. Surf to **http://localhost:3000**

If you want to start the admin page, go to **http://localhost:3000/admin.html**
Attention: it's very unstable, because I decided to implement only some basic features. I'll improve it in the next alphas.

## How to start (production mode bundle)
1. cd `My-MEAN-website-server`
2. `npm start`
3. cd ..
4. cd `My-MEAN-website-client` (if necessary rename it (case-sensitive) to match `FRONT_END_PATH` in `.env` file of [server-side](https://github.com/Ks89/My-MEAN-website-server))
5. `npm run build`
6. Surf to **http://localhost:3000** (if [My-MEAN-website server](https://github.com/Ks89/My-MEAN-website-server) is in dev mode, otherwise the correct port will be `3000`)

If you want to start the admin page, go to **http://localhost:3000/admin.html**
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
A special thanks to the authors of these books, because very useful to understand how to develop a modern web application: [BOOK1](https://www.manning.com/books/getting-mean-with-mongo-express-angular-and-node) and [BOOK2](https://www.manning.com/books/angular-2-development-with-typescript). Also to [this project](https://github.com/AngularClass/angular2-webpack-starter) and [this one](https://github.com/qdouble/angular-webpack2-starter/)


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
