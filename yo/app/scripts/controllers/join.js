'use strict';

angular.module('dmpApp')
    .controller('JoinCtrl', function($scope) {

        $scope.joinItems = [
            {name: 'Insert Mapper', action: 'mapper'}
        ];

        $scope.mappingComponents = [];


        var mappingComponentFactory = (function() {
            var globalCounter = {};

            function getId(name) {
                return globalCounter.hasOwnProperty(name) ? ++globalCounter[name] : (globalCounter[name] = 0);
            }

            /**
             * @return {{description: String, name: String}}
             */
            function MappingComponentFactory(name) {
                switch (name) {
                case 'mapper':
                    var nextId = getId(name)
                      , componentId = name + '-' + nextId;
                    return {
                        description: 'a fine Join Mapper',
                        name: 'Join Mapper ' + (nextId + 1),
                        id: componentId,
                        data: {
                            name: 'mapper.' + componentId
                        }
                    };
                default:
                    return null;
                }
            }
            return MappingComponentFactory;
        })();


        $scope.joinItem = function (action) {
            var component = mappingComponentFactory(action);
            if (component) {
                $scope.mappingComponents.push(component);
                $scope.hasMappingComponents = true;
            }
        };

    });
