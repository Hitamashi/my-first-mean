app.controller('DashboardCtrl', ['$scope', '$rootScope', '$filter', '$routeParams', '$interval', '$timeout', '$window', '$cookies', 'Upload', 'DataService', 'userProfile',
function ($scope, $rootScope, $filter, $routeParams, $interval, $timeout, $window, $cookies, Upload, DataService, userProfile) {
    $scope.isDebug = false;
    $scope.listTicket= [];
    $scope.loading = true;
    $scope.onlyMyTask = false;
    $scope.currentUser = $cookies.get('HM_USER_ID');

    $scope.teams = [
        {name:"Sales"},
        {name:"Điều hành"},
        {name:"Giám đốc"},
        {name:"Admin"},
        {name:"Kế toán"},
    ];

    //Get ticket info
    $scope.getlstTicket = function(){
        DataService.sendRequest("GET", '/api/tickets')
        .then(function(data){
            $scope.listAllTicket = data;
            $scope.listMyTicket = data.filter($scope.filterMyTask);
            $scope.listTicket = $scope.listAllTicket;

            $scope.teams.forEach(function(team){
                var number = data.filter($scope.filterTeamInCharge(team.name)).length;
                team.ticketsNumber = number;
            });

            console.log($scope.listTicket);
            $scope.loading = false;
        },function(error){
			console.log(error);
            $scope.loading = false;
        })
    };

    $scope.toggleMyTask = function(){
        $scope.onlyMyTask = !$scope.onlyMyTask;
        if($scope.onlyMyTask)
            $scope.listTicket = $scope.listMyTicket;
        else
            $scope.listTicket = $scope.listAllTicket;
    }

    $scope.newTicket = function(){
        $window.swal({
            title: 'Khởi tạo',
            text: "Bạn muốn khỏi tạo một tour mới?",
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            showLoaderOnConfirm: true,
            preConfirm: function() {
                return new Promise(
                    function(resolve){ 
                        return DataService.sendRequest("POST", "/api/tickets/create", {data: {user:$scope.currentUser}})
                            .then(function(data){
                                $window.swal('Thành công','','success');
                                $timeout( function(){ $window.location.href = '#Ticket/'+data._id;}, 1000 );
                            },
                            function(data){
                                $window.swal('Error!','Operation failed','error');
                            });
                    }
                )
            },
        });
    }

    $scope.getlstTicket();

    $scope.colorStatus = function(status){
        return DataService.colorStatus(status);
    }

    $scope.filterMyTask = function(ticket){
        switch(ticket.status._id){
            case 0:
                return DataService.checkRole(['sales']);
            case 1:
                return DataService.checkRole(['operator']);
            case 2:
                return DataService.checkRole(['sales']);
            case 3:
                return DataService.checkRole(['operator']);
            case 4:
                return DataService.checkRole(['director']);
            case 5:
                return DataService.checkRole(['admin']);
            case 6:
                return DataService.checkRole(['accountant']);
            case 7:
                return DataService.checkRole(['director']);
            case 8:
                return DataService.checkRole(['accountant']);
        }
    }

    $scope.filterTeamInCharge = function(teamName){
        return function(element){
            return $scope.teamInCharge(element) == teamName;    
        };
    }

    $scope.teamInCharge = function(ticket){
        switch(ticket.status._id){
            case 0:
            case 2:
                return "Sales"
            case 1:
            case 3:
                return "Điều hành";
            case 4:
            case 7:
                return "Giám đốc";
            case 5:
                return "Admin";
            case 6:
            case 8:
                return "Kế toán";
            default:
                return "-";
        }
    }

    $scope.sort = function (keyname) {
        if ($scope.sortKey != keyname) {
            $scope.reverse = false;
        }
        else {
            $scope.reverse = !$scope.reverse;
        }
        $scope.sortKey = keyname;   //set the sortKey to the param passed
    }

    $scope.checkRole = function(){
        return DataService.checkRole(['sales','director']);
    }

    $scope.checkRoleDirector = function(){
        return DataService.checkRole(['director']);
    }
} ]);