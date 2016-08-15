# My M.E.A.N. website
<br>

## Informations
My MEAN website is a MEAN's web application that I'm creating as a personal website, but also for other uses.
It's composed by:
- A: a front-end in AngularJS 1 (that will be replaced by a new one in Angular2 - check the branch **angular2-front-end**)
- N + E: a back-end in Node.js + Express js (and other useful libs like PassportJs)
- M: a MongoDb's database
- gulp + nodemon

A possible extension of this project is a configurable template to build a custom web app very quickly.

Attention! This project is still an alpha, so it's not production ready. Please be careful.
If you are interested, please star this project on GitHub.

Testing:
- front-end unit: useless, because I'm rewriting the entire front-end using Angular 2
- front-end e2e: useless, because I'm rewriting the entire front-end using Angular 2
- back-end unit: almost done (only the necessary things)*
- back-end integration: almost done*

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
- Google Chrome
- work in progress... (this is only an alpha, please be patient)


## News
- *08/15/2016* - **My MEAN website** Alpha 1 public release

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
    
    RECAPTCHA_PUBLIC=YOU KEY/ID
    RECAPTCHA_SECRET=YOU KEY/ID

    - replace 'YOU KEY/ID' with the keys obtained from facebook/github... oauth applications.
    - replace YOUR_EMAIL and YOUR_PASSWORD with the data of your e-mail account
    - reaplce INSERT A JEW SECRET HERE with an alphanumerical string (I'm using a random string with a length = 72)

2. install all necessary tools (Node.js, redis-server, mongo db, Google Chrome)
3. execute this command 'npm install'
4. execute this command 'redis-server 
5. execute this command 'mongod' (on Mac OSX use 'sudo mongod')
6. execute this command 'gulp' to build and start this application on http://localhost:3001

Attention: there are some problems with browserSync on Mac, so reload the page on Google Chrome to be able to show this application.

## Features
Work in progress... (this is only an alpha, please be patient)


## Future extensions
Work in progress... (this is only an alpha, please be patient)


## Images
Work in progress...

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
