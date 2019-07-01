.PHONY: all clean docker-build

all: MPOV.json ROPAX.json OSV.json OPV.json

docker-build:
	docker build -t stl2json .

OPV.json: docker-build Stl/OPV2.stl mesh2json.py
	docker run --rm -t -v $(shell pwd):/app -w /app -u $(shell id -u):$(shell id -g) stl2json -f Stl/OPV2.stl -o OPV.json -v --nx 10 --ny 10 -d y- --offset 0.1

# ROPAX_retouche1.stl is ROPAX.stl with z down
ROPAX.json: docker-build Stl/ROPAX_retouche1.stl mesh2json.py
	docker run --rm -t -v $(shell pwd):/app -w /app -u $(shell id -u):$(shell id -g) stl2json -f Stl/ROPAX_retouche1.stl -o ROPAX.json -v --nx 10 --ny 10 -d y- --offset 0.1

OSV.json: docker-build Stl/OSV1.stl mesh2json.py
	docker run --rm -t -v $(shell pwd):/app -w /app -u $(shell id -u):$(shell id -g) stl2json -f Stl/OSV1.stl -o OSV.json -v --nx 10 --ny 10 -d y- --offset 0.1

clean:
	rm *.json
