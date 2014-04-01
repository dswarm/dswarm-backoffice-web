'use strict';

angular.module('dmpApp')
    .controller('SourceDataCtrl', function ($scope, schemaParser, DataModelResource, PubSub, loDash) {
        $scope.internalName = 'Source Data Widget';

        $scope.data = {};
        $scope.records = [];
        $scope.schema = {};

        $scope.showData = false;

        $scope.resourceName = '';

        $scope.selectedTab = 0;

        $scope.selectTab = function(tab) {
            $scope.selectedTab = tab;
        };

        $scope.dataInclude = function() {
            return $scope.showData ? 'sourcedata' : '';
        };

        $scope.loadData = function(dataModel) {

            if (loDash.isEmpty(dataModel) || loDash.isEmpty(dataModel.schema)) {
                return;
            }

            function getSchema(record) {
                return schemaParser.parseFromDomainSchema(record, dataModel.schema);
            }

            $scope.schema = dataModel.schema;
            $scope.resourceName = dataModel.name;

            DataModelResource.data({

                id: dataModel.id,
                atMost: 3

            }, function(dataResult) {

                $scope.records = loDash.map(dataResult, function (record) {
                    return {
                        id: record.recordId,
                        data: getSchema(record)
                    };
                });

                $scope.showData = true;
            });
        };

        function init() {
            $scope.loadData($scope.project.input_data_model);
        }
        init();
        PubSub.subscribe($scope, ['inputDataSelected', 'projectDraftDiscarded', 'projectModelChanged', 'changeOutputModel'], init);

        PubSub.subscribe($scope, 'getLoadData', function() {

            PubSub.broadcast('returnLoadData', {
                record : $scope.records[0],
                schema : $scope.schema
            });

        });
    })
    .directive('sourceData', function () {
        return {
            scope : true,
            restrict: 'E',
            replace: true,
            templateUrl: 'views/directives/source-data.html',
            controller: 'SourceDataCtrl'
        };
    });
