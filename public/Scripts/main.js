
var app = angular.module('appSentinel', ['ui.bootstrap', 
    'ngAnimate', 
    'ngSanitize', 
    'ui.select',
    'angularUtils.directives.dirPagination', 
    'ngCookies', 
    'ngRoute',
    'ngFileUpload', 
    'bcherny/formatAsCurrency']);

//FILTERS
app.filter('propsFilter', function () {
    return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
            var keys = Object.keys(props);

            items.forEach(function (item) {
                var itemMatches = false;

                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});

app.filter('vnd', function ($filter) {
    return function (value) {
        if(!value || value==0) return '0';
        return 'VND ' + $filter('number')(value) ;
    }
})
