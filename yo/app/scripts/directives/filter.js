'use strict';

angular.module('dmpApp')
    .controller('FilterCtrl', function($scope, $http, $q, $modalInstance, schemaParser, PubSub, mapping) {

        $scope.internalName = 'Filter Widget';

        $scope.activeMapping = mapping;

        if (!$scope.activeMapping._$filters) {
            $scope.activeMapping._$filters = [];
        }

        $scope.dataSource = {};
        $scope.dataSchema = {};
        $scope.dataLoaded = false;


        PubSub.subscribe($scope, 'returnLoadData', function(args) {

            if (args.record) {

                $scope.dataSource = args.record.data;
                $scope.dataSchema = args.schema;
                $scope.dataLoaded = true;

            }

        });

        PubSub.broadcast('getLoadData', {});

        $scope.update = function() {

            var inputFilterCollection = [];

            angular.forEach($scope.activeMapping._$filters, function(filter) {

                filter.inputFilters = schemaParser.getData(filter.filter, '');

                inputFilterCollection = inputFilterCollection.concat(filter.inputFilters);

                if (filter.inputFilters) {
                    filter.name = '';
                }

                var countInputFilter = 0;
                angular.forEach(filter.inputFilters, function(inputfilter) {
                    if (filter.name.length > 0) {
                        filter.name += ', ';
                    }
                    filter.name += inputfilter.title;

                    countInputFilter++;
                });
                if (countInputFilter === 0) {
                    filter.name = 'new filter';
                }

            });

            if (inputFilterCollection && inputFilterCollection[0] !== undefined && inputFilterCollection.length > 0) {
                $scope.dataSource.isFiltered = true;
                $scope.dataSource = schemaParser.filterData($scope.dataSource, inputFilterCollection);

            } else {
                $scope.dataSource.isFiltered = false;
                $scope.dataSource.filterNoMatch = false;
            }

            return true;
        };

        $scope.addFilter = function() {

            $scope.activeMapping._$filters.push({
                filter: schemaParser.fromDomainSchema($scope.dataSchema, true),
                inputFilters: [],
                name: 'new filter'
            });

        };

        $scope.close = function() {
            $modalInstance.dismiss('cancel');
        };

        $scope.onSaveClick = function() {
            $modalInstance.close();
        };

    });
