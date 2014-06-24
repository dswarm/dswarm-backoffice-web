'use strict';

angular.module('dmpApp')
    .controller('FilterCtrl', function($scope, $http, $q, $modalInstance, loDash, gdmParser, schemaParser, filterHelper, PubSub, mapping, attributePathId, filters) {

        $scope.internalName = 'Filter Widget';

        $scope.activeMapping = mapping;
        $scope.filters = filters;

        $scope.dataSource = {};
        $scope.dataSchema = {};
        $scope.dataLoaded = false;

        var originalSource = {};

        // deactivated until further notice
        /* jshint ignore:start */
        function restrictSchema(schema, pathId) {
            var exactPath = loDash.find(schema.attribute_paths, { id: pathId });

            if (angular.isDefined(exactPath)) {
                var exactAttributes = exactPath.attributes;

                schema.attribute_paths = loDash.filter(schema.attribute_paths, function(ap) {

                    return loDash.every(exactAttributes, function(a, i) {

                        return ap.attributes[i] && ap.attributes[i].id === a.id;
                    });
                });
            }
        }
        /* jshint ignore:end */

        $scope.expandCollapse = function(that) {
            that.toggle(that);
        };

        $scope.update = function() {

            var inputFilterCollection = filterHelper.buildFilterInputs(filters);

            filterHelper.annotateMatches($scope.dataSource, inputFilterCollection, function(a, b) {
                return a === b;
            });

            return true;
        };

        $scope.addFilter = function() {

            filters.push({
                filter: schemaParser.fromDomainSchema($scope.dataSchema, true),
                inputFilters: [],
                name: 'new filter'
            });

        };

        $scope.close = function() {
            $modalInstance.dismiss('cancel');
        };

        $scope.save = function() {
            $modalInstance.close();
        };

        PubSub.ask($scope, 'getLoadData', {}, 'returnLoadData', function(args) {

            if (args.record) {
                var schema = angular.copy(args.schema);
                // deactivated until further notice
//                if (attributePathId) {
//                    restrictSchema(schema, attributePathId);
//                }

                schema.name = schema.name || '';

                originalSource = gdmParser.parse(args.record.data, schema);

                $scope.dataSource = originalSource;
                $scope.dataSchema = schema;

                $scope.update();

                $scope.dataLoaded = true;
            }
        });

    });
