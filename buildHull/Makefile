.PHONY: all clean

all: anthineas.json OPV.json KCS.json DTMB_5415.json


anthineas.json: ../shipBuilder/assets/anthineas.stl mesh2json.py
	cp ../shipBuilder/assets/anthineas.stl .
	docker build -t stl2json .
	docker run --rm -t -v $(shell pwd):/app -w /app -u $(shell id -u):$(shell id -g) stl2json -f anthineas.stl -o anthineas.json -v --nx 10 --ny 10 -d y- --offset 0.1
	rm anthineas.stl

OPV.json: ../shipBuilder/assets/OPV.stl mesh2json.py
	cp ../shipBuilder/assets/OPV.stl .
	docker build -t stl2json .
	docker run --rm -t -v $(shell pwd):/app -w /app -u $(shell id -u):$(shell id -g) stl2json -f OPV.stl -o OPV.json -v --nx 10 --ny 10 -d y- --offset 0.1
	rm OPV.stl

KCS.json: ../shipBuilder/assets/KCS.stl mesh2json.py
	cp ../shipBuilder/assets/KCS.stl .
	docker build -t stl2json .
	docker run --rm -t -v $(shell pwd):/app -w /app -u $(shell id -u):$(shell id -g) stl2json -f KCS.stl -o KCS.json -v --nx 10 --ny 10 -d y- --offset 0.1
	rm KCS.stl

DTMB_5415.json: ../shipBuilder/assets/DTMB_5415.stl mesh2json.py
	cp ../shipBuilder/assets/DTMB_5415.stl .
	docker build -t stl2json .
	docker run --rm -t -v $(shell pwd):/app -w /app -u $(shell id -u):$(shell id -g) stl2json -f DTMB_5415.stl -o DTMB_5415.json -v --nx 10 --ny 10 -d y- --offset 0.1
	rm DTMB_5415.stl

clean:
	rm *.json