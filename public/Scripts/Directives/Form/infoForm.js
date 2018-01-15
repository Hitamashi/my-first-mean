var app = angular.module('appSentinel');

app.directive('infoForm', function () {
    return {
        restrict: 'EA',
        scope: {
            info: '=',
            status: '=',
            ticket: '='
        },
        templateUrl: '../Views/Form/InfoForm.tpl.htm',
        controller: 'infoCtrl',
        controllerAs: 'inf',
        bindToController:true,
    };
});

app.controller('infoCtrl', ['$rootScope', '$window', '$cookies', 'Upload', 'DataService', 
function ($rootScope, $window, $cookies, Upload, DataService) {
    var self = this;
    self.currentUser = $cookies.get('HM_USER_NAME');

    self.submit = function(){
        var _info = angular.copy(self.info);
        _info.createdDate = new Date();
        _info.salesman = $cookies.get('HM_USER_ID');
        _info.ticket = self.ticket;
        delete _info.view;

        $window.swal({
            title: 'Xác nhận chưong trình',
            text: "Chương trình đưọc chấp nhận sau khi điền thông tin. Bạn muốn tiếp tục?",
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
            preConfirm: function() {
                return new Promise(
                    function(resolve){ 
                        return DataService.sendRequest("POST", "/api/tickets/newInfo", {data: _info})
                            .then(function(data){
                                $window.swal('Thành công','','success');
                                $rootScope.$emit("reloadTicketPage");
                            },
                            function(data){
                                $window.swal('Error!','Operation failed','error');
                            });
                    }
                )
            },
        });
    }

    self.reset = function(){
        $rootScope.$emit("reloadTicketPage");
    }

    self.isCollapsed = function(){
        return self.info===undefined? true : self.info.view.collapsed;
    }

    self.deny = function(){
        $window.swal({
            title: 'Từ chối',
            text: "Bạn muốn từ chối yêu cầu? Nhập lý do",
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            input: 'text',
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
            preConfirm: function(text) {
                return new Promise(
                    function(resolve){
                        return DataService.sendRequest("POST", "/api/tickets/denyProgram", {'data': {'ticket':self.ticket, 'reason': self.currentUser +':\n'+ text}})
                            .then(function(data){
                                $window.swal('Thành công','','success');
                                $rootScope.$emit("reloadTicketPage");
                            },
                            function(data){
                                $window.swal('Error!','Operation failed','error');
                            });
                    }
                )
            },
        });
    };

    self.checkRole = function(){
        return DataService.checkRole(['sales','superuser']);
    }
} ]);