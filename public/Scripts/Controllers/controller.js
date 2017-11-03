app.controller('AuthCtrl', ['$scope', '$rootScope', '$filter', '$cookies', '$window', 'DataService', 'AuthService',
function ($scope, $rootScope, $filter, $cookies, $window, DataService, AuthService) {

    $scope.ok = false;
    if(AuthService.checkAuth()) $scope.ok = true;
    else $window.location.href = '/login.html';
    

    DataService.getmyIP().then(function (data) {
        $.notify(data.ip);
    }, function (error) {
        console.log(error);
    });

    $scope.logout = function(){
        AuthService.logout();
        $window.location.href = '/login.html';
    }


}]);

app.controller('ClaimCtrl', ['$scope', '$rootScope', '$filter', '$interval', '$timeout', '$cookies', 'DataService',
function ($scope, $rootScope, $filter, $interval, $timeout, $cookies, DataService) {
    $scope.isDebug = false;
    $scope.claim = {amount:0,ims_ticket:'N/A',notes:''};
    
    $scope.loading = false;

    DataService.getmyIP().then(function (data) {
        $scope.claim["Submitted From"] = data.ip;
    }, function (error) {
        console.log(error);
    });

    $scope.submitClaim = function () {
        $scope.loading = true;
        var params = angular.copy($scope.claim);

        if (!params.Name || params.Name == "" || !params.Claim_date || !params.types_of_claim) {
            $scope.status = "Missing field: " + ((!params.Name || params.Name == "") ? "- Username " : "") + ((!params.Claim_date) ? "- Date " : "") + ((!params.types_of_claim) ? "- Claim Code" : "");
            $scope.error = true;
            $scope.loading = false;
            return;
        }

        params.Submitted = $filter('date')(new Date(), "yyyy-MM-dd hh:mm:ss");
        params.Claim_date = $filter('date')(params.Claim_date, "yyyy-MM-dd");


        //alert(params);
        if (!params.ims_ticket || params.ims_ticket=='')
            params.ims_ticket = 'N/A';

        DataService.createClaim(params)
        .then(function (data) {
            if (data.error) {
                $scope.status = "Error!";
                $scope.error = true;
            }
            else {
                $scope.status = "Claim created successfully";
                $scope.error = false;
            }
            $scope.loading = false;
        }, function (error) {
            console.log(error);
            $scope.status = "Error!";
            $scope.error = true;
            $scope.loading = false;
        });
    }

    $scope.resetClaim = function () {
        $scope.claim = {};
        $scope.status = null;
    }

} ]);

app.controller('LeaveCtrl', ['$scope', '$rootScope', '$filter', '$interval', '$timeout', '$cookies', 'DataService',
function ($scope, $rootScope, $filter, $interval, $timeout, $cookies, DataService) {
    $scope.isDebug = false;
    $scope.leave = {notes:''};
    $scope.loading = false;

    DataService.getmyIP().then(function (data) {
        $scope.leave["Submitted From"] = data.ip;
    }, function (error) {
        console.log(error);
    });

    $scope.submit = function () {
        $scope.loading = true;

        var params = angular.copy($scope.leave);

        //alert(params);
        if (!params.Name || params.Name == "" || !params.start_date || !params.leave_ims || !params.end_date || !params.day) {
            $scope.status = "Missing field";
            $scope.error = true;
            $scope.loading = false;
            return;
        }

        params.Submitted = $filter('date')(new Date(), "yyyy-MM-dd hh:mm:ss");
        params.start_date = $filter('date')(params.start_date, "yyyy-MM-dd");
        params.end_date = $filter('date')(params.end_date, "yyyy-MM-dd");
		
        DataService.createLeave(params)
        .then(function (data) {
            if (data.error) {
                $scope.status = "Error!";
                $scope.error = true;
            }
            else {
                $scope.status = "Leave created successfully";
                $scope.error = false;
            }
            $scope.loading = false;
        }, function (error) {
            console.log(error);
            $scope.status = "Error!";
            $scope.error = true;
            $scope.loading = false;
        });
    }

    $scope.reset = function () {
        $scope.leave = {};
        $scope.status = null;
    }

} ]);


app.controller('TSCtrl', ['$scope', '$rootScope', '$filter', '$interval', '$timeout', '$cookies', 'DataService',
function ($scope, $rootScope, $filter, $interval, $timeout, $cookies, DataService) {
    $scope.isDebug = false;
    $scope.timesheet = {Description:'',Hours:0};
    $scope.loading = false;

    DataService.getmyIP().then(function (data) {
        $scope.timesheet["Submitted From"] = data.ip;
    }, function (error) {
        console.log(error);
    });

    $scope.phaseOptions = ["N/A", "Discovery", "Design", "Development", "Deployment"];
    $scope.timesheet.Phase = "N/A";
    $scope.submit = function () {
        $scope.loading = true;
        var params = angular.copy($scope.timesheet);

        if (!params.Name || params.Name == "" || !params.Date || !params.TimesheetCode) {
            $scope.status = "Missing field: " + ((!params.Name || params.Name == "") ? "- Username " : "") + ((!params.Date) ? "- Date " : "") + ((!params.TimesheetCode) ? "- Timesheet Code" : "");
            $scope.error = true;
            $scope.loading = false;
            return;
        }

        params.Submitted = $filter('date')(new Date(), "yyyy-MM-dd hh:mm:ss");
        params.Date = $filter('date')(params.Date, "yyyy-MM-dd");

        //alert(params);
        if (!params.Name || params.Name == "") {
            $scope.status = "Error!";
            $scope.error = true;
        }

        if (!params.Phase || params.Phase == "") {
            params.Phase = "N/A";
        }

        if (!params.IMS || params.IMS == "") {
            params.IMS = "N/A";
        }

        DataService.createTimesheet(params)
        .then(function (data) {
            if (data.error) {
                $scope.status = "Error!";
                $scope.error = true;
            }
            else {
                $scope.status = "Timesheet created successfully";
                $scope.error = false;
            }
            $scope.loading = false;
        }, function (error) {
            console.log(error);
            $scope.status = "Error!";
            $scope.error = true;
            $scope.loading = false;
        });
    }

    $scope.reset = function () {
        $scope.timesheet = {};
        $scope.status = null;
    }

} ]);

app.controller('PersonCtrl', ['$scope', '$rootScope', '$filter', '$interval', '$timeout', '$cookies', 'DataService',
function ($scope, $rootScope, $filter, $interval, $timeout, $cookies, DataService) {
    $scope.isDebug = false;
    $scope.loading = false;

    $scope.lstPerson = [];
    $scope.selPerson = {};

    DataService.getListPerson().then(function (data) {
        if (data.error) {
            $scope.status = "Cannot load list of employee. Please refresh the page."; ;
            $scope.error = true;
        }
        else {
            $scope.lstPerson = data;
            $scope.selPerson = $scope.lstPerson[0];
        }
    }, function (error) {
        console.log(error);
        $scope.status = "Cannot load list of employee. Please refresh the page.";
        $scope.error = true;
    });

    $scope.submit = function () {
        $scope.loading = true;
        if (!$scope.selPerson.LeaveMedical) $scope.selPerson.LeaveMedical = 0;
        if (!$scope.selPerson.AnnualMedical) $scope.selPerson.AnnualMedical = 0;

        var params = angular.copy($scope.selPerson);

        DataService.editPersonBalance(params)
        .then(function (data) {
            if (data.error) {
                $scope.status = "Error!";
                $scope.error = true;
            }
            else {
                $scope.status = "Balance edited successfully";
                $scope.error = false;
            }
            $scope.loading = false;
        }, function (error) {
            console.log(error);
            $scope.status = "Error!";
            $scope.error = true;
            $scope.loading = false;
        });
    }

    $scope.reset = function () {
        $scope.status = null;
    }

} ]);

app.controller('HolidayCtrl', ['$scope', '$rootScope', '$filter', '$interval', '$timeout', '$cookies', 'DataService',
function ($scope, $rootScope, $filter, $interval, $timeout, $cookies, DataService) {
    $scope.isDebug = false;
    $scope.holiday = {};
    $scope.loading = false;

    $scope.submit = function () {
        $scope.loading = true;

        if (!$scope.holiday.Date || !$scope.holiday.Description) {
            $scope.status = "Missing field!";
            $scope.error = true;
            $scope.loading = false;
            return;
        }

        var params = angular.copy($scope.holiday);

        DataService.createHoliday(params)
        .then(function (data) {
            if (data.error) {
                $scope.status = "Error!";
                $scope.error = true;
            }
            else {
                $scope.status = "Holiday added successfully";
                $scope.error = false;
            }
            $scope.loading = false;
        }, function (error) {
            console.log(error);
            $scope.status = "Error!";
            $scope.error = true;
            $scope.loading = false;
        });
    }

    $scope.reset = function () {
        $scope.holiday = {};
        $scope.status = null;
    }

    //Import Pulic Holiday by file
    $scope.excelData = { loading: false, done: true, data: [] };

    $scope.resetUpload = function () {
        $scope.excelData = { loading: false, done: true, data: [] };
        $scope.statusUpload = null;
    }

    $scope.submitUpload = function () {
        $scope.loadingUpload = true;
        var params = angular.copy($scope.excelData.data.splice(1));

        DataService.importHoliday(params)
        .then(function (data) {
            if (data.error) {
                $scope.statusUpload = "Error!";
                $scope.errorUpload = true;
            }
            else {
                $scope.statusUpload = "Completed: " + data.success + " rows imported in total " + data.total + " rows";
                $scope.errorUpload = false;
            }
            $scope.loadingUpload = false;
        }, function (error) {
            console.log(error);
            $scope.statusUpload = "Error!";
            $scope.errorUpload = true;
            $scope.loadingUpload = false;
        });
    }

} ]);
