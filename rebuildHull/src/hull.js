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
        var xmin = json['xmin'];
        var ymin = json['ymin'];
        var zmin = json['zmin'];
		var slices = json['slices'];

		var geometry = new THREE.Geometry();

		var nx = slices.length;
		var ny = slices[0]['y'].length;
        var make_symmetric = function(y) {var y1 = y.slice(); var y2 = y.reverse().map(function(y){return 1-y;}) ;return y1.concat(y2);};
        slices = slices.map(function(slice){slice['y'] = make_symmetric(slice['y']); return slice;});

		slices.forEach(function (slice)
		{
			var x = slice['x'];
			var ys = slice['y'];
			var zmin_slice = slice['zmin'];
			var zmax_slice = slice['zmax'];
			var dz = (zmax_slice - zmin_slice) / (ny-1);
            for (var i = 0 ; i < ny ; i++)
            {
                var y = ys[i];
				var z = zmin_slice + dz*i;
				geometry.vertices.push(new THREE.Vector3( x*L+xmin,y*B+ymin,z*H+zmin ));
            }
            for (var i = 0 ; i < ny ; i++)
            {
                var y = ys[i+ny];
				var z = zmax_slice - dz*i;
				geometry.vertices.push(new THREE.Vector3( x*L+xmin,y*B+ymin,z*H+zmin ));
            }
		});

		for (let i = 0; i < nx -1 ; i++){
			for(let j=0; j<ny -1 ; j++)
			{
				var k1 = 2*i*ny+j;
				var k2 = k1+1;
				var k3 = k1+2*ny;
				var k4 = k3 + 1;

				geometry.faces.push( new THREE.Face3( k1, k2, k3 ) );
				geometry.faces.push( new THREE.Face3( k2, k4, k3 ) );
			}
		}
        for (let i = 0; i < nx -1 ; i++){
			for(let j=2*ny-2; j>ny -2 ; j--)
			{
				var k1 = 2*i*ny+j;
				var k2 = k1+1;
				var k3 = k1+2*ny;
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
