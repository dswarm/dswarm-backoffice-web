'use strict';

angular.module('dmpApp')
    .controller('ExportCtrl', function($scope, DataModelResource, fileDownload, loDash, Neo4jEndpoint, ApiEndpoint) {

        $scope.models = [];
        $scope.selectedModel = [];
        $scope.exportUri = '';

        $scope.onExportAllClick = function(format) {
            var fileUrl = Neo4jEndpoint + 'rdf/getall?format=' + encodeURIComponent(format);

            fileDownload(fileUrl);
        };

        $scope.onExportModelClick = function(format) {

            var fileUrl = ApiEndpoint + 'datamodels/' + $scope.selectedModel[0].id + '/export?format=' + encodeURIComponent(format);

            fileDownload(fileUrl);

        };

        $scope.updateGridData = function() {

            DataModelResource.query(function(results) {

                $scope.models = results;

                $scope.models = loDash.map($scope.models, function(result) {

                    result['storage_type'] = result.configuration && result.configuration.parameters['storage_type'];

                    return result;
                });
            }, function() {
                $scope.models = '';
            });

        };

        $scope.modelListOptions = {
            data: 'models',
            columnDefs: [
                {field: 'name', displayName: 'Name'},
                {field: 'description', displayName: 'Description '},
                {field: 'storage_type', displayName: 'Configured Data Storage Type'}
            ],
            enableColumnResize: false,
            selectedItems: $scope.selectedModel,
            multiSelect: false
        };

        $scope.updateGridData();

    });
