(function () {
	angular.module('mySiteApp', ['ngRoute', 'ngSanitize', 'ui.bootstrap', 'jkuri.gallery','angular-ladda']);

	function config ($routeProvider, $locationProvider, $httpProvider, $provide) {
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
		.when('/activate/:emailToken/:userName', {
			templateUrl: '/auth/activateAccount/activateAccount.view.html',
			controller: 'activateAccountCtrl',
			controllerAs: 'vm'
		})
		//attention: '?' means "optional parameter". 
		//You can call /profile and also /profile/uhfffg
		//using the same route
		.when('/profile/:token?', { 
			templateUrl: '/profile/profile.view.html',
			controller: 'profileCtrl',
			controllerAs: 'vm', 
			resolve: {
				returnedData: ['$location', 'authentication', '$q', function ($location, authentication, $q) {
					var defer = $q.defer();
					//I call post3dAuthAfterCallback because, for 3dauth, I must save the auth token, before that I can
					//call isLoggedIn. 
					//Obviously with local auth I can manage all the process by myself, but for 3dauth after the callback
					//I haven't anything and I must call a method to finish this process.
					//I embedded this login into post3dAuthAfterCallback. 
					authentication.post3dAuthAfterCallback()
					.then(function(result) {
						authentication.isLoggedIn()
						.then(function(result) {
							console.log('Profile resolve post3dAuthAfterCallback, is3dauth? ------------------------ SUCCESS: ' + result);
							if(!result) {
								console.log("REDIRECTING.....");
								defer.reject(result); 
					      	//$location.url('/login');
					      } else {
					      	console.log("OPEN PROFILE....");
					      	defer.resolve(result); 
					      }
					  },function(reason) {
					  	console.log('Profile resolve ------------------------ ERROR: ' + reason);
				      //$location.path('/login');
				      defer.reject(reason); 
				  });
					},function(reason) {
						console.log('Profile resolve post3dAuthAfterCallback ------------------------ ERROR: ' + reason);
			      //$location.path('/login');
			      defer.reject(reason); 
			  });
					return defer.promise;
				}]
			}
			
		})
		.otherwise({redirectTo: '/'});

		$locationProvider.html5Mode({
			enabled: true,
			requireBase: true,
			rewriteLinks: false
		});

		$provide.decorator("$exceptionHandler", ['$delegate', 'logServer', function($delegate, logServer) {
			return function(exception, cause) {
				$delegate(exception, cause);
				console.log("Provider decorator OK - calling logServer");
				logServer.exception(exception, cause);
			};
		}]);
	}

	angular
	.module('mySiteApp')
	.config(['$routeProvider', '$locationProvider', '$httpProvider', '$provide', config])
	.run(['$rootScope','$location', '$window', function($root, $location, $window) {
		$root.$on('$routeChangeStart', function(e, curr, prev) {
			if (curr.$$route && curr.$$route.resolve) {
	      // Show a loading message until promises aren't resolved
	      console.log("run root on true -> STARTING");
	      console.log("run start->e: ");
	      console.log(e);
	      $root.loadingView = true;
	  }
	});
		$root.$on('$routeChangeSuccess', function(e, curr, prev) {
	    // Hide loading message
	    console.log("run success->e: ");
	    console.log(e);
	    console.log("run root on false -> SUCCESS");
	    $root.loadingView = false;
	    $window.loading_screen.finish();
	});
		$root.$on('$routeChangeError', function(e, curr, prev, rejection) {
	    // Hide loading message
	    console.log("run error->e: ");
	    console.log(e);
	    console.log("run routeChangeError -> ERROR " + rejection);
	    $location.url('/login');
	    $root.loadingView = true;
	    $window.loading_screen.finish();
	});
	}]);
})();