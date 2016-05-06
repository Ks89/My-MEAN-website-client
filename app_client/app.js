(function () {
	angular.module('mySiteApp', ['ngRoute', 'ngSanitize', 'ui.bootstrap', 'jkuri.gallery']);

	function config ($routeProvider, $locationProvider, $httpProvider) {
		$routeProvider
			.when('/', {
				redirectTo: '/home'
			})
			.when('/home', {
				templateUrl: '/home/home.view.html',
				controller: 'homeCtrl',
				controllerAs: 'vm'
			})
			.when('/projects', {
        		templateUrl: '/projectList/projectList.view.html',
		        controller: 'projectListCtrl',
		        controllerAs: 'vm'
		    })
			.when('/projects/:projectid', {
				templateUrl: '/projectDetail/projectDetail.view.html',
				controller: 'projectDetailCtrl',
				controllerAs: 'vm'
			})
			.when('/cv', {
        		templateUrl: '/cv/cv.view.html',
		        controller: 'cvCtrl',
		        controllerAs: 'vm'
			})
			.when('/contact', {
        		templateUrl: '/contact/contact.view.html',
		        controller: 'contactCtrl',
		        controllerAs: 'vm'
			})
			.when('/about', {
        		templateUrl: '/common/views/genericText.view.html',
		        controller: 'aboutCtrl',
		        controllerAs: 'vm'
			})
			.when('/register', {
          		templateUrl: '/auth/register/register.view.html',
          		controller: 'registerCtrl',
          		controllerAs: 'vm'
			})
			.when('/login', {
          		templateUrl: '/auth/login/login.view.html',
          		controller: 'loginCtrl',
          		controllerAs: 'vm'
			})
			.when('/reset/:emailToken', {
				templateUrl: '/auth/resetPassword/resetPassword.view.html',
				controller: 'resetPasswordCtrl',
				controllerAs: 'vm'
			})
			.when('/forgot', {
				templateUrl: '/auth/forgotPassword/forgotPassword.view.html',
				controller: 'forgotPasswordCtrl',
				controllerAs: 'vm'
			})
			//attention: '?' means "optional parameter". 
			//You can call /profile and also /profile/uhfffg
			//using the same route
			.when('/profile/:token?', { 
          		templateUrl: '/profile/profile.view.html',
          		controller: 'profileCtrl',
          		controllerAs: 'vm'
			})
      		.otherwise({redirectTo: '/'});
		
		$locationProvider.html5Mode({
			enabled: true,
			requireBase: true,
			rewriteLinks: false
		});

		$httpProvider.interceptors.push('authInterceptor'); //inject my authInterceptor.factory.js
	}

	angular
		.module('mySiteApp')
		.config(['$routeProvider', '$locationProvider', '$httpProvider', config]);

})();


// .when('/profile/:token?', { 
//           		templateUrl: '/profile/profile.view.html',
//           		controller: 'profileCtrl',
//           		controllerAs: 'vm',
//           		resolve: {
// 				    resolvedAuth: function( $q, authentication ) {
// 				        var deferred = $q.defer();
// 				        deferred.resolve({
// 				        	isLogged: function( ) {
// 				            	return authentication.isLoggedIn();
// 				            }
// 				        });
// 				        return deferred.promise;
// 				    }
//           		}
//           		// ,
//           		// resolveAs: 'resolve'
// 			})