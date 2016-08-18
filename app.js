require('dotenv').config(); //to read info from .env file
//attention: i'm using "dotenv" 2.0 and for this reason I must call "config()".

var express = require('express');
var compression = require('compression');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');
//logger created with winston
var logger = require("./app_server/utils/logger");

var redis   = require("redis"); //it's really useful?
var RedisStore = require('connect-redis')(session);
var client  = redis.createClient(); //it's really useful?

//[http params pollution] security package to prevent http params pollution
var hpp = require('hpp');

//[large payload attacks] Make sure this application is not vulnerable to large payload attacks
var contentLength = require('express-content-length-validator');
var MAX_CONTENT_LENGTH_ACCEPTED = 9999;

//[CSRF]
var csrf = require('csurf');

var fs = require('fs');
var passport = require('passport');

//require for mongo
require('./app_server/models/db');
require('./app_server/controllers/authentication/passport')(passport);

var app = express();

//[hemlet] enable hemlet
//this automatically add 7 of 10 security features
/*
  -contentSecurityPolicy for setting Content Security Policy
  -dnsPrefetchControl controls browser DNS prefetching
  -frameguard to prevent clickjacking
  -hidePoweredBy to remove the X-Powered-By header
  -hsts for HTTP Strict Transport Security
  -ieNoOpen sets X-Download-Options for IE8+
  -noCache to disable client-side caching
  -noSniff to keep clients from sniffing the MIME type
  -xssFilter adds some small XSS protections
*/
//The other features NOT included by default are:
/*
  -hpkp for HTTP Public Key Pinning
  -contentSecurityPolicy for setting Content Security Policy
  -noCache to disable client-side caching => I don't want this for better performances
*/
var helmet = require('helmet');
app.use(helmet());

// [Public Key Pinning: hpkp] HTTPS certificates can be forged, allowing man-in-the middle attacks.
//                      HTTP Public Key Pinning aims to help that.
var ninetyDaysInMilliseconds = 7776000000;
app.use(helmet.hpkp({
  maxAge: ninetyDaysInMilliseconds,
  sha256s: ['AbCdEf123=', 'ZyXwVu456='],
  includeSubdomains: true,         // optional
  reportUri: 'http://example.com',  // optional
  reportOnly: false,               // optional

  // Set the header based on a condition.
  // This is optional.
  setIf: function (req, res) {
    return req.secure;
  }
}));

// [CSP - Content Security Policy] Trying to prevent: Injecting anything unintended into our page.
//                   That could cause XSS vulnerabilities, unintended tracking, malicious frames, and more.
app.use(helmet.contentSecurityPolicy({
  // Specify directives as normal.
  directives: {
    defaultSrc: ["'self'", 'localhost:3000', 'localhost:3001', 'www.google.com', 'www.youtube.com'],
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'maxcdn.bootstrapcdn.com',
                'ajax.googleapis.com', 'cdnjs.cloudflare.com',
                'code.jquery.com', 'www.google.com',
                'www.gstatic.com'],
    styleSrc: ["'self'", 'ajax.googleapis.com', 'maxcdn.bootstrapcdn.com', 'cdnjs.cloudflare.com', "'unsafe-inline'"],
    fontSrc: ['maxcdn.bootstrapcdn.com'],
    imgSrc: ["'self'", 'localhost:3000', 'localhost:3001',
              'placehold.it', 'placeholdit.imgix.net', 'camo.githubusercontent.com',
              's3.amazonaws.com', 'cdnjs.cloudflare.com'],
    sandbox: ['allow-forms', 'allow-scripts', 'allow-same-origin', 'allow-popups'],
    frameSrc : ["'self'", 'www.google.com', 'www.youtube.com'], //frame-src is deprecated
    childSrc : ["'self'", 'www.google.com', 'www.youtube.com'],
    connectSrc: [
        "'self'",
        "cdnjs.cloudflare.com",
        "ajax.googleapis.com",
        "ws://localhost:3000",
        "ws://localhost:3001"
    ],
    reportUri: '/report-violation',
    objectSrc: [] // An empty array allows nothing through
  },

  // Set to true if you only want browsers to report errors, not block them
  reportOnly: false,

  // Set to true if you want to blindly set all headers: Content-Security-Policy,
  // X-WebKit-CSP, and X-Content-Security-Policy.
  setAllHeaders: false,

  // Set to true if you want to disable CSP on Android where it can be buggy.
  disableAndroid: false,

  // Set to false if you want to completely disable any user-agent sniffing.
  // This may make the headers less compatible but it will be much faster.
  // This defaults to 'true'.
  browserSniff: true
}));

//[large payload attacks] this line enables the middleware for all routes
app.use(contentLength.validateMax({max: MAX_CONTENT_LENGTH_ACCEPTED, status: 400, message: "stop it!"})); // max size accepted for the content-length

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan({ "stream": logger.stream }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_client')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//[http params pollution] activate http parameters pollution
//use this ALWAYS AFTER app.use(bodyParser.urlencoded())
app.use(hpp());

// Express Session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new RedisStore({ host: 'localhost', port: 6379, client: client,ttl :  260}),
    // cookie: {
    //   httpOnly: false,
    //     secure: false, //to use true, you must use https. If you'll use true with http it won't work.
    //     //maxAge: 2160000000
    // }
}));

app.use(passport.initialize());
app.use(passport.session());

// compress all requests using gzip
app.use(compression());

// --------------------------------------- ROUTES ---------------------------------------
// dedicated routes for angular logging with stacktracejs
// these router aren't protected with csrf, because declared before app.use(csrf()).
var loggerApi = require('./app_server/routes/log-api')(express);
app.use('/api/log', loggerApi);

// enable middleware CSRF by csurf package
// before app.use('/api', routesApi); to protect their,
// but after session and/or cookie initialization
app.use(csrf());
app.use(function (req, res, next) {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  res.locals.csrftoken = req.csrfToken();
  next();
});

// APIs for all route protected with CSRF (all routes except for angular log's service)
var routesApi = require('./app_server/routes/index')(express);
app.use('/api', routesApi);
// --------------------------------------------------------------------------------------


app.use(function(req, res) {
  res.sendFile(path.join(__dirname, 'app_client', 'index.html'));
});

// catch bad csrf token
app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') {
    return next(err);
  }
  // handle CSRF token errors here
  res.status(403);
  res.send('session has expired or form tampered with');
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
