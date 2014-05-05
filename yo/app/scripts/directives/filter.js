'use strict';

angular.module('dmpApp')
    .controller('FilterCtrl', function($scope, $http, $q, $modalInstance, loDash, gdmParser, schemaParser, PubSub, mapping, attributePath) {

        $scope.internalName = 'Filter Widget';

        $scope.activeMapping = mapping;

        if (!$scope.activeMapping._$filters) {
            $scope.activeMapping._$filters = [];
        }

        $scope.dataSource = {};
        $scope.dataSchema = {};
        $scope.dataLoaded = false;

        var orignalSource = {};


        PubSub.subscribe($scope, 'returnLoadData', function(args) {

            if (args.record) {
                var schema = angular.copy(args.schema);
                var path = attributePath ? attributePath.attribute_path_id : null;

                if (path) {
                    var exactPath = loDash.find(schema.attribute_paths, { id: path });

                    if (angular.isDefined(exactPath)) {
                        var exactAttributes = exactPath.attributes;

                        schema.attribute_paths = loDash.filter(schema.attribute_paths, function(ap) {

                            return loDash.every(exactAttributes, function(a, i) {

                                return ap.attributes[i] && ap.attributes[i].id === a.id;
                            });
                        });
                    }
                }

                schema.name = schema.name || '';

                orignalSource = gdmParser.parse(args.record.data, schema);

                $scope.dataSource = orignalSource;
                $scope.dataSchema = schema;
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
                $scope.dataSource = schemaParser.filterData(angular.copy(orignalSource), inputFilterCollection, function(a, b) {
                    return a.indexOf(b) >= 0;
                });

            } else {
                $scope.dataSource = orignalSource;
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
