app.factory('DataService', ["$http", "$q", "$filter", function ($http, $q, $filter) {

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

    return {
        sendRequest: sendRequest,
        getmyIP: getmyIP,
        createTimesheet: createTimesheet,
        editPersonBalance: editPersonBalance,
        getListPerson: getListPerson,
        createHoliday: createHoliday,
        importHoliday: importHoliday,
    };
} ]);