'use strict';
/* jshint ignore:start */
describe('Directive: Transformation', function () {
    var element, scope, $rootScope, $compile, $timeout, $httpBackend;
    var elementHtml = '<transformation></transformation>';

    var configuration = {
        "id": 11,
        "name": "xml",
        "description": "xml with id 13",
        "resources": [{
            "id": 13
        }],
        "parameters": {
            "storage_type": "xml",
            "record_tag": "datensatz"
        }
    };
    var data_resource = {
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
    var schema = {
        "id": 20,
        "attribute_paths": [{
            "id": 33,
            "attributes": [{
                "id": 21,
                "name": "mabVersion",
                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#mabVersion"
            }]
        }, {
            "id": 34,
            "attributes": [{
                "id": 22,
                "name": "typ",
                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#typ"
            }]
        }, {
            "id": 35,
            "attributes": [{
                "id": 23,
                "name": "status",
                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#status"
            }]
        }, {
            "id": 5,
            "attributes": [{
                "id": 5,
                "name": "type",
                "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
            }]
        }, {
            "id": 28,
            "attributes": [{
                "id": 17,
                "name": "feld",
                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld"
            }, {
                "id": 18,
                "name": "nr",
                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr"
            }]
        }, {
            "id": 27,
            "attributes": [{
                "id": 17,
                "name": "feld",
                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld"
            }, {
                "id": 5,
                "name": "type",
                "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
            }]
        }, {
            "id": 26,
            "attributes": [{
                "id": 17,
                "name": "feld",
                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld"
            }]
        }, {
            "id": 32,
            "attributes": [{
                "id": 17,
                "name": "feld",
                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld"
            }, {
                "id": 20,
                "name": "tf",
                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#tf"
            }, {
                "id": 5,
                "name": "type",
                "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
            }]
        }, {
            "id": 31,
            "attributes": [{
                "id": 17,
                "name": "feld",
                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld"
            }, {
                "id": 20,
                "name": "tf",
                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#tf"
            }]
        }, {
            "id": 30,
            "attributes": [{
                "id": 17,
                "name": "feld",
                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld"
            }, {
                "id": 14,
                "name": "value",
                "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#value"
            }]
        }, {
            "id": 29,
            "attributes": [{
                "id": 17,
                "name": "feld",
                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld"
            }, {
                "id": 19,
                "name": "ind",
                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind"
            }]
        }],
        "record_class": {
            "id": 3,
            "name": "datensatzType",
            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#datensatzType"
        }
    };
    var project = {
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

    function getClasses(jqElem) {
        return Array.prototype.slice.call(jqElem[0].classList);
    }

    beforeEach(module('dmpApp'));

    beforeEach(module(function($provide) {
        $provide.value('Util', {
            apiEndpoint: 'foo/'
        });
    }));

    beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_, _$httpBackend_) {

        $rootScope = _$rootScope_;
        $compile = _$compile_;
        $timeout = _$timeout_;
        $httpBackend = _$httpBackend_;

        $httpBackend.whenGET('views/directives/transformation.html').respond('<div><span>{{ internalName }}</span></div>');

        scope = $rootScope.$new();
        scope.project = project;
        scope.alerts = [];

        var _element = angular.element(elementHtml);
        element = $compile(_element)(scope);
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingRequest();
        $httpBackend.verifyNoOutstandingExpectation();
    });

    it('should initialize the controller', function() {
        $httpBackend.expectGET('views/directives/transformation.html');

        scope.$digest();
        $httpBackend.flush();

        var elScope = element.scope();

        expect(elScope.internalName).toBe('Transformation Logic Widget');
        expect(elScope.activeMapping).toEqual({ _$components : [] });
        expect(elScope.showSortable).toBeFalsy();
        expect(elScope.tabs).toEqual([]);
    });

    it('should show the draft banner if the current project is a draft', function() {
        $httpBackend.expectGET('views/directives/transformation.html');
        scope.projectIsDraft = true;

        scope.$digest();
        $httpBackend.flush();

        var elScope = element.scope();

        expect(elScope.alerts.length).toBe(1);
        expect(elScope.alerts[0]).toEqual({ type: 'info', discard: true, save: true, msg: 'I opened an unsaved draft for you to continue working where you left off.' });
    });

    it('should react to the connectionSelected Event', function() {
        $httpBackend.expectGET('views/directives/transformation.html');

        scope.$digest();
        $httpBackend.flush();

        var elScope = element.scope();

        var source = {
            id: 42,
            name: 'feld.nr',
            path: [17, 18]
        };
        var target = {
            id: 1337,
            name: 'feld.value',
            path: [17, 14]
        };
        var data = {
            internal_id: source.id + ':' + target.id,
            connection_id: 'foo:bar',
            mapping_id: 13,
            name: 'testMapping',
            inputAttributePath: source,
            outputAttributePath: target,
            additionalInput: []
        };

        expect(project.mappings.length).toBe(0);


        var spyee = jasmine.createSpyObj('spyee', ['cb']);
        elScope.$on('tabSwitch', function(evt, data) {
            spyee.cb(data);
        });

        var expectedId = new Date().getTime() * -1;
        $rootScope.$broadcast('connectionSelected', data);

        expect(project.mappings.length).toBe(1);
        var mapping = project.mappings[0];

        expect(mapping.id - expectedId).toBeLessThan(0);
        expect(mapping.id - expectedId).toBeGreaterThan(-1000);
        expect(mapping._$internal_id).toBe(data.internal_id);
        expect(mapping._$connection_id).toBe(data.connection_id);
        expect(mapping.name).toBe(data.name);
        expect(mapping._$components).toEqual([]);

        expect(mapping.transformation.name).toBe('transformation');
        expect(mapping.transformation.description).toBe('transformation');
        expect(mapping.transformation.function.name).toBe('transformation');
        expect(mapping.transformation.function.type).toBe('Transformation');
        expect(mapping.transformation.function.components).toEqual([]);

        expect(mapping.input_attribute_paths).toEqual([{
            "id": 28,
            "attributes": [{
                "id": 17,
                "name": "feld",
                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld"
            }, {
                "id": 18,
                "name": "nr",
                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr"
            }]
        }]);
        expect(mapping.output_attribute_path).toEqual({
            "id": 30,
            "attributes": [{
                "id": 17,
                "name": "feld",
                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld"
            }, {
                "id": 14,
                "name": "value",
                "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#value"
            }]
        });

        expect(elScope.tabs.length).toBe(1);
        expect(elScope.tabs[0]).toEqual({
            title: data.name,
            active: true,
            id: data.internal_id,
            mappingId: data.mapping_id
        });

        expect(elScope.showSortable).toBeTruthy();

        expect(spyee.cb).toHaveBeenCalledWith(data.internal_id);
        expect(elScope.activeMapping).toBe(mapping);
    });

    xit('should send no heartbeat if disabled', function() {
        var classes;

        scope.$digest();

        element.trigger('click');

        classes = getClasses(element);

        expect(classes).toContain('disabled');
        expect(classes).not.toContain('red');
        expect(classes).not.toContain('green');
        expect(classes).not.toContain('yellow');

        $timeout.flush(2000);
        $timeout.verifyNoPendingTasks();
    });

    xit('should reactivate itself if disabled and then clicked', function() {
        var classes;

        scope.$digest();

        element.trigger('click');

        $timeout.flush(1000);
        $timeout.verifyNoPendingTasks();

        element.trigger('click');

        classes = getClasses(element);

        expect(classes).toContain('yellow');
        expect(classes).not.toContain('red');
        expect(classes).not.toContain('green');
        expect(classes).not.toContain('disabled');

        $httpBackend.expectGET('foo/ping').respond('pong');
        $timeout.flush(1000);
        $httpBackend.flush();
        scope.$digest();

        classes = getClasses(element);

        expect(classes).toContain('green');
        expect(classes).not.toContain('red');
        expect(classes).not.toContain('yellow');
        expect(classes).not.toContain('disabled');
    });

});
