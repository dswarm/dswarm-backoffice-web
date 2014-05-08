'use strict';

describe('gdmParser tests', function (){
    var gdmParser, mabSchema, mabRecord, expectedMabTree, csvSchema, xmlSchema;

    beforeEach(module('dmpApp', 'mockedSchemas'));

    beforeEach(inject(function ($injector) {

        gdmParser = $injector.get('gdmParser');
        mabSchema = $injector.get('mockMabRtSchema');
        mabRecord = $injector.get('mockMabRtRecord');
        expectedMabTree = $injector.get('expectedMabRtRecord');
        csvSchema = $injector.get('mockCsvSchema');
        xmlSchema = $injector.get('mockXmlSchema');
    }));

    it('should correctly parse a mab record', function () {
        expect(gdmParser.parse(mabRecord.data, mabSchema, true)).toEqual(expectedMabTree);
    });

    it('should return item from parsed object with parseObject', function () {
        var result = gdmParser.parseObject(
            [ {'identifier': 'urn:nbn:de:bsz:14-ds-1229427875176-76287'} ],
            'bar',
            { 'identifier': {'type': 'string'} }
        );

        expect(result['name']).toBe('bar');

        expect(result['children'].length).toBe(1);
        expect(result['children'][0]['title']).toBe('urn:nbn:de:bsz:14-ds-1229427875176-76287');

    });

    it('should return item from parsed array with parseArray', function () {
        var result = gdmParser.parseArray(
            [ 'urn:nbn:de:bsz:14-ds-1229427875176-76287' ],
            'bar',
            { 'type': 'string' }
        );

        expect(result['name']).toBe('bar[]');

        expect(result['children'].length).toBe(1);
        expect(result['children'][0]['title']).toBe('urn:nbn:de:bsz:14-ds-1229427875176-76287');

    });

    it('should return item from parsed string with parseString when container string', function () {
        var result = gdmParser.parseString('foo', 'bar');

        expect(result['name']).toBe('bar');
        expect(result['title']).toBe('foo');

    });

    it('should return item from parsed string with parseString when container strings in array', function () {

        var container = ['foo','fooo','foooo'];

        var result = gdmParser.parseString(container, 'bar');

        expect(result['name']).toBe('bar[]');
        expect(result['children'].length).toBe(3);

    });

    it('should return item from any type, trying object', function () {

        // Test object
        var result = gdmParser.parseAny(
            [{ 'identifier': 'urn:nbn:de:bsz:14-ds-1229427875176-76287' }],
            'bar',
            {
                'type' : 'object',
                'properties' : { 'identifier': {'type': 'string'} }
            }
        );

        expect(result['name']).toBe('bar');
        expect(result['children'].length).toBe(1);

    });

    it('should return item from any type, trying string', function () {

        // Test string
        var result = gdmParser.parseAny('foo', 'bar', { 'type' : 'string' } );

        expect(result['name']).toBe('bar');
        expect(result['title']).toBe('foo');

    });

    it('should parse the data from a simple domain schema', function() {

        var record = [
            {'csv:foo': 'this is foo'},
            {'csv:bar': 'this is bar'}
        ];

        var result = gdmParser.parse(record, csvSchema);

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

        var record = [
            {'xml:foo': [
                {'xml:foo.bar': 'this is bar'},
                {'xml:foo.qux': 'this is qux'}
            ]},
            {'xml:bar': [
                {'xml:bar.baz': 'this is MADNESS'}
            ]}
        ];

        var result = gdmParser.parse(record, xmlSchema);

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
});
