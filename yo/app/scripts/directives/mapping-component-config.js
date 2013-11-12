'use strict';

angular.module('dmpApp')
    .controller('MappingComponentConfigCtrl', ['$scope', 'PubSub', function ($scope, PubSub) {

        $scope.internalName = 'Mapping Component Config Widget';

        $scope.mappingComponentConfigShouldBeOpen = false;

        $scope.incomingPool = {};
        $scope.outgoingPool = {};

        $scope.selectedSet = [];

        $scope.opts = {
            backdropFade: true,
            dialogFade: true,
            triggerClass: 'really in'
        };

        $scope.onSelectClick = function() {
            $scope.targetSchemaSelectorShouldBeOpen = false;
        };

        $scope.close = function () {
            $scope.mappingComponentConfigShouldBeOpen = false;
        };

        function addIncoming(data) {

            if(!$scope.incomingPool[data.$$hashKey]) {
                $scope.incomingPool[data.$$hashKey] = [];
            }

            $scope.incomingPool[data.$$hashKey].push(data);
        }

        PubSub.subscribe($scope, 'handleOpenMappingComponentConfig', function(mappings) {

            $scope.incomingPool = {};
            $scope.outgoingPool = {};

            $scope.mappingComponentConfigShouldBeOpen = true;

            angular.forEach(mappings[0], function(value){
                addIncoming(value.sourceData);
            });

            $scope.outgoingPool = mappings[1];



        });



    }])
    .directive('mappingComponentConfig', function () {

        return {
            restrict: 'E',
            replace: true,
            scope: true,
            templateUrl: 'views/directives/mapping-component-config.html',
            controller: 'MappingComponentConfigCtrl'
        };
    });
