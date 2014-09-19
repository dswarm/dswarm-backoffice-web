'use strict';

describe('Service: NormalizeKey', function() {

    beforeEach(module('dmpApp'));

    var normalizeKey;
    beforeEach(inject(function(_normalizeKey_) {
        normalizeKey = _normalizeKey_;
    }));

    it('should return valid keys verbatim', function() {
        expect(normalizeKey('foobar')).toBe('foobar');
        expect(normalizeKey('1234')).toBe('1234');
    });

    it('should remove invalid character from the ASCII table', function() {
        // this follows roughly the english-US keyboard characters
        expect(normalizeKey('foo`bar')).toBe('foobar');
        expect(normalizeKey('foo~bar')).toBe('foobar');
        expect(normalizeKey('foo!bar')).toBe('foobar');
        expect(normalizeKey('foo@bar')).toBe('foobar');
        expect(normalizeKey('foo#bar')).toBe('foobar');
        expect(normalizeKey('foo$bar')).toBe('foobar');
        expect(normalizeKey('foo%bar')).toBe('foobar');
        expect(normalizeKey('foo^bar')).toBe('foobar');
        expect(normalizeKey('foo&bar')).toBe('foobar');
        expect(normalizeKey('foo*bar')).toBe('foobar');
        expect(normalizeKey('foo(bar')).toBe('foobar');
        expect(normalizeKey('foo)bar')).toBe('foobar');
        expect(normalizeKey('foo-bar')).toBe('foobar');
        expect(normalizeKey('foo_bar')).toBe('foobar');
        expect(normalizeKey('foo=bar')).toBe('foobar');
        expect(normalizeKey('foo+bar')).toBe('foobar');
        expect(normalizeKey('foo[bar')).toBe('foobar');
        expect(normalizeKey('foo]bar')).toBe('foobar');
        expect(normalizeKey('foo{bar')).toBe('foobar');
        expect(normalizeKey('foo}bar')).toBe('foobar');
        expect(normalizeKey('foo;bar')).toBe('foobar');
        expect(normalizeKey('foo:bar')).toBe('foobar');
        expect(normalizeKey('foo\'bar')).toBe('foobar');
        expect(normalizeKey('foo"bar')).toBe('foobar');
        expect(normalizeKey('foo\\bar')).toBe('foobar');
        expect(normalizeKey('foo|bar')).toBe('foobar');
        expect(normalizeKey('foo,bar')).toBe('foobar');
        expect(normalizeKey('foo.bar')).toBe('foobar');
        expect(normalizeKey('foo<bar')).toBe('foobar');
        expect(normalizeKey('foo>bar')).toBe('foobar');
        expect(normalizeKey('foo/bar')).toBe('foobar');
        expect(normalizeKey('foo?bar')).toBe('foobar');
    });

    it ('should remove whitespace characters', function() {
        expect(normalizeKey('foo bar')).toBe('foobar');
        expect(normalizeKey('foo\nbar')).toBe('foobar');
        expect(normalizeKey('foo\tbar')).toBe('foobar');
        expect(normalizeKey('foo\rbar')).toBe('foobar');
    });

    it('should remove all characters above char code 127', function() {
        for (var i = 128; i <= 1024; i++) {
            var specialChar = String.fromCharCode(i);
            var string = 'foo' + specialChar + 'bar';
            var actual = normalizeKey(string);
            expect(actual).toBe('foobar');
        }
    });
});
