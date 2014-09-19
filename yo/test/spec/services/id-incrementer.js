'use strict';

describe('Factory: idIncrementer', function() {

    // load the service's module
    beforeEach(module('dmpApp'));

    // instantiate service
    var idIncrementer;
    beforeEach(inject(function(_idIncrementer_) {
        idIncrementer = _idIncrementer_;
    }));

    it('should return an incremented number with every invocation', function() {
        var incrementer = idIncrementer();
        for (var i = 1; i <= 10; i++) {
            expect(incrementer()).toBe('' + i);
        }
    });

    it('should prefix the counter with some prefix', function() {
        var incrementer = idIncrementer('foo_');
        for (var i = 1; i <= 10; i++) {
            expect(incrementer()).toBe('foo_' + i);
        }
    });

    it('should cache invocation when given an id', function() {
        var incrementer = idIncrementer();
        expect(incrementer('a')).toBe('1');
        expect(incrementer('a')).toBe('1');
        expect(incrementer('b')).toBe('2');
    });

    it('should allow mixing cached and non-cached invocations', function() {
        var incrementer = idIncrementer();
        expect(incrementer('a')).toBe('1');
        expect(incrementer()).toBe('2');
        expect(incrementer('b')).toBe('3');
        expect(incrementer('a')).toBe('1');
        expect(incrementer()).toBe('4');
        expect(incrementer('b')).toBe('3');
    });

    it('should allow easy mapping of the id provider', function() {
        var incrementer = idIncrementer().map(function(item) {
            return item.id;
        });

        expect(incrementer({ id: 'a' })).toBe('1');
        expect(incrementer()).toBe('2');
        expect(incrementer({ id: 'b' })).toBe('3');
        expect(incrementer({ id: 'a' })).toBe('1');
        expect(incrementer()).toBe('4');
        expect(incrementer({ id: 'b' })).toBe('3');
    });

    it('should allow lodash-pluck style of mapping over the id provider', function() {
        var incrementer = idIncrementer().map('id');

        expect(incrementer({ id: 'a' })).toBe('1');
        expect(incrementer()).toBe('2');
        expect(incrementer({ id: 'b' })).toBe('3');
        expect(incrementer({ id: 'a' })).toBe('1');
        expect(incrementer()).toBe('4');
        expect(incrementer({ id: 'b' })).toBe('3');
    });
});
