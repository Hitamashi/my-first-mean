var app = angular.module('appSentinel', ['ui.bootstrap', 'ngAnimate', 'ngSanitize', 'ui.select', 'ngCookies', 'ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
    .when('/',{
        templateUrl: '/Views/Claims.html',
        controller: 'ClaimCtrl'
    })
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
    ;
});
