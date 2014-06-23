## Start with Development ##

These Windows specific installation instructions are based on the [default instructions](dev.md) and have been tested on Windows 7 64bit.
For other environments, please have a look at the [default instructions](dev.md).

### Prerequisites ###

- create an environment variable DMP_HOME that points to the directory of the datamanagement-platform (backend), e.g. DMP_HOME=C:\DMP\datamanagement-platform\
- node >= 0.8 [website](http://nodejs.org)
- npm in your $PATH
- python 2.7.3 [website](https://www.python.org/), [installer 2.7.3](https://www.python.org/ftp/python/2.7.3/python-2.7.3.msi)
- maybe .NET Framework 20. SDK [download](http://www.microsoft.com/de-de/download/details.aspx?id=19988)
- Visual Studio Express 2013 [download](http://www.microsoft.com/de-de/download/details.aspx?id=40787) OR follow [alternative instructions](https://github.com/TooTallNate/node-gyp/blob/master/README.md) to install node-gyp

You'll also need [bower](http://bower.io/) and the [grunt command line interface](https://github.com/gruntjs/grunt-cli) (see also [grunt](http://gruntjs.com/)).
These could be installed by `npm install`, but it's probably better, if you install them globally and have them in your $PATH.

	npm install -g grunt-cli bower


### Download Assets ###

For the following command blocks, it is assumed, that the current working directory is /yo/.

    npm install
    bower install


### Start Development Server ###

    grunt serve

A browser should open at localhost:9999
You are now ready to use the front end. If you like to run the tests, linter, have a look at the [default instructions](dev.md)