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
- work in progress...


## News
- *08/14/2016* - **My MEAN website** Alpha 1 public release

## How to setup
- install all necessary tools (Node.js, redis-server, mongo db)
- run: npm install
- start redis-server and mongodb
- run: gulp

## Features
Work in progress...


## Future extensions
Work in progress...


## Images
Work in progress...


## Configuration
Work in progress...


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
