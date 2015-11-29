'use strict';

var geohanaApp = angular.module('ContentApp', [
        'ContentApp.services',
        'ContentApp.controllers',
        'ContentApp.directives',
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ab-base64',
        'ui.bootstrap',
        'ui.bootstrap.tpls',
    'kendo.directives'
    ])
    .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider){
        $routeProvider
            .when('/', {
                templateUrl: 'views/_Appview.html',
                controller: 'AppviewCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
        $httpProvider.interceptors.push(function ($q, $rootScope) {
            return {
                'response': function (response) {

                    return response;
                },
                'responseError': function (rejection) {
                    switch (rejection.status) {
                        case 401:
                            $rootScope.$broadcast('auth:loginRequired');
                            break;
                        case 403:
                            $rootScope.$broadcast('auth:loginRequired');
                            break;
                        case 404:
                            $rootScope.$broadcast('page:notFound');
                            break;
                        case 500:
                            $rootScope.$broadcast('server:error');
                            break;
                    }
                    return $q.reject(rejection);
                }
            };
        });
    }])
    .run(['$rootScope', function ($rootScope) {

    }]);

var CSV = {
    parse: function (csv, reviver) {
        reviver = reviver || function (r, c, v) { return v; };
        var chars = csv.split(''), c = 0, cc = chars.length, start, end, table = [], row;
        while (c < cc) {
            table.push(row = []);
            while (c < cc && '\r' !== chars[c] && '\n' !== chars[c]) {
                start = end = c;
                if ('"' === chars[c]) {
                    start = end = ++c;
                    while (c < cc) {
                        if ('"' === chars[c]) {
                            if ('"' !== chars[c + 1]) { break; }
                            else { chars[++c] = ''; } // unescape ""
                        }
                        end = ++c;
                    }
                    if ('"' === chars[c]) { ++c; }
                    while (c < cc && '\r' !== chars[c] && '\n' !== chars[c] && ',' !== chars[c]) { ++c; }
                } else {
                    while (c < cc && '\r' !== chars[c] && '\n' !== chars[c] && ',' !== chars[c]) { end = ++c; }
                }
                row.push(reviver(table.length - 1, row.length, chars.slice(start, end).join('')));
                if (',' === chars[c]) { ++c; }
            }
            if ('\r' === chars[c]) { ++c; }
            if ('\n' === chars[c]) { ++c; }
        }
        return table;
    },

    stringify: function (table, replacer) {
        replacer = replacer || function (r, c, v) { return v; };
        var csv = '', c, cc, r, rr = table.length, cell;
        for (r = 0; r < rr; ++r) {
            if (r) { csv += '\r\n'; }
            for (c = 0, cc = table[r].length; c < cc; ++c) {
                if (c) { csv += ','; }
                cell = replacer(r, c, table[r][c]);
                if (/[,\r\n"]/.test(cell)) { cell = '"' + cell.replace(/"/g, '""') + '"'; }
                csv += (cell || 0 === cell) ? cell : '';
            }
        }
        return csv;
    }
};

function csvJSON(csv) {

    var lines = csv.split("\n");

    var result = [];

    var headers = lines[0].split(",");

    for (var i = 1; i < lines.length; i++) {

        var obj = {};

        var currentline = lines[i].split(",");

        for (var j = 0; j < headers.length; j++) {
            obj[headers[j].trim()] = currentline[j].trim();
        }

        result.push(obj);

    }

    return JSON.stringify(result); //JSON
}