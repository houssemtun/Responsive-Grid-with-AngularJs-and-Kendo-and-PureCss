
angular.module('ContentApp.services').factory('ContentListService',
    ['$http', '$routeParams', '$location', 'LoadingDialogService', '$log', '$q',
        function ($http, $routeParams, $location, loadingDialogService, $log, $q) {
            function httpPostWithLoadingDialog(path, data, config) {
                loadingDialogService.open();

                var httpPromise = $http.post(path, data, config);
                httpPromise.finally(function () {
                    loadingDialogService.close();
                });
                return httpPromise;
            }
function httpGetWithLoadingDialog(path, config) {
                loadingDialogService.open();

                var httpPromise = $http.get(path, config);
                httpPromise.finally(function () {
                    loadingDialogService.close();
                });

                return httpPromise;
            }
            
            function logonUser(username, password) {
                return httpPostWithLoadingDialog("/login.xscfunc",
                    $.param({"xs-username": username, "xs-password": password}),
                    {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                            'x-csrf-token': 'unsafe'}
                    });
            }


            function getDataFromHana(data, authdata) {
                return $http.get('protokol1.json');

            }

            function getList(data, authdata) {
                return $http.get('protokol2.json');
            }


            return {
                logonUser: function (username, password) {
                    return logonUser(username, password);
                },
                getList : function(data, authdata) {
                    return getList(data, authdata);
                },
                getDataFromHana : function(data, authdata) {
                    return getDataFromHana(data, authdata);
                }


            };
        }]);
