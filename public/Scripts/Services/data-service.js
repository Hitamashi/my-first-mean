app.factory('DataService', ["$http", "$q", "$filter", function ($http, $q, $filter) {

    function getmyIP() {
        var url = 'http://ip-api.com/json';

        return $http({
            url: url,
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(function (response) {
            if (typeof response.data === 'object') {
                response.data.ip = response.data.query;
                //console.log(response.data);
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
    function createClaim(params) {
        var url = '/api/data/createClaim/';
        return $http({
            url: url,
            method: "POST",
            data: params,
            headers: {
                "Content-Type": "application/json"
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

    function createLeave(params) {
        var url = '/api/data/createLeave/';
        return $http({
            url: url,
            method: "POST",
            data: params,
            headers: {
                "Content-Type": "application/json"
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

    function createTimesheet(params) {
        var url = '/api/data/createTimesheet/';
        return $http({
            url: url,
            method: "POST",
            data: params,
            headers: {
                "Content-Type": "application/json"
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

    function editPersonBalance(params) {
        var url = '/api/data/editPersonBalance/';
        return $http({
            url: url,
            method: "POST",
            data: params,
            headers: {
                "Content-Type": "application/json"
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
    }

    function getListPerson() {
        var url = '/api/data/getListPerson/';
        return $http({
            url: url,
            method: "GET",
            headers: {
                "Content-Type": "application/json"
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
    }

    function createHoliday(params) {
        var url = '/api/data/createHoliday/';
        return $http({
            url: url,
            method: "POST",
            data: params,
            headers: {
                "Content-Type": "application/json"
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

    function importHoliday(params) {
        var url = '/api/data/importHoliday/';
        return $http({
            url: url,
            method: "POST",
            data: params,
            headers: {
                "Content-Type": "application/json"
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
        getmyIP: getmyIP,
        createClaim: createClaim,
        createLeave: createLeave,
        createTimesheet: createTimesheet,
        editPersonBalance: editPersonBalance,
        getListPerson: getListPerson,
        createHoliday: createHoliday,
        importHoliday: importHoliday
    };
} ]);