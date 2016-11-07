var gulp        = require('gulp');
var jshint      = require('gulp-jshint');
var mocha 			= require('gulp-mocha');
var istanbul 		= require('gulp-istanbul');
var gutil       = require('gulp-util');
var del         = require('del');
var browserSync = require('browser-sync').create();
var nodemon 		= require('gulp-nodemon');
var sourcemaps  = require('gulp-sourcemaps');
var through     = require('through2');
var arguments 	= require('yargs').argv;

var isprod = (arguments.env === 'prod');

var noop = function() {
	return through.obj();
};

var dev = function(task) {
	return isprod ? noop() : task;
};

var prod = function(task) {
	return isprod ? task : noop();
};

var testHintJs = ['app_server/**/*.js', 'app.js'];

//TODO FIXME - broken in alpha 2
gulp.task('hint', function hintInternal() {
	return gulp.src(testHintJs /*, {since: gulp.lastRun('hint')}*/)
	.pipe(jshint())
	.pipe(jshint.reporter('default'))
	.pipe(jshint.reporter('fail'));
});


var testPaths = [
								 'test-server-integration/**/*.spec.js',
								//  'test-server-unit/**/*.spec.js'
								];

gulp.task('pre-test', function pretestInternal() {
  return gulp.src(['app_server/**/*.js'])
		// optionally load existing source maps
    .pipe(sourcemaps.init())
    // Covering files
    .pipe(istanbul())
    // Force `require` to return covered files
    .pipe(istanbul.hookRequire());
});

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

gulp.task('test',
	gulp.series('pre-test', function testInternal() {
  return gulp.src(testPaths)
    .pipe(mocha().on("error", handleError))
    // Creating the reports after tests ran
    .pipe(istanbul.writeReports())
    // Enforce a coverage of at least 90% otherwise throw an error
    .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }));
}));

gulp.task('nodemon', function nodemonInternal(cb) {
	var started = false;
	return nodemon({
		script: 'bin/www',
		// watch core server file(s) that require server restart on change
    //watch: ['app.js']
		// ext: 'js html',
		env: { 'NODE_ENV': process.env.NODE_ENV }
	})
	.on('start', function nodemonStartInternal() {
		browserSync.reload;
		if(!started) {
			cb();
			started = true;
		}

	})
	.on('error', function nodemonErrInternal(err) {
     // Make sure failure causes gulp to exit
     throw err;
 })
});


gulp.task('server',
	gulp.series('nodemon', function bSyncInternal() {

	  // for more browser-sync config options: http://www.browsersync.io/docs/options/
	  browserSync.init({

	    // informs browser-sync to proxy our expressjs app which would run at the following location
	    proxy: 'http://localhost:3000',

	    // informs browser-sync to use the following port for the proxied app
	    // notice that the default port is 3000, which would clash with our expressjs
	    port: 3001,

	    // open the proxied app in chrome
	    browser: ["google chrome"]
	 })
	})
);

gulp.task('default',
	gulp.series('server', function watcher(done) {
		    gulp.watch(['app_server/**/*.js', 'app.js'], browserSync.reload);
		})
);
