var app = angular.module('appSentinel');

app.controller('HistoryCtrl', ['$rootScope', '$filter', '$routeParams', '$interval', '$timeout', '$window', '$cookies', 'Upload', 'DataService', 'userProfile',
function ($rootScope, $filter, $routeParams, $interval, $timeout, $window, $cookies, Upload, DataService, userProfile) {
    var self = this;
    self.isDebug = false; 
    self.loading = true;

    self.type = $routeParams.type;
    self.ticketId = $routeParams.ticketId;
    self.status = {_id:9};
    
    self.history = [];

    var listType = [
        {name:'request', displayName:'Yêu cầu'},
        {name:'program', displayName:'Chương trình'},
        {name:'info', displayName:'Thông tin'},
        {name:'estimation', displayName:'Dự toán'},
        {name:'contract', displayName:'Hợp đồng'}
    ];

    function setupView(){
        self.history.forEach(function(item){
            item.view = {collapsed: true, disabled: true, history: true};
        });
    }

    self.getDisplayName = function(){
        var a = listType.filter(function(t){ return t.name==self.type; })[0];
        return a.displayName;
    }

    self.getHistory = function(){
        DataService.sendRequest("POST", '/api/tickets/getHistory', 
            {data: {"ticket": self.ticketId, "type": self.type}}
        ).then(function(data){
            self.history = data;

            setupView();

            console.log(self.history);
            //End loading
            self.loading = false;
        },function(error){
            $window.swal('Lỗi','Không tìm thấy dũ liệu','error');
            self.loading = false;
            console.log(error);
        })
    }

    self.getHistory();
} ]);