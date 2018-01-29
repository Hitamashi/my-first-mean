
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
});

app.filter('timeago',function($filter){
    //time: the time
    //local: compared to what time? default: now
    //raw: wheter you want in a format of "5 minutes ago", or "5 minutes"
    return function (time, local, raw) {
        if (!time) return "-";
        
        if (!local) {
            (local = Date.now())
        }

        if (angular.isDate(time)) {
            time = time.getTime();
        } else if (typeof time === "string") {
            time = new Date(time).getTime();
        }

        if (angular.isDate(local)) {
            local = local.getTime();
        } else if (typeof local === "string") {
            local = new Date(local).getTime();
        }

        if (typeof time !== 'number' || typeof local !== 'number') {
            return "-";
        }

        var offset = Math.abs((local - time) / 1000),
            span = [],
            MINUTE = 60,
            HOUR = 3600,
            DAY = 86400,
            WEEK = 604800,
            MONTH = 2629744;

        var result = "-";

        if (offset <= MINUTE) {
            span = [ '', raw ? 'mới đây' : 'khoảng 1 phút' ];
        }
        else if (offset < (MINUTE * 60)) {
            span = [ Math.round(Math.abs(offset / MINUTE)), 'phút' ];
        }
        else if (offset < (HOUR * 24)) {
            span = [ Math.round(Math.abs(offset / HOUR)), 'giờ' ];
        }
        else if (offset < (DAY * 7)) {
            if(offset ==1){
                result = "Hôm qua, " + $filter("date")(time, 'HH:mm')
            }
            else{
                span = [ Math.round(Math.abs(offset / DAY)), 'ngày' ];    
            }
        }
        else {
            result = $filter('date')(time, 'dd-MM-yyyy HH:mm');
        }


        result = span.length>0? span.join(' '): result;

        if (raw === true || span.length==0) {
            return result;
        }
        return (time <= local) ? result + ' trước' : span + ' nữa';
    }
});
