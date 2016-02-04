require('dotenv').config(); //to read info from .env file
//attention: i'm using "dotenv" 2.0 and for this reason I must call "config()".

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

//uglify
var uglifyJs = require("uglify-js");
var fs = require('fs');
var passport = require('passport');

//require for mongo
require('./app_api/models/db');
require('./app_api/authentication/passport')(passport);

var app = express();

//use uglify
var appClientFiles = [
  'app_client/app.js',
  'app_client/home/home.controller.js',
  'app_client/projectList/projectList.controller.js',
  'app_client/projectDetail/projectDetail.controller.js',
  'app_client/cv/cv.controller.js',
  'app_client/contact/contact.controller.js',
  'app_client/about/about.controller.js',
  'app_client/profile/profile.controller.js',
  'app_client/auth/login/login.controller.js',
  'app_client/auth/register/register.controller.js',
  'app_client/common/factories/underscore.factory.js',
  'app_client/common/services/authentication.service.js',
  'app_client/common/services/profile.service.js',
  'app_client/common/services/contactData.service.js',
  'app_client/common/services/projectsData.service.js',
  'app_client/common/filters/addHtmlLineBreaks.filter.js',
  'app_client/common/directives/navigation/navigation.controller.js',
  'app_client/common/directives/navigation/navigation.controller.js',
  'app_client/common/directives/navigation/navigation.directive.js',
  'app_client/common/directives/pageHeader/pageHeader.directive.js'
];
var uglified = uglifyJs.minify(appClientFiles, { compress : false });

fs.writeFile('public/angular/mysite.min.js', uglified.code, function (err){
  if(err) {
    console.log(err);
  } else {
    console.log("Script generated and saved:", 'mysite.min.js');
  }
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_client')));
app.use(cookieParser('keyboard cat'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Express Session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
    // cookie: {
    //   httpOnly: false,
    //     secure: false, //to use true, you must use https. If you'll use true with http it won't work.
    //     //maxAge: 2160000000
    // }
}));

//app.use(express.csrf());

app.use(passport.initialize());
app.use(passport.session());

var routesApi = require('./app_api/routes/index');
app.use('/api', routesApi);

app.use(function(req, res) {
  res.sendFile(path.join(__dirname, 'app_client', 'index.html'));
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// Catch unauthorised errors
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;