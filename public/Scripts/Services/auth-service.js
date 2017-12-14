app.factory('AuthService', ["$http", "$q", "$filter", "$cookies", "$window", "DataService",
function ($http, $q, $filter, $cookies, $window, DataService) {

	function checkAuth(){
		var user = $cookies.get("HM_ID");
        if(user) return true;
        else return false;
	};

	function clearCookie(){
		$cookies.remove("HM_ID");
		$cookies.remove("HM_USER_ID");
        $cookies.remove("HM_USER_NAME");
        $cookies.remove("HM_USER_EMAIL");
        $cookies.remove("HM_USER_ROLE");
	};

	function logout(){
        clearCookie();
        return DataService.sendRequest("GET", "/api/auth/logout");
	};

	function getProfile(){
        return DataService.sendRequest("GET", "/api/auth/me");
	};

	return {
		checkAuth : checkAuth,
		logout : logout,
		getProfile : getProfile,
		clearCookie: clearCookie
	}

}]);