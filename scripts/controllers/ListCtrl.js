'use strict';

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

angular.module('ContentApp.controllers')
    .controller('ListCtrl', ['$scope', '$rootScope', '$compile', 'ContentListService', '$parse', function ($scope, $rootScope, $compile, contentListService, $timeout, $parse) {

        $scope.listData = [];
        $scope.showGrid = false;
        $scope.selectItem = selectItem;
       
        $scope.selectedItem = {};
        
        $scope.itemi = 0;
        $scope.Nobj = 0;
        $scope.dataStatic;
      
        $scope.lc = {};

        contentListService.getList({
            "name": "G431017"
        }, $scope.getAuthData()).success(function (data) {
            $scope.listData = data;
            $scope.listData[0].isSelected = true;
            selectItem($scope.listData[0], 0);
        }).error(function (data) {
            alert(data);
        });

        function selectItem(item, itemIndex) {
            angular.forEach($scope.listData, function (listItem) {
                listItem.isSelected = false;
            });
            $scope.selectedItem = item;
            item.isSelected = true;
            $scope.itemIndex = itemIndex;
            $scope.tab = $scope.listData[itemIndex].name;
            if (firstTime)
                setTimeout(function () {
                    $scope.products.read();
                }, 100);
            else
                $scope.products.read();
        }

        var body = {};

        var previous = {}

        $scope.products = new kendo.data.DataSource({
            type: "json",
            transport: {
                read: function (options) {
                    console.log(options.data);
                    var raw = {}
                    raw.table = $scope.tab;                    
                    $scope.promise = contentListService.getDataFromHana(raw, $scope.getAuthData());
                    $scope.promise.success(function (data) {
                        var newColumns = [];                        newColumns.push({
                            field: 'id',
                            hidden: false
                        });

        $scope.dataStatic =data;

                        for (var propt in data.daten[0]) {
                            newColumns.push({
                                field: propt,
                                editable: false
                            });
                            $scope.Nobj++;
                        }

                        newColumns.push({
                            command: ["edit", "destroy"],
                            title: "&nbsp;",
                            width: "250px"
                        });

                        $scope.lc.mainGridOptions.columns = newColumns;

                        $scope.lc.selectedType = newColumns.length;

                        var i = 1;

                        angular.forEach(data.daten, function (product) {
                            product.id = i++;
                        });

                        setTimeout(function () {
                            options.success(data.daten);

                            firstTime = false;
                        }, 100);
                    });
                },
                update: function (e) {

                    e.success();
                },
                destroy: function (e) {
                    e.success();
                },
                create: function (e) {
                    body.Data = JSON.parse(JSON.stringify(e.data));
                    for (var key in body.Data) {
                        if (body.Data.hasOwnProperty(key)) {
                            value = body.Data[key];
                            value = Math.floor(value);
                            if (!isNaN(value)) {
                                body.Data[key] = value;
                            }
                        }
                    }
                    body.table = $scope.tab;
                }
            },
            schema: {
                model: {
                    id: 'id'
                }
            },
            pageSize: 5,
            serverPaging: true
        });

        $scope.lc.mainGridOptions = {
            autoBind: false,
            dataSource: $scope.products,
            height: 350,
            editable: "inline",
            sortable: true,
            mobile: true,
            pageable: true,
            toolbar: ["create"]
        };

        var firstTime = true;

        $scope.$on('csv-imported', function (event, args) {
            var keys = Object.keys($scope.dataStatic.daten[0]);

            var firstRow = args.csvRecords[0];

            if (keys.length - 1 != firstRow.length) {
                console.log('Columns count not matching.');
                return;
            }

            var headersMatch = true;

            for (var i = 0; i < firstRow.length; i++) {
                if (!$scope.dataStatic.daten[0].hasOwnProperty(firstRow[i])) {
                    console.log("Column " + firstRow[i] + " does not exists in grid.");
                    return;
                }
            }
            
            var productsArray = JSON.parse(csvJSON(CSV.stringify(args.csvRecords)));

            $scope.products.fetch(function () {
                productsArray.forEach(function (product) {
                    $scope.products.add(product);
                });
            });

            $scope.products.sync();
        });
    }]);