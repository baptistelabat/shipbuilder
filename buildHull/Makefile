.PHONY: all

all: anthineas.json

anthineas.json: anthineas.stl
	docker build -t stl2json .
	docker run --rm -it -v $(shell pwd):/app -w /app -u $(shell id -u):$(shell id -g) stl2json -f anthineas.stl -o anthineas.json -v --nx 10 --ny 10 -d y- --offset 0.1
