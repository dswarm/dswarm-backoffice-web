'use strict';

angular.module('dmpApp')
    .controller('FilterCtrl', ['$scope','$http', '$q', 'schemaParser', 'PubSub', function ($scope, $http, $q, schemaParser, PubSub) {

        $scope.internalName = 'Filter Widget';

        $scope.sourceDatas = [];
        $scope.component = null;
        $scope.filterShouldBeOpen = false;
        $scope.result = {};

        var schemaPromise = $http.get('/data/schema.json')
            , dataPromise = $http.get('/data/record.json')
            , allPromise = $q.all([schemaPromise, dataPromise]);

        $http.get('/data/schema.json')
            .success(function (result) {
                $scope.result = result;
            });

        allPromise.then(function (result) {
            var schemaResult = result[0]['data']
                , dataResult = result[1]['data'];

            $scope.result = result[0]['data'];

            $scope.sourceDatas.push(
                schemaParser.parseAny(
                    dataResult[schemaResult['title']], schemaResult['title'], schemaResult)
            );

        });

        $scope.update = function() {

            var inputfilterCollection = [];

            angular.forEach($scope.component.filters, function(filter){

                filter.inputfilters = schemaParser.getData(filter.filter,'');

                inputfilterCollection = inputfilterCollection.concat(filter.inputfilters);

                if(filter.inputfilters) {
                    filter.name = "";
                }

                var countInputfilter = 0;
                angular.forEach(filter.inputfilters, function(inputfilter) {
                    if(filter.name.length > 0) {
                        filter.name += ", ";
                    }
                    filter.name += inputfilter.title ;

                    countInputfilter++;
                });
                if(countInputfilter == 0) { filter.name = "new filter" };

            });

            angular.forEach($scope.sourceDatas, function(sourceData){

                if(inputfilterCollection && inputfilterCollection[0] !== undefined && inputfilterCollection.length > 0) {

                    sourceData.isFiltered = true;
                    sourceData = schemaParser.filterData(sourceData, inputfilterCollection);

                } else {
                    sourceData.isFiltered = false;
                    sourceData.filterNoMatch = false;
                }

            });

            return true;
        }

        $scope.opts = {
            backdropFade: true,
            dialogFade:true,
            triggerClass: 'really in'
        };

        $scope.addFilter = function () {

            if(!$scope.component.filters) {
                $scope.component.filters = [];
            }

            $scope.component.filters.push({
                filter : schemaParser.mapData($scope.result['title'], $scope.result, true),
                inputfilters : [],
                name : 'new filter'
            });

        }

        $scope.close = function () {
            $scope.filterShouldBeOpen = false;
        };

        PubSub.subscribe($scope, 'handleEditFilter', function(args) {
            $scope.filterShouldBeOpen = true;
            $scope.component = args['payload'];

        });

        $scope.onSaveClick = function() {
            $scope.component = null;
        };

    }])
    .directive('filter', function () {

        return {
            restrict: 'E',
            replace: true,
            scope: true,
            link : function(scope, element, attrs) {

                console.log(scope);

            },
            templateUrl: 'views/directives/filter.html',
            controller: 'FilterCtrl'
        };
    });
