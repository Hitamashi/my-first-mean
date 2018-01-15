var app = angular.module('appSentinel');

app.controller('TicketCtrl', ['$rootScope', '$filter', '$routeParams', '$interval', '$timeout', '$window', '$cookies', 'Upload', 'DataService', 'userProfile',
function ($rootScope, $filter, $routeParams, $interval, $timeout, $window, $cookies, Upload, DataService, userProfile) {
    var self = this;

    self.isDebug = false;

    self.ticket= {};
    self.ticket._id = $routeParams.id;

    self.currentUser = $cookies.get('HM_USER_NAME');
    self.currentUserId = $cookies.get('HM_USER_ID');
    
    self.loading = true;

    self.view = {collapsed: true};

    var listKey = ['request', 'program','info', 'estimation','contract', 'follow'];

    //Setup view
    var setupView = function(){
        switch(self.ticket.status._id){
            case 0: //Create Request
                if(!self.ticket.request)
                    self.ticket.request = {'view':{'collapsed': false}};
                self.ticket.request.view.collapsed = false;
                self.ticket.request.view.disabled = false;
                break;
            case 1: //Create Program
                self.ticket.program.view.collapsed = false;
                self.ticket.program.view.disabled = false;
                break;
            case 2: //Create info
                self.ticket.info.view.collapsed = false;
                self.ticket.info.view.disabled = false;
                break;
            case 3: //Create estimation
                self.ticket.estimation.view.collapsed = false;
                self.ticket.estimation.view.disabled = false;
                break;
            case 4: //Waiting director confirm
                //No need to do
                break;
            case 5: //Create contract
            case 6: //Add info contract
                self.ticket.contract.view.collapsed = false;
                self.ticket.contract.view.disabled = false;
            case 7: //Wating for confirm
                break;
            case 8: //Start follow contract
                self.ticket.follow.view.collapsed = false;
                self.ticket.follow.view.disabled = false;
            case 9: //Finish contract
                break;
            default:
                break;
        }
    }

    //Get ticket info
    self.getTicket = function(){
        DataService.sendRequest("GET", '/api/tickets/'+ $routeParams.id)
        .then(function(data){
            self.ticket = data;

            //TODO: Setup view
            //...
            /*
            for (var key in self.ticket) {
                if (self.ticket.hasOwnProperty(key) && listKey.indexOf(key) !=-1 ) {
                    var value = self.ticket[key];
                    value.view = {collapsed:true, disabled: true};
                }
            }
            */
            for (var k in listKey) {
                if (self.ticket.hasOwnProperty(listKey[k])) {
                    var value = self.ticket[listKey[k]];
                    if(value)
                        value.view = {collapsed:true, disabled: true};
                    else
                        self.ticket[listKey[k]] = {view:{collapsed:true, disabled: true}};
                }
                else{
                    self.ticket[listKey[k]]= {view:{collapsed:true, disabled: true}};
                }
            }

            setupView();

            console.log(self.ticket);
            //End loading
            self.loading = false;
        },function(error){
            $window.swal('Lỗi','Không tìm thấy dũ liệu','error');
            self.loading = false;
			console.log(error);
        })
    };

    self.cancelTicket = function(){
        $window.swal({
            title: 'Hủy tour',
            text: "Bạn muốn hủy tour? Nhập lý do",
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
                        return DataService.sendRequest("POST", "/api/tickets/cancelTicket", {'data': {'ticket':self.ticket._id, 'reason': self.currentUser +':\n'+ text}})
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

    self.addComment = function(){
        $window.swal({
            title: 'Thêm cập nhật',
            text: "Bạn muốn cập nhật tour? Nhập nội dung",
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            input: 'textarea',
            inputValidator: function(text){
                return new Promise((resolve) => {
                    if (text && text !=='') {
                        resolve();
                    } else {
                        resolve('Vui lòng nhập nội dung');
                    }
                })
            },
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
            preConfirm: function(text) {
                return new Promise(
                    function(resolve){
                        return DataService.sendRequest("POST", "/api/tickets/addComment", 
                            {'data': {'ticket':self.ticket._id, 'user': self.currentUserId, 'description': text}})
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

    self.showUpdates = function(){
        self.ticket.comments.sort(function(a,b){
            return a.createdDate > b.createdDate;
        });
    }

    //Toggle expand all
    self.isExpandedAll = false;

    self.toggleExpand = function(){
    	for (var key in self.ticket && listKey.indexOf(key) !=-1) {
		    if (self.ticket.hasOwnProperty(key) && listKey.indexOf(key) !=-1) {
		    	var value = self.ticket[key];
		        if(value && value.view)
					value.view.collapsed = self.isExpandedAll;
		    }
		}
		self.isExpandedAll = !self.isExpandedAll;
    }

    self.getTicket();

    $rootScope.$on("reloadTicketPage", function (event, data) {
        //alert("Reload");
        self.loading = true;
        self.ticket = {};
        self.getTicket();
    });

    self.colorStatus = function(status){
        return DataService.colorStatus(status);
    }

    self.checkDirector = function(){
        return DataService.checkRole(['director']);
    }
} ]);