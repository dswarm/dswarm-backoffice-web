/**
 * Copyright (C) 2013 – 2015  SLUB Dresden & Avantgarde Labs GmbH (<code@dswarm.org>)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

angular.module('dmpApp')
    .factory('dataConfigText', function ($q, ngProgress, DataModelResource, ResourceResource, GUID, Util) {

        function newTextConfig(mode, resourceId, dataModelId, configType) {

            var defer = $q.defer();

            if (mode === 'create' && resourceId) {

                ResourceResource.get({ id: resourceId }, Util.mapResources(function(result, configFromResource) {
                    var config = {
                        parameters: {
                            'storage_type': configType
                        }
                    };
                    if (applicableAsPlaceholder(configFromResource, configType)) {
                        config.name = configFromResource.name;
                        config.description = configFromResource.description;
                        config.parameters = configFromResource.parameters;
                    }
                    defer.resolve({
                        resource: result,
                        config: config
                    });
                }), defer.reject);

            } else if (mode === 'edit' && dataModelId) {

                DataModelResource.get({id: dataModelId }, function(result) {
                    defer.resolve({
                        resource: result.data_resource,
                        dataModel: result,
                        resourceId: result.data_resource.uuid,
                        config: result.configuration
                    });
                }, defer.reject);

            } else {

                defer.reject('Invalid mode, must be one of (create|edit), got ' + mode + ' instead.');
            }

            return defer.promise;
        }

        function applicableAsPlaceholder(config, configType) {
            return config !== null && config.parameters['storage_type'] === configType;
        }

        var savingPromise;

        function save(mode, resource, dataModel, config) {
            if (savingPromise) {
                return savingPromise.promise;
            }
            savingPromise = $q.defer();
            ngProgress.start();

            if(!config.uuid) {
                config.uuid = GUID.uuid4();
            }

            if (mode === 'create' && resource !== null) {

                var model = {
                    'data_resource': resource,
                    'name': dataModel.name,
                    'description': dataModel.description,
                    'configuration': config,
                    'uuid': GUID.uuid4()
                };

                DataModelResource.save({}, model, function() {
                    ngProgress.complete();
                    savingPromise.resolve({});
                    savingPromise = null;
                }, function(error) {
                    ngProgress.complete();
                    savingPromise.reject(error);
                    savingPromise = null;
                });

            } else if (mode === 'edit' && dataModel !== null) {

                dataModel.configuration = config;

                DataModelResource.update({id: dataModel.uuid}, dataModel, function() {
                    ngProgress.complete();
                    savingPromise.resolve({});
                    savingPromise = null;
                }, function(error) {
                    ngProgress.complete();
                    savingPromise.reject(error);
                    savingPromise = null;
                });
            }

            return savingPromise.promise;
        }

        return {
            newTextConfig: newTextConfig,
            save: save
        };
    });
