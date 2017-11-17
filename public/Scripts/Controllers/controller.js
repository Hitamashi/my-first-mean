﻿app.controller('AuthCtrl', ['$scope', '$rootScope', '$filter', '$cookies', '$window', 'DataService', 'AuthService', 'Pusher'
,function ($scope, $rootScope, $filter, $cookies, $window, DataService, AuthService, Pusher) {

    $scope.ok = false;


    if(AuthService.checkAuth()) {
        $scope.ok = true;
        if($cookies.get("HM_USER_ID")){
            $scope.USER_ID= $cookies.get("HM_USER_ID");
            $scope.USER_NAME= $cookies.get("HM_USER_NAME");
            $scope.USER_EMAIL= $cookies.get("HM_USER_EMAIL");
            $scope.USER_ROLE= JSON.parse($cookies.get("HM_USER_ROLE"));

            if($scope.USER_ROLE && $scope.USER_ROLE.indexOf("admin") != -1){
                Pusher.subscribe('newLogin', 'login', function (user) {
                    $.notify({message: "New login: "+ user.name ,title:'Notification',icon:"icon fa fa-info"},{type: 'info'});
                });
            }
        }
        else{
            AuthService.getProfile().then(function (data) {
                $cookies.put("HM_USER_ID", data._id);
                $cookies.put("HM_USER_NAME", data.name);
                $cookies.put("HM_USER_EMAIL", data.email);
                $cookies.put("HM_USER_ROLE", JSON.stringify(data.role));
            
                $scope.USER_ID= data.id;
                $scope.USER_NAME= data.name;
                $scope.USER_EMAIL= data.email;
                $scope.USER_ROLE= data.role;

                if($scope.USER_ROLE && $scope.USER_ROLE.indexOf("admin") != -1){
                    Pusher.subscribe('newLogin', 'login', function (user) {
                        $.notify({message: "New login: "+ user.name ,title:'Notification',icon:"icon fa fa-info"},{type: 'info'});
                    });
                }

            }, function (error) {
                console.log(error);
            });    
        }
    }
    else 
        $window.location.href = '/login.html';

    DataService.getmyIP().then(function (data) {
        $.notify({message: data.ip,title:'My IP',icon:"icon fa fa-info"},{type: 'info'});
    }, function (error) {
        console.log(error);
    });

    $scope.logout = function(){
        $window.swal({
            title: 'Logout',
            text: "You really want to go?",
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then(function () {
            $window.swal({type:'success', title:'Logout success', timer:1500,showConfirmButton:false})
            .then(
                function(){},
                function(dismiss){
                    if(dismiss=='timer'){
                        AuthService.logout();
                        $window.location.href = '/login.html';
                    }
                }
            );
        });
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

app.controller('DemoCtrl', ['$scope', '$rootScope', '$filter', '$interval', '$timeout', '$window', '$cookies', 'Upload', 'DataService',
function ($scope, $rootScope, $filter, $interval, $timeout,$window, $cookies, Upload, DataService) {
    $scope.isDebug = false;
    $scope.holiday = {};
    $scope.loading = false;
    

    // Upload - Download
    $scope.excelData = { loading: false, done: true, data: [] };

    $scope.resetUpload = function () {
        $scope.statusUpload = null;
    }

    $scope.myFileModel =null;

    $scope.submitUpload = function () {
        var file = $scope.myFileModel;
        file.progress = 0;
        $scope.loadingUpload = true;

        console.log(file);

        Upload.upload({
          url: '/api/file/upload',
          data: {file: file},
        })
        .then(function (response) {
            file.result = response.data;
            $.notify({message: "File uploaded: "+ response.data.file.name ,title:'Success',icon:"icon fa fa-check-circle"},{type: 'success'});
            $scope.loadingUpload = false;
        }, function (response) {
            if (response.status > 0){
                $scope.statusUpload = response.status + ': ' + response.data;
                $.notify({message: "File uploaded failed! ",title:'Error',icon:"icon fa fa-times-circle"},{type: 'danger'});
            }
            $scope.loadingUpload = false;
        }, function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            console.log('progress: ' + evt.loaded +'/'+evt.total + '% ' + evt.config.data.file.name);
        });
    }


    //Table demo

    $scope.demoData=[{"ID":1,"Destination":"El Salvador","Status":"On going","Duration":2,"CreationDate":"2017-11-12T09:23:05.762","Customer":"Netagy","Description":"Ipsum pariatur quis exercitation dolore sunt dolor adipisicing."},{"ID":2,"Destination":"Libya","Status":"Critical","Duration":3,"CreationDate":"2017-11-13T10:42:53.727","Customer":"Zolar","Description":"Aliquip commodo Lorem tempor culpa magna Lorem elit culpa."},{"ID":3,"Destination":"Mayotte","Status":"Urgent","Duration":3,"CreationDate":"2017-11-10T22:45:45.664","Customer":"Gluid","Description":"Eu laborum quis labore non sunt nisi aliqua minim mollit consequat aliquip nostrud."},{"ID":4,"Destination":"Greece","Status":"Done","Duration":5,"CreationDate":"2017-11-12T11:01:22.983","Customer":"Gadtron","Description":"Irure nisi nostrud sint nostrud eiusmod deserunt."},{"ID":5,"Destination":"Pitcairn","Status":"Urgent","Duration":2,"CreationDate":"2017-11-11T15:13:05.911","Customer":"Memora","Description":"Consectetur proident dolore ea tempor eu consectetur quis consectetur est veniam aute occaecat."},{"ID":6,"Destination":"China","Status":"Done","Duration":4,"CreationDate":"2017-11-10T23:18:03.561","Customer":"Autograte","Description":"Eiusmod non occaecat nostrud anim dolor."},{"ID":7,"Destination":"Andorra","Status":"Urgent","Duration":4,"CreationDate":"2017-11-10T07:34:39.492","Customer":"Shopabout","Description":"Laborum duis fugiat ipsum minim do est qui dolore aliqua."}];

    $scope.colorStatus = function (val) {
        switch (val) {
            case 'Critical':
                return 'bg-red';
            case 'Urgent':
                return 'bg-orange';
            case 'On going':
                return 'bg-purple';
            case 'Done':
                return 'bg-blue';
            default:
                return '';
        }
    }

    $scope.sort = function (keyname) {
        if ($scope.sortKey != keyname) {
            $scope.reverse = false;
        }
        else {
            $scope.reverse = !$scope.reverse;
        }
        $scope.sortKey = keyname;   //set the sortKey to the param passed
    }

    $scope.tableEdit = function(){
        $window.swal(
            'Modified!',
            'Your item has been edited',
            'success'
        )
    };

    $scope.tableRemove = function(){
        $window.swal({
            title: 'Remove item',
            text: "You really want to remove this item?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then(function () {
            $window.swal(
                'Deleted!',
                'Your item has been deleted.',
                'success'
            )
        });
    };    

} ]);
