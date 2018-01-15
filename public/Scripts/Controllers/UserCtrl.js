var app = angular.module('appSentinel');

app.controller('UserCtrl', ['$scope', '$rootScope', '$filter', '$cookies', '$window', 'DataService', 'AuthService'
,function ($scope, $rootScope, $filter, $cookies, $window, DataService, AuthService) {

    $scope.getListUser = function(){
        DataService.sendRequest("GET", '/api/users')
        .then(function(data){
            $scope.lstUser = data;
        });
    }

    DataService.sendRequest("GET", '/api/users/roles')
    .then(function(data){
        $scope.lstRoles = data;
    });


    $scope.selectUser = function(user){
        $scope.forNew = false;
        $scope.selUser = angular.copy(user);
    }

    $scope.removeUser = function(user){
        $window.swal({
            title: 'Remove user',
            text: "You really want to remove this user?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            showLoaderOnConfirm: true,
            preConfirm: function() {
                return new Promise(
                    function(resolve){ 
                        return DataService.sendRequest("DELETE", "/api/users/"+user._id)
                            .then(function(data){
                                $window.swal('Deleted!','The user has been deleted.','success');
                                $scope.getListUser();
                            },
                            function(data){
                                $window.swal('Error!','Operation failed','error');
                            });
                    }
                )
            },
        });
    }

    $scope.reset = function(){
        $scope.selUser = null; 
        $scope.forNew=false;
    }

    $scope.newUser = function(){
        DataService.sendRequest("POST", '/api/users',{data: $scope.selUser})
        .then(function(data){
            $scope.getListUser();
            $window.swal('Created!','User has been created.','success');
            $scope.reset();
        }, function(data){
            $window.swal('Error!','Operation failed','error');
        });
    }

    $scope.editUser = function(){
        DataService.sendRequest("PUT", '/api/users/'+$scope.selUser._id,{data: $scope.selUser})
        .then(function(data){
            $scope.getListUser();
            $window.swal('Edited!','User has been edited.','success');
            $scope.reset();
        }, function(data){
            $window.swal('Error!','Operation failed','error');
        });
    }

    var generateRandomPass = function(){
        return Math.random().toString(36).substr(2, 8);
    }

    $scope.editUserPassword= function(id){
        $window.swal({
            title: 'Change password',
            text: "You really want to change password for this user?",
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            input: 'password',
            inputAutoTrim:true,
            inputAttributes:{"minlength":8, "autocomplete":"off"},
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
            preConfirm: function(password) {
                return new Promise(
                    function(resolve){ 
                        var newPassword = (password || password.trim()!="")? password : generateRandomPass();
                        return DataService.sendRequest("POST", '/api/users/password/'+id,{data: {"password": newPassword}})
                        .then(function(data){
                            $window.swal('Edited!','New password: '+ newPassword,'success');
                        },function(data){
                            $window.swal('Error!','Operation failed','error');
                        });
                    }
                )
            },
        });
        
    }

    $scope.getListUser();
}]);