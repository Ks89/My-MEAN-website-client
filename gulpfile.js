var gulp        = require('gulp');
var jshint      = require('gulp-jshint');
var uglify      = require('gulp-uglify');
var concat      = require('gulp-concat');
var minifyCSS   = require('gulp-minify-css');
var prefix      = require('gulp-autoprefixer');
var gutil       = require('gulp-util');
var del         = require('del');
var bSync       = require('browser-sync');
var wiredep     = require('wiredep').stream;
var nodemon = require('gulp-nodemon');
// var mainBowerFiles = require('main-bower-files');

gulp.task('test', function() {
	return gulp.src(['app_api/**/*.js',

		'!app_client/lib/*.js',
		'app_client/about/**/*.js',
		'app_client/auth/**/*.js',
		'app_client/common/**/*.js',

		'app_client/contact/**/*.js',
		'app_client/cv/**/*.js',
		'app_client/home/**/*.js',
		'app_client/profile/**/*.js',
		'app_client/projectDetail/**/*.js',
		'app_client/projectList/**/*.js',
		'app_client/app.js',
		'app.js',
		'!public/angular/*.js',
		'public/javascripts/bs-docs-sidebar.js',
		'public/javascripts/validation.js',
		'!public/ngGallery/**/*'

		])
	.pipe(jshint())
	.pipe(jshint.reporter('default'))
	.pipe(jshint.reporter('fail'));
});


gulp.task('scripts',
	gulp.series('test', function scriptsInternal() {
          // var glob = mainBowerFiles('*.js');
          // glob.push('app/scripts/**/*.js');
          return gulp.src(/*glob*/ [
			//only app_client files
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
  'app_client/common/factories/authInterceptor.factory.js',
  'app_client/common/services/authentication.service.js',
  'app_client/common/services/contactData.service.js',
  'app_client/common/services/projectsData.service.js',
  'app_client/common/filters/addHtmlLineBreaks.filter.js',
  'app_client/common/directives/navigation/navigation.controller.js',
  'app_client/common/directives/navigation/navigation.controller.js',
  'app_client/common/directives/navigation/navigation.directive.js',
  'app_client/common/directives/pageHeader/pageHeader.directive.js'

          	// 'app_api/router/*.js',
          	// 'app_api/authentication/**/*.js',
          	// 'app_api/controller/**/*.js',
          	// 'app_api/models/**/*.js',
          	// 'app_api/utils/util.js',
           //  '!app_api/utils/logger.js', //TODO fix this, if i add this file i have problems

           //  'app_client/about/**/*.js',
           //  'app_client/auth/**/*.js',
           //  'app_client/common/**/*.js',

           //  'app_client/contact/**/*.js',
           //  'app_client/cv/**/*.js',
           //  'app_client/home/**/*.js',
           //  'app_client/profile/**/*.js',
           //  'app_client/projectDetail/**/*.js',
           //  'app_client/projectList/**/*.js',
           //  'app_client/app.js',
           //  'app.js',
           //  'public/javascripts/bs-docs-sidebar.js',
           //  'public/javascripts/validation.js'

                                    ])
          .pipe(concat('mysite.min.js'))
          .pipe(uglify().on('error', gutil.log))
          .pipe(gulp.dest('public/angular'));
      })
	);

gulp.task('styles', function() {
	return gulp.src('public/stylesheets/*')
	.pipe(minifyCSS())
	.pipe(prefix())
	.pipe(gulp.dest('dist/styles'));
});

gulp.task('clean', function(done) {
	return del(['dist', 'public/angular']);
});

gulp.task('server', function () {
	nodemon({
		script: './bin/www',
		ext: 'js html',
		env: { 'NODE_ENV': 'development' }
	})
})

// gulp.task('server', function(done) {
//      bSync({
//           server: {
//                baseDir: ['bin/www']
//           }
//      })
//      done();
// });

gulp.task('deps', function() {
	return gulp.src('public/html/**/*.html')
        //.pipe(wiredep())
        .pipe(gulp.dest('dist'));
    });

gulp.task('default',
	gulp.series('clean',
		gulp.parallel('styles', 'scripts', 'deps'),
		'server',
		function watcher(done) {
			gulp.watch(['app_api/**/*.js',
				'app_client/**/*.js',
				'public/**/*.js',
				'app.js',
				], gulp.parallel('scripts'));
			gulp.watch('public/stylesheets/*', gulp.parallel('styles'));
			gulp.watch('dist/**/*', bSync.reload); //TODO remove this, i'm not using bsync anymore
		}
		)
	);
