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
                // TODO: load from funtions instead of generating
                return {
                    'function_description': payload,
                    name: payload.name,
                    parameters: loDash.keys(payload.parameters),
                    type: 'Function'
                };
            };
        })();

        function genParamMappings(params) {
            var paramsMap = {};
            angular.forEach(params, function(val, key) {
                if (val.data) {
                    paramsMap[key] = val.data + '';
                }
            });

            return paramsMap;
        }

        function genComponent(component, previous) {
            /* jshint camelcase:false */
            var comp = {
                name: component.payload.name,
                description: component.payload.description,
                'function': genFunctions(component.payload)
            };

            comp.parameter_mappings = genParamMappings(component.payload.parameters);

            if (angular.isDefined(previous)) {
                comp.input_components = [previous];

                var output = previous.output_components || [];
                output.push(comp);
                previous.output_components = output;
            }

            return comp;
        }

        function genAttribPath(component) {
            // TODO: copy this from schema instead of generating
            return {
                attributes: [{
                    id: component.payload.path,
                    name: component.payload.name
                }]
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
            var scp = this.getScope(tab);

            if (!scp) {
                return null;
            }

            return {
                name: tab.title,
                'function': {
                    name: 'transformation',
                    type: 'Transformation',
                    components: loDash.foldl(scp.components, function(acc, c) {
                        acc.push(genComponent(c, loDash.last(acc)));
                        return acc;
                    }, [])
                }
            };
        };

        DataModelGen.prototype.genMapping = function genMapping(tab) {
            /* jshint camelcase:false */
            var scp = this.getScope(tab),
                transformation = this.genTransformation(tab);

            return {
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
                mappings: mappings
            };
        };

        DataModelGen.prototype.genTask = function genTask(tabs, inputModel, outputModel) {
            /* jshint camelcase:false */
            return {
                input_data_model: inputModel,
                output_data_model: outputModel,
                job: this.genJob(tabs)
            };
        };


        return DataModelGen;

    }]);
