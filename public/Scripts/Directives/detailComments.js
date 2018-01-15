var app = angular.module('appSentinel');

app.directive('modalDetailComment', function () {
    return {
        restrict: 'EA',
        scope: {
            comments: '=',
        },
        templateUrl: '../Scripts/Directives/detailComments.html',
        bindToController:true,
        controller: 'modalCommentCtrl',
        controllerAs: 'u'
    };
});

app.controller('modalCommentCtrl', ['$rootScope', '$window', '$cookies', 'Upload', 'DataService', 
function ($rootScope, $window, $cookies, Upload, DataService) {
    var self = this;
    self.page=1;
    self.reverse = true;

    self.sort = function (keyname) {
        if (self.sortKey != keyname) {
            self.reverse = false;
        }
        else {
            self.reverse = !self.reverse;
        }
        self.sortKey = keyname;   //set the sortKey to the param passed
    }

    self.reset = function () {
        self.search = "";
        self.page = 1;
    }
}]);