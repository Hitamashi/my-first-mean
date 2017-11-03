app.factory('AuthService', ["$http", "$q", "$filter", "$cookies", "$window",
function ($http, $q, $filter, $cookies, $window) {

	function checkAuth(){
		var user = $cookies.get("User");
        if(user) return true;
        else return false;
	};

	return {
		checkAuth : checkAuth
	}

}]);