'use strict';

var _ = require('lodash');

module.exports = function(grunt) {

    var commentWrappers = {
        js: {
            first: '/**',
            middle: ' * ',
            last: ' */'
        },
        html: {
            first: '<!--',
            middle: '    ',
            last: '-->'
        },
        css: {
            first: '/*!',
            middle: '    ',
            last: '*/'
        },
        less: {
            first: '/*!',
            middle: '    ',
            last: '*/'
        }
    };

    function copyrightLines(holder, email, year) {
        return [
            'Copyright (C) ' + year + '  ' + holder + ' (<' + email + '>)',
            ' ',
            'Licensed under the Apache License, Version 2.0 (the "License");',
            'you may not use this file except in compliance with the License.',
            'You may obtain a copy of the License at',
            ' ',
            'http://www.apache.org/licenses/LICENSE-2.0',
            ' ',
            'Unless required by applicable law or agreed to in writing, software',
            'distributed under the License is distributed on an "AS IS" BASIS,',
            'WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.',
            'See the License for the specific language governing permissions and',
            'limitations under the License.'
        ];
    }

    var fileExtensionRe = /(?:\.([^.]+))?$/;

    function getFileExtension(file) {
        return fileExtensionRe.exec(file)[1];
    }

    function getFileContents(separator, file) {
        return [file, grunt.file.read(file).split(separator)];
    }

    function writeFileContents(separator, file, content) {
        return grunt.file.write(file, content.join(separator));
    }

    function startsWith(str, sub) {
        return str.lastIndexOf(sub, 0) === 0;
    }

    function isComment(wrapper, line) {
        var wrapperStarts = [wrapper.first, wrapper.middle, wrapper.last];
        return _.any(wrapperStarts, _.partial(startsWith, line));
    }

    function getBanner(file, lines) {
        var wrapper = getWrapperFor(file);
        return [file, _.take(lines, _.partial(isComment, wrapper))];
    }

    function tupled(f, thisObj) {
        return function(tuple) {
            return f.apply(thisObj, tuple);
        };
    }

    function runTask(banners, task) {
        banners.forEach(tupled(task));
    }

    function formatCopyright(wrapper, copy) {
        var copyLines = copyrightLines(copy.holder, copy.email, copy.year);
        var lines = _.map(copyLines, function(line) {
            return wrapper.middle + line;
        });
        var wrapped = [wrapper.first];
        wrapped.push.apply(wrapped, lines);
        wrapped.push(wrapper.last);
        return wrapped;
    }

    function containsCopyright(b) {
        return _.contains(b.toLocaleLowerCase(), 'copyright');
    }

    function check(banner) {
        return !_.isEmpty(banner) && _.any(banner, containsCopyright);
    }

    function getWrapperFor(file) {
        var fileExtension = getFileExtension(file);
        return commentWrappers[fileExtension];
    }

    function update(file, copy, separator) {
        var wrapper = getWrapperFor(file);
        if (wrapper) {
            var copyright = formatCopyright(wrapper, copy);
            var content = getFileContents(separator, file)[1];
            content.unshift.apply(content, copyright);
            writeFileContents(separator, file, content);
        }
        return !!wrapper;
    }

    function ensure(file, banner, copy, separator) {
        var hasCopyright = check(banner);
        if (!hasCopyright) {
            return update(file, copy, separator);
        }
        return hasCopyright;
    }

    function mkTask(verb, task) {
        return function(file, banner) {
            grunt.verbose.write(verb + ' copyright banner in ' + file + '… ');
            if (!task(file, banner)) {
                grunt.verbose.error();
                grunt.fail.warn(file + ' has no copyright banner');
            } else {
                grunt.verbose.ok();
            }
        };
    }

    var copyrightTask = function() {
        var defaults = {
            year: new Date().getFullYear(),
            email: 'foo@example.org',
            holder: 'ACME',
            separator: grunt.util.linefeed
        };
        var options = this.options(defaults);
        var files = this.filesSrc;

        function relevantBanners() {
            return _(files).
                map(_.partial(getFileContents, options.separator)).
                map(tupled(getBanner));
        }

        var checkTask = mkTask('Checking for', function(file, banner) {
            return check(banner);
        });

        var ensureTask = mkTask('Ensuring', function(file, banner) {
            return ensure(file, banner, options, options.separator);
        });

        var updateTask = mkTask('Updating', function(file) {
            return update(file, options, options.separator);
        });

        switch (this.target) {
            case 'ensure':
                runTask(relevantBanners(options.cwd), ensureTask);
                break;
            case 'check':
                runTask(relevantBanners(options.cwd), checkTask);
                break;
            case 'update':
                runTask(relevantBanners(options.cwd), updateTask);
                break;
            default:
                grunt.fail.warn('Unkown task [' + this.target + '], use one of {check,update,ensure}');
        }
    };

    grunt.registerMultiTask('copyright', 'Adds copyright banner to every file', copyrightTask);
};
