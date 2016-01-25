'use strict';

var _ = require('lodash');

module.exports = function(grunt) {

    var CHECK_OK = 1,
        CHECK_NO = 0,
        CHECK_WRONG = -1;

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

    function copyrightHolderLine(holder, email, year) {
        return 'Copyright (C) ' + year + '  ' + holder + ' (<' + email + '>)'
    }

    function copyrightLines(holder, email, year) {
        return [
            copyrightHolderLine(holder, email, year),
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
        return grunt.file.read(file).split(separator);
    }

    function writeFileContents(separator, file, content) {
        return grunt.file.write(file, content.join(separator));
    }

    function startsWith(str, sub) {
        return str.lastIndexOf(sub, 0) === 0;
    }

    function endsWith(str, sub) {
        var position = str.length - sub.length;
        if (position < 0) {
          return false;
        }
        if (position === 0) {
          return str === sub;
        }
        var lastIndex = str.indexOf(sub, position);
        return lastIndex !== -1 && lastIndex === position;
    }

    function getBannerOf(file, separator) {
        var wrapper = getWrapperFor(file);
        var fileLines = getFileContents(separator, file);
        return findBanner(fileLines, wrapper);
    }

    function findBanner(lines, wrapper) {
        var state = 0;
        var i = 0;
        var targets = [wrapper.first, wrapper.middle, rightTrim(wrapper.middle), wrapper.last];
        for (var l = lines.length; i < l; i++) {
            var line = lines[i];
            var matches = startsWith(line, targets[state]);
            if (matches) {
                switch (state) {
                    case 0:        // matched beginning line, goto next state
                        state = 1;
                        break;
                    case 1:        // matched middle line, continue
                        break;
                    case 2:        // matched trimmed middle line, continue but revert to untrimmed
                        state = 1;
                        break;
                    case 3:        // matched last line, return result
                        return lines.slice(0, i + 1);
                }
            } else {
                switch (state) {
                    case 0:        // beginning not found, abort
                        return [];
                    case 1:        // no more middle, check for trimmed variant
                        // the end might start with the same content as the trimmed
                        // middle check, so we need to guard against that case first
                        if (startsWith(line, targets[3])) {
                            return lines.slice(0, i + 1)
                        }
                        state = 2;
                        i--;
                        break;
                    case 2:       // trimmed version nout found as well, last resort to the end
                        state = 3;
                        i--;
                        break;
                    case 3:        // end not found
                        // technically, we should return `lines`, since everything
                        // seems to be a comment. Returning the empty array means
                        // the file doesn't have banner and gets a completely new copy
                        // at the top. Return `lines` would mean that `ensure `would
                        // delete the complete content and between those two things,
                        // the first is slightly less annoying.
                        return [];
                }
            }
        }
        // reason for returning `[]` is the same as above when we would
        // not find any end line marker
        return [];
    }

    function runTask(options, files, task) {
        var failures = 0;
        for (var file, i = 0; file = files[i++];) {
            var banner = getBannerOf(file, options.separator);
            if (!task(file, banner)) {
                failures += 1;
            }
        };
        if (failures) {
            var filesWord = failures === 1 ? ' file.' : ' files.';
            grunt.fail.warn('The task has failed for ' + failures + filesWord);
        }
    }

    function rightTrim(text) {
        var i = text.length - 1;
        for (; i >= 0; i--) {
            var ch = text.charAt(i);
            if (ch !== ' ') {
              break;
            }
        };
        if (++i < text.length) {
            return text.substring(0, i);
        }
        return text;
    }

    function formatCopyright(wrapper, copy) {
        var copyLines = copyrightLines(copy.holder, copy.email, copy.year);
        var lines = _.map(copyLines, function(line) {
            return rightTrim(wrapper.middle + line);
        });
        var wrapped = [wrapper.first];
        wrapped.push.apply(wrapped, lines);
        wrapped.push(wrapper.last);
        return wrapped;
    }

    function containsCopyright(copyLine) {
        return function(line) {
            return endsWith(line.toLocaleLowerCase(), copyLine);
        }
    }

    function check(banner, checker) {
        return _.isEmpty(banner)
            ? CHECK_NO
            : _.any(banner, checker)
                ? CHECK_OK
                : CHECK_WRONG;
    }

    function getWrapperFor(file) {
        var fileExtension = getFileExtension(file);
        return commentWrappers[fileExtension];
    }

    function update(file, banner, options, separator) {
        var wrapper = getWrapperFor(file);
        if (wrapper) {
            var copyright = formatCopyright(wrapper, options);
            var content = getFileContents(separator, file);
            // start from 0 and delete `banner.length` elements before
            // adding all elements of copyright.
            copyright.unshift(0, banner.length);
            content.splice.apply(content, copyright);
            writeFileContents(separator, file, content);
        }
        return !!wrapper;
    }

    function ensure(file, banner, options, separator) {
        var copyLine = copyrightHolderLine(options.holder, options.email, options.year).toLocaleLowerCase();
        var copyChecker = containsCopyright(copyLine);
        var hasCopyright = check(banner, copyChecker);
        if (hasCopyright !== CHECK_OK) {
            if (hasCopyright === CHECK_NO) {
                grunt.verbose.error();
            } else {
                grunt.verbose.error('OUTDATED');
            }
            var msg = hasCopyright === CHECK_NO ? 'missing.' : 'outdated.';
            var updated = update(file, banner, options, separator);
            grunt.verbose.write('Updating copyright banner in ' + file + '...');
            return updated;
        }
        return hasCopyright;
    }

    function mkTask(verb, task) {
        return function(file, banner) {
            grunt.verbose.write(verb + ' copyright banner in ' + file + '...');
            var result = task(file, banner);
            if (result === CHECK_WRONG) {
                grunt.verbose.error('OUTDATED');
                grunt.log.error(file + ' has an outdated copyright banner');
                return false;
            } else if (result === CHECK_NO || !result) {
                grunt.verbose.error();
                grunt.log.error(file + ' has no copyright banner');
                return false;
            }
            grunt.verbose.ok();
            return true;
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

        var checkTask = (function(){
            var copyLine = copyrightHolderLine(options.holder, options.email, options.year).toLocaleLowerCase();
            var copyChecker = containsCopyright(copyLine);
            return mkTask('Checking for', function(file, banner) {
                return check(banner, copyChecker);
            });
        })();

        var ensureTask = mkTask('Checking', function(file, banner) {
            return ensure(file, banner, options, options.separator);
        });

        switch (this.target) {
            case 'ensure':
                runTask(options, files, ensureTask);
                break;
            case 'check':
                runTask(options, files, checkTask);
                break;
            default:
                grunt.fail.warn('Unkown task [' + this.target + '], use one of {check,ensure}');
        }
    };

    grunt.registerMultiTask('copyright', 'Adds copyright banner to every file', copyrightTask);
};
