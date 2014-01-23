'use strict';

angular.module('dmpApp')
    .controller('ModelCtrl', ['$scope', '$routeParams', '$timeout', 'localStorageService', 'ProjectResource', 'schemaParser', 'PubSub', 'Lo-Dash',
    function($scope, $routeParams, $timeout, localStorageService, ProjectResource, schemaParser, PubSub, loDash) {

        /* jshint camelcase:false */

        $scope.alerts = [];

        $scope.projectId = $routeParams.projectId;
        $scope.projectIsDraft = false;

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

        $scope.$project_saved_state =  {};

        $scope.isOutputDataModelLoaded = false;

        $scope.closeAlert = function(idx) {
            $scope.alerts.splice(idx);
        };

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

        //====================================
        // Custom JSON serializing
        //====================================

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
            } else if (value) {
                if (value.document && value.location && value.alert && value.setInterval) {
                    val = '$WINDOW';
                } else if (document === value) {
                    val = '$DOCUMENT';
                } else if (value.$evalAsync && value.$watch) {
                    val = '$SCOPE';
                }
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


        //====================================
        // Project drafting
        //====================================

        function getStorageDraftKey(projectId) {
            return 'project.draft.' + (projectId || $scope.project.id);
        }

        function loadProjectData(projectId, cb) {
            var callback = angular.isFunction(cb) ? cb : angular.identity,
                draft = localStorageService.get(getStorageDraftKey(projectId));

            if (angular.isObject(draft) && +draft.id === +projectId) {

                $scope.projectIsDraft = true;

                callback();
                restoreProject(draft);
            } else {

                ProjectResource.get({id: projectId}, function(project) {

                    callback();
                    restoreProject(project);
                });
            }
        }

        function restoreProject(project) {

            $scope.project = project;

            if($scope.project.input_data_model) {
                $scope.processInputDataModel();
            }

            if($scope.project.output_data_model) {
                $scope.processOutputDataModel();
            }

            PubSub.broadcast('projectModelChanged');

        }

        function saveProjectDraft(project) {

            var projectToSave = project || $scope.project;
            $scope.projectIsDraft = true;

            localStorageService.set(getStorageDraftKey(projectToSave.id), projectToSave);

            console.log('Project changed: ', projectToSave);
        }

        function discardProjectDraft(projectId) {

            localStorageService.remove(getStorageDraftKey(projectId));
            PubSub.broadcast('projectDraftDiscarded');
        }

        $scope.onSaveProjectClick = function(idx) {
            if ($scope.alerts[idx].busy) {
                return;
            }
            $scope.alerts[idx].busy = true;

            $scope.projectIsDraft = false;

            discardProjectDraft($scope.project.id);

            ProjectResource.update({ id: $scope.project.id }, $scope.toJson($scope.project), function() {
                $scope.closeAlert(idx);
            });
        };

        $scope.onDiscardDraftClick = function(idx) {
            if ($scope.alerts[idx].busy) {
                return;
            }
            $scope.alerts[idx].busy = true;

            $scope.projectIsDraft = false;
            var projectId = $scope.project.id;
            $scope.project.id = 0;

            discardProjectDraft(projectId);

            loadProjectData(projectId, function() {
                $scope.closeAlert(idx);
            });
        };

        $scope.saveProjectDraft = loDash.debounce(saveProjectDraft, 200, {
            leading: true,
            trailing: true
        });

        $scope.$watch(function() {
            return $scope.project.id + ':' + angular.toJson($scope.project);
        }, function(newValue, oldValue) {
            if (newValue === oldValue) {
                // initial call after registration
                return;
            }

            if (+oldValue.charAt(0) === 0 || +newValue.charAt(0) === 0) {
                // initial load, do not store yet
                return;
            }

            $scope.saveProjectDraft();
        }, true);

        loadProjectData($routeParams.projectId);

    }]);
