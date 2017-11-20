app

.factory("Access", ["$q", "UserProfile", function ($q, UserProfile) {

  var Access = {

    OK: 200,

    // "we don't know who you are, so we can't say if you're authorized to access
    // this resource or not yet, please sign in first"
    UNAUTHORIZED: 401,

    // "we know who you are, and your profile does not allow you to access this resource"
    FORBIDDEN: 403,

    hasRole: function (role) {
      return UserProfile.then(function (userProfile) {
        if (userProfile.$hasRole(role)) {
          return Access.OK;
        } else if (userProfile.$isAnonymous()) {
          return $q.reject(Access.UNAUTHORIZED);
        } else {
          return $q.reject(Access.FORBIDDEN);
        }
      });
    },

    hasAnyRole: function (roles) {
      return UserProfile.then(function (userProfile) {
        if (userProfile.$hasAnyRole(roles)) {
          return Access.OK;
        } else if (userProfile.$isAnonymous()) {
          return $q.reject(Access.UNAUTHORIZED);
        } else {
          return $q.reject(Access.FORBIDDEN);
        }
      });
    },

    isAnonymous: function () {
      return UserProfile.then(function (userProfile) {
        if (userProfile.$isAnonymous()) {
          return Access.OK;
        } else {
          return $q.reject(Access.FORBIDDEN);
        }
      });
    },

    isAuthenticated: function () {
      return UserProfile.then(function (userProfile) {
        if (userProfile.$isAuthenticated()) {
          return Access.OK;
        } else {
          return $q.reject(Access.UNAUTHORIZED);
        }
      });
    }

  };

  return Access;

}])

.factory("UserProfile", ["AuthService", '$cookies', '$http', function (Auth,$cookies, $http) {

  var userProfile = {};

  var clearUserProfile = function () {
    for (var prop in userProfile) {
      if (userProfile.hasOwnProperty(prop)) {
        delete userProfile[prop];
      }
    }
  };

  var fetchUserProfile = function () {
    return $http({
        url: "/api/auth/me",
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": $cookies.get("HM_ID")
        }
    }).then(function (response) {
        clearUserProfile();
        //console.log(response);
        return angular.extend(userProfile, response.data, {

        $refresh: fetchUserProfile,

        $hasRole: function (role) {
          return userProfile.roles.indexOf(role) >= 0;
        },

        $hasAnyRole: function (roles) {
          return !!userProfile.roles.filter(function (role) {
            return roles.indexOf(role) >= 0;
          }).length;
        },

        $isAnonymous: function () {
          return !userProfile || !userProfile.name;
        },

        $isAuthenticated: function () {
          return userProfile.name;
        },
        
        $getProfile: function(){
            return userProfile;
        }
        
      });
    });
  };

  return fetchUserProfile();

}])

.run(["$rootScope", "Access", "$location", "$log", function ($rootScope, Access, $location, $log) {

  $rootScope.$on("$routeChangeError", function (event, current, previous, rejection) {
    switch (rejection) {

    case Access.UNAUTHORIZED:
      $location.path("/login.html");
      break;

    case Access.FORBIDDEN:
      $location.path("/404");
      break;

    default:
      $log.warn("$stateChangeError event catched");
      break;

    }
  });

}])