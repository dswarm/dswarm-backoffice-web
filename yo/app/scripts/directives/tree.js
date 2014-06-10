'use strict';

angular.module('dmpApp')
    .controller('TreeCtrl', function($scope, $timeout, PubSub) {

        /* jshint camelcase:false */

        $scope.isSource = $scope.$parent && $scope.$parent.isSource;
        $scope.isTarget = $scope.$parent && $scope.$parent.isTarget;

        if (typeof $scope.$parent.layer === 'undefined') {
            $scope.layer = 1;
        } else {
            $scope.layer = parseInt($scope.$parent.layer, 10) + 1;
        }

        if ($scope.$parent && $scope.$parent.project && $scope.$parent.project && Object.keys($scope.$parent.project).length > 0) {
            $scope.project = $scope.$parent.project;
        }

        if ($scope.$parent && $scope.$parent.name) {
            $scope.parentName = $scope.$parent.name;
        } else {
            $scope.parentName = $scope.name;
        }

        $scope.update = $scope.$parent && $scope.$parent.update;

        $scope.jspSourceOptions = {
            scope: 'schema',
            container: 'schema',
            anchor: ['Continuous', { faces: ['top'] } ],
            endpoint: ['Dot', {
                radius: 5,
                cssClass: 'source-endpoint source-endpoint-tree'
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

        $scope.jspTargetOptions = {
            scope: 'schema',
            container: 'schema',
            anchor: ['Continuous', { faces: ['top'] } ],
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

        $scope.chevron = function(data) {
            if (data.children && data.children.length) {
                return 'glyphicon-chevron-' + (data.$show ? 'down' : 'right');
            }
        };

        $scope.getTooltipPlacement = function(alternatePositions) {

            if($scope.position.left < $scope.position.width ) {
                return (alternatePositions.left) ? alternatePositions.left : 'right';
            }
            if($scope.position.left + $scope.position.width + 50 > $scope.position.windowwidth) {
                return (alternatePositions.right) ? alternatePositions.right : 'left';
            }

            return (alternatePositions.default) ? alternatePositions.default : 'top';

        };

        $scope.isExpanded = function(data) {
            return (data.$show ? true : false);
        };

        $scope.isTempoDisabled = function() {
            return $scope.layer >= 3;
        };

        $scope.layerClass = function() {
            return 'layer' + $scope.layer;
        };

        $scope.handleClick = function(evt, data) {
            if ($scope.isLeaf(data) && !$scope.isTempoDisabled()) {
                $scope.$emit('leafClicked', {
                    event: evt,
                    data: data
                });
            }
        };

        $scope.onFilterKeyClick = function(data) {
            console.log(data);
            if (angular.isDefined(data._$path_id)) {
                PubSub.broadcast('FilterKeySelected', {
                    id: data.id,
                    attribute_path_id: data._$path_id,
                    name: data.name,
                    uri: data.uri
                });
            }

        };

        $scope.expandCollapse = function(data) {
            data.$show = $scope.isLeaf(data) || !data.$show;

            $timeout(function() {
                PubSub.broadcast('schemaCanvasUpdated', {});
            }, 0);
        };

        $scope.isLeaf = function(data) {
            return data.leaf || !data.children || !data.children.length;
        };

    })
    .directive('tree', function($compile) {
        return {
            restrict: 'E',
            scope: {
                data: '=',
                onLeafClick: '&',
                name: '=',
                resId: '@',
                confId: '@'
            },
            replace: true,
            templateUrl: 'views/directives/tree.html',
            controller: 'TreeCtrl',
            compile: function(tElement, tAttrs) {
                var contents = tElement.contents().remove()
                    , compiledContents
                    , isInternal = angular.isDefined(tAttrs.internal);

                return function(scope, iElement) {
                    if (!compiledContents) {
                        compiledContents = $compile(contents);
                    }

                    scope.position = $(iElement).offset();
                    scope.position.width = $(iElement).width();
                    scope.position.windowwidth = $( window ).width();

                    if (!isInternal) {
                        scope.$on('leafClicked', function(evt, data) {
                            evt.stopPropagation();
                            evt.preventDefault();

                            scope.onLeafClick(data);
                        });

                        scope.isSource = angular.isDefined(tAttrs.asSource);
                        scope.isTarget = angular.isDefined(tAttrs.asTarget);

                    }

                    compiledContents(scope, function(clone) {
                        iElement.append(clone);
                    });
                };
            }
        };
    });
