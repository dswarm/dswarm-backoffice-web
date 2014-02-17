'use strict';

describe('Service: PubSub', function () {
    beforeEach(module('dmpApp'));

    var scope1, scope2, callbackSpy, $rootScope;

    beforeEach(inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');

        scope1 = $rootScope.$new();
        scope2 = $rootScope.$new();

        callbackSpy = jasmine.createSpy('callbackSpy');
    }));

    it('should subscribe using the scope\'s $on method', inject(function (PubSub) {
        spyOn(scope1, '$on');
        PubSub.subscribe(scope1, 'channel', callbackSpy);

        expect(scope1.$on).toHaveBeenCalled();
        expect(scope1.$on.mostRecentCall.args[0]).toEqual('channel');
    }));

    it('should publish using the $rootScope\'s $broadcast method', inject(function (PubSub) {
        spyOn($rootScope, '$broadcast');
        PubSub.broadcast('channel', 'data');

        expect($rootScope.$broadcast).toHaveBeenCalledWith('channel', 'data');
    }));

    it('realize publish-subscribe pattern using the subscribe and broadcast methods', inject(function (PubSub) {
        PubSub.subscribe(scope1, 'channel', callbackSpy);
        PubSub.broadcast('channel', 'data');

        expect(callbackSpy).toHaveBeenCalled();
        expect(callbackSpy.mostRecentCall.args[0]).toEqual('data');
    }));

});
