'use strict';

angular.module('ContentApp.controllers')
    .controller('AppviewCtrl', ['$scope', '$modal', '$log', '$cookieStore','$rootScope','$timeout',function ($scope, $modal, $log, $cookieStore,$rootScope, $timeout) {
        var openLoginPanel = function () {
            var modalInstance = $modal.open({
                templateUrl: 'partials/dialog/_login.html',
                controller: 'ModalLoginInstanceCtrl',
                backdrop: 'static',
                size: 'sm'
            });
            modalInstance.result.then(function (authdata) {
                $scope.authenticated = true;
                $scope.authdata = authdata;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.getAuthData = function(){
          return $scope.authdata;
        };

        var init = function () {
            $scope.authenticated = false;
            if($cookieStore.get('xsLogin') !== undefined) {
                $scope.authenticated = true;
                $scope.authdata = $cookieStore.get('xsLogin');
            }else{
                $timeout(function(){
                    openLoginPanel();
                }, 1000);
            }
        };
        init();
    }]);
