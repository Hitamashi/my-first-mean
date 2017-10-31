app.directive('modalSelectProfil', function () {
    return {
        restrict: 'E',
        scope: {
            info: '='
        },
        templateUrl: '../Scripts/Directives/selectProfil.html'
    };
});

app.controller('modalSelectProfilController', ['$scope', '$rootScope', 'DataService',
function ($scope, $rootScope, DataService) {
    $scope.team = { name: "", data: [] };
    $scope.team = $scope.info;
    $scope.listProfils = [];

    $scope.RefreshData = function (info) {
        //$scope.team.data = [{ "name": $scope.team.name, "listProfils": [{ key: "Rsx", id: 78}]}];
        $rootScope.$emit("OnChangeProfilEvent", info);
    }

    $scope.loadListProfils = function () {
        DataService.getListProfils().then(function (data) {
            $scope.listProfils = data;
        }, function (error) {
            console.log(error);
        });
    }

    $scope.loadListProfils();
} ]);