angular.module('dmpApp')
    .controller('JoinCtrl', ['$scope', function($scope) {

        $scope.joinItems = [
            {name:'Insert Mapper',action:'mapper'}
        ];

        $scope.mappingComponents = [];


        var MappingComponentFactory = (function() {
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
                        var nextId = getId(name);
                        return {
                            description: 'a fine Join Mapper',
                            name: 'Join Mapper ' + (nextId + 1),
                            id: name = '-' + nextId
                        };
                        break;
                    default:
                        return null;
                        break;
                }
            }
            return MappingComponentFactory;
        })();



        $scope.joinItem = function (action) {
            var component = MappingComponentFactory(action);
            if (component) {
                $scope.mappingComponents.push(component);
                $scope.hasMappingComponents = true;
            }
        };

//        $scope.joinItem('mapper');

    }]);
