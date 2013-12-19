'use strict';

angular.module('dmpApp')
    .controller('FilterCtrl', ['$scope','$http', '$q', '$modalInstance', 'schemaParser', 'PubSub', function ($scope, $http, $q, $modalInstance, schemaParser, PubSub) {

        $scope.internalName = 'Filter Widget';

        if(!$scope.component.filters) {
            $scope.component.filters = [];
        }

        $scope.dataSource = {};
        $scope.dataSchema = {};
        $scope.dataLoaded = false;


        PubSub.subscribe($scope, 'returnLoadData', function(args) {

            if(args.record) {

                $scope.dataSource = args.record.data;
                $scope.dataSchema = args.schema;
                $scope.dataLoaded = true;

            }

        });

        PubSub.broadcast('getLoadData', {});

        $scope.update = function() {

            var inputfilterCollection = [];

            angular.forEach($scope.component.filters, function(filter){

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

            if(inputfilterCollection && inputfilterCollection[0] !== undefined && inputfilterCollection.length > 0) {
                $scope.dataSource.isFiltered = true;
                $scope.dataSource = schemaParser.filterData($scope.dataSource, inputfilterCollection);

            } else {
                $scope.dataSource.isFiltered = false;
                $scope.dataSource.filterNoMatch = false;
            }

            return true;
        };

        $scope.addFilter = function () {

            $scope.component.filters.push({
                filter : schemaParser.fromDomainSchema($scope.dataSchema, true),
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
