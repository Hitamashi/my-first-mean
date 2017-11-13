var app = angular.module('appSentinel', ['ui.bootstrap', 'ngAnimate', 'ngSanitize', 'ui.select','angularUtils.directives.dirPagination', 'ngCookies', 'ngRoute','doowb.angular-pusher']);

app.config(function ($routeProvider) {
    $routeProvider
    .when('/Timesheet',{
        templateUrl: '/Views/tempTS.htm',
        controller: 'TSCtrl'   
    })
    .when('/Claim',{
        templateUrl: '/Views/Claims.html',
        controller: 'ClaimCtrl'
    })
    .when('/Leave', {
        templateUrl: '/Views/Leaves.html',
        controller: 'LeaveCtrl'
    })
    .when('/Person', {
        templateUrl: '/Views/Person.html',
        controller: 'PersonCtrl'
    })
    .when('/Holiday', {
        templateUrl: '/Views/Holiday.htm',
        controller: 'HolidayCtrl'
    })
    .when('/Demo', {
        templateUrl: '/Views/Demo.htm',
        controller: 'DemoCtrl'
    })
    .otherwise({redirectTo: '/Demo'})
    ;
});

app.config(['PusherServiceProvider',
  function(PusherServiceProvider) {
    PusherServiceProvider
    .setToken('ec3c2fa791f9b21e7070')
    .setOptions({
        cluster: 'ap1',
        encrypted: true
    });
  }
]);
