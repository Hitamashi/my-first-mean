app.directive('requestForm', function () {
    return {
        restrict: 'EA',
        scope: {
            request: '=',
            ticket: '=',
            status: '=',
        },
        bindToController:true,
        templateUrl: '../Views/Form/RequestForm.tpl.htm',
        controller: 'requestCtrl',
        controllerAs: 'req'
    };
});

app.controller('requestCtrl', ['$rootScope', '$window', '$cookies', 'Upload', 'DataService', 
function ($rootScope, $window, $cookies, Upload, DataService) {
    var self = this;
    //var origin = angular.copy(self.info);

    self.submit = function(){
        var _request = angular.copy(self.request);
        _request.createdDate = new Date();
        _request.salesman = $cookies.get('HM_USER_ID');
        _request.ticket = self.ticket; //id only
        delete _request.view;
        delete _request._id;

        console.log(_request);

        $window.swal({
            title: 'Tạo yêu cầu',
            text: "Bạn muốn tạo một yêu cầu?",
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
                        return DataService.sendRequest("POST", "/api/tickets/newRequest", {data: _request})
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
        console.log(self.request);
    }

    self.isCollapsed = function(){
        return self.request===undefined? true : self.request.view.collapsed;
    }

    self.checkIfSales = function(){
        return DataService.checkRole(['sales','supersuser']);
    }
} ]);