'use strict';

angular.module('dmpApp')
    .factory('DataModelGen', ['GUID', 'Lo-Dash', function(GUID, loDash) {

        var notNull = function notNull(thing) {
            return thing !== null;
        };

        var genFunctions = (function(){
            var idMap = {};

            function getId(functionDsl, functionName) {
                var key = functionDsl + '##' + functionName;
                if (idMap.hasOwnProperty(key)) {
                    return idMap[key];
                }
                var id = GUID.uuid4();
                idMap[key] = id;

                return id;
            }

            return function genFunctions(payload) {
                return {
                    id: getId(payload.dsl, payload.reference)
                };
            };
        })();

        function genParamMappings(params, parameters) {
            var paramsMap = {};
            angular.forEach(params, function(val, key) {
                if (val.data) {
                    paramsMap[key] = val.data;
                }
            });

            if (parameters) {
                angular.forEach(parameters, function(val, key) {
                    paramsMap[val] = key;
                });
            }

            return paramsMap;
        }

        function genComponent(component, parameters, previous) {
            /* jshint camelcase:false */
            var uuid = GUID.uuid4(),
                params = genParamMappings(component.payload.parameters, parameters),
                comp = {
                    id: uuid,
                    name: component.payload.name,
                    description: component.payload.description,
                    'function': genFunctions(component.payload)
                };

            if (angular.isDefined(previous)) {
                comp.input_components = [{
                    id: previous.id
                }];

                var output = previous.output_components || [];
                output.push({
                    id: uuid
                });
                previous.output_components = output;
            }

            comp.parameter_mappings = params;
            return comp;
        }

        function genAttribPath(component) {
            return {
                id: component.payload.path,
                name: component.payload.name
            };
        }


        function DataModelGen(components) {
            // shared mutable resources, beware!
            /* jshint camelcase:false */
            this.components_ = components;
        }

        DataModelGen.prototype.getScope = function getScope(tab) {
            /* jshint camelcase:false */
            var id = tab.id,
                scp = this.components_[id];

            if (!scp) {
                return null;
            }

            return scp;
        };

        DataModelGen.prototype.genTransformation = function genTransformation(tab) {
            var uuid = GUID.uuid4(),
                scp = this.getScope(tab);

            if (!scp) {
                return null;
            }

            // this must be per component
            var parameters = {
                transformationInputString: 'inputString'
            };
            return {
                id: uuid,
                name: tab.title,
                description: tab.title,
                parameters: loDash.keys(parameters),
                components: loDash.foldl(scp.components, function(acc, c) {
                    acc.push(genComponent(c, acc.length? {'previousComponent.outputString': 'inputString'} :parameters, loDash.last(acc)));
                    return acc;
                }, [])
            };
        };

        DataModelGen.prototype.genMapping = function genMapping(tab) {
            /* jshint camelcase:false */
            var scp = this.getScope(tab),
                transformation = this.genTransformation(tab),
                id = GUID.uuid4();

            return {
                id: id,
                name: transformation.name,
                transformation: transformation,
                input_attribute_paths: [
                    genAttribPath(scp.source)
                ],
                output_attribute_path: genAttribPath(scp.target)
            };
        };

        DataModelGen.prototype.genJob = function genJob(tabs) {
            var mappings = loDash(tabs).map(this.genMapping, this).filter(notNull).valueOf();
            return {
                id: GUID.uuid4(),
                mappings: mappings
            };
        };


        return DataModelGen;

    }]);
