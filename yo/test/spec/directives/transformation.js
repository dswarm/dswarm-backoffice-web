'use strict';

describe('Directive: Transformation', function () {
    var element, scope, $rootScope, $compile, $timeout, $httpBackend;
    var elementHtml = '<transformation></transformation>';

    var project, schema, attributePaths, data_resource, configuration, gridsterOpts, mockedFunctions;


    function cleanPath(path) {
        var ip = angular.copy(path);
        var id = ip.id;

        var expectedId = -new Date();

        expect(Math.abs(id - expectedId)).toBeGreaterThan(-1);
        expect(Math.abs(id - expectedId)).toBeLessThan(10);

        delete ip.id;
        return ip;
    }

    function getMappingWithPath(attributePaths, selector, specs) {
        var paths = _.filter(attributePaths, selector);
        var mapping = angular.extend({
            type: 'MappingAttributePathInstance',
            name: 'input mapping attribute path instance'
        }, specs || {});
        mapping.attribute_path = paths[0];

        return mapping;
    }

    beforeEach(function() {

        configuration = {
            "id": 11,
            "name": "xml",
            "description": "xml with id 13",
            "resources": [
                {
                    "id": 13
                }
            ],
            "parameters": {
                "storage_type": "xml",
                "record_tag": "datensatz"
            }
        };
        data_resource = {
            "id": 13,
            "name": "test-mabxml.xml",
            "description": "MABxml",
            "type": "FILE",
            "configurations": [configuration],
            "resource_attributes": {
                "path": "/home/dmp/tmp/tmp/resources/test-mabxml.xml",
                "filesize": -1
            }
        };

        attributePaths = [
            {
                "id": 33,
                "attributes": [
                    {
                        "id": 21,
                        "name": "mabVersion",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#mabVersion"
                    }
                ]
            },
            {
                "id": 34,
                "attributes": [
                    {
                        "id": 22,
                        "name": "typ",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#typ"
                    }
                ]
            },
            {
                "id": 35,
                "attributes": [
                    {
                        "id": 23,
                        "name": "status",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#status"
                    }
                ]
            },
            {
                "id": 5,
                "attributes": [
                    {
                        "id": 5,
                        "name": "type",
                        "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
                    }
                ]
            },
            {
                "id": 28,
                "attributes": [
                    {
                        "id": 17,
                        "name": "feld",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld"
                    },
                    {
                        "id": 18,
                        "name": "nr",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr"
                    }
                ]
            },
            {
                "id": 27,
                "attributes": [
                    {
                        "id": 17,
                        "name": "feld",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld"
                    },
                    {
                        "id": 5,
                        "name": "type",
                        "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
                    }
                ]
            },
            {
                "id": 26,
                "attributes": [
                    {
                        "id": 17,
                        "name": "feld",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld"
                    }
                ]
            },
            {
                "id": 32,
                "attributes": [
                    {
                        "id": 17,
                        "name": "feld",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld"
                    },
                    {
                        "id": 20,
                        "name": "tf",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#tf"
                    },
                    {
                        "id": 5,
                        "name": "type",
                        "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
                    }
                ]
            },
            {
                "id": 31,
                "attributes": [
                    {
                        "id": 17,
                        "name": "feld",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld"
                    },
                    {
                        "id": 20,
                        "name": "tf",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#tf"
                    }
                ]
            },
            {
                "id": 30,
                "attributes": [
                    {
                        "id": 17,
                        "name": "feld",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld"
                    },
                    {
                        "id": 14,
                        "name": "value",
                        "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#value"
                    }
                ]
            },
            {
                "id": 29,
                "attributes": [
                    {
                        "id": 17,
                        "name": "feld",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld"
                    },
                    {
                        "id": 19,
                        "name": "ind",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind"
                    }
                ]
            }
        ];
        schema = {
            id: 20,
            attribute_paths: attributePaths,
            record_class: {
                id: 3,
                name: "datensatzType",
                uri: "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#datensatzType"
            }
        };
        project = {
            "id": 28,
            "name": "Workshop",
            "mappings": [],
            "functions": [],
            "input_data_model": {
                "id": 28,
                "name": "test-mabxml.xml",
                "description": "MABxml",
                "configuration": configuration,
                "schema": schema,
                "data_resource": data_resource
            },
            "output_data_model": {
                "schema": schema
            }
        };
        gridsterOpts = {
            margins: [20, 20],
            draggable: {
                enabled: true
            },
            resizable: {
                enabled: false
            },
            mobileBreakPoint : 100,
            minRows : 0,
            maxRows : 0
        };
    });

    var connectionSources = [{
        id: 42,
        name: 'feld.nr',
        path: [17, 18]
    }, {
        id: 43,
        name: 'feld.type',
        path: [17, 5]
    }, {
        id: 43,
        name: 'feld.type',
        path: [17, 5]
    }];
    var connectionTargets = [{
        id: 1337,
        name: 'feld.value',
        path: [17, 14]
    },{
        id: 1338,
        name: 'feld.ind',
        path: [17, 19]
    },{
        id: 1338,
        name: 'feld.ind',
        path: [17, 19]
    }];
    var additionalTargets = [ [], [],
        [{
            id: 1339,
            name: 'feld.additional',
            path: [22]
        }]
    ];

    var connectionDatas = _.map(_.zip(connectionSources, connectionTargets, additionalTargets), function(sourceTargetAdditional, idx) {
        var source = sourceTargetAdditional[0],
            target = sourceTargetAdditional[1],
            additionalTargets = sourceTargetAdditional[2];

        return {
            internal_id: source.id + ':' + target.id,
            connection_id: source.path + ':' + target.path,
            mapping_id: 13 + idx,
            name: 'testMapping',
            inputAttributePath: source,
            outputAttributePath: target,
            additionalInput: additionalTargets
        };
    });


    beforeEach(module('dmpApp'));

    beforeEach(module('dmpApp', 'mockedFunctions'));

    beforeEach(module(function($provide) {
        $provide.value('ApiEndpoint', 'foo/');
    }));

    beforeEach(inject(function($injector) {

        $rootScope = $injector.get('$rootScope');
        $compile = $injector.get('$compile');
        $timeout = $injector.get('$timeout');
        $httpBackend = $injector.get('$httpBackend');

        $injector.get('$templateCache').put('views/directives/transformation.html', '<div></div>');

        mockedFunctions = $injector.get('mockFunctionsJSON');

        scope = $rootScope.$new();
        scope.project = project;
        scope.gridsterOpts = gridsterOpts;
        scope.alerts = [];

        var _element = angular.element(elementHtml);
        element = $compile(_element)(scope);
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingRequest();
        $httpBackend.verifyNoOutstandingExpectation();
    });

    it('should initialize the controller', function() {
        scope.$digest();
        var elScope = element.scope();

        expect(elScope.internalName).toBe('Transformation Logic Widget');
        expect(elScope.activeMapping).toEqual({});
        expect(elScope.tabs).toEqual([]);
    });

    it('should show the draft banner if the current project is a draft', function() {
        scope.projectIsDraft = true;

        scope.$digest();
        var elScope = element.scope();

        expect(elScope.alerts.length).toBe(1);
        expect(elScope.alerts[0]).toEqual({ type: 'info', discard: true, save: true, msg: 'I opened an unsaved draft for you to continue working where you left off.' });
    });

    it('should react to the connectionSelected Event', function() {
        scope.$digest();
        var elScope = element.scope();

        expect(project.mappings.length).toBe(0);


        var spyee = jasmine.createSpyObj('spyee', ['cb']);
        elScope.$on('tabSwitch', function(evt, data) {
            spyee.cb(data);
        });

        var data = connectionDatas[0];

        $rootScope.$broadcast('connectionSelected', data);

        expect(project.mappings.length).toBe(1);
        var mapping = project.mappings[0];

        expect(mapping.id).toBe(13);
        expect(mapping._$connection_id).toBe(data.connection_id);
        expect(mapping.name).toBe(data.name);

        expect(mapping.transformation.name).toBe('transformation');
        expect(mapping.transformation.description).toBe('transformation');
        expect(mapping.transformation.function.name).toBe('transformation');
        expect(mapping.transformation.function.type).toBe('Transformation');
        expect(mapping.transformation.function.components).toEqual([]);

        var expectedInputMapping = [getMappingWithPath(attributePaths, {id: 28}, {
            name: 'input mapping attribute path instance'
        })];
        var actualInputMapping = _.map(mapping.input_attribute_paths, cleanPath);

        var expectedOutputMapping = getMappingWithPath(attributePaths, {id: 30}, {
            name: 'output mapping attribute path instance'
        });
        var actualOutputMapping = _.map([mapping.output_attribute_path], cleanPath)[0];

        expect(actualInputMapping).toEqual(expectedInputMapping);
        expect(actualOutputMapping).toEqual(expectedOutputMapping);

        expect(elScope.tabs.length).toBe(1);
        expect(elScope.tabs[0]).toEqual({
            title: data.name,
            active: true,
            id: data.mapping_id,
            mappingId: data.mapping_id
        });

        expect(spyee.cb).toHaveBeenCalledWith(data.mapping_id);
        expect(elScope.activeMapping).toBe(mapping);
    });

    it('should switch tabs when more connections are mapped', function() {
        scope.$digest();
        var elScope = element.scope();

        expect(project.mappings.length).toBe(0);


        var spyee = jasmine.createSpyObj('spyee', ['cb']);
        elScope.$on('tabSwitch', function(evt, data) {
            spyee.cb(data);
        });

        _.each(connectionDatas, function(data) {
            $rootScope.$broadcast('connectionSelected', data);
        });
        $rootScope.$broadcast('connectionSelected', connectionDatas[1]);

        expect(project.mappings.length).toBe(3);
        expect(elScope.tabs.length).toBe(3);

        var expectedPaths = [[28, 30], [27, 29], [27, 29, 34]];

        _.each(_.zip(project.mappings, connectionDatas, elScope.tabs, expectedPaths), function(mappingDataTabsPaths, idx) {
            var mapping = mappingDataTabsPaths[0],
                data = mappingDataTabsPaths[1],
                tab = mappingDataTabsPaths[2],
                paths = mappingDataTabsPaths[3];

            expect(mapping.id).toBe(13 + idx);
            expect(mapping._$connection_id).toBe(data.connection_id);
            expect(mapping.name).toBe(data.name);

            expect(mapping.transformation.name).toBe('transformation');
            expect(mapping.transformation.description).toBe('transformation');
            expect(mapping.transformation.function.name).toBe('transformation');
            expect(mapping.transformation.function.type).toBe('Transformation');
            expect(mapping.transformation.function.components).toEqual([]);

	    var expectedInputMapping;
            if(paths[2]) {
		expectedInputMapping =[getMappingWithPath(attributePaths, {id: paths[0]}, {
                    name: 'input mapping attribute path instance'
                }), getMappingWithPath(attributePaths, {id: paths[2]}, {
                    name: 'input mapping attribute path instance'
                })];

            } else {
		expectedInputMapping = [getMappingWithPath(attributePaths, {id: paths[0]}, {
                    name: 'input mapping attribute path instance'
                })];
            }

            var actualInputMapping = _.map(mapping.input_attribute_paths, cleanPath);

            var expectedOutputMapping = [getMappingWithPath(attributePaths, {id: paths[1]}, {
                name: 'output mapping attribute path instance'
            })];
            var actualOutputMapping = _.map([mapping.output_attribute_path], cleanPath);

            expect(actualInputMapping).toEqual(expectedInputMapping);
            expect(actualOutputMapping).toEqual(expectedOutputMapping);

            expect(tab).toEqual({
                title: data.name,
                active: true,
                id: data.mapping_id,
                mappingId: data.mapping_id
            });

            expect(spyee.cb).toHaveBeenCalledWith(data.mapping_id);
        });

        expect(elScope.activeMapping).toBe(project.mappings[1]);

    });

    it('should format an attribute path for display', function() {
        scope.$digest();
        var elScope = element.scope();

        expect(elScope.formatAttributePath(attributePaths[7])).toBe('feld › tf › type');
        expect(elScope.formatAttributePath()).toBe('');
        expect(elScope.formatAttributePath(false)).toBe('');
        expect(elScope.formatAttributePath({})).toBe('');
        expect(elScope.formatAttributePath({attributes: {}})).toBe('');
        expect(elScope.formatAttributePath({attributes: []})).toBe('');
    });

    it('should restore the mappings when there was a previous project', function() {

        var inputPaths = [getMappingWithPath(attributePaths, {id: 28}, {
            name: 'input mapping attribute path instance'
        })];
        var outputPaths = getMappingWithPath(attributePaths, {id: 30}, {
            name: 'output mapping attribute path instance'
        });

        var mappingId = connectionDatas[0].mapping_id;
        var mappingName = connectionDatas[0].name;

        var mapping = {
            id: mappingId,
            name: mappingName,
            input_attribute_paths: inputPaths,
            output_attribute_path: outputPaths
        };

        project.mappings = [mapping];


        scope.$digest();
        var elScope = element.scope();

        expect(elScope.tabs).toEqual([{
            title: mappingName,
            active: false,
            id: mappingId
        }]);
    });

    it('should send transformations', inject(function(Util, TaskResource, PubSub) {
        var taskResult = [
            {'foo': 'bar'}
        ];
        $httpBackend.expectPOST('foo/tasks').respond(taskResult);

        scope.$digest();
        var elScope = element.scope();

        var dataIdx = 0;
        var data = connectionDatas[dataIdx];
        $rootScope.$broadcast('connectionSelected', data);

        var payload = {
            name: data.name,
            description: 'A Transformation',
            job: {
                mappings: [project.mappings[dataIdx]]
            },
            input_data_model: project.input_data_model,
            output_data_model: project.output_data_model
        };
        var payloadJson = Util.toJson(payload);

        spyOn(TaskResource, 'execute').andCallThrough();
        spyOn(PubSub, 'broadcast');

        elScope.sendTransformation(elScope.tabs[dataIdx]);
        $httpBackend.flush();

        expect(TaskResource.execute).toHaveBeenCalledWith(payloadJson);
        // JS, Y U NO WORK?
        // Error: Expected [ { foo : 'bar' } ] to equal [ { foo : 'bar' } ]. ????

        expect(PubSub.broadcast.calls.length).toBe(1);
        expect(PubSub.broadcast.calls[0].args.length).toBe(2);
        expect(PubSub.broadcast.calls[0].args[0]).toBe('transformationFinished');
        expect(PubSub.broadcast.calls[0].args[1].length).toBe(1);
        expect(PubSub.broadcast.calls[0].args[1][0].foo).toBe('bar');
    }));

    it('should alert an error on wrong transformations', inject(function(TaskResource, $window) {
        $httpBackend.expectPOST('foo/tasks').respond(500, {error: 'foo bar'});

        scope.$digest();
        var elScope = element.scope();

        var dataIdx = 0;
        var data = connectionDatas[dataIdx];
        $rootScope.$broadcast('connectionSelected', data);

        spyOn(TaskResource, 'execute').andCallThrough();
        spyOn($window, 'alert');

        elScope.sendTransformation(elScope.tabs[dataIdx]);
        $httpBackend.flush();

        expect($window.alert).toHaveBeenCalledWith('foo bar');
    }));

    it('should not send anything for the wrong tab', inject(function(TaskResource) {
        scope.$digest();
        var elScope = element.scope();

        var dataIdx = 0;
        var data = connectionDatas[dataIdx];
        $rootScope.$broadcast('connectionSelected', data);

        spyOn(TaskResource, 'execute').andCallThrough();

        elScope.sendTransformation({id: 9999});

        expect(TaskResource.execute).not.toHaveBeenCalled();
    }));

    it('should send all transformations', inject(function(Util, TaskResource, PubSub) {
        var taskResult = [
            {'foo': 'bar'}
        ];
        $httpBackend.expectPOST('foo/tasks').respond(taskResult);

        scope.$digest();
        var elScope = element.scope();

        $rootScope.$broadcast('connectionSelected', connectionDatas[0]);
        $rootScope.$broadcast('connectionSelected', connectionDatas[1]);

        var payload = {
            name: 'Transformations',
            description: 'Transformations',
            job: {
                mappings: project.mappings
            },
            input_data_model: project.input_data_model,
            output_data_model: project.output_data_model
        };
        var payloadJson = Util.toJson(payload);

        spyOn(TaskResource, 'execute').andCallThrough();
        spyOn(PubSub, 'broadcast');

        elScope.sendTransformations();
        $httpBackend.flush();

        expect(TaskResource.execute).toHaveBeenCalledWith(payloadJson);
        // JS, Y U NO WORK?
        // Error: Expected [ { foo : 'bar' } ] to equal [ { foo : 'bar' } ]. ????
        expect(PubSub.broadcast.calls.length).toBe(1);
        expect(PubSub.broadcast.calls[0].args.length).toBe(2);
        expect(PubSub.broadcast.calls[0].args[0]).toBe('transformationFinished');
        expect(PubSub.broadcast.calls[0].args[1].length).toBe(1);
        expect(PubSub.broadcast.calls[0].args[1][0].foo).toBe('bar');
    }));

    it('should map additional input data to input attribute path', function() {
        scope.$digest();
        var elScope = element.scope();

        var spyee = jasmine.createSpyObj('spyee', ['cb']);
        elScope.$on('tabSwitch', function(evt, data) {
            spyee.cb(data);
        });

        var data = connectionDatas[0];

        $rootScope.$broadcast('connectionSelected', data);

        expect(elScope.activeMapping.input_attribute_paths.length).toBe(1);

        data = connectionDatas[2];

        $rootScope.$broadcast('connectionSelected', data);

        expect(elScope.activeMapping.input_attribute_paths.length).toBe(2);

    });

    it('should set gridRows according to mapping data', function() {
        scope.$digest();
        var elScope = element.scope();

        expect(elScope.gridsterOpts.minRows).toBe(0);
        expect(elScope.gridsterOpts.maxRows).toBe(0);

        var spyee = jasmine.createSpyObj('spyee', ['cb']);
        elScope.$on('tabSwitch', function(evt, data) {
            spyee.cb(data);
        });

        var data = connectionDatas[0];

        $rootScope.$broadcast('connectionSelected', data);

        expect(elScope.gridsterOpts.minRows).toBe(1);
        expect(elScope.gridsterOpts.maxRows).toBe(1);

        data = connectionDatas[2];

        $rootScope.$broadcast('connectionSelected', data);

        expect(elScope.gridsterOpts.minRows).toBe(2);
        expect(elScope.gridsterOpts.maxRows).toBe(2);

    });

    it('should build internal components on grid drop', function() {

        var dragEl, dropEl;

        scope.$digest();
        var elScope = element.scope();

        var spyee = jasmine.createSpyObj('spyee', ['cb']);
        elScope.$on('tabSwitch', function(evt, data) {
            spyee.cb(data);
        });

        var data = connectionDatas[0];

        $rootScope.$broadcast('connectionSelected', data);

        var _dragEl = angular.element('<span id="f2f447ff-562f-fe9b-10e4-e3cec2c97b1c">compose</span>');
        elScope.child = mockedFunctions[0];

        dragEl = $compile(_dragEl)(elScope);

        var _dropEl = angular.element('<span><li style="margin: 0px; top: 20px; left: 444.5px; height: 121.5px; width: 121.5px;" id="ebc3de1c-c677-d393-997f-bda80ddebbd0"></li></span>');
        elScope.item = {
            positionX : 0,
            positionY : 0,
            placeholder : true
        };

        dropEl = $compile(_dropEl)(elScope);

        elScope.dropped(dragEl,dropEl);

        expect(elScope.activeMapping.transformation.function.components.length).toBe(1);

    });

    it('should broadcast an \'handleEditConfig\' event when a component was clicked', inject(function(PubSub) {
        scope.$digest();
        var elScope = element.scope();

        spyOn(PubSub, 'broadcast');

        elScope.onFunctionClick('foo');

        expect(PubSub.broadcast).toHaveBeenCalledWith('handleEditConfig', 'foo');
    }));

    it('should open a filter modal when the path component is clicked', inject(function($modal) {
        var fakeModal = { result: { then: function(fn){ fn(); } } };
        spyOn($modal, 'open').andReturn(fakeModal);

        scope.$digest();
        var elScope = element.scope();

        elScope.onFilterClick('foo');

        expect($modal.open).toHaveBeenCalled();
        expect($modal.open.calls[0].args[0].scope.currentComponent).toBe('foo');
        expect($modal.open.calls[0].args[0].scope.component).toBe('foo');
    }));

});
