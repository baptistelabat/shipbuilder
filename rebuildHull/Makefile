.PHONY: all
all:
	docker build -t rollup .
	docker run -t -u $(shell id -u):$(shell id -g) -v $(shell pwd):/work -w /work rollup
