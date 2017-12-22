app.directive('contractAccForm', function () {
    return {
        restrict: 'EA',
        scope: {
            contract: '=',
            status: '=',
            ticket: '='
        },
        templateUrl: '../Views/Form/ContractAccountantForm.tpl.htm',
        controller: 'contractAccCtrl',
        controllerAs:'c',
        bindToController:true,
    };
});

app.controller('contractAccCtrl', ['$rootScope', '$window', '$cookies', 'Upload', 'DataService', 
function ($rootScope, $window, $cookies, Upload, DataService) {
    var self = this;
    self.curentUser = $cookies.get('HM_USER_NAME');

    self.submit = function(){
        if(!self.contract.status || self.contract.status == 'NEW'){
            $window.swal('Error!','Vui lòng xác nhận hợp đồng','error');
            return;
        }

        var _contract = {};
        _contract.modified = new Date();
        _contract.accountant = $cookies.get('HM_USER_ID');
        _contract.ticket = self.ticket;
        _contract.status = self.contract.status;
        _contract.noteAccountant = self.contract.noteAccountant ||"";
        _contract._id = self.contract._id;
        console.log(_contract);

        var file = self.myFileModel;
        $window.swal({
            title: 'Xác nhận hợp đồng',
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
                        return DataService.sendRequest("POST", "/api/tickets/updateContract", {data: _contract})
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
        //console.log(self.contract===undefined? true : self.contract.view.collapsed);
        return self.contract===undefined? true : (self.contract.view.collapsed);
    }

    self.isDisabled = function(){
        return self.contract===undefined? false : (self.contract.view.collapsed || ((self.contract.accountant===undefined || self.contract.accountant==null)? false : true));
    }

    self.checkRole = function(){
        return DataService.checkRole(['accountant','superuser']);
    }

} ]);