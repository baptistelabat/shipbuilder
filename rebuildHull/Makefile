.PHONY: all clean
all: js/hull.js

fake-passwd:
	echo "node:x:$(shell id -u):$(shell id -g)::/home/node:/bin/bash" > fake-passwd

anthineas.stl: ../buildHull/anthineas.json package.json app.js js/hull.js fake-passwd
	chmod a+rwx js
	docker build -t node:821_rollup .
	cp ../buildHull/anthineas.json .
	docker run -t -v $(shell pwd):/work -w /work -u node --entrypoint "/usr/local/bin/npm" node:821_rollup install
	docker run -t -v $(shell pwd):/work -w /work -u node node:821_rollup app.js -f anthineas.json
	rm anthineas.json

js/hull.js: src/hull.js fake-passwd
	chmod a+rwx js
	docker build -t node:821_rollup .
	docker run -t -v $(shell pwd):/work -w /work -u node --entrypoint "/usr/local/bin/rollup" node:821_rollup -c

clean:
	rm anthineas.stl js/hull.js
