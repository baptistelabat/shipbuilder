* construction fichier json
	python vtkRayIntersection.py -f anthineas.stl -o outxxl.json -v --nx 20 --ny 10 -d y- --offset 0.1 --lx 0.1 0.5 1.0 5.0 10.0 20.0 21.0 22.0

* installation de rollup
	npm install --global rollup

* installation des paquets (rollup, ...)
	npm install

* compilation du projet défini dans le fichier rollup.config.js
	rollup -c

* execution app dans node
	node app.js -f outxxl.json
