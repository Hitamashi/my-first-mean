var app = angular.module('appSentinel');

app.controller('MainCtrl', ['$rootScope','$filter', '$cookies', '$window', 'DataService', 'AuthService',
function ($rootScope, $filter, $cookies, $window, DataService, AuthService) {
    var self = this;

    self.ok = false;

    AuthService.getProfile().then(function (data) {
        $cookies.put("HM_USER_ID", data._id);
        $cookies.put("HM_USER_NAME", data.name);
        $cookies.put("HM_USER_EMAIL", data.email);
        $cookies.put("HM_USER_ROLE", JSON.stringify(data.roles));
    
        var user = {};

        user.id = data._id;
        user.name= data.name;
        user.email= data.email;
        user.roles= data.roles;

        self.HM_USER = user;
        $rootScope.HM_USER = angular.copy(user);

        self.ok = true;
    }, function (error) {
        console.log(error);
        AuthService.clearCookie();
        $window.location.href = '/login.html';
    }); 

    //Logout
    self.logout = function(){
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
                        AuthService.logout().then(function(data){
                            $window.location.href = '/login.html';
                        },
                        function(err){
                            $window.location.href = '/login.html';
                        }
                        )
                        
                    }
                }
            );
        });
    }

    //
    self.menuAvailable = function(roles){
        if(!self.HM_USER) return 0;
        return DataService.checkRole(roles);
    }

}]);

app.controller('TSCtrl', ['$filter', '$interval', '$timeout', '$cookies', '$window','DataService',
function ($filter, $interval, $timeout, $cookies, $window, DataService) {
    var self = this;

    self.timesheet = {Description:'',Hours:0};

    self.phaseOptions = ["N/A", "Discovery", "Design", "Development", "Deployment"];
    self.timesheet.Phase = "N/A";
    self.submit = function () {
        $window.swal({type:'success', title:'Submit success', text:'<pre>'+ JSON.stringify(self.timesheet) +'</pre>'})
    }

    self.reset = function () {
        self.timesheet = {};
    }

} ]);

app.controller('PersonCtrl', ['$filter', '$interval', '$timeout', '$cookies', '$window' ,'DataService',
function ($filter, $interval, $timeout, $cookies, $window, DataService) {
    var self = this;
    this.isDebug = true;
    this.loading = false;

    this.lstPerson = [];
    this.selPerson = {'name': "tada"};

    this.submit = function () {
        $window.swal({type:'success', title:'Submit success', text:'<pre>'+ JSON.stringify($scope.selPerson)+'</pre>'})
    }

    this.reset = function () {
        $scope.status = null;
    }

} ]);

app.controller('HolidayCtrl', ['$scope', '$rootScope', '$filter', '$interval', '$timeout', '$cookies', '$window', 'DataService',
function ($scope, $rootScope, $filter, $interval, $timeout, $cookies, $window, DataService) {
    $scope.isDebug = false;
    $scope.holiday = {};
    $scope.loading = false;

    $scope.submit = function () {
        $scope.loading = true;

        $window.swal({
            type:'success', 
            title:'Submit success', 
            text:'<pre>'+ JSON.stringify($scope.holiday)+'</pre>', 
            showConfirmButton:false, timer: 3000})
        .then(function(){},
            function(dismiss){
                if(dismiss=='timer'){
                    $scope.loading = false;
                }

            }
        );
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

app.controller('DemoCtrl', ['$scope', '$rootScope', '$filter', '$interval', '$timeout', '$window', '$cookies', 'Upload', 'DataService', 'userProfile',
function ($scope, $rootScope, $filter, $interval, $timeout, $window, $cookies, Upload, DataService, userProfile) {
    $scope.isDebug = false;
    $scope.holiday = {};
    $scope.loading = false;
    
    $scope.myProfile = userProfile.$getProfile();
    /*
    userProfile.$getProfile().then(function(data){
        console.log(data);
        $scope.myProfile = data;
    });
    */

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
            file.progress = 0;
        }, function (response) {
            if (response.status > 0){
                $scope.statusUpload = response.status + ': ' + response.data;
                $.notify({message: "File uploaded failed! ",title:'Error',icon:"icon fa fa-times-circle"},{type: 'danger'});
            }
            $scope.loadingUpload = false;
            file.progress = 0;
        }, function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            console.log('progress: ' + evt.loaded +'/'+evt.total + '% ' + evt.config.data.file.name);
        });
    }

    DataService.getListFile().then(function(data){
        $scope.lstFiles = data;
    });

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

    $scope.notification = {
        info: function(){
            $.notify({message: 'Info message', title: 'Info', icon:"icon fa fa-info"},{type: 'info'});
        },
        success: function(){
            $.notify({message: "Success message" ,title:'Success',icon:"icon fa fa-check-circle"},{type: 'success'});
        },
        warning: function(){
            $.notify({message: "Warning message" , title:'Warning', icon:"icon fa fa-warning"},{type: 'warning'});
        },
        error: function(){
            $.notify({message: "Error message" , title:'Error',icon:"icon fa fa-times-circle"},{type: 'danger'});
        },
        ajax: function(){
            DataService.getmyIP().then(function (data) {
                $.notify({message: data.ip,title:'My IP',icon:"icon fa fa-info"},{type: 'info'});
            }, function (error) {
                console.log(error);
            });
        }
    }   

    $scope.fieldList=[
        {name: 'File1', displayName:'File 1', model:{}, error:{}},
        {name: 'File2', displayName:'File 2', model:{}, error:{}},
    ];

    $scope.show=function(){console.log($scope.fieldList);};

} ]);
