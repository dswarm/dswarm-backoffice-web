'use strict';

describe('schemaParser tests', function (){
    var schemaParser;

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

        var domainSchema = {
            attribute_paths: [{
                attributes: [{
                    id: 'csv:foo',
                    name: 'foo'
                }, {
                    id: 'csv:bar',
                    name: 'bar'
                }],
                id: 9
            }],
            id: 42,
            name: 'foobar'
        };

        var result = schemaParser.fromDomainSchema(domainSchema);

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

        var domainSchema = {
            attribute_paths: [{
                attributes: [{
                    id: 'xml:foo.bar',
                    name: 'foo.bar'
                }, {
                    id: 'xml:foo.qux',
                    name: 'foo.qux'
                }, {
                    id: 'xml:bar.baz',
                    name: 'bar.baz'
                }],
                id: 9
            }],
            id: 42,
            name: 'foobarbazqux'
        };

        var result = schemaParser.fromDomainSchema(domainSchema);

        expect(result['name']).toBe('foobarbazqux');
        expect(result['hasChildren']).toBe(true);
        expect(result['children'].length).toBe(2);
        expect(result['children'][0].name).toBe('foo');
        expect(result['children'][0].id).toBeUndefined();
        expect(result['children'][0].hasChildren).toBe(true);
        expect(result['children'][0].children.length).toBe(2);
        expect(result['children'][0].children[0].name).toBe('bar');
        expect(result['children'][0].children[0].id).toBe('xml:foo.bar');
        expect(result['children'][0].children[0].hasChildren).toBe(false);
        expect(result['children'][0].children[1].name).toBe('qux');
        expect(result['children'][0].children[1].id).toBe('xml:foo.qux');
        expect(result['children'][0].children[1].hasChildren).toBe(false);

        expect(result['children'][1].name).toBe('bar');
        expect(result['children'][1].id).toBeUndefined();
        expect(result['children'][1].hasChildren).toBe(true);
        expect(result['children'][1].children.length).toBe(1);
        expect(result['children'][1].children[0].name).toBe('baz');
        expect(result['children'][1].children[0].id).toBe('xml:bar.baz');
        expect(result['children'][1].children[0].hasChildren).toBe(false);
    });

    it('should parse the data from a simple domain schema', function() {

        var domainSchema = {
            attribute_paths: [{
                attributes: [{
                    id: 'csv:foo',
                    name: 'foo'
                }, {
                    id: 'csv:bar',
                    name: 'bar'
                }],
                id: 9
            }],
            id: 42,
            name: 'foobar'
        };

        var record = {
            'csv:foo': 'this is foo',
            'csv:bar': 'this is bar'
        };

        var result = schemaParser.parseFromDomainSchema(record, domainSchema);

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

        var domainSchema = {
            attribute_paths: [{
                attributes: [{
                    id: 'xml:foo.bar',
                    name: 'foo.bar'
                }, {
                    id: 'xml:foo.qux',
                    name: 'foo.qux'
                }, {
                    id: 'xml:bar.baz',
                    name: 'bar.baz'
                }],
                id: 9
            }],
            id: 42,
            name: 'foobarbazqux'
        };

        var record = {
            foo: {
                'xml:foo.bar': 'this is bar',
                'xml:foo.qux': 'this is qux'
            },
            bar: {
                'xml:bar.baz': 'this is MADNESS'
            }
        };

        var result = schemaParser.parseFromDomainSchema(record, domainSchema);

        expect(result['name']).toBe('foobarbazqux');

        expect(result['children'].length).toBe(2);
        expect(result['children'][0].name).toBe('foo');
        expect(result['children'][0].leaf).toBeUndefined();
        expect(result['children'][0].children.length).toBe(2);
        expect(result['children'][0].children[0].name).toBe('bar');
        expect(result['children'][0].children[0].title).toBe('this is bar');
        expect(result['children'][0].children[0].leaf).toBe(true);
        expect(result['children'][0].children[1].name).toBe('qux');
        expect(result['children'][0].children[1].title).toBe('this is qux');
        expect(result['children'][0].children[1].leaf).toBe(true);

        expect(result['children'][1].name).toBe('bar');
        expect(result['children'][1].leaf).toBeUndefined();
        expect(result['children'][1].children.length).toBe(1);
        expect(result['children'][1].children[0].name).toBe('baz');
        expect(result['children'][1].children[0].title).toBe('this is MADNESS');
        expect(result['children'][1].children[0].leaf).toBe(true);

    });


});
