var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var minifyCSS = require('gulp-minify-css');
var prefix = require('gulp-autoprefixer');
var del = require('del');

gulp.task('clean', function(done){
	del(['dist'], done);
});

gulp.task('styles', function() {
	return gulp.src('public/stylesheets')
	.pipe(minifyCSS())
	.pipe(prefix())
	.pipe(gulp.dest('dist'));
});

gulp.task('test', function() {
	return gulp.src([
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
		'app_client/common/directives/pageHeader/pageHeader.directive.js',
		'!app_client/lib/*.js',
		'!app_client/lib/*.js.map'
		])
	.pipe(jshint())
	.pipe(jshint.reporter('default'))
	.pipe(jshint.reporter('fail'));
});

gulp.task('scripts', 
	gulp.series('test', function scriptsInternal() {
	return gulp.src([
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
		])
	.pipe(concat('mysite.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('dist'));
	})
);

gulp.task('default', gulp.series('clean', gulp.parallel('styles', 'scripts')));