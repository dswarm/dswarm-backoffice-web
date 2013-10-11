'use strict';

angular.module('dmpApp')
    .controller('TargetSchemaSelectorCtrl', ['$scope','$http', '$q', 'schemaParser', 'PubSub', function ($scope, $http, $q, schemaParser, PubSub) {

        $scope.internalName = 'Target Schema Selector Widget';

        $scope.targetSchemaSelectorShouldBeOpen = false;
        $scope.result = {};

        $scope.selectedSet = [];

        $scope.opts = {
            backdropFade: true,
            dialogFade:true,
            triggerClass: 'really in'
        };

        $scope.onSelectClick = function() {
            PubSub.broadcast('handleTargetSchemaSelected', $scope.selectedSet[0]);
            $scope.targetSchemaSelectorShouldBeOpen = false;
        };

        $scope.close = function () {
            $scope.targetSchemaSelectorShouldBeOpen = false;
        };

        PubSub.subscribe($scope, 'handleOpenTargetSchemaSelector', function() {
            $scope.targetSchemaSelectorShouldBeOpen = true;
        });



    }])
    .directive('targetSchemaSelector', function () {

        return {
            restrict: 'E',
            replace: true,
            scope: true,
            templateUrl: 'views/directives/target-schema-selector.html',
            controller: 'TargetSchemaSelectorCtrl'
        };
    });
