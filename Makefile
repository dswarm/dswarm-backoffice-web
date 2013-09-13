PORT=9999

all: install
.PHONY: all

env-install:
	cd yo && npm install
	cd yo && bower install
.PHONY: env-install


## needs build after `bower install'

yo/app/components/angular-ui-bootstrap/dist/ui-bootstrap-0.5.0.js: yo/app/components/angular-ui-bootstrap/package.json yo/app/components/angular-ui-bootstrap/Gruntfile.js
	cd yo/app/components/angular-ui-bootstrap && npm install
	cd yo/app/components/angular-ui-bootstrap && grunt build

yo/app/components/angular-ui-utils/components/angular-ui-docs/build/ui-utils.js: yo/app/components/angular-ui-utils/package.json yo/app/components/angular-ui-utils/gruntFile.js
	cd yo/app/components/angular-ui-utils && npm install
	cd yo/app/components/angular-ui-utils && grunt build

# shorthand

ui-bootstrap: yo/app/components/angular-ui-bootstrap/dist/ui-bootstrap-0.5.0.js
ui-utils: yo/app/components/angular-ui-utils/components/angular-ui-docs/build/ui-utils.js
.PHONY: ui-bootstrap ui-utils


# install all

install: env-install ui-bootstrap ui-utils
.PHONY: install

# update all
update-files:
	cd yo && bower update

update: update-files ui-bootstrap ui-utils
.PHONY: update-files update


# upgrade installation base
upgrade:
	git pull


# run tests

test: yo/Gruntfile.js
	cd yo && grunt karma:unit
.PHONY: test


# run static analysis

lint: yo/Gruntfile.js
	cd yo && grunt jshint
.PHONY: lint


# build live version

dist: yo/Gruntfile.js install update
	cd yo && grunt build


# run grunt server (dev)

server: yo/Gruntfile.js
	(cd yo; grunt server &)
.PHONY: server


stop-server: yo/Gruntfile.js
	@@lsof -i :$(PORT) | grep LISTEN | awk '{print $$2}' | xargs kill
.PHONY: stop-server
