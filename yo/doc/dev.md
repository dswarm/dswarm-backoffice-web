## Start with Development ##

### Prerequisites ###

- $DMP_HOME that points to the directory of the datamanagement-platform (backend), e.g. export DMP_HOME="/var/www/dmp/datamanagement-platform/" or permanently add to /etc/environment 
- node >= 0.8 [website](http://nodejs.org)
- npm in your $PATH

You'll also need [grunt](http://gruntjs.com/) and [bower](http://bower.io/).
These would be installed by `npm install`, but it's probably better,
if you install them globally and have them in your $PATH.

    npm install -g grunt-cli bower

Also, [yeoman](http://yeoman.io/) might be of service.

Every command block assumes, that the current working directory is /yo/.
Also, the commands are written for bash or a similar shell, you'll need
to adjust them if you work on other systems, e.g. Windows.


### Download Assets ###

    npm install
    bower install


### Start Development Server ###

    grunt serve

A browser should open at localhost:9999


### Run the tests ###

the test runner for the unit tests is [karma](http://karma-runner.github.io/).
As with bower/grunt, you can have it installed globally or locally through `npm install`
Either way, start a single unit test run:

    karma start --single-run

This should output something like

> INFO [karma]: Karma v0.10.2 server started at http://localhost:9876/
> INFO [launcher]: Starting browser Chrome
> INFO [Chrome 29.0.1547 (Mac OS X 10.8.4)]: Connected on socket 4aWTmAM_7jePLA3clBgw
> Chrome 29.0.1547 (Mac OS X 10.8.4): Executed 31 of 31 SUCCESS (0.87 secs / 0.14 secs)

Alternatively, you can use grunt to do the same:

    grunt karma:unit

Karma can be run in a server mode, where tests are re-run on every file change:

    grunt karma:continuous
    # or
    karma start --auto-watch


### Run the linter ###

Linting is done by [jshint](http://jshint.com/). It can be run via grunt:

    grunt jshint

A good idea is to incorporate jshint within your favorite IDE: [jshint plugins](http://jshint.com/install/#plugins)
For example, the IDEA plugin highlights jshint issues directly as syntax errors in the IDE


### Build the whole distribution ###

Just run

    grunt


### other helpful tasks ###

> **Note**: `grunt` to execute these tasks is implied

task                     | description
------------------------ | -----------
ngtemplates              | Compile AngularJS templates for $templateCache, produces the file `.tmp/scripts/templates.js`
bowerInstall             | Inject all components in your HTML file. (into `app/index.html`).
clean:tmp                | Clean temporary (intermediate) files and folders. (`./tmp`).
clean:dist               | Clean all generated files and folders. (`./tmp` and `./dist`).
jshint:all               | Validate source files with JSHint.
jshint:test              | Validate test files with JSHint.
jshint:ci                | Validate source files with JSHint and generate a jenkins-readable report in `target/jshint.xml`.
less                     | Compile LESS files to CSS into `.tmp/styles/`.
karma:ci                 | Run karma using PhantomJS and reporting jenkins-readble coverage reports in `target/coverage`. Indented to be used by jenkins.
karma:localci            | Run karma using Chrome and reporting coverage reports in `target/coverage` in html form.
plato                    | Generate static analysis charts with plato in `target/metrics`.
template:api-server      | Generate the `app/api.js` file with the API url pointing to `http://localhost:8087/dmp`.
template:api-server-dist | Generate the `app/api.js` file with the API url pointing to `/dmp`.
revision                 | Generate the `app/data/version.json` file with build information gathered from the exection of `git describe`.
printConfig              | Dump the complete Grunt configuration.
test                     | Rebuild the styles and then run the tests.
build                    | Build the application without running the tests
jenkins                  | Test and analyze the application. Indented to be used by jenkins (duh).


### Use yeoman ###

Yeoman can be of service to create new components

    yo angular:directive awesome-foo
    yo angular:controller awesome-foo
    yo angular:view awesome-foo

This will create the following files

- app/scripts/directives/awesome-foo.js
- test/spec/directives/awesome-foo.js
- create app/scripts/controllers/awesome-foo.js
- create test/spec/controllers/awesome-foo.js
- create app/views/awesome-foo.html

Also, it will inject them into the `app/index.html`

    <script src="scripts/directives/awesome-foo.js"></script>
    <script src="scripts/controllers/awesome-foo.js"></script>

