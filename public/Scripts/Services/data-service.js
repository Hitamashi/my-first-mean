/*jslint es6, white, browser */
var app = angular.module('appSentinel');
app.factory('DataService', ["$http", "$q", "$filter", "$rootScope", function ($http, $q, $filter, $rootScope) {

    function sendRequest(method, url, options={}){
        options.url = url;
        options.method = method;

        if(!options.headers)
            options.headers={};

        options.headers["Content-Type"] = "application/json";

        return $http(options)
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
    }

    function getmyIP() {
        return sendRequest("GET", 'https://api.ipify.org/?format=json');
    }

    function getListFile() {
        return sendRequest("GET", '/api/file');
    }

    function createTimesheet(params) {
        var url = '/api/data/createTimesheet/';
        return sendRequest("POST", url, {data: params});
    };

    function editPersonBalance(params) {
        var url = '/api/data/editPersonBalance/';
        return sendRequest("POST", url, {data: params});
    }

    function getListPerson() {
        return sendRequest("GET", '/api/data/getListPerson/');
    }


    function createHoliday(params) {
        var url = '/api/data/createHoliday/';
        return sendRequest("POST", url, {data: params});
    };

    function importHoliday(params) {
        var url = '/api/data/importHoliday/';
        return sendRequest("POST", url, {data: params});
    };

    function checkRole(roles){
        if(!$rootScope.HM_USER || !$rootScope.HM_USER.roles  ) return 0;

        if($rootScope.HM_USER.roles.indexOf('superuser')>=0){
            return 1;
        }

        return !!$rootScope.HM_USER.roles.filter(function (role) {
            return roles.indexOf(role) >= 0;
        }).length;
    }

    var colorStatus = function(status){
        switch(status){
            case 0:
                return 'bg-blue-gradient';
            case 8:
                return 'bg-purple-gradient';    
            case 9:
                return 'bg-green-gradient';
            default:
                return 'bg-red-gradient';
        }
    }

    return {
        sendRequest: sendRequest,
        getmyIP: getmyIP,
        createTimesheet: createTimesheet,
        editPersonBalance: editPersonBalance,
        getListPerson: getListPerson,
        createHoliday: createHoliday,
        importHoliday: importHoliday,
        getListFile: getListFile,
        checkRole: checkRole,
        colorStatus: colorStatus,
    };
} ]);