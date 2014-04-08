'use strict';

angular.module('dmpApp')
    .directive('appVersion', function(ProjectInfo) {
        return function(scope, iElement) {
            var text = [
                    'Web:', ProjectInfo.versions.web.revision,
                    '--',
                    'API:', ProjectInfo.versions.backend.revision,
                    'at',
                    ProjectInfo.versions.web.date
                ],
                version = text.join(' ');

            iElement.text(version);
            iElement.attr('id', 'footer-build-information');
        };
    });
