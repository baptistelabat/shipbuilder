.PHONY: all build build-optimized clean artifacts test selenium babel elm-analyse

VERSION := $(if $(shell git tag -l --points-at HEAD),$(shell git tag -l --points-at HEAD),$(shell git rev-parse --short=8 HEAD))

all: build-optimized

build: shipBuilder/js/elm.js shipBuilder/index-not-optimized.html

build-optimized: shipBuilder/js/elm.min.js

shipBuilder/js/hull.js: rebuildHull/src/hull.js
	cd rebuildHull && make
	cp rebuildHull/js/hull.js shipBuilder/js/

shipBuilder/js/elm.js: src/*.elm src/Dict/*.elm src/Interpolate/*.elm
	rm -rf elm-stuff/generated-code || true
	docker build -t elm .
	docker run -t --rm --name elm -v `pwd`:/work -u $(shell id -u):$(shell id -g) -w /work elm make src/Main.elm --output shipBuilder/js/elm.js

test: shipBuilder/js/elm.js tests/*.elm
	docker build -t elm .
	docker run -t --rm --name elm -v `pwd`:/work -u $(shell id -u):$(shell id -g) -w /work --entrypoint elm-test elm --skip-install --verbose

shipBuilder/index-not-optimized.html: shipBuilder/index.template.json.html
	@sed 's/GIT_SHA/$(VERSION)/g' shipBuilder/index.template.json.html > shipBuilder/index-not-optimized.html
	@echo "Added GIT SHA to index-not-optimized.html"

shipBuilder/index.template.json.html: shipBuilder/index.template.html shipBuilder/assets/ROPAX_retouche1.stl  shipBuilder/assets/OSV1.stl shipBuilder/assets/OPV.stl
	cd buildHull && make
	cp buildHull/*.json shipBuilder
	cd shipBuilder && docker run -t --rm -u $(shell id -u):$(shell id -g) -v $(shell pwd)/shipBuilder:/work -w /work python:3.6 python add_json_to_html.py

artifacts: shipBuilder.zip

shipBuilder.zip: shipBuilder/index.html shipBuilder/js/hull.js shipBuilder/js/main.js shipBuilder/js/elm.js shipBuilder/*.css shipBuilder/assets/*
	zip -r -9 shipBuilder.zip shipBuilder/index.html shipBuilder/js shipBuilder/css shipBuilder/assets

clean:
	rm -rf shipBuilder/js/elm.js shipBuilder/js/elm.min.js shipBuilder/index.html shipBuilder/index-not-optimized.html shipBuilder.zip shipBuilder/index.template.json.html shipBuilder/*.json buildHull/anthineas.json

shipBuilder/index.html: shipBuilder/index-not-optimized.html
	@sed 's/elm.js/elm.min.js/g' shipBuilder/index-not-optimized.html > shipBuilder/index.html
	@echo "Replaced elm.js by elm.min.js in index.html"

elm-analyse:
	cd elm-analyse && make
	docker run -t --rm -u $(shell id -u):$(shell id -g) -v $(shell pwd):/work -v $(shell pwd)/.elm-analyse:/root/.elm-analyse -w /work elm-analyse

shipBuilder/js/elm.min.js: shipBuilder/js/elm.js shipBuilder/index.html
	cd uglifyjs && docker build -t uglifyjs . ; cd ..
	cp shipBuilder/js/elm.js .
	docker run -t -u $(shell id -u):$(shell id -g) -v $(shell pwd):/work -w /work uglifyjs elm.js --compress 'pure_funcs="F2,F3,F4,F5,F6,F7,F8,F9,A2,A3,A4,A5,A6,A7,A8,A9",pure_getters,keep_fargs=false,unsafe_comps,unsafe' > elm-compressed.js
	rm elm.js
	docker run -t -u $(shell id -u):$(shell id -g) -v $(shell pwd):/work -w /work uglifyjs elm-compressed.js --mangle --output=elm.min.js
	rm elm-compressed.js
	mv elm.min.js shipBuilder/js/elm.min.js

babel:
	cd babel && make && cd ..
	docker run -t --rm -v $(shell pwd):/work -w /work -u $(shell id -u):$(shell id -g) babel
	mv shipBuilder/js/main.babel.js shipBuilder/js/main.js
	mv shipBuilder/js/lib/TransformControls.babel.js shipBuilder/js/lib/TransformControls.js
	cp buildHull/*.json shipBuilder/assets

selenium: shipBuilder/index.html shipBuilder/js/elm.min.js
	cd selenium && make
	docker run -t -v $(shell pwd)/shipBuilder:/work -w /work python-selenium-firefox:firefox38

FILENAME := ../shipBuilderForTest_$(shell date +_%Y%m%d_%Hh%M).tar.gz
BINARIES = shipBuilder/js/* shipBuilder/css/*.css shipBuilder/assets/* shipBuilder/index-not-optimized.html shipBuilder/*.json

binaries:
	tar -cvzf $(FILENAME) $(BINARIES)
