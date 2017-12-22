app.directive('contractAdminForm', function () {
    return {
        restrict: 'EA',
        scope: {
            contract: '=',
            status: '=',
            ticket: '='
        },
        templateUrl: '../Views/Form/ContractAdminForm.tpl.htm',
        controller: 'contractAdminCtrl',
        controllerAs:'c',
        bindToController:true,
    };
});

app.controller('contractAdminCtrl', ['$rootScope', '$window', '$cookies', 'Upload', 'DataService', 
function ($rootScope, $window, $cookies, Upload, DataService) {
    var self = this;
    self.curentUser = $cookies.get('HM_USER_NAME');

    self.submit = function(){
        if(!self.myFileModel){
            $window.swal('Error!','Nhập file dự toán','error');
            return;
        }

        var _contract = angular.copy(self.contract);
        _contract.createdDate = new Date();
        _contract.admin = $cookies.get('HM_USER_ID');
        _contract.ticket = self.ticket;
        delete _contract.view;

        var file = self.myFileModel;
        Upload.upload({
          url: '/api/file/upload',
          data: {"file": file},
        })
        .then(function (response) {
            file.result = response.data;
            $.notify({message: "File uploaded: "+ response.data.file.name ,title:'Success',icon:"icon fa fa-check-circle"},{type: 'success'});
            _contract.contractFile = file.result.file._id;
            file.progress = 0;
            self.sendRequest(_contract);
        }, function (response) {
            if (response.status > 0){
                $.notify({message: "File uploaded failed! ",title:'Error',icon:"icon fa fa-times-circle"},{type: 'danger'});
            }
            file.progress = 0;
        }, function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            console.log('progress: ' + evt.loaded +'/'+evt.total + '% ' + evt.config.data.file.name);
        });
    }

    self.sendRequest = function(_contract){
        $window.swal({
            title: 'Tạo hợp đồng',
            text: "Bạn muốn tiếp tục?",
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            showLoaderOnConfirm: true,
            preConfirm: function() {
                return new Promise(
                    function(resolve){
                        return DataService.sendRequest("POST", "/api/tickets/newContract", {data: _contract})
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

    self.reset = function(){
        $rootScope.$emit("reloadTicketPage");
    }

    self.isCollapsed = function(){
        return self.contract===undefined? true : (self.contract.view.collapsed);
    }

    self.isDisabled = function(){
        return self.contract===undefined? false : (self.contract.view.collapsed ||((self.contract.admin===undefined || self.contract.admin==null)? false : true));
    }

    self.checkDirector = function(){
        return DataService.checkRole(['director']);
    }

    self.denyProgram = function(){
        $window.swal({
            title: 'Từ chối',
            text: "Bạn muốn từ chối chưong trình? Nhập lý do",
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
                        return DataService.sendRequest("POST", "/api/tickets/denyProgram", {'data': {'ticket':self.ticket, 'reason': self.currentUser +'\n'+ text}})
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


    self.acceptProgram = function(){
        $window.swal({
            title: 'Xác nhận',
            text: "Bạn muốn xác nhận chương trình?",
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
            preConfirm: function(text) {
                return new Promise(
                    function(resolve){
                        return DataService.sendRequest("POST", "/api/tickets/acceptProgram", {'data': {'ticket':self.ticket}})
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

    self.checkAdmin = function(){
        return DataService.checkRole(['admin']);
    }
} ]);