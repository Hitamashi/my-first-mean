app.config(function ($routeProvider) {
    $routeProvider
    .when('/Timesheet',{
        templateUrl: '/Views/Timesheet.htm',
        controller: 'TSCtrl',
        resolve: {
            access: ["Access", function (Access) { return Access.isAuthenticated(); }],
        }
    })
    .when('/Person', {
        templateUrl: '/Views/Person.html',
        controller: 'PersonCtrl',
        resolve: {
            access: ["Access", function (Access) { return Access.isAuthenticated(); }],
        }
    })
    .when('/Holiday', {
        templateUrl: '/Views/Holiday.htm',
        controller: 'HolidayCtrl',
        resolve: {
            access: ["Access", function (Access) { return Access.hasRole("admin"); }],
        }
    })
    .when('/404', {
        templateUrl: '/Views/404.htm',
    })
    .when('/Demo', {
        templateUrl: '/Views/Demo.htm',
        controller: 'DemoCtrl',
        resolve: {
            access: ["Access", function (Access) { return Access.isAuthenticated(); }],
            userProfile: 'UserProfile'
        }
    })
    .otherwise({redirectTo: '/Demo'})
    ;
})