app.factory('AuthService', ["$http", "$q", "$filter", "$cookies", "$window", "DataService",
function ($http, $q, $filter, $cookies, $window, DataService) {

	function checkAuth(){
		var user = $cookies.get("HM_ID");
        if(user) return true;
        else return false;
	};

	function logout(){
        $cookies.remove("HM_ID");
		$cookies.remove("HM_USER_ID");
        $cookies.remove("HM_USER_NAME");
        $cookies.remove("HM_USER_EMAIL");
        $cookies.remove("HM_USER_ROLE");
        return DataService.sendRequest("GET", "/api/logout");
	};

	function getProfile(){
        return DataService.sendRequest("GET", "/api/auth/me");
	};

	return {
		checkAuth : checkAuth,
		logout : logout,
		getProfile : getProfile
	}

}]);