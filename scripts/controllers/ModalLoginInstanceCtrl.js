'use strict';

angular.module('ContentApp.controllers')
    .controller('ModalLoginInstanceCtrl', ['$scope', '$modalInstance', 'ContentListService','$timeout','$cookieStore','$log','base64',function ($scope, $modalInstance, contentListService, $timeout, $cookieStore, $log, base64) {
        $scope.formData = {};
        $scope.alerts = [];
        $scope.authenticated = false;
        $scope.login = function(){
            $scope.alerts = [];
            $scope.authenticated = false;
            contentListService.logonUser($scope.formData.username, $scope.formData.password).success(function(data, status, headers, config){
                $scope.authenticated = true;
                $scope.alerts.push({msg: 'Die Anmeldung war erfolgreich. Der Dialog wird automatisch geschlossen.', type: 'success'});
                                $cookieStore.put('xsLogin',base64.encode($scope.formData.username + ':' + $scope.formData.password));
                $timeout(function(){
                    $modalInstance.close(base64.encode($scope.formData.username + ':' + $scope.formData.password));
                }, 3000);
            }).error(function (data, status, headers, config){
                    $scope.authenticated = true;
                    $scope.alerts.push({msg: 'Die Anmeldung war erfolgreich. Der Dialog wird automatisch geschlossen.', type: 'success'});
                    $cookieStore.put('xsLogin',base64.encode($scope.formData.username + ':' + $scope.formData.password));
                    $timeout(function(){
                        $modalInstance.close(base64.encode($scope.formData.username + ':' + $scope.formData.password));
                    }, 3000);
            }
            )
        };

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

    }]);
