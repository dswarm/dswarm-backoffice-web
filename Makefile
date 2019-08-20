PORT=9999
STAGE=unstable

all: install
.PHONY: all

env-install:
	cd yo && npm install && npm audit fix && npm audit fix --force
	cd yo && bower install
.PHONY: env-install

# install all

install: env-install
.PHONY: install

# update all
update-files:
	cd yo && bower update

update: update-files
.PHONY: update-files update


# upgrade installation base
upgrade:
	git fetch origin
	git pull
.PHONY: upgrade


# run tests

test: yo/Gruntfile.js
	cd yo && grunt test:ci
.PHONY: test

jenkins: yo/Gruntfile.js
	cd yo && grunt --no-color jenkins
.PHONY: jenkins


# run static analysis

lint: yo/Gruntfile.js
	cd yo && grunt jshint
.PHONY: lint


# build live version

yo/publish:
	mkdir yo/publish


dist: yo/Gruntfile.js clean install | yo/publish
	cd yo && STAGE=${STAGE} grunt build --force
	rsync --delete --verbose --recursive yo/dist/ yo/publish
.PHONY: dist


# clean

clean:
	rm -rf yo/app/components
	rm -rf yo/node_modules
.PHONY: clean
