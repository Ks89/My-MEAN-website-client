'user strict';
(function() {

	angular
	.module('mySiteApp')
	.service('profileData', profileData);

	profileData.$inject = ['$http', '$q'];
	function profileData ($http, $q) {

		var update = function (profile) {
			var deferred = $q.defer();
			$http.post('/api/profile', profile)
			.success(function(data) {
				console.log('called update profile - success');
				console.log(data);
				deferred.resolve(data);
			})
			.error(function (err) {
				console.log('called update profile - error');
				deferred.reject(err);
			});
			return deferred.promise;
		};

		return {
			update : update
		};
	}
})();