'use strict';
(function(win) {
  var dmp = win['dmp'] || {};
  dmp['jsRoutes'] = {
    'api': '<%= endpoint %>'
  };

  win['dmp'] = dmp;
})(window);

