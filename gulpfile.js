var gulp        = require('gulp');
var jshint      = require('gulp-jshint');
var uglify      = require('gulp-uglify');
const mocha 	= require('gulp-mocha');
var concat      = require('gulp-concat');
// var less        = require('gulp-less');
var minifyCSS   = require('gulp-minify-css');
var prefix      = require('gulp-autoprefixer');

var gutil       = require('gulp-util');

var del         = require('del');
var browserSync = require('browser-sync').create();
var wiredep     = require('wiredep').stream;
var mainBowerFiles = require('main-bower-files');

var nodemon 	= require('gulp-nodemon');

var cached 		= require('gulp-cached');
var remember 	= require('gulp-remember');
var sourcemaps  = require('gulp-sourcemaps');
var combiner    = require('stream-combiner2');
var through     = require('through2');

var eslint 		= require('gulp-eslint');
var babel 		= require('gulp-babel');

var rev 		= require('gulp-rev');
var revReplace 	= require('gulp-rev-replace');

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

// var mainBowerFiles = require('main-bower-files');

var test = ['unit-test-server/**/*.js'];

var testHintJs = ['app_server/**/*.js',
		'app_client/**/*.js',
		'app.js',
		'public/javascripts/*.js',
		'!public/javascripts/stacktrace.min.js',
		'!public/javascripts/please-wait.min.js',
		'!public/angular/*.js',
		'!public/angular-ladda/*.js',
		'!public/ngGallery/**/*'
		];

var app_clientJs = ['app_client/**/*.js'];

gulp.task('hint', function() {
	return gulp.src(testHintJs /*, {since: gulp.lastRun('hint')}*/)
	.pipe(jshint())
	.pipe(jshint.reporter('default'))
	.pipe(jshint.reporter('fail'));
});

gulp.task('test', function() {
	return gulp.src(test, { read: false })
    .pipe(mocha({
      reporter: 'spec'
    }))
    .on('error', gutil.log);
});


// gulp.task('watch-mocha', function() {
//     gulp.watch(['lib/**', 'test/**'], ['test']);
// });


// gulp.task('revreplace', function() {
//   var manifest = gulp.src("./public/angular/rev-manifest.json");

//   return gulp.src("./app_client/index-1.html")
//     .pipe(revReplace({manifest: manifest}))
//     .pipe(gulp.dest("./app_client/index.html"));
// });


gulp.task('scripts',
	gulp.series('hint', function scriptsInternal() {
          // var glob = mainBowerFiles('*.js');
          // glob.push('app/scripts/**/*.js');
          return gulp.src(/*glob*/ 
			//only app_client files, because the generated file will be imported into app_client/index.html
			app_clientJs , {	sourcemaps: true /*,
				since: gulp.lastRun('hint')*/} )
          .pipe(sourcemaps.init())
          .pipe(dev(sourcemaps.init()))
          .pipe(cached('ugly'))
          .pipe(uglify().on('error', gutil.log))
          .pipe(remember('ugly'))
          .pipe(concat('mysite.min.js'))
          //.pipe(rev())
          //.pipe(dev(sourcemaps.write('.', {sourceRoot: 'js-source'})))
          .pipe(gulp.dest('public/angular')); //write mysite.min.js to build dir
          //.pipe(rev.manifest())
          //.pipe(gulp.dest('public/angular')); // write manifest to build dir
      })
	);

gulp.task('styles', function() {
	return gulp.src('public/stylesheets/*' , { since: gulp.lastRun('styles') })
	.pipe(minifyCSS())
	.pipe(prefix())
	//.pipe(rev())
	.pipe(gulp.dest('dist/styles'));
    //.pipe(rev.manifest())
    //.pipe(gulp.dest('dist/styles')); // write manifest to build dir
});

function clean() {
  // You can use multiple globbing patterns as you would with `gulp.src`,
  // for example if you are using del 2.0 or above, return its promise
  return del(['dist', 'public/angular']);
}

exports.clean = clean;


gulp.task('nodemon', function (cb) {

	var started = false;

	return nodemon({
		script: 'bin/www',
		// watch core server file(s) that require server restart on change
    	//watch: ['app.js']
		// ext: 'js html',
		env: { 'NODE_ENV': 'development' }
	})
	.on('start', function () {
		browserSync.reload;
		if(!started) {
			cb();
			started = true;
		}
		
	})
	.on('error', function(err) {
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

		//files: app_clientJs,

	    // informs browser-sync to use the following port for the proxied app
	    // notice that the default port is 3000, which would clash with our expressjs
	    port: 3001,

	    // open the proxied app in chrome
	    browser: ["google chrome"]
	 })
	})
);

// gulp.task('server', function(done) {
// 	if(!isprod) {	
//      bSync({
//           server: {
//                baseDir: ['bin/www']
//           }
//      })
// 	}
//  done();
// });

// gulp.task('deps', function() {
// 	return gulp.src('public/html/**/*.html')
//         //.pipe(wiredep())
//         .pipe(gulp.dest('dist'));
//     });

gulp.task('default',
	gulp.series(clean,
		gulp.parallel('styles', 'scripts'),
		//'revreplace',
		'server',

		function watcher(done) {
		    gulp.watch(['app_server/**/*.js', 'app_client/**/*.js', 'public/**/*.js', 'app.js'], 
		    	gulp.parallel('scripts'));
		    gulp.watch('public/stylesheets/**/*.css', gulp.parallel('styles'));
		    gulp.watch('public/**/*.js', browserSync.reload);
		  })

		//function watcher() {
			//gulp.watch('**/*.*', browserSync.reload
			// if(!isprod) {
			// 	var watcher = gulp.watch(['app_server/**/*.js',
			// 	'app_client/**/*.js',
			// 	'public/**/*.js',
			// 	'app.js',
			// 	], gulp.parallel('scripts'));
			// 	gulp.watch('public/stylesheets/*', gulp.parallel('styles'));
			// 	gulp.watch('**/*.*', browserSync.reload); //TODO remove this, i'm not using bsync anymore
			// }
			//)
		//}
	//)
);
