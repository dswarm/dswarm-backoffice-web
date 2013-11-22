'use strict';

angular.module('dmpApp')
    .controller('FilterCtrl', ['$scope','$http', '$q', '$modalInstance', 'schemaParser', 'PubSub', function ($scope, $http, $q, $modalInstance, schemaParser, PubSub) {

        $scope.internalName = 'Filter Widget';

        var component = { payload : {}};

        console.log($scope);

        $scope.sourceDatas = [];
        $scope.componentPayload = component.payload;
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

            angular.forEach($scope.componentPayload.filters, function(filter){

                filter.inputfilters = schemaParser.getData(filter.filter,'');

                inputfilterCollection = inputfilterCollection.concat(filter.inputfilters);

                if(filter.inputfilters) {
                    filter.name = '';
                }

                var countInputfilter = 0;
                angular.forEach(filter.inputfilters, function(inputfilter) {
                    if(filter.name.length > 0) {
                        filter.name += ', ';
                    }
                    filter.name += inputfilter.title ;

                    countInputfilter++;
                });
                if(countInputfilter === 0) { filter.name = 'new filter'; }

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
        };

        $scope.addFilter = function () {

            if(!$scope.componentPayload.filters) {
                $scope.componentPayload.filters = [];
            }

            $scope.componentPayload.filters.push({
                filter : schemaParser.mapData($scope.result['title'], $scope.result, true),
                inputfilters : [],
                name : 'new filter'
            });

        };

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.onSaveClick = function() {
            $modalInstance.close();
        };

    }]);
