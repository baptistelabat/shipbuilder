import * as THREE from 'three';

var Hull = {

	/**
	 * Returns a hull mesh
	 * @param {json}
	 * @return {THREE.Mesh} The hull mesh
	 **/
	buildHull: function ( json ) {
		var H = json['mouldedDepth'];
		var B = json['breadth'];
		var L = json['length'];
		var slices = json['slices'];

		console.log( 'H: ' + H.toFixed(2));
		console.log( 'B: ' + B.toFixed(2));

		var geometry = new THREE.Geometry();

		var nx = slices.length;
		var ny = slices[0]['y'].length;
		console.log( 'nx: ' + nx.toFixed(0));
		console.log( 'ny: ' + ny.toFixed(0));

		slices.forEach(function (slice)
		{
			var x = slice['x'];
			var zs = slice['z'];
			var y = 0;
			var ys = slice['y'];
			var zmin = slice['zmin'];
			var zmax = slice['zmax'];
			var dz = (zmax - zmin) / (ny-1);
			var z = 0;

			var i=0;
			ys.forEach(function (y)
			{
				//z = zs[i];
				var z1 = zmin + dz*i;
				z = z1;
				i=i+1;
				geometry.vertices.push(new THREE.Vector3( x,y,z ));
				//console.log( x.toFixed(2) + ',' + y.toFixed(2) + ',' + z.toFixed(2));
			});
		});

		for (let i = 0; i < nx -1 ; i++){
			for(let j=0; j<ny -1 ; j++)
			{
				var k1 = i*ny+j;
				var k2 = k1+1;
				var k3 = k1+ny;
				var k4 = k3 + 1;

				geometry.faces.push( new THREE.Face3( k1, k2, k3 ) );
				geometry.faces.push( new THREE.Face3( k2, k4, k3 ) );
			}
		}

		//compute Normals
		geometry.computeVertexNormals();
		geometry.computeFaceNormals();

		const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: false });
		const mesh = new THREE.Mesh(geometry, material);

		return mesh;
  }


};

export { Hull };
