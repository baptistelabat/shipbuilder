* installation de rollup
	npm install --global rollup

* installation des paquets (rollup, ...)
	npm install

* compilation du projet défini dans le fichier rollup.config.js
	rollup -c

* execution app dans node
	node app.js -f outxxl.json

* Le fichier src/hull.js contient le code de la fonction

		buildHull : input json
		return THREE.Mesh


* Dans la pratique, utiliser le fichier ./js/test.js généré par la commande:
rollup -c
