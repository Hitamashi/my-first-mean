app.factory('AuthService', ["$http", "$q", "$filter", "$cookies", "$window",
function ($http, $q, $filter, $cookies, $window) {

	function checkAuth(){
		var user = $cookies.get("HM_ID");
        if(user) return true;
        else return false;
	};

	function logout(){
		$cookies.remove("HM_ID");
		$cookies.remove("HM_USER_ID");
		$cookies.remove("HM_USER_ID");
        $cookies.remove("HM_USER_NAME");
        $cookies.remove("HM_USER_EMAIL");
        $cookies.remove("HM_USER_ROLE");
	};

	function getProfile(){
		var url="/api/auth/me";
		return $http({
            url: url,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": $cookies.get("HM_ID")
            }
        })
        .then(function (response) {
            if (typeof response.data === 'object') {
                return response.data;
            } else {
                // invalid response
                return $q.reject(response.data);
            }

        }, function (response) {
            // something went wrong
            return $q.reject(response.data);
        });
	};

	return {
		checkAuth : checkAuth,
		logout : logout,
		getProfile : getProfile
	}

}]);