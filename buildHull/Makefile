.PHONY: all clean

all: MPOV.json ROPAX.json OSV.json OPV.json


anthineas.json: ../buildHull/Stl/anthineas.stl mesh2json.py
	cp ../buildHull/Stl/anthineas.stl .
	docker build -t stl2json .
	docker run --rm -t -v $(shell pwd):/app -w /app -u $(shell id -u):$(shell id -g) stl2json -f anthineas.stl -o anthineas.json -v --nx 10 --ny 10 -d y- --offset 0.1
	rm anthineas.stl

OPV.json: ../buildHull/Stl/OPV2.stl mesh2json.py
	cp ../buildHull/Stl/OPV2.stl .
	docker build -t stl2json .
	docker run --rm -t -v $(shell pwd):/app -w /app -u $(shell id -u):$(shell id -g) stl2json -f OPV2.stl -o OPV.json -v --nx 10 --ny 10 -d y- --offset 0.1
	rm OPV2.stl

KCS.json: ../buildHull/Stl/KCS.stl mesh2json.py
	cp ../buildHull/Stl/KCS.stl .
	docker build -t stl2json .
	docker run --rm -t -v $(shell pwd):/app -w /app -u $(shell id -u):$(shell id -g) stl2json -f KCS.stl -o KCS.json -v --nx 10 --ny 10 -d y- --offset 0.1
	rm KCS.stl

DTMB_5415.json: ../buildHull/Stl/DTMB_5415.stl mesh2json.py
	cp ../buildHull/Stl/DTMB_5415.stl .
	docker build -t stl2json .
	docker run --rm -t -v $(shell pwd):/app -w /app -u $(shell id -u):$(shell id -g) stl2json -f DTMB_5415.stl -o DTMB_5415.json -v --nx 10 --ny 10 -d y- --offset 0.1
	rm DTMB_5415.stl

# ROPAX_retouche1.stl is ROPAX_retouche1.stl with z down
ROPAX.json: ../buildHull/Stl/ROPAX_retouche1.stl mesh2json.py
	cp ../buildHull/Stl/ROPAX_retouche1.stl .
	docker build -t stl2json .
	docker run --rm -t -v $(shell pwd):/app -w /app -u $(shell id -u):$(shell id -g) stl2json -f ROPAX_retouche1.stl -o ROPAX.json -v --nx 10 --ny 10 -d y- --offset 0.1
	rm ROPAX_retouche1.stl

OSV.json: ../buildHull/Stl/OSV1.stl mesh2json.py
	cp ../buildHull/Stl/OSV1.stl .
	docker build -t stl2json .
	docker run --rm -t -v $(shell pwd):/app -w /app -u $(shell id -u):$(shell id -g) stl2json -f OSV1.stl -o OSV.json -v --nx 10 --ny 10 -d y- --offset 0.1
	rm OSV1.stl

clean:
	rm *.json
