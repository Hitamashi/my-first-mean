app.directive('programForm', function () {
    return {
        restrict: 'EA',
        scope: {
            program: '=',
            ticket: '=',
            status: '=',
        },
        bindToController:true,
        templateUrl: '../Views/Form/ProgramForm.tpl.htm',
        controller: 'programCtrl',
        controllerAs: 'pr',
    };
});

app.controller('programCtrl', ['$rootScope', '$window', '$cookies', 'Upload', 'DataService', 
function ($rootScope, $window, $cookies, Upload, DataService) {
    var self = this;
    self.currentUser = $cookies.get('HM_USER_NAME');

    this.submit = function(){
        if(!self.myFileModel){
            $window.swal('Error!','Nhập file chương trình','error');
            return;
        }

        var _program = angular.copy(self.program);
        _program.createdDate = new Date();
        _program.operator = $cookies.get('HM_USER_ID');
        _program.ticket = self.ticket;
        delete _program.view;
        delete _program._id;

        var file = self.myFileModel;
        Upload.upload({
          url: '/api/file/upload',
          data: {"file": file},
        })
        .then(function (response) {
            file.result = response.data;
            $.notify({message: "File uploaded: "+ response.data.file.name ,title:'Success',icon:"icon fa fa-check-circle"},{type: 'success'});
            _program.programFile = file.result.file._id;
            file.progress = 0;
            self.sendRequest(_program);
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
    };

    self.reset = function(){
        $rootScope.$emit("reloadTicketPage");
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
                        return DataService.sendRequest("POST", "/api/tickets/denyRequest", {'data': {'ticket':self.ticket, 'reason': self.currentUser +':\n'+ text}})
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

    self.sendRequest = function(_program){
        $window.swal({
            title: 'Tạo chương trình',
            text: "Bạn muốn tạo một chương trình?",
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            showLoaderOnConfirm: true,
            preConfirm: function() {
                return new Promise(
                    function(resolve){
                        return DataService.sendRequest("POST", "/api/tickets/newProgram", {data: _program})
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

    self.isCollapsed = function(){
        //console.log(self.program);
        return self.program===undefined? true : self.program.view.collapsed;
    };

    self.checkRole = function(){
        return DataService.checkRole(['operator','superuser']);
    }
}]);