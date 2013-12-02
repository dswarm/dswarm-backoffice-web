'use strict';

angular.module('dmpApp')
    .controller('FilterCtrl', ['$scope','$http', '$q', '$modalInstance', 'schemaParser', function ($scope, $http, $q, $modalInstance, schemaParser) {

        $scope.internalName = 'Filter Widget';

        $scope.filterSource = {
            datas : [],
            component : $scope.component ? $scope.component.payload : { filters : {} }
        };

        $scope.filterShouldBeOpen = false;
        $scope.result = {};

        $scope.update = function() {

            var inputfilterCollection = [];

            angular.forEach($scope.filterSource.component.filters, function(filter){

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

            angular.forEach($scope.filterSource.datas, function(sourceData){

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

            if(!$scope.filterSource.component.filters) {
                $scope.filterSource.component.filters = [];
            }

            $scope.filterSource.component.filters.push({
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
