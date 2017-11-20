var app = angular.module('appSentinel', ['ui.bootstrap', 'ngAnimate', 'ngSanitize', 'ui.select','angularUtils.directives.dirPagination', 'ngCookies', 'ngRoute','doowb.angular-pusher','ngFileUpload']);

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
