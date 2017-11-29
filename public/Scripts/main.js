﻿var app = angular.module('appSentinel', ['ui.bootstrap', 'ngAnimate', 'ngSanitize', 'ui.select','angularUtils.directives.dirPagination', 'ngCookies', 'ngRoute','doowb.angular-pusher','ngFileUpload']);

app.config(['PusherServiceProvider',
  function(PusherServiceProvider) {
    PusherServiceProvider
    .setToken('ec3c2fa791f9b21e7070')
    .setOptions({
        cluster: 'ap1',
        encrypted: true
    });
  }
]);

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