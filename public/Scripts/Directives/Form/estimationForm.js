app.directive('estimationForm', function () {
    return {
        restrict: 'EA',
        scope: {
            estimation: '=',
            status: '=',
            ticket: '='
        },
        templateUrl: '../Views/Form/EstimationForm.tpl.htm',
        controller: 'estimationCtrl',
        controllerAs:'es',
        bindToController:true,
    };
});

app.controller('estimationCtrl', ['$rootScope', '$window', '$cookies', 'Upload', 'DataService', 
function ($rootScope, $window, $cookies, Upload, DataService) {
    var self = this;

    self.submit = function(){
        if(!self.myFileModel){
            $window.swal('Error!','Nhập file dự toán','error');
            return;
        }

        var _estimation = angular.copy(self.estimation);
        _estimation.createdDate = new Date();
        _estimation.ticket = self.ticket;
        _estimation.operator = $cookies.get('HM_USER_ID');
        delete _estimation.view;
        console.log(_estimation);

        var file = self.myFileModel;
        Upload.upload({
          url: '/api/file/upload',
          data: {"file": file},
        })
        .then(function (response) {
            file.result = response.data;
            $.notify({message: "File uploaded: "+ response.data.file.name ,title:'Success',icon:"icon fa fa-check-circle"},{type: 'success'});
            _estimation.estimationFile = file.result.file._id;
            file.progress = 0;
            self.sendRequest(_estimation);
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

    self.sendRequest = function(_estimation){
        $window.swal({
            title: 'Nhập dự toán',
            text: "Chương trình đưọc chấp nhận sau khi nhập dự toán. Bạn muốn tiếp tục?",
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            showLoaderOnConfirm: true,
            preConfirm: function() {
                return new Promise(
                    function(resolve){
                        return DataService.sendRequest("POST", "/api/tickets/newEstimation", {data: _estimation})
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

    self.reset = function(){
        $rootScope.$emit("reloadTicketPage");
    }

    self.isCollapsed = function(){
        return self.estimation===undefined? true : self.estimation.view.collapsed;
    }


    self.checkRole = function(){
        return DataService.checkRole(['operator','superuser']);
    }

    self.checkNotSales = function(){
        return DataService.checkRole([]) || !DataService.checkRole(['sales']);
    }
} ]);