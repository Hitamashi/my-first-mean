app.factory('DataService', ["$http", "$q", "$filter", function ($http, $q, $filter) {

    function sendRequest(options){
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
        var url = 'https://api.ipify.org/?format=json';

        return sendRequest({
            url: url,
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }

    function createTimesheet(params) {
        var url = '/api/data/createTimesheet/';
        return sendRequest({
            url: url,
            method: "POST",
            data: params,
            headers: {
                "Content-Type": "application/json"
            }
        })
    };

    function editPersonBalance(params) {
        var url = '/api/data/editPersonBalance/';
        return sendRequest({
            url: url,
            method: "POST",
            data: params,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

    function getListPerson() {
        var url = '/api/data/getListPerson/';
        return sendRequest({
            url: url,
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

    function createHoliday(params) {
        var url = '/api/data/createHoliday/';
        return sendRequest({
            url: url,
            method: "POST",
            data: params,
            headers: {
                "Content-Type": "application/json"
            }
        });
    };

    function importHoliday(params) {
        var url = '/api/data/importHoliday/';
        return sendRequest({
            url: url,
            method: "POST",
            data: params,
            headers: {
                "Content-Type": "application/json"
            }
        })
    };

    return {
        getmyIP: getmyIP,
        createTimesheet: createTimesheet,
        editPersonBalance: editPersonBalance,
        getListPerson: getListPerson,
        createHoliday: createHoliday,
        importHoliday: importHoliday
    };
} ]);