angular.module('ContentApp.directives').directive("ngFileSelect", function ($rootScope, fileReader) {
    return {
        link: function ($scope, el) {
            el.bind("change", function (e) {
                var file = (e.srcElement || e.target).files[0];
                fileReader.readAsDataUrl(file, $scope)
                      .then(function (result) {
                          var csvRecords = CSV.parse(result);                          
                          $rootScope.$broadcast('csv-imported', { csvRecords: csvRecords });
                      });
            })
        }
    }
});