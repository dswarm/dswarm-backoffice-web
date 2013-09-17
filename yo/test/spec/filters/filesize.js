'use strict';

describe('filter', function () {
  beforeEach(module('dmpApp'));

  describe('filesize', function () {

    beforeEach(module(function($provide) {
      $provide.value('$window', {
        humanize: {
          filesize: function(arg) {
            return '1.21 kb';
          }
        }
      })
    }));

    it('should call filesize of window/humaize', inject(function ($window, filesizeFilter) {
      spyOn($window.humanize, 'filesize');
      filesizeFilter(1234);

      expect($window.humanize.filesize).toHaveBeenCalledWith(1234);
    }));

    it('should render human readable filesizes', inject(function ($window, filesizeFilter) {
      expect(filesizeFilter(1234)).toEqual('1.21 kb');
    }));
  });
});
