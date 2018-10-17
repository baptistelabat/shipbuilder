function getIntersectOfPartitionsWithHull(hull, partitions) {
    if (hull && partitions.length) {
        const hullCSG = THREE.CSG.fromMesh(hull);
        const results = partitions.map(partition => {
            const partitionCSG = THREE.CSG.fromMesh(partition);
            const partitionIntersected = partitionCSG.intersect(hullCSG);
            var result = THREE.CSG.toMesh(partitionIntersected, new THREE.MeshBasicMaterial({
                color: 0x88BB88
            }));
            return { matrix: result.matrix, geometry: { vertices: result.geometry.vertices, faces: result.geometry.faces } };
        });
        return results;
    }
}

function parseObjectForCsg(object) {
    const matrix4 = new THREE.Matrix4();
    const face3 = new THREE.Face3(0, 0, 0);

    object.updateMatrix = function () { };
    Object.setPrototypeOf(object.matrix, Object.getPrototypeOf(matrix4));
    object.geometry.faces.forEach(face => {
        Object.setPrototypeOf(face, Object.getPrototypeOf(face3));
    });
}