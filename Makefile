.PHONY: all clean artifacts

all: shipBuilder/js/elm.js

shipBuilder/js/elm.js: src/*
	rm -rf elm-stuff/generated-code || true
	docker build -t shipbuilder-build .
	docker run -t --rm --name shipbuilder-build -v `pwd`:/work -u $(shell id -u):$(shell id -g) -w /work shipbuilder-build

artifacts: shipBuilder.zip

shipBuilder.zip: shipBuilder/index.html shipBuilder/js/elm.js shipBuilder/*.css shipBuilder/assets/*
	zip -r -9 shipBuilder.zip shipBuilder/index.html shipBuilder/js shipBuilder/css shipBuilder/assets

clean:
	rm -rf shipBuilder/js/elm.js shipBuilder.zip elm-stuff/generated-code elm-stuff/build-artifacts