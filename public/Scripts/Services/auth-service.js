app.factory('AuthService', ["$http", "$q", "$filter", "$cookies", "$window",
function ($http, $q, $filter, $cookies, $window) {

	function checkAuth(){
		var user = $cookies.get("HM_USER_ID");
        if(user) return true;
        else return false;
	};

	function logout(){
		$cookies.remove("HM_USER_ID");
		var user = $cookies.get("HM_USER_ID");
	};

	return {
		checkAuth : checkAuth,
		logout : logout
	}

}]);