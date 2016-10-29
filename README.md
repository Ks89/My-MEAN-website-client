[![Code Climate](https://codeclimate.com/github/Ks89/My-MEAN-website/badges/gpa.svg)](https://codeclimate.com/github/Ks89/My-MEAN-website)   [![Build Status](https://travis-ci.org/Ks89/My-MEAN-website.svg?branch=master)](https://travis-ci.org/Ks89/My-MEAN-website)
<br>
# My M.E.A.N. website (Alpha 2)
<br>

## Informations
My MEAN website is a MEAN's web application that I'm creating as a personal website, but also for other uses.
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
- front-end unit: only some classes are tested. In alpha 3 and 4 I'll complete everything 
- front-end e2e: work in progress, In alpha 3 and 4 I'll complete everything
- back-end unit: almost done (only the necessary things)*. coverage >80%
- back-end integration: almost done*. coverage >80%

(*) I unit-tested only public functions and I tested all APIs (integration) except for OAUTH2/PassportJS.
This is because, it's extremely difficult to test passportjs (for 3dparty services, not for the local auth) without to use  browsers (like Zombie or Phantom). In my opinion an integration-test for a back-end api must use only backend's code, not also a browser (browser is on client and not on server :) ).
The problem is that to test PassportJS without a browser it's really diffult. I asked on StackOverflow [HERE](http://stackoverflow.com/questions/38169351/how-can-i-test-integration-testing-with-supertest-a-node-js-server-with-passpo), without receivend any answers.
For this reason, I decided to unit-tests these APIs (not APIs theirself but their functions/logics).
If you want to help me to write integration-test's case for PassportJS, check [this file](https://github.com/Ks89/My-MEAN-website/blob/master/test-server-integration/TODO-auth-3dparty.js)


## Requirements
- Node.js
- MongoDB
- redis
- npm
- Google Chrome and Firefox (mandatory for testing)
- some global npm dependencies: karma-cli, mocha, webpack, typescript, nodemon, gulp 4.0 alpha, npm-check, lite-server, remap-istanbul, webdriver-manager, protractor
- work in progress... (this is only an alpha, please be patient)


## News
- *10/27/2016* - **My MEAN website** Alpha 2 public release [HERE](https://github.com/Ks89/My-MEAN-website/releases)
- *08/15/2016* - **My MEAN website** Alpha 1 public release [HERE](https://github.com/Ks89/My-MEAN-website/releases)

## How to install (MacOS)
- download and install Node.js 7.0 or higher
- download the latest versions of Google Chrome and Mozilla Firefox
- Install homebrew:
  ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
  brew update
  brew upgrade
- Install MongoDB
  brew install wget
  brew install mongodb --with-openssl
  sudo mkdir -p /data/db
- Install redis
  wget http://download.redis.io/redis-stable.tar.gz
  tar xvzf redis-stable.tar.gz
  cd redis-stable
  make install
  cd ..
  rm -rf redis-stable
  rm -f redis-stable.tar.gz
- Install global npm packages
  sudo npm install -g karma-cli
  sudo npm install -g mocha
  sudo npm install -g webpack
  sudo npm install -g typescript
  sudo npm install -g nodemon
  sudo npm install -g gulp@github:gulpjs/gulp#4.0
  sudo npm install -g npm-check
  sudo npm install -g lite-server
  sudo npm install -g remap-istanbul
  sudo npm install -g webdriver-manager
  sudo npm install -g protractor
  sudo npm install -g istanbul

## How to setup

1. create a file called ".env" into the root folder and add all these properties

    JWT_SECRET=INSERT A JEW SECRET HERE

    TWITTER_CONSUMER_KEY=YOU KEY/ID
    TWITTER_CONSUMER_SECRET=YOU KEY/ID

    FACEBOOK_APP_ID=YOU KEY/ID
    FACEBOOK_APP_SECRET=YOU KEY/ID

    GOOGLE_CLIENT_ID=YOU KEY/ID
    GOOGLE_CLIENT_SECRET=YOU KEY/ID

    GITHUB_CLIENT_ID=YOU KEY/ID
    GITHUB_CLIENT_SECRET=YOU KEY/ID

    LINKEDIN_CLIENT_ID=YOU KEY/ID
    LINKEDIN_CLIENT_SECRET=YOU KEY/ID

    USER_EMAIL=YOUR_EMAIL
    PASS_EMAIL=YOUR_PASSWORD

    - replace 'YOU KEY/ID' with the keys obtained from facebook/github... oauth applications.
    - replace YOUR_EMAIL and YOUR_PASSWORD with the data of your e-mail account
    - reaplce INSERT A JWT SECRET HERE with an alphanumerical string (I'm using a random string with a length = 72)

2. install all necessary tools (Node.js, redis-server, mongo db, Google Chrome)
3. execute this command 'npm install' into the root folder
4. execute this command 'npm install' into the app_client folder
4. execute this command 'redis-server
5. execute this command 'mongod' (on Mac OSX use 'sudo mongod')
6. execute this command 'gulp' into the root folder to start this application (back-end)
7. execute this command 'npm start' into app_client folder to start this application (front-end)

This will start this application at http://localhost:3300

## How to run tests (server-side)
If you want to run server's tests execute these commands:

1. mocha test-server-integration
2. mocha test-client-unit/3dparty-passport-test.js
3. mocha test-client-unit/auth-experimental-collapse-db.js
4. mocha test-client-unit/auth-util-test.js
5. mocha test-client-unit/users-test.js
6. mocha test-client-unit/util-test.js

Or try `gulp test`, but it's still broken


## How to run tests (client-side)
cd app_client
npm test


## How to start

- cd <Main folder>
- gulp
- cd app_client
- npm start (or npm run build for production)
- Open your browser http://localhost:3300 (if not automatically opened)

## Features
Work in progress... (this is only an alpha, please be patient)


## Future extensions
Work in progress... (this is only an alpha, please be patient)


## Images
Work in progress... (all these images are old. alpha 2 uses a new front-end in Angular 2 and Bootstrap 4 )

![alt tag](http://www.stefanocappa.it/publicfiles/Github_repositories_images/MyMeanWebsite/home.png)
<br/><br/>
![alt tag](http://www.stefanocappa.it/publicfiles/Github_repositories_images/MyMeanWebsite/projects.png)
<br/><br/>
![alt tag](http://www.stefanocappa.it/publicfiles/Github_repositories_images/MyMeanWebsite/project-detail.png)
<br/><br/>
![alt tag](http://www.stefanocappa.it/publicfiles/Github_repositories_images/MyMeanWebsite/projectDetail-imagegallery.png)
<br/><br/>
![alt tag](http://www.stefanocappa.it/publicfiles/Github_repositories_images/MyMeanWebsite/contact.png)
<br/><br/>
![alt tag](http://www.stefanocappa.it/publicfiles/Github_repositories_images/MyMeanWebsite/contact-recaptcha.png)
<br/><br/>
![alt tag](http://www.stefanocappa.it/publicfiles/Github_repositories_images/MyMeanWebsite/signin.png)
<br/><br/>
![alt tag](http://www.stefanocappa.it/publicfiles/Github_repositories_images/MyMeanWebsite/register.png)
<br/><br/>
Note: updated local profile info
![alt tag](http://www.stefanocappa.it/publicfiles/Github_repositories_images/MyMeanWebsite/profile-updated.png)
<br/><br/>
Note: multiple account connected (Facebook and Github)
![alt tag](http://www.stefanocappa.it/publicfiles/Github_repositories_images/MyMeanWebsite/profile-fb-github.png)


## Configuration
Work in progress... (this is only an alpha, please be patient)


## Thanks
A special thanks to the authors of these books, because very useful to understand how to develop a modern web application: [BOOK1](https://www.manning.com/books/getting-mean-with-mongo-express-angular-and-node) and [BOOK2](https://www.manning.com/books/angular-2-development-with-typescript). Also to [this project](https://github.com/AngularClass/angular2-webpack-starter)


## License

Copyright 2015-2016 Stefano Cappa

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
