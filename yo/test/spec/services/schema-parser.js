'use strict';

describe('schemaParser tests', function (){
    var schemaParser,

        csvSchema = {
            id: 42,
            name: 'foobar',
            attribute_paths: [
                {
                    id: 9,
                    attributes: [{
                        id: 'csv:foo',
                        uri: 'csv:foo',
                        name: 'foo'
                    }]
                }, {
                    id: 19,
                    attributes: [{
                        id: 'csv:bar',
                        uri: 'csv:bar',
                        name: 'bar'
                    }]
                }
            ]
        },

        xmlSchema = {
            id: 42,
            name: 'foobarbazqux',
            attribute_paths: [
                {
                    id: 9,
                    attributes: [{
                        id: 'xml:foo',
                        uri: 'xml:foo',
                        name: 'foo'
                    }, {
                        id: 'xml:foo.bar',
                        uri: 'xml:foo.bar',
                        name: 'foo.bar'
                    }]
                }, {
                    id: 19,
                    attributes: [{
                        id: 'xml:foo',
                        uri: 'xml:foo',
                        name: 'foo'
                    }, {
                        id: 'xml:foo.qux',
                        uri: 'xml:foo.qux',
                        name: 'foo.qux'
                    }]
                }, {
                    id: 29,
                    attributes: [{
                        id: 'xml:bar',
                        uri: 'xml:bar',
                        name: 'bar'
                    }, {
                        id: 'xml:bar.baz',
                        uri: 'xml:bar.baz',
                        name: 'bar.baz'
                    }]
                }
            ]
        };

    //excuted before each "it" is run.
    beforeEach(function (){

        //load the module.
        module('dmpApp');

        //inject your service for testing.
        inject(function(_schemaParser_) {
            schemaParser = _schemaParser_;
        });
    });

    it('should have an mapData function', function () {
        expect(angular.isFunction(schemaParser.mapData)).toBe(true);
    });

    it('should return mapped data from object with object properties using mapData', function () {
        var result = schemaParser.mapData('bar', { 'properties' : { 'foo' : {}}});
        expect(result['name']).toBe('bar');
        expect(result['children'].length).toBe(1);
    });

    it('should return mapped data from object with array elements using mapData', function () {
        var result = schemaParser.mapData('bar', { 'items' : { 'foo' : {}}});
        expect(result['name']).toBe('bar');
        expect(result['children'].length).toBe(1);
    });

    it('should have an makeItem function', function () {
        expect(angular.isFunction(schemaParser.makeItem)).toBe(true);
    });

    it('should return correct item structure with makeItem', function () {
        var result = schemaParser.makeItem('bar', ['baz', 'bazz' ], 'foo');
        expect(result['name']).toBe('bar');

        expect(result['children'].length).toBe(2);
        expect(result['children'][1]).toBe('bazz');

        expect(result['title']).toBe('foo');
    });

    it('should have an parseObject function', function () {
        expect(angular.isFunction(schemaParser.parseObject)).toBe(true);
    });

    it('should return item from parsed object with parseObject', function () {
        var result = schemaParser.parseObject(
            { 'identifier': 'urn:nbn:de:bsz:14-ds-1229427875176-76287' },
            'bar',
            { 'identifier': {'type': 'string'} }
        );

        expect(result['name']).toBe('bar');

        expect(result['children'].length).toBe(1);
        expect(result['children'][0]['title']).toBe('urn:nbn:de:bsz:14-ds-1229427875176-76287');

    });

    it('should have an parseArray function', function () {
        expect(angular.isFunction(schemaParser.parseArray)).toBe(true);
    });

    it('should return item from parsed array with parseArray', function () {
        var result = schemaParser.parseArray(
            [ 'urn:nbn:de:bsz:14-ds-1229427875176-76287' ],
            'bar',
            { 'type': 'string' }
        );

        expect(result['name']).toBe('bar');

        expect(result['children'].length).toBe(1);
        expect(result['children'][0]['title']).toBe('urn:nbn:de:bsz:14-ds-1229427875176-76287');

    });

    it('should have an parseString function', function () {
        expect(angular.isFunction(schemaParser.parseString)).toBe(true);
    });

    it('should return item from parsed string with parseString when container string', function () {
        var result = schemaParser.parseString('foo', 'bar');

        expect(result['name']).toBe('bar');
        expect(result['title']).toBe('foo');

    });

    it('should return item from parsed string with parseString when container string in associative array', function () {

        var container = [];
        container['#text'] = 'foo';

        var result = schemaParser.parseString(container, 'bar');

        expect(result['name']).toBe('bar');
        expect(result['title']).toBe('foo');

    });

    it('should return item from parsed string with parseString when container strings in array', function () {

        var container = ['foo','fooo','foooo'];

        var result = schemaParser.parseString(container, 'bar');

        expect(result['name']).toBe('bar');
        expect(result['children'].length).toBe(3);

    });

    it('should have an parseEnum function', function () {
        expect(angular.isFunction(schemaParser.parseEnum)).toBe(true);
    });

    it('should return item from parsed enum with parseEnum', function () {
        var result = schemaParser.parseEnum(
            'IDENTIFIER',
            'bar',
            'IDENTIFIER, TEXT'
        );

        expect(result['name']).toBe('bar');

        expect(result['title']).toBe('IDENTIFIER');

    });

    it('should have an parseAny function', function () {
        expect(angular.isFunction(schemaParser.parseAny)).toBe(true);
    });

    it('should return item from any type, trying object', function () {

        // Test object
        var result = schemaParser.parseAny(
            { 'identifier': 'urn:nbn:de:bsz:14-ds-1229427875176-76287' },
            'bar',
            {
                'type' : 'object',
                'properties' : { 'identifier': {'type': 'string'} }
            }
        );

        expect(result['name']).toBe('bar');
        expect(result['children'].length).toBe(1);

    });

    it('should return item from any type, trying array', function () {

        // Test array
        var result = schemaParser.parseAny(
            [ 'urn:nbn:de:bsz:14-ds-1229427875176-76287' ],
            'bar',
            { 'type' : 'array', 'items' : { 'type': 'string' } }
        );

        expect(result['name']).toBe('bar');
        expect(result['children'].length).toBe(1);

    });

    it('should return item from any type, trying string', function () {

        // Test string
        var result = schemaParser.parseAny('foo', 'bar', { 'type' : 'string' } );

        expect(result['name']).toBe('bar');
        expect(result['title']).toBe('foo');

    });

    it('should return item from any type, trying enum', function () {

        // Test enum
        var result = schemaParser.parseAny('IDENTIFIER', 'bar', { 'enum' : 'IDENTIFIER' } );

        expect(result['name']).toBe('bar');
        expect(result['title']).toBe('IDENTIFIER');

    });

    it('should generate the tree model from a simple domain schema', function() {

        var result = schemaParser.fromDomainSchema(csvSchema);

        expect(result['name']).toBe('foobar');
        expect(result['hasChildren']).toBe(true);
        expect(result['children'].length).toBe(2);
        expect(result['children'][0].name).toBe('foo');
        expect(result['children'][0].id).toBe('csv:foo');
        expect(result['children'][0].hasChildren).toBe(false);
        expect(result['children'][1].name).toBe('bar');
        expect(result['children'][1].id).toBe('csv:bar');
        expect(result['children'][1].hasChildren).toBe(false);

    });

    it('should generate the tree model from a complex domain schema', function() {

        var result = schemaParser.fromDomainSchema(xmlSchema);

        expect(result['name']).toBe('foobarbazqux');
        expect(result['hasChildren']).toBe(true);
        expect(result['children'].length).toBe(2);
        expect(result['children'][0].name).toBe('foo');
        expect(result['children'][0].id).toBe('xml:foo');
        expect(result['children'][0].hasChildren).toBe(true);
        expect(result['children'][0].children.length).toBe(2);
        expect(result['children'][0].children[0].name).toBe('foo.bar');
        expect(result['children'][0].children[0].id).toBe('xml:foo.bar');
        expect(result['children'][0].children[0].hasChildren).toBeFalsy();
        expect(result['children'][0].children[1].name).toBe('foo.qux');
        expect(result['children'][0].children[1].id).toBe('xml:foo.qux');
        expect(result['children'][0].children[1].hasChildren).toBeFalsy();

        expect(result['children'][1].name).toBe('bar');
        expect(result['children'][1].id).toBe('xml:bar');
        expect(result['children'][1].hasChildren).toBe(true);
        expect(result['children'][1].children.length).toBe(1);
        expect(result['children'][1].children[0].name).toBe('bar.baz');
        expect(result['children'][1].children[0].id).toBe('xml:bar.baz');
        expect(result['children'][1].children[0].hasChildren).toBeFalsy();
    });

    it('should parse the data from a simple domain schema', function() {

        var record = {
            'csv:foo': 'this is foo',
            'csv:bar': 'this is bar'
        };

        var result = schemaParser.parseFromDomainSchema(record, csvSchema);

        expect(result['name']).toBe('foobar');
        expect(result['children'].length).toBe(2);
        expect(result['children'][0].name).toBe('foo');
        expect(result['children'][0].title).toBe('this is foo');
        expect(result['children'][0].leaf).toBe(true);
        expect(result['children'][1].name).toBe('bar');
        expect(result['children'][1].title).toBe('this is bar');
        expect(result['children'][1].leaf).toBe(true);
    });



    it('should generate the tree model from a complex domain schema', function() {

        var record = {
            'xml:foo': {
                'xml:foo.bar': 'this is bar',
                'xml:foo.qux': 'this is qux'
            },
            'xml:bar': {
                'xml:bar.baz': 'this is MADNESS'
            }
        };

        var result = schemaParser.parseFromDomainSchema(record, xmlSchema);

        expect(result['name']).toBe('foobarbazqux');

        expect(result['children'].length).toBe(2);
        expect(result['children'][0].name).toBe('foo');
        expect(result['children'][0].leaf).toBeUndefined();
        expect(result['children'][0].children.length).toBe(2);
        expect(result['children'][0].children[0].name).toBe('foo.bar');
        expect(result['children'][0].children[0].title).toBe('this is bar');
        expect(result['children'][0].children[0].leaf).toBe(true);
        expect(result['children'][0].children[1].name).toBe('foo.qux');
        expect(result['children'][0].children[1].title).toBe('this is qux');
        expect(result['children'][0].children[1].leaf).toBe(true);

        expect(result['children'][1].name).toBe('bar');
        expect(result['children'][1].leaf).toBeUndefined();
        expect(result['children'][1].children.length).toBe(1);
        expect(result['children'][1].children[0].name).toBe('bar.baz');
        expect(result['children'][1].children[0].title).toBe('this is MADNESS');
        expect(result['children'][1].children[0].leaf).toBe(true);

    });

    it('should parse an MAB like schema', function() {
        var mabSchema = JSON.parse('{"id":1,"attribute_paths":[{"id":3,"attributes":[{"id":"http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld","name":"feld"},{"id":"http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr","name":"nr"}]},{"id":4,"attributes":[{"id":"http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld","name":"feld"},{"id":"http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind","name":"ind"}]},{"id":1,"attributes":[{"id":"http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld","name":"feld"}]},{"id":2,"attributes":[{"id":"http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld","name":"feld"},{"id":"http://www.w3.org/1999/02/22-rdf-syntax-ns#type","name":"type"}]},{"id":7,"attributes":[{"id":"http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld","name":"feld"},{"id":"http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#tf","name":"tf"},{"id":"http://www.w3.org/1999/02/22-rdf-syntax-ns#type","name":"type"}]},{"id":8,"attributes":[{"id":"http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#status","name":"status"}]},{"id":5,"attributes":[{"id":"http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld","name":"feld"},{"id":"http://www.w3.org/1999/02/22-rdf-syntax-ns#value","name":"value"}]},{"id":6,"attributes":[{"id":"http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld","name":"feld"},{"id":"http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#tf","name":"tf"}]},{"id":11,"attributes":[{"id":"http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#typ","name":"typ"}]},{"id":9,"attributes":[{"id":"http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#mabVersion","name":"mabVersion"}]},{"id":10,"attributes":[{"id":"http://www.w3.org/1999/02/22-rdf-syntax-ns#type","name":"type"}]}],"record_class":{"id":"http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#datensatzType","name":"datensatzType"}}');

//        var expected = {
//            name: undefined,
//            $show: true,
//            editableTitle: undefined,
//            children: [
//                {
//                    $show: true,
//                    hasChildren: true,
//                    editableTitle: undefined,
//                    id: 'http: //www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld',
//                    name: 'feld',
//                    _$path_id: 1,
//                    children: [
//                        {
//                            $show: true,
//                            hasChildren: undefined,
//                            editableTitle: undefined,
//                            id: 'http: //www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr',
//                            name: 'nr',
//                            _$path_id: 3
//                        },
//                        {
//                            $show: true,
//                            hasChildren: undefined,
//                            editableTitle: undefined,
//                            id: 'http: //www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind',
//                            name: 'ind',
//                            _$path_id: 4
//                        },
//                        {
//                            $show: true,
//                            hasChildren: undefined,
//                            editableTitle: undefined,
//                            id: 'http: //www.w3.org/1999/02/22-rdf-syntax-ns#type',
//                            name: 'type',
//                            _$path_id: 2
//                        },
//                        {
//                            id: 'http: //www.ddb.de/professionell/mabxml/mabxml-1.xsd#tf',
//                            uri: undefined,
//                            name: 'tf',
//                            children: [
//                                {
//                                    $show: true,
//                                    hasChildren: undefined,
//                                    editableTitle: undefined,
//                                    id: 'http: //www.w3.org/1999/02/22-rdf-syntax-ns#type',
//                                    name: 'type',
//                                    _$path_id: 7
//                                }
//                            ],
//                            hasChildren: true
//                        },
//                        {
//                            $show: true,
//                            hasChildren: undefined,
//                            editableTitle: undefined,
//                            id: 'http: //www.w3.org/1999/02/22-rdf-syntax-ns#value',
//                            name: 'value',
//                            _$path_id: 5
//                        }
//                    ]
//                },
//                {
//                    $show: true,
//                    hasChildren: false,
//                    editableTitle: undefined,
//                    id: 'http: //www.ddb.de/professionell/mabxml/mabxml-1.xsd#status',
//                    name: 'status',
//                    _$path_id: 8
//                },
//                {
//                    $show: true,
//                    hasChildren: false,
//                    editableTitle: undefined,
//                    id: 'http: //www.ddb.de/professionell/mabxml/mabxml-1.xsd#typ',
//                    name: 'typ',
//                    _$path_id: 11
//                },
//                {
//                    $show: true,
//                    hasChildren: false,
//                    editableTitle: undefined,
//                    id: 'http: //www.ddb.de/professionell/mabxml/mabxml-1.xsd#mabVersion',
//                    name: 'mabVersion',
//                    _$path_id: 9
//                },
//                {
//                    $show: true,
//                    hasChildren: false,
//                    editableTitle: undefined,
//                    id: 'http: //www.w3.org/1999/02/22-rdf-syntax-ns#type',
//                    name: 'type',
//                    _$path_id: 10
//                }
//            ],
//            hasChildren: true
//        };

        var actual = schemaParser.fromDomainSchema(mabSchema);

        expect(actual.children.length).toEqual(5);
        expect(actual.children[3]._$path_id).toEqual(9);
        expect(actual.children[0].children.length).toEqual(5);
    });


});
