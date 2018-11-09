.PHONY: all build clean artifacts

VERSION := $(if $(shell git tag -l --points-at HEAD),$(shell git tag -l --points-at HEAD),$(shell git rev-parse --short=8 HEAD))

all: build

build: shipBuilder/js/elm.js shipBuilder/index.html

shipBuilder/js/elm.js: src/*
	rm -rf elm-stuff/generated-code || true
	docker build -t shipbuilder-build .
	docker run -t --rm --name shipbuilder-build -v `pwd`:/work -u $(shell id -u):$(shell id -g) -w /work shipbuilder-build

shipBuilder/index.html: shipBuilder/index.template.html
	@sed 's/GIT_SHA/$(VERSION)/g' shipBuilder/index.template.html > shipBuilder/index.html
	@echo "Added GIT SHA to index.html"

artifacts: shipBuilder.zip

shipBuilder.zip: shipBuilder/index.html shipBuilder/js/elm.js shipBuilder/*.css shipBuilder/assets/*
	zip -r -9 shipBuilder.zip shipBuilder/index.html shipBuilder/js shipBuilder/css shipBuilder/assets

clean:
	rm -rf shipBuilder/js/elm.js shipBuilder.zip elm-stuff/generated-code elm-stuff/build-artifacts