'use strict';

describe('schemaParser tests', function (){
    var schemaParser, mabSchema, csvSchema, xmlSchema;

    beforeEach(module('dmpApp', 'mockedSchemas'));

    beforeEach(inject(function ($injector) {

        schemaParser = $injector.get('schemaParser');
        mabSchema = $injector.get('mockMabSchema');
        csvSchema = $injector.get('mockCsvSchema');
        xmlSchema = $injector.get('mockXmlSchema');
    }));

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

    it('should parse an MAB like schema', function() {
        var actual = schemaParser.fromDomainSchema(mabSchema);

        expect(actual.children.length).toEqual(5);
        expect(_.pluck(actual.children, '_$path_id')).toEqual([8, 11, 9, 10, 1]);
        expect(_.last(actual.children).children.length).toEqual(5);
    });


});
