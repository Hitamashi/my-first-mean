app.directive('followForm', function () {
    return {
        restrict: 'EA',
        scope: {
            follow: '=',
            status: '=',
            ticket: '=',
            contract: '=',
        },
        templateUrl: '../Views/Form/FollowForm.tpl.htm',
        controller: 'followCtrl',
        controllerAs:'f',
        bindToController:true,
    };
});

app.controller('followCtrl', ['$rootScope', '$window', '$cookies', 'Upload', 'DataService', 
function ($rootScope, $window, $cookies, Upload, DataService) {
    var self = this;
    self.currentUser = $cookies.get('HM_USER_NAME');

    self.fieldList=[
        {name: 'listFile', displayName:'Danh sách', model:{}, error:{}},
        {name: 'reserveTransportFile', displayName:'Book xe', model:{}, error:{}},
        {name: 'reserveHotelFile', displayName:'Book khách sạn', model:{}, error:{}},
        {name: 'reserveRestaurantFile', displayName:'Book nhà hàng', model:{}, error:{}},

        {name: 'touristGuideFile', displayName:'Hợp đồng HDV', model:{}, error:{}},
        {name: 'galaFile', displayName:'Chương trình Gala', model:{}, error:{}},
        {name: 'pasportFile', displayName:'Passport', model:{}, error:{}},
        {name: 'insuranceFile', displayName:'Bảo hiểm DL', model:{}, error:{}},
        {name: 'tourFile', displayName:'Điều tour', model:{}, error:{}},
    ];

    self.submit = function(){
        var _follow = angular.copy(self.follow);
        _follow.accountant = $cookies.get('HM_USER_ID');
        delete _follow.view;
        console.log(_follow);
        self.sendRequest(_follow);
    }

    self.uploadFollow = function(name, model){
        var _follow = {_id: self.follow._id};
        var file = model;
        console.log(file);
        if(!model || angular.equals(model,{})){
            window.swal('Error!','Vui lòng nhập file','warning');
            return;
        }

        Upload.upload({
          url: '/api/file/upload',
          data: {"file": file},
        })
        .then(function (response) {
            file.result = response.data;
            _follow[name] = file.result.file._id;
            file.progress = 99;
            
            DataService.sendRequest("POST", "/api/tickets/updateFollow", {data: _follow})
            .then(function(data){
                $window.swal('Thành công','','success');
                $rootScope.$emit("reloadTicketPage");
            },
            function(data){
                $window.swal('Error!','Operation failed','error');
            });
            
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

    self.denyContract = function(){
        $window.swal({
            title: 'Từ chối',
            text: "Bạn muốn từ chối hợp đồng? Nhập lý do",
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
                        return DataService.sendRequest("POST", "/api/tickets/denyContract", {'data': {'ticket':self.ticket, 'reason': self.currentUser +':\n'+ text}})
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

    self.acceptContract = function(){
        console.log(self.contract.contractNumber);
        $window.swal({
            title: 'Xác nhận',
            text: "Bạn muốn xác nhận hợp đồng?",
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
                        return DataService.sendRequest("POST", "/api/tickets/acceptContract", 
                            {'data': {'ticket':self.ticket, 'contractNumber': self.contract.contractNumber}})
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

    self.sendRequest = function(_follow){
        $window.swal({
            title: 'Cập nhật',
            text: "Bạn muốn cập nhật chỉnh sửa?",
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            showLoaderOnConfirm: true,
            preConfirm: function() {
                return new Promise(
                    function(resolve){
                        return DataService.sendRequest("POST", "/api/tickets/updateFollow", {data: _follow})
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

    self.finishContract = function(){
        if(!(self.follow && self.follow.receive && self.rest()==0 && self.follow.total !=0)){
            $window.swal('Error!','Chưa thanh toán xong','warning');
            return;
        }

        $window.swal({
            title: 'Hoàn tất',
            text: "Bạn chắc chắn muốn hoàn tất hợp đồng?",
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            showLoaderOnConfirm: true,
            preConfirm: function() {
                return new Promise(
                    function(resolve){
                        return DataService.sendRequest("POST", "/api/tickets/finish", {data: {"ticket":self.ticket}})
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

    self.receiveSum = function(){
        if(!self.follow || !self.follow.receive) return 0;
        var result = 0;
        self.follow.receive.forEach(function(r){
            result += r;
        });
        
        return result;
    }

    self.receiveNum = function(){
        if(!self.follow || !self.follow.receive) return 0;
        var result = 0;
        self.follow.receive.forEach(function(r){
            result += r>0? 1:0;
        });
        
        return result;
    }

    self.rest = function(){
        if(!self.follow || !self.follow.total) return 0;
        return  self.follow.total - self.receiveSum();
    }

    self.reset = function(){
        $rootScope.$emit("reloadTicketPage");
    }

    self.isCollapsed = function(){
        return self.follow===undefined? true : self.follow.view.collapsed;
    }

    self.checkRole = function(){
        return DataService.checkRole(['accountant','superuser']);
    }

    self.checkRoleDirector = function(){
        return DataService.checkRole(['director','superuser']);
    }
} ]);