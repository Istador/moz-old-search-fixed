#!make
JPM     := ./node_modules/.bin/jpm
NPM     := node_modules/
XPI     := old-search-fixed.xpi
JS      := index.js prefs.js
ICO     := data/icon-64.png data/icon-48.png data/icon-32.png
OPTIONS := options.xul locale/en-US/options.dtd locale/de-DE/options.dtd defaults/preferences/prefs.js
PROJECT := package.json install.rdf chrome.manifest .jpmignore $(JS) $(OPTIONS) README.md LICENSE.md

$(XPI): $(NPM) $(PROJECT)
	$(JPM) xpi

$(NPM): package.json
	npm install

.PHONY: clean
clean:
	rm -f $(XPI)
	rm -rf $(NPM)

.PHONY: force
force:
	npm install
	$(JPM) xpi

.jpmcredentials:
	touch .jpmcredentials

include .jpmcredentials

.PHONY: sign
sign: $(XPI) .jpmcredentials
	$(JPM) sign --xpi $(XPI) --api-key "$(API_KEY)" --api-secret "$(API_SECRET)"
