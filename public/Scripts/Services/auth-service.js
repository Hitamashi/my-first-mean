app.factory('AuthService', ["$http", "$q", "$filter", "$cookies", "$window",
function ($http, $q, $filter, $cookies, $window) {

	function checkAuth(){
		var user = $cookies.get("User");
        if(user) return true;
        else $window.location.href = '/login.html';
	};

	return {
		checkAuth : checkAuth
	}

}]);