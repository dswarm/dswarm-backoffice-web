'use strict';

angular.module('dmpApp')
    .controller('DataSelectorCtrl', function($scope, PubSub) {

        $scope.internalName = 'Data Selector Widget';

        $scope.dataSelectorShouldBeOpen = false;
        $scope.result = {};

        $scope.selectedSet = [];

        $scope.opts = {
            backdropFade: true,
            dialogFade: true,
            triggerClass: 'really in'
        };

        $scope.onSelectClick = function() {
            PubSub.broadcast('handleDataSelected', $scope.selectedSet[0]);
            $scope.dataSelectorShouldBeOpen = false;
        };

        $scope.close = function() {
            $scope.dataSelectorShouldBeOpen = false;
        };

        PubSub.subscribe($scope, 'handleOpenDataSelector', function() {
            $scope.dataSelectorShouldBeOpen = true;
        });

    })
    .directive('dataselector', function() {
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'views/directives/data-selector.html',
            controller: 'DataSelectorCtrl'
        };
    });
