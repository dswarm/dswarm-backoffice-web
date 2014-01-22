'use strict';

angular.module('dmpApp')
    .controller('ModelCtrl', ['$scope', '$routeParams', '$timeout', 'localStorageService', 'ProjectResource', 'schemaParser', 'PubSub',
    function($scope, $routeParams, $timeout, localStorageService, ProjectResource, schemaParser, PubSub) {

        /* jshint camelcase:false */

        $scope.projectId = $routeParams.projectId;

        // Mock project data for angular data handling
        $scope.project = {
            id : 0,
            name : '',
            description : '',
            mappings : [],
            functions : [],
            input_data_model : {},
            _$input_data_model_schema : {},
            output_data_model : {},
            _$output_data_model_schema : {}
        };

        $scope.isOutputDataModelLoaded = false;

        function getStorageDraftKey(projectId) {
            return 'project.draft.' + (projectId || $scope.project.id);
        }


        $scope.setOutputDataModel = function(dataModel) {
            $scope.project.output_data_model = dataModel;

            $scope.processOutputDataModel();
        };

        $scope.setOutputSchema = function(schema) {
            $scope.setOutputDataModel({schema: schema});
        };

        $scope.processOutputDataModel = function() {
            $scope.project._$output_data_model_schema = $scope.dataModelToSchema($scope.project.output_data_model);

            $scope.isOutputDataModelLoaded = true;

            PubSub.broadcast('outputDataSelected', {});
        };

        $scope.processInputDataModel = function() {
            $scope.project._$input_data_model_schema = $scope.dataModelToSchema($scope.project.input_data_model);

            PubSub.broadcast('inputDataSelected', { });
        };

        $scope.dataModelToSchema = function(dataModel) {
            return schemaParser.fromDomainSchema(dataModel.schema);
        };

        $scope.loadProjectData = function(projectId) {

            var draft = localStorageService.get(getStorageDraftKey(projectId));
            if (angular.isObject(draft) && +draft.id === +projectId) {

                $scope.restoreProject(draft);
            } else {

                ProjectResource.get({id: projectId}, function(project) {

                    $scope.restoreProject(project);
                });
            }
        };

        $scope.restoreProject = function(project) {

            $scope.project = project;

            if($scope.project.input_data_model) {
                $scope.processInputDataModel();
            }

            if($scope.project.output_data_model) {
                $scope.processOutputDataModel();
            }

        };

        /**
         * Eliminates keys, that start with '$' (angular internal stuff)
         * and '_$' (dmp internal stuff)
         *
         * @param key
         * @param value
         * @returns {*}
         */
        function toJsonReplacer(key, value) {
            var val = value;

            if (typeof key === 'string' && (key.charAt(0) === '$' || (key.charAt(0) === '_' && key.charAt(1) === '$'))) {
                val = undefined;
            } else if (angular.isWindow(value)) {
                val = '$WINDOW';
            } else if (value &&  document === value) {
                val = '$DOCUMENT';
            } else if (value && value.$evalAsync && value.$watch) {
                val = '$SCOPE';
            }

            return val;
        }


        /**
         * Serializes input into a JSON-formatted string.
         * Properties with leading $ or _$ will be stripped.
         *
         * Do not use this for drafts/saving into local storage but for
         * serializing an object before sending it over the wire.
         *
         * @param {Object|Array|Date|string|number} obj Input to be serialized into JSON.
         * @param {boolean=} pretty If set to true, the JSON output will contain newlines and whitespace.
         * @returns {string|undefined} JSON-ified string representing `obj`.
         */
        $scope.toJson = function(obj, pretty) {
            if (typeof obj === 'undefined') {
                return undefined;
            }
            return JSON.stringify(obj, toJsonReplacer, pretty ? '  ' : null);
        };


        $scope.onSaveProjectClick = function() {
            localStorageService.delete(getStorageDraftKey());
            ProjectResource.update({ id: $scope.project.id }, $scope.project, function() { });
        };

        $scope.saveProjectDraft = function(project) {
            var projectToSave = project || $scope.project;
            localStorageService.set(getStorageDraftKey(projectToSave.id), projectToSave);
            console.log('Project changed: ', projectToSave);
        };

        $scope.$watch('project', function(newValue, oldValue) {
            if (newValue === oldValue) {
                // initial call after registration
                return;
            }
            $scope.saveProjectDraft(newValue);
        }, true);

        $scope.loadProjectData($routeParams.projectId);

    }]);
