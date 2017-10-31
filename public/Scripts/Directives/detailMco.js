app.directive('modalDetailMco', function () {
    return {
        restrict: 'E',
        scope: {
            info: '=',
            page: '='
        },
        templateUrl: '../Scripts/Directives/detailMco.html'
    };
});

app.controller('modalDetailController', ['$scope', function ($scope) {
    $scope.colorSeverity = function (val) {
        switch (val) {
            case 1:
                return 'bg-red';
            case 2:
                return 'bg-orange';
            case 3:
                return 'bg-purple';
            case 4:
                return 'bg-blue';
            default:
                return '';
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

    $scope.reset = function () {
        $scope.search = "";
        $scope.page = 1;
    }
}]);