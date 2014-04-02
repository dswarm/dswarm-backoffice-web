'use strict';

angular.module('dmpApp')
    .controller('SchemaListCtrl', function ($scope, DataModelResource, Util) {

        $scope.files = [];

	DataModelResource.query(function(results) {

	    //noinspection FunctionWithInconsistentReturnsJS
	    $scope.files = Util.collect(results, function(dataModel) {
		var schema = dataModel.schema;
		if (schema && schema['attribute_paths'] && schema['attribute_paths'].length) {

		    dataModel._$name = schema['name'] + ' (' + dataModel['name'] + ')';
		    dataModel._$description = schema['attribute_paths'].length + ' attribute paths, record class: ' + (schema['record_class'] || {}).name;

		    return dataModel;
		}
            });
	});

        $scope.schemaListOptions = {
            data: 'files',
            columnDefs: [
		{field:'_$name', displayName:'Name'},
                {field:'_$description', displayName:'Description '}
            ],
            enableColumnResize: false,
            selectedItems: $scope.items,
            multiSelect: false
        };


    })
    .directive('schemalist', function () {
        return {
            replace: false,
            restrict: 'E',
            scope: {
                items: '='
            },
            templateUrl: 'views/directives/schema-list.html',
            controller: 'SchemaListCtrl'
        };
    });
