'use strict';

angular.module('dmpApp')
    .controller('MappingComponentController', ['$scope', 'PubSub', function($scope, PubSub) {

        var incomingPool = {},
            outgoingPool = {};

        $scope.onEditClicked = function() {

            PubSub.broadcast('handleOpenMappingComponentConfig', [incomingPool, outgoingPool]);

        };

        PubSub.subscribe($scope, 'connectionSelected', function(data) {

            if($(data.targetData).attr('id') === $scope.id) {
                incomingPool[data.id] = data;
            }

            if($(data.sourceData).attr('id') === $scope.id) {
                outgoingPool[data.id] = data;
            }

        });

    }])
    .directive('mappingComponent', function() {

        return {
            restrict: 'E',
            scope: {
                options: '='
            },
            replace: true,
            controller: 'MappingComponentController',
            templateUrl: 'views/directives/mapping-component.html',
            link: function(scope) {
                angular.extend(scope, scope.options);
                scope.name = scope.name || '(Unknown)';

                scope.jspSourceOptions = {
                    scope: 'schema',
                    container: 'schema',
                    anchor: 'Continuous',
                    endpoint: ['Dot', {
                        radius: 5,
                        cssClass: 'source-endpoint'
                    }],
                    connectorOverlays: [
                        ['Arrow', {
                            location: 1,
                            width: 10,
                            length: 12,
                            foldback: 0.75
                        }]
                    ],
                    connector: 'StateMachine',
                    connectorStyle: {
                        strokeStyle: 'black',
                        lineWidth: 3
                    },
                    paintStyle: {
                        fillStyle: 'black',
                        lineWidth: 3
                    }
                };

                scope.jspTargetOptions = {
                    scope: 'schema',
                    container: 'schema',
                    anchor: 'Continuous',
                    endpoint: ['Dot', {
                        radius: 5,
                        cssClass: 'transparent'
                    }],
                    connector: 'StateMachine',
                    connectorStyle: {
                        strokeStyle: 'black',
                        lineWidth: 3
                    },
                    paintStyle: {
                        fillStyle: 'transparent',
                        lineWidth: 3
                    },
                    dropOptions: {
                        hoverClass: 'mapping-droppable'
                    }
                };
            }

        };

    });
