'use strict';

const app = Elm.Main.init({node: document.getElementById('elm-app'), flags: flags});

const mouse = new THREE.Vector2(); // used to store the cursor's position
const wrapperId = "three-wrapper"; // defined in elm

let canPan = false; // if the user can move the camera (in orthographic scenes)
let panning = false; // if the user is moving the camera
let multipleSelect = false; // if the user is using the modifier (Ctrl) to select multiple objects
let selection = []; // the array of selected uuids (blocks only)

let transformControlsBasis = { // is used to calculate the transformations applied by a transformControls and apply them to other elements (multiple selection)
    position: null // stores the position of the element the gizmo is attached to
}

let views = [];
let mode = null; // ViewMode in Elm : which tab is active ('block', 'hull', 'kpi', 'partition')

let hovered = null; // the first object under the cursor in the scene
let wrapper = null; // parent of canvas, used for resizing
let canvas = null;
let renderer = null;
let scene = null;
let raycaster = new THREE.Raycaster(); // used to find the objects under the cursor on click, mousemove etc
let loader = new THREE.STLLoader();

let preventSelection = false; // prevents selecting another block when moving one for example
let showingPartitions = true;
// ThreeJs coordinate system to ship coordinate system
let coordinatesTransform = new THREE.Matrix3();


let toShipCoordinates = function (x, y, z, coordinatesTransform) {
    const initVector = new THREE.Vector3(x, y, z);
    const resultVector = initVector.applyMatrix3(coordinatesTransform);
    return resultVector;
}

let toThreeJsCoordinates = function (x, y, z, coordinatesTransform) {
    const initVector = new THREE.Vector3(x, y, z);
    const inversedTransform = new THREE.Matrix3();
    inversedTransform.getInverse(coordinatesTransform);
    const resultVector = initVector.applyMatrix3(inversedTransform);
    return resultVector;
}

app.ports.toJs.subscribe(function (message) {
    const data = message.data;
    switch (message.tag) {
        case "add-block-to-selection":
            addBlockToSelectionFromElm(data);
            break;
        case "blocks-visibility":
            toggleBlocksVisibility(data);
            break;
        case "export-csv":
            saveCSV("export", data);
            break;
        case "export-stl":
            exportSTL(data);
            break;
        case "init-three":
            initThree(data);
            break;
        case "read-json-file": // used to read a save file
            readFile(data);
            break;
        case "restore-save":
            restoreSave(data);
            break;
        case "add-block": // when creating a new block
            addCube(data.label, getThreeColorFromElmColor(data.color));
            break;
        case "load-hull":
            loadHull(data);
            break;
        case "unload-hull": // remove the hull model in the scene
            unloadHull();
            break;
        case "make-bulkheads":
            makeBulkheads(data);
            break;
        case "make-decks":
            makeDecks(data);
            break;
        case "remove-block":
            removeObject(data);
            break;
        case "remove-blocks":
            removeObjects(data);
            break;
        case "remove-block-from-selection": // unselect one in multiple select
            removeBlockFromSelectionFromElm(data);
            break;
        case "select-block":
            selectBlockFromElm(data);
            break;
        case "showing-partitions":
            toggleShowingPartitions(data);
            break;
        case "switch-mode": // used to synchronize the view mode with Elm
            switchMode(data);
            break;
        case "update-color":
            updateColor(data);
            break;
        case "update-position":
            updatePosition(data);
            break;
        case "update-size":
            updateSize(data);
            break;
        default:
    }
})


let sendToElm = function (tag, data) {
    app.ports.fromJs.send({ tag: tag, data: data });
}

let switchMode = function (newMode) {
    if (newMode !== mode) { // only when the mode changes
        resetSelection();
        mode = newMode;

        // sets opacity = 1 to objects active in the given mode, sets it to 0.2 otherwise
        const sbObjects = scene.children.filter(child => child.sbType);
        sbObjects.forEach(object => {
            setObjectOpacityForCurrentMode(object);
        })
    }
}

let toggleBlocksVisibility = function (data) {
    const visible = data.visible;
    const uuids = data.uuids;
    // keeps blocks in the scene matching one of the given uuids
    const blocks = scene.children.filter(child => isBlock(child) && uuids.includes(child.uuid));

    blocks.forEach(block => {
        // .visible is a ThreeJs attribute, when false the block is not rendered
        block.visible = visible;
    });
}

let setObjectOpacityForCurrentMode = function (object) {
    if (object.sbType === mode) { // if the object is "active" in the current mode (a block in the "block" mode, a deck in the "partition" mode etc)
        object.material.opacity = 1;
        object.material.transparent = false;
    } else {
        object.material.opacity = 0.2;
        object.material.transparent = true;
    }
}


let readFile = function (inputId) {
    var node = document.getElementById(inputId);
    if (node === null) {
        return;
    }

    var file = node.files[0];
    var reader = new FileReader();

    // FileReader API is event based. Once a file is selected
    // it fires events. We hook into the `onload` event for our reader.
    reader.onload = (function (event) {
        var contents = event.target.result;
        // sends the content of the file to Elm to handle the restoration
        sendToElm("save-data", JSON.parse(contents));
    });

    // Connect our FileReader with the file that was selected in our `input` node.
    reader.readAsText(file);
}

let restoreSave = function (savedData) {
    const savedBlocks = savedData.blocks;
    const savedCoordinatesTransform = savedData.coordinatesTransform;
    const decks = savedData.decks;
    const bulkheads = savedData.bulkheads;
    const viewMode = savedData.viewMode;
    const showing = savedData.showingPartitions;

    mode = viewMode;
    showingPartitions = showing;
    resetScene(views, scene);
    setCoordinatesTransformFromElm(savedCoordinatesTransform); // save the matrix in JS' state for the next transformations
    restoreBlocks(savedBlocks);
    makeDecks(decks);
    makeBulkheads(bulkheads);
}

// clean the scene, reset selection and gizmos
let resetScene = function (views, scene) {
    views.forEach(view => {
        // if we don't detach the controls (gizmo), the removal of the selected block (if any) won't work and will crash the page
        if (view.control) {
            view.control.detach();
        }
    })
    resetSelection();
    const sbObjectsToDelete = scene.children.filter(child => child.sbType);
    sbObjectsToDelete.forEach(toDelete => removeFromScene(toDelete));
}

let restoreBlocks = function (blocks) {
    blocks.forEach(block => {
        restoreBlock(block.uuid, block.color, block.position, block.size, block.visible);
    });
}

let setCoordinatesTransformFromElm = function (elmCoordinatesTransform) {
    // the elm matrix maps threejs's coordinate system to the ship's one
    // we want the ship's coordinate system mapped to threejs' one
    const inversedCoordinatesTransform = new THREE.Matrix3();
    inversedCoordinatesTransform.fromArray(elmCoordinatesTransform);
    coordinatesTransform.getInverse(inversedCoordinatesTransform);
}

let updateColor = function (data) {
    const object = findObjectByUUID(data.uuid);
    if (object) {
        // baseColor is the color of the object in ThreeJS format
        // it will be used to compute the highlight color on select and over and to restore the object color when "idle"
        object.baseColor = getThreeColorFromElmColor(data.color);
        if (isObjectSelected(object)) {
            selectObject(object);
        } else if (isObjectHovered(object)) {
            highlightObject(object);
            hovered = object;
        } else {
            resetElementColor(object);
        }
    }
}

// apply Math.abs() to the 3 components of the vector
let absVector3 = function (vector3) {
    return new THREE.Vector3(Math.abs(vector3.x), Math.abs(vector3.y), Math.abs(vector3.z));
}


let makeBulkheads = function (bulkheads) {
    const oldBulkheads = scene.children.filter(child =>
        child.sbType // checks if the sbType attribute exists to prevent JS from crashing on an undefined check
        && child.sbType === "partition"
        && child.partitionType // checks if the partitionType attribute exists
        && child.partitionType === "bulkhead"
    );
    oldBulkheads.forEach(oldBulkhead => removeFromScene(oldBulkhead));

    const bulkheadColor = new THREE.Color(0.5, 0.5, 1); // blue
    // color of the bulkhead #0
    const zeroColor = new THREE.Color(1, 0.5, 0.5); // red

    bulkheads.forEach(bulkhead => {
        const index = bulkhead.index;
        const number = bulkhead.number;
        const xPosition = bulkhead.position;
        const size = 500;
        const geometry = new THREE.Geometry();

        // create a 4 points that compose a square centered in 0,0,0
        geometry.vertices.push(toThreeJsCoordinates(0, -size / 2, -size / 2, coordinatesTransform));
        geometry.vertices.push(toThreeJsCoordinates(0, -size / 2, size / 2, coordinatesTransform));
        geometry.vertices.push(toThreeJsCoordinates(0, size / 2, size / 2, coordinatesTransform));
        geometry.vertices.push(toThreeJsCoordinates(0, size / 2, -size / 2, coordinatesTransform));
        const color = number ? bulkheadColor : zeroColor;
        var material = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });

        // create a line from those 4 points
        var bulkhead = new THREE.LineLoop(geometry, material);
        // sets the position of the bulkhead on the x axis
        bulkhead.position.copy(toThreeJsCoordinates(xPosition, 0, 0, coordinatesTransform));

        // used to include or exclude partitions when filtering objects in the scene
        bulkhead.sbType = "partition";
        bulkhead.baseColor = color;
        bulkhead.visible = showingPartitions;
        // used to separate bulkheads from decks among partitions
        bulkhead.partitionType = "bulkhead";
        // used to retrieve the bulkhead by its index in Elm (from 0 to N)
        bulkhead.partitionIndex = index;
        // used to retrieve the bulkhead by its number in Elm (actual number of the bulkhead)
        bulkhead.partitionNumber = number;
        // sets opacity based on the current ViewMode : 1 if partitions tab open, 0.2 otherwise
        setObjectOpacityForCurrentMode(bulkhead);
        scene.add(bulkhead);
    })
}

let toggleShowingPartitions = function (showing) {
    showingPartitions = showing;
    scene.children
        .filter(child =>
            // keeps only partitions
            child.sbType && child.sbType === "partition"
        )
        .forEach(partition => {
            // prevents their rendering
            partition.visible = showing;
        });
}

let makeDecks = function (decks) {
    const oldDecks = scene.children.filter(child =>
        child.sbType
        && child.sbType === "partition"
        && child.partitionType
        && child.partitionType === "deck"
    );
    oldDecks.forEach(oldDeck => removeFromScene(oldDeck));

    const deckColor = new THREE.Color(0.5, 0.5, 1); // blue
    // color of the deck #0
    const zeroColor = new THREE.Color(1, 0.5, 0.5); // red

    decks.forEach(deck => {
        const index = deck.index;
        const number = deck.number;
        const zPosition = deck.position;
        const size = 500;
        const geometry = new THREE.Geometry();

        // create a 4 points that compose a square centered in 0,0,0
        geometry.vertices.push(toThreeJsCoordinates(-size / 2, -size / 2, 0, coordinatesTransform));
        geometry.vertices.push(toThreeJsCoordinates(-size / 2, size / 2, 0, coordinatesTransform));
        geometry.vertices.push(toThreeJsCoordinates(size / 2, size / 2, 0, coordinatesTransform));
        geometry.vertices.push(toThreeJsCoordinates(size / 2, -size / 2, 0, coordinatesTransform));
        const color = number ? deckColor : zeroColor;
        var material = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });

        // create a line from the previous 4 points
        var deck = new THREE.LineLoop(geometry, material);
        // set the position of the deck on the Z axis (-z going up)
        deck.position.copy(toThreeJsCoordinates(0, 0, zPosition, coordinatesTransform));

        // used to include or exclude partitions when filtering objects in the scene
        deck.sbType = "partition";
        deck.baseColor = color;
        deck.visible = showingPartitions;
        // used to separate decks from bulkheads among partitions
        deck.partitionType = "deck";
        // used to retrieve the deck by its index in Elm (from 0 to N)
        deck.partitionIndex = index;
        // used to retrieve the deck by its actual number (relative to deck #0)
        deck.partitionNumber = number;
        // set opacity to 1 if partitions' tab active
        setObjectOpacityForCurrentMode(deck);
        scene.add(deck);
    })
}

// remove the hull model from the scene if any
let unloadHull = function () {
    // find the hull in the scene based on the sbType attribute (evaluate to null, if there is none)
    const previousHull = scene.children.find(child => child.sbType && child.sbType === "hull");
    if (previousHull) {
        removeFromScene(previousHull);
    }
}

let buildHullGeometry = function ( json ) {
    var H = json['depth'];
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

            geometry.faces.push( new THREE.Face3( k1, k4, k3 ) );
            geometry.faces.push( new THREE.Face3( k1, k2, k4 ) );
        }
    }
    for (let i = 0; i < nx -1 ; i++){
        for(let j=2*ny-2; j>ny -2 ; j--)
        {
            var k1 = 2*i*ny+j;
            var k2 = k1+1;
            var k3 = k1+2*ny;
            var k4 = k3 + 1;

            // geometry.faces.push( new THREE.Face3( k1, k3, k2 ) );
            // geometry.faces.push( new THREE.Face3( k2, k3, k4 ) );
            geometry.faces.push( new THREE.Face3( k1, k2, k3 ) );
            geometry.faces.push( new THREE.Face3( k2, k4, k3 ) );
        }
    }

    // BEGIN close the mesh
    var i=0;
    for(let j=0; j<ny -1 ; j++)
    {
        var k1 = i*(2*ny)+j;
        var k2 = k1+1;
        var k3 = (i+1)*(2*ny)-1-j;
        var k4 = k3 - 1;

        geometry.faces.push( new THREE.Face3( k2, k1, k3 ) );
        geometry.faces.push( new THREE.Face3( k2, k3, k4 ) );
    }

    i=nx-1;
    for(let j=0; j<ny -1 ; j++)
    {
      var k1 = i*(2*ny)+j;
      var k2 = k1+1;
      var k3 = (i+1)*(2*ny)-1-j;
      var k4 = k3 - 1;

        // geometry.faces.push( new THREE.Face3( k2, k1, k3 ) );
        // geometry.faces.push( new THREE.Face3( k2, k3, k4 ) );
        geometry.faces.push( new THREE.Face3( k2, k3, k1 ) );
        geometry.faces.push( new THREE.Face3( k2, k4, k3 ) );
    }

    for (let i = 0; i < nx -1 ; i++){
      var k1 = 2*i*ny;
      var k2 = k1+(2*ny);
      var k3 = k2-1;
      var k4 = k3+(2*ny);

      geometry.faces.push( new THREE.Face3( k1, k2, k3 ) );
      geometry.faces.push( new THREE.Face3( k2, k4, k3 ) );
    }
    // END close the mesh


    //compute Normals
    geometry.computeVertexNormals();
    geometry.computeFaceNormals();
    return geometry;
}

let loadHull = function (json) {
        // there can only be one hull in the scene so remove the current one, if any
        unloadHull();

        const hullColor = new THREE.Color(3/255, 146/255, 255/255); // light blue
        // the STL loader returns a bufferGeometry. We can't read its vertices and faces
        // we need to convert it to an "actual" geometry to access these
        const geometry = buildHullGeometry(json);
        const volume = calcVolume(geometry);

        const shipVertices = geometry.vertices;

        const material = new THREE.MeshLambertMaterial({color: hullColor, side: THREE.DoubleSide});

        const hull1 = new THREE.Mesh(geometry, material);
        saveSTL(hull1, "Test");

        // convert the coordinate system to Threejs' one, otherwise the hull would be rotated
        geometry.vertices = shipVertices.map(vertex => {
            return toThreeJsCoordinates(vertex.x, vertex.y, vertex.z, coordinatesTransform);
        });

        const hull = new THREE.Mesh(geometry, material);

        // var vnh = new THREE.VertexNormalsHelper( hull, 1, 0xff0000 );
        // scene.add( vnh );

        var axh = new THREE.AxesHelper ( 5.0 );
        scene.add( axh );

        hull.baseColor = hullColor;
        hull.sbType = "hull";
        scene.add(hull);

}

let hullVolume = function (json) {
  // the STL loader returns a bufferGeometry. We can't read its vertices and faces
  // we need to convert it to an "actual" geometry to access these
  const geometry = buildHullGeometry(json);
  const volume = calcVolume(geometry);
  return volume;
}

let calcVolume = function (geom) {
//var geom = new THREE.Geometry().fromBufferGeometry(geom_);
var faces_ = geom.faces;
var vertices = geom.vertices;
var volumes = 0;
console.log ("print before volume: " + Math.abs(volumes));
for(var i = 0; i < faces_.length; i++){
  var Pi = faces_[i].a;
  var Qi = faces_[i].b;
  var Ri = faces_[i].c;

  var P = new THREE.Vector3(vertices[Pi].x, vertices[Pi].y, vertices[Pi].z);
      var Q = new THREE.Vector3(vertices[Qi].x, vertices[Qi].y, vertices[Qi].z);
      var R = new THREE.Vector3(vertices[Ri].x, vertices[Ri].y, vertices[Ri].z);

  volumes += signedVolumeOfTriangle(P, Q, R);
}
console.log ("print volume: " + Math.abs(volumes));
return Math.abs(volumes);
}

let signedVolumeOfTriangle = function (p1, p2, p3) {
  var v321 = p3.x*p2.y*p1.z;
  var v231 = p2.x*p3.y*p1.z;
  var v312 = p3.x*p1.y*p2.z;
  var v132 = p1.x*p3.y*p2.z;
  var v213 = p2.x*p1.y*p3.z;
  var v123 = p1.x*p2.y*p3.z;
  return (1.0/6.0)*(-v321 + v231 + v312 - v132 - v213 + v123);
}


// move an object according to the changes made in Elm
let updatePosition = function (data) {
    const object = findObjectByUUID(data.uuid);
    if (object) {
        const position = toThreeJsCoordinates(data.position.x, data.position.y, data.position.z, coordinatesTransform);
        object.position.copy(position);
        // update selection and hover (if selected or hovered) with the updated version of the object
        if (isObjectSelected(object)) {
            selectObject(object);
        } else if (isObjectHovered(object)) {
            hovered = object;
        }
    }
}

// update the size of an object according to the changes made in Elm
let updateSize = function (data) {
    const object = findObjectByUUID(data.uuid);
    if (object) {
        const newSize = sizeToThreeJsCoordinates(data.size.x, data.size.y, data.size.z, coordinatesTransform);
        // compute the current size of the object
        const currentSize = getObjectSize(object);
        const newXSize = newSize.x;
        const currentXSize = currentSize.x;
        const newYSize = newSize.y;
        const currentYSize = currentSize.y;
        const newZSize = newSize.z;
        const currentZSize = currentSize.z;
        // to resize an object, we need to change its scale
        object.scale.set(newXSize / currentXSize, newYSize / currentYSize, newZSize / currentZSize);
        // update selection and hover (if selected or hovered) with the updated version of the object
        if (isObjectSelected(object)) {
            selectObject(object);
        } else if (isObjectHovered(object)) {
            hovered = object;
        }
    }
}

let getThreeColorFromElmColor = function (color) { // convert a record { red: {0,255}, green: {0,255}, blue {0,255} } to a ThreeJs color
    // a THREE.Color has its attributes on a scale from 0 to 1 instead of 0 to 255.
    return (new THREE.Color(color.red / 255, color.green / 255, color.blue / 255));
}

let getObjectSize = function (object) {
    object.geometry.computeBoundingBox();
    var bb = object.geometry.boundingBox;
    // return the length of the object's bounding box on each axis
    // if the blocks are not rotated (we don't allow them to be rotated), it matches their actual size
    return {
        x: bb.max.x - bb.min.x,
        y: bb.max.y - bb.min.y,
        z: bb.max.z - bb.min.z
    }
}

// used to create a new block
let addCube = function (label, color = 0x5078ff, sizeX = 10, sizeY = 5, sizeZ = 5, x = 0, y = 0, z = 0) {
    // create a ThreeJs cube
    var cube = makeCube(sizeX, sizeY, sizeZ, x, y, z, color);

    // center on Y axis by moving the cube by half its size
    const size = sizeToShipCoordinates(getObjectSize(cube));
    cube.position.copy(toThreeJsCoordinates(0, -size.y / 2, 0, coordinatesTransform));

    scene.add(cube);
    sendToElm("new-block", { // notify elm of the creation with the uuid
        uuid: cube.uuid,
        label: label,
        color: getRgbRecord(color),
        position: toShipCoordinates(cube.position.x, cube.position.y, cube.position.z, coordinatesTransform),
        size: sizeToShipCoordinates(getObjectSize(cube))
    });
}

// restore a block after reading a save file in Elm
let restoreBlock = function (uuid, color, position, size, visible = true) {
    const threeJsSize = sizeToThreeJsCoordinates(size.x, size.y, size.z, coordinatesTransform);
    const threeJsPosition = toThreeJsCoordinates(position.x, position.y, position.z, coordinatesTransform);
    const threeJsColor = getThreeColorFromElmColor(color);

    const geometry = restoreCubeGeometry(threeJsSize);
    const material = restoreMaterial(threeJsColor);

    const block = new THREE.Mesh(geometry, material);
    // set the opacity based on the current ViewMode (~ active tab in Elm)
    setObjectOpacityForCurrentMode(block);

    block.uuid = uuid;
    block.position.fromArray([threeJsPosition.x, threeJsPosition.y, threeJsPosition.z]);
    block.baseColor = threeJsColor;
    block.sbType = "block";
    block.visible = visible;
    scene.add(block);
}

// input : size in threejs coordinates
let restoreCubeGeometry = function (size) {
    const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
    geometry.translate(size.x / 2, size.y / 2, size.z / 2); // set the origin in the bottom left
    return geometry;
}

// input : threejs color
let restoreMaterial = function (color, opacity = 1) {
    const material = new THREE.MeshBasicMaterial({ color: color, opacity });
    if (opacity < 1) {
        material.transparent = true;
    }
    return material;
}

// convert a size vector in ThreeJs coordinates into the corresponding size vector in the ship's coordinate system (used in Elm and the UI)
let sizeToShipCoordinates = function (size) {
    return absVector3(toShipCoordinates(size.x, size.y, size.z, coordinatesTransform));
}

// convert a size vector used in Elm and the UI into the corresponding size vector in ThreeJS' coordinate system
let sizeToThreeJsCoordinates = function (x, y, z) {
    return absVector3(toThreeJsCoordinates(x, y, z, coordinatesTransform));
}

// convert a THREE.Color to a record readable by Elm
let getRgbRecord = function (threeColor) {
    const rgbArray = threeColor.toArray();
    // the components of a THREE.Color are on a scale from 0 to 1 instead of 0 to 255
    return { red: Math.round(rgbArray[0] * 255), green: Math.round(rgbArray[1] * 255), blue: Math.round(rgbArray[2] * 255) };
}

// create a ThreeJs box of the given size, in the given position and of the given color
let makeCube = function (sizeX, sizeY, sizeZ, x, y, z, color) {
    var geometry = new THREE.BoxGeometry(sizeX, sizeY, sizeZ);
    // set the origin of the block in its lower left corner
    geometry.translate(sizeX / 2, sizeY / 2, sizeZ / 2);

    var material = new THREE.MeshBasicMaterial({ color: color });

    var cube = new THREE.Mesh(geometry, material);
    cube.position.fromArray([x, y, z]);
    cube.baseColor = color;
    cube.sbType = "block";
    return cube;
}

let removeObjects = function (data) {
    data.forEach(block => {
      removeObject(block);
    });
}

// remove an object from the scene
let removeObject = function (block) {
    const objectToRemove = findObjectByUUID(block.uuid);
    if (objectToRemove) {
        if (isObjectHovered(objectToRemove)) {
            // reset hovered
            hovered = null;
        }

        views.forEach(view => {
          if(view.control != null)
          {
            if(view.control.object != null)
            {
              if(view.control.object.uuid === block.uuid )
                detachControls(); // detach gizmo
            }
          }
        });

        if (isObjectSelected(objectToRemove)) {
            // remove object from selection
            removeFromSelection(objectToRemove);
        }

        // delete object from the scene
        removeFromScene(objectToRemove);
    }
}

let removeFromScene = function (objectToRemove) {
    scene.remove(objectToRemove);
    // memory optimization
    objectToRemove.geometry.dispose();
    objectToRemove.material.dispose();
}

let isBlock = function (object) {
    return object && object.uuid && object.sbType === "block";
}

let isHull = function (object) {
    return object && object.uuid && object.sbType === "hull";
}

let isPartition = function (object) {
    return object && object.uuid && object.sbType === "partition";
}

let canChangeInMode = function (object, mode) {
    // if the object is part of the given mode (eg: a block when the mode is "block", the hull when the mode if "hull",...)
    return object && object.sbType === mode;
}


let selectBlock = function (block) {
    if (isBlock(block)) {
        // selection (not multiple) of a block : the result is a single block selected, even if a multiple selection existed before
        resetSelection();
        addToSelection(block);

        // attach the gizmo to the block, to allow moving/scaling it
        attachViewControl(block);
        sendToElm("select", block.uuid);
    }
}

// handle selecting a block in Elm : Elm sends its uuid
let selectBlockFromElm = function (elmBlock) {
    const block = getBlockByUuid(elmBlock.uuid);
    selectBlock(block);
}


// handle multiple select in Elm : Elm sends the uuid of the block to add to the selection
let addBlockToSelectionFromElm = function (elmBlock) {
    const block = getBlockByUuid(elmBlock.uuid);
    addToSelection(block);
}

// handle unselecting a block in a multiple select in Elm : Elm sends the uuid of the block
let removeBlockFromSelectionFromElm = function (elmBlock) {
    const block = getBlockByUuid(elmBlock.uuid);
    removeFromSelection(block);
}

// handle adding a block to/removing a block from a multiple selection from the 3D view
let toggleBlockSelection = function (block) {
    if (isBlock(block)) {
        if (isObjectSelected(block)) {
            removeFromSelection(block);
            sendToElm("remove-from-selection", block.uuid);
        } else {
            addToSelection(block);
            sendToElm("add-to-selection", block.uuid);
        }
    }
}

let addToSelection = function (object) {
    highlightObject(object);
    selection.push(object.uuid);
}

let removeFromSelection = function (object) {
    // reset highlight on the object
    resetElementColor(object);
    // remove the object's uuid from the selection array
    selection = selection.filter(uuid => uuid !== object.uuid);
}


let resetSelection = function () {
    if (selection.length) {
        // reset the highlight on all the blocks in the selection
        selection.forEach(uuid => {
            const selectedBlock = getBlockByUuid(uuid);
            resetElementColor(selectedBlock);
        });
        selection = [];
    }
    // detach the gizmos : they were attached to the first block in the selection
    detachControls();
}

// find a block in the scene with the given uuid
let getBlockByUuid = function (uuid) {
    const block = scene.children.find(child => child.sbType && child.sbType === "block" && child.uuid === uuid);
    return block;
}

// find the blocks in the scene whose uuid matches one in the given array
let getBlocksByUuids = function (uuids) {
    const blocks = uuids.map(uuid => getBlockByUuid(uuid));
    return blocks;
}

let selectObject = function (object) {
    // if the object if "active" : it is part of the current mode (a block in the "block" mode, the hull in the "hull" mode...)
    if (object.sbType && object.sbType === mode) {
        switch (mode) {
            case "block":
                selectBlock(object);
                break;

            case "hull":
                break;

            case "partition":
                selectPartition(object);
                break;

            default:
                break;
        }
    }
}

// handle selecting a partition in the 3D view
let selectPartition = function (partition) {
    if (isPartition(partition)) {
        let positionToSend = 0;
        const positionInShipCoordinates = toShipCoordinates(partition.position.x, partition.position.y, partition.position.z, coordinatesTransform)

        if (partition.partitionType === "deck") {
            // the decks are positioned on the z axis
            positionToSend = positionInShipCoordinates.z;
        } else if (partition.partitionType === "bulkhead") {
            // the x are positiong on the x axis
            positionToSend = positionInShipCoordinates.x;
        }

        sendToElm("select-partition", {
            partitionType: partition.partitionType,
            partitionIndex: partition.partitionIndex,
            partitionPosition: positionToSend
        });
    }
}

// attach the gizmoq to the given block
let attachViewControl = function (block) {
    let currentView = getActiveViewport(views);
    // if the cursor isn't hover any view, take the first one
    if (!currentView && views.length) {
        currentView = views[0];
    }
    // if the current view has a gizmo (stored in .control attribute) ~> if the currentView is orthographic
    if (currentView && currentView.control) {
        // detach the gizmos from the previous object they were set to
        detachControls();
        // attach the gizmo of the current view to the given block
        currentView.control.attach(block);
        // store the current position of the given block as the reference for the following transforms
        setTransformControlsBasis(block);
    }
}

let detachControls = function () {
    views.forEach(view => {
        if (view.control) {
            view.control.detach();
        }
    })
    // set the reference for the transforms to nulls
    setTransformControlsBasis();
}

// store the reference to calculate the transforms made to an object
let setTransformControlsBasis = function (object) {
    if (object) {
        transformControlsBasis.position = object.position.clone();
    } else {
        transformControlsBasis.position = null;
    }
}

let getTranslationBetween = function (positionStart, positionEnd) {
    // both arguments must be THREE.Vector3
    return positionEnd.clone().sub(positionStart);
}

let applyTranslationToObjects = function (objects, translation) {
    // translation must be THREE.Vector3
    objects.forEach(object => {
        object.position.add(translation.clone());
    })
}

// apply the given translation to all the selected elements
let applyTranslationToSelection = function (translation) {
    // retrieve the selected blocks from their uuids
    const selectedBlocks = getBlocksByUuids(selection)
    // we don't want to transform the first object, which is the active object already transformed by the gizmo
    const blocksToTransform = selectedBlocks.slice(1);
    applyTranslationToObjects(blocksToTransform, translation);
    // send the updated objects to Elm
    sendToElm("sync-positions",
        selectedBlocks.map(block => {
            return {
                uuid: block.uuid, position: toShipCoordinates(block.position.x, block.position.y, block.position.z, coordinatesTransform)
            };
        })
    );
}

let findObjectByUUID = function (uuid) {
    return scene.children.find(child => child.uuid === uuid);
}

let onKeyUp = function (event) {
    // if Ctrl is "unpressed", deactive multiple select
    if (event.key === "Control") { multipleSelect = false; }
}

let onKeyDown = function (event) {
    // if Ctrl is pressed, activate multiple select
    if (event.key === "Control") { multipleSelect = true; }
}

// on click end
let onMouseUp = function (event) {
    // if panning was active and right click
    if (panning && event.which === 3) {
        // reset panning
        panning = null;
        preventSelection = false;
    }
}

// on click start
let onMouseDown = function (event) {
    const currentView = getActiveViewport(views);
    // if clicking on a view and panning was active and right click
    if (!preventSelection && currentView && event.which === 3) {
        // store the view being panned
        panning = currentView;
        // prevent selecting another block while panning the camera
        preventSelection = true;
    }
}

let initThree = function (data) {
    window.addEventListener('resize', (event) => onResize(), false);
    document.addEventListener('mousemove', (event) => onMouseMove(event), false)
    document.addEventListener('keydown', (event) => onKeyDown(event), false)
    document.addEventListener('keyup', (event) => onKeyUp(event), false)
    document.addEventListener('mousedown', (event) => onMouseDown(event), false)
    document.addEventListener('mouseup', (event) => onMouseUp(event), false)
    document.addEventListener('wheel', (event) => onWheel(event), false)

    const initViewports = data.viewports;
    const initMode = data.mode;
    const initCoordinatesTransform = data.coordinatesTransform;
    const initDecks = data.decks;
    const initBulkheads = data.bulkheads;
    const showing = data.showingPartitions;

    // create all viewports sent by Elm
    views = initViewports.map(view => {
        // transform the "eye" for the camera
        view.getEye = () => { // ~ the position of the camera
            const converted = toThreeJsCoordinates(view.eye.x, view.eye.y, view.eye.z, coordinatesTransform);
            return [converted.x, converted.y, converted.z]
        };
        // get the THREE.Color for the color of the background of the viewport
        view.getBackground = () => new THREE.Color(view.background.red / 255, view.background.green / 255, view.background.blue / 255);
        // get the details of which axis the user can control the elements on
        view.getCanControl = () => {
            const converted = toThreeJsCoordinates(view.canControl.x, view.canControl.y, view.canControl.z, coordinatesTransform);
            return [converted.x, converted.y, converted.z]
        };
        return view;
    });

    // set starting view mode : ~ the active tab in the UI
    mode = initMode;
    showingPartitions = showing;

    // save the matrix to transform the coordinates of the element from the ship's coordinates system into ThreeJs coordinates system
    setCoordinatesTransformFromElm(initCoordinatesTransform);

    wrapper = document.getElementById(wrapperId);

    initCanvas(wrapper);
    initRenderer();
    initScene();
    initCameras();
    // display the labels of the views hover their upper left corner
    displayLabels();
    initGizmos();
    initOrbitControls();

    makeDecks(initDecks);
    makeBulkheads(initBulkheads);

    // start the rendering loop
    animate();
};

// when the user uses its scrollwheel
let onWheel = function (event) {
    const activeView = getActiveViewport(views);
    // if the user scrolled on an orthographic view
    if (activeView && activeView.cameraType === "Orthographic") {
        // get all the orthographic views
        const orthographicViews = views.filter(view => view.cameraType === "Orthographic");
        // zoom on all of them the same way
        orthographicViews.forEach(orthoView => {
            // "distance" of the scroll multiplied by a coefficient
            // the deltaY is positive when scrolling down
            orthoView.camera.zoom -= event.deltaY * 0.2;
            if (orthoView.camera.zoom < 0.5) {
                // set the minimum zoom level to 0.5 (arbitrary limit, it can't be <= 0)
                orthoView.camera.zoom = 0.5
            }

            // adjusts the size of the gizmo based on the zoom level
            // its base size is 120 (meters), it should be adjusted if the the cameras frustrum changes in the future
            orthoView.control.size = 120 / orthoView.camera.zoom;
        });
    }

}

let displayLabels = function () {
    // remove previous labels
    var labels = document.getElementsByClassName("viewport-label");
    for (var i = labels.length - 1; i >= 0; --i) {
        labels[i].remove();
    }

    views.forEach(view => {
        // create a new element in the DOM
        var label = document.createElement('div');
        // set its content to be the label of the viewport
        label.innerHTML = view.label;
        label.classList.add("viewport-label");
        // move it to the top left corner of the viewport
        label.style.top = 20 + view.top * wrapper.clientHeight + "px";
        label.style.left = 20 + view.left * wrapper.clientWidth + "px";
        // add it to the DOM
        wrapper.appendChild(label);
    });
}

// make a THREE.Color lighter or darker based on the given percentage
let shadeThreeColor = function (threeColor, percent) {
    var color = threeColor.getHex();
    var t = percent < 0 ? 0 : 255, p = percent < 0 ? percent * -1 : percent, R = color >> 16, G = color >> 8 & 0x00FF, B = color & 0x0000FF;
    return 0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B);
}

// render loop
let animate = function () {
    updateCameras(views, scene);
    // if an object that isn't part of the selection is hovered (and highlighted)
    if (hovered && !isObjectSelected(hovered)) {
        // remove highlight from the previous "hovered" element
        resetElementColor(hovered);
    }
    // get the element directly under the cursor
    hovered = getFirstElementUnderCursor(mouse, views, scene);
    // highlight the current "hovered" element
    if (hovered) {
        highlightObject(hovered);
    }
    // notify ThreeJS to draw the updated frame
    requestAnimationFrame(animate);
}

let highlightObject = function (object) {
    // change the mesh color to be 33% lighted than its base color
    object.material.color.set(shadeThreeColor(object.baseColor, 0.333))
}

let resetElementColor = function (element) {
    // set the mesh color to be its base color
    element.material.color.set(element.baseColor)
}

// when the window is resized
let onResize = function (window, event) {
    // update the canvas size
    fitCanvas(canvas, wrapper);
    // notify the renderer of the new size it can draw in
    fitRenderer(canvas);
    // reallocate the available space between the viewports
    updateViewports(views, canvas);
    // fit the cameras in the scene
    fitCameras(views, scene);
    // update the position of the viewports' labels
    displayLabels();
}

let onMouseMove = function (event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;

    // if can control 2 axis and is orthographic
    if (panning && panning.cameraType === "Orthographic" && panning.getCanControl().reduce((prev, current) => prev + (current ? 1 : 0)) === 2) {
        const camera = panning.camera;
        const canControl = panning.getCanControl();

        const eventMovementX = event.movementX !== undefined ? event.movementX : event.mozMovementX;
        const eventMovementY = event.movementY !== undefined ? event.movementY : event.mozMovementY;
        // we weight the movement of the camera with the zoom to keep a constant speed across all zoom levels
        const movementX = eventMovementX / camera.zoom;
        // -eventMovementY because in the browser, Y = 0 is at the bottom of the screen
        const movementY = -eventMovementY / camera.zoom;

        // move the cameras in sync across the different viewports
        views
            .filter(view => view.cameraType === "Orthographic")
            .forEach(view => {
                const camera = view.camera;
                if (canControl[0]) { // can control the X axis (threejs)
                    camera.position.x -= movementX; // move along the X axis
                    if (canControl[2]) { // can control the Z axis (threejs)
                        camera.position.z += movementY; // move along the Z axis
                    }
                }
                if (canControl[1]) { // can control the Y axis (threejs)
                    camera.position.y -= movementY; // move along the Y axis
                    if (canControl[2]) { // can control the Z axis (threejs)
                        camera.position.z += movementX; // move along the Z axis
                    }
                }
            });
    }

    // on panning, disable the orbitControls in perspective view
    views.forEach(view => {
        if (view.orbitControls && view.orbitControls.enabled) {
            view.orbitControls.enabled = false;
        }
    });

    // Switch the active gizmo to the new active view if it changed
    const viewWithGizmo = views.find(view => view.control && view.control.object);
    const currentView = getActiveViewport(views);
    if (currentView) {
        if (!preventSelection) {
            // when using a control, preventSelection is set to true. It allows the user to move the cursor past the viewport when performing a transform
            if (viewWithGizmo && currentView.camera.uuid !== viewWithGizmo.camera.uuid) {
                // detach the last active transformControl if the active view is different from the view that owns it
                detachControls();
            }

            // true if the view can control at least one axis
            const currentViewCanControl = currentView.getCanControl().some(canControl => canControl);

            // if there is something to control
            if (currentView && currentViewCanControl && currentView.control && !currentView.control.object && selection.length) {
                const activeObject = getBlockByUuid(selection[0]);
                if (activeObject) {
                    // set the control to the activeObject (the first element in the selection)
                    currentView.control.attach(activeObject);
                    setTransformControlsBasis(activeObject);
                }
            }
        }

        // if the active view is the perspective view, enable the orbitControls
        if (currentView && currentView.orbitControls && !currentView.orbitControls.enabled) {
            currentView.orbitControls.enabled = true;
        }
    }
}


let updateViewports = function (views, canvas) {
    views.forEach(view => {
        // store the new position and size of the viewport in the viewport object as clientWidth, clientHeight, clientTop, clientLeft
        computeViewportPosition(view, canvas);
        computeViewportSize(view, canvas);
    })
}

let initRenderer = function () {
    // set the renderer to the canvas element
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    // extract the size of the canvas to configure the renderer
    fitRenderer(canvas);
}

let initScene = function () {
    scene = new THREE.Scene();

    var lights = [];
    			lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
    			lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
    			lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

    			lights[ 0 ].position.set( 100, 200, 100 );
    			lights[ 1 ].position.set( 100, -200, 100 );
    			lights[ 2 ].position.set( 0, 0, -200 );

    			scene.add( lights[ 0 ] );
    			scene.add( lights[ 1 ] );
    			scene.add( lights[ 2 ] );
}

let initCameras = function () {
    if (views && views.length) {
        views.forEach(view => {
            // store the new position and size of the viewport in the viewport object as clientWidth, clientHeight, clientTop, clientLeft
            computeViewportPosition(view, canvas);
            computeViewportSize(view, canvas);

            var camera = null;
            if (view.cameraType === "Orthographic") {
                // Views Side, Front, Top
                camera = new THREE.OrthographicCamera( // --> frustum
                    // centered in viewport
                    view.clientWidth / - 2,
                    view.clientWidth / 2,
                    view.clientHeight / 2,
                    view.clientHeight / - 2,
                    // includes everything between {first} units from the camera to {second} units from the camera
                    0,
                    2000
                );
                camera.position.fromArray(view.getEye());
            } else if (view.cameraType === "Perspective") {
                // View Perspective
                camera = new THREE.PerspectiveCamera(
                    // fov
                    18,
                    // ratio
                    view.clientWidth / view.clientHeight,
                    // includes everything between {first} units from the camera to {second} units from the camera
                    0.1,
                    2000
                );
                camera.position.fromArray(view.getEye());
            }
            // otherwise, the camera won't be directed at the scene
            camera.lookAt(scene.position);
            view.camera = camera;
        });
    }
}

let initGizmos = function () {
    views.forEach(view => {
        const canControl = view.getCanControl();

        // make a control if at least one axis can be controlled in the view
        if (canControl[0] || canControl[1] || canControl[2]) {
            var control = new THREE.TransformControls(view, canvas);

            // triggered when the gizmo is used to transform the object
            control.addEventListener("objectChange", event => {
                const mode = control.getMode(); // not the ViewMode but the gizmo's mode : translate, rotate, scale
                const object = control.object;
                switch (mode) {
                    case "translate":
                        // Round position to .2f
                        const position = object.position;
                        const roundedPosition = new THREE.Vector3(
                            Math.round(position.x * 100) / 100,
                            Math.round(position.y * 100) / 100,
                            Math.round(position.z * 100) / 100
                        );
                        // update the position of the object to the rounded one to keep elm and js in sync
                        object.position.set(roundedPosition.x, roundedPosition.y, roundedPosition.z);

                        // compute the translation applied by the gizmo from the init position stored in transformControlsBasis
                        const translation = getTranslationBetween(transformControlsBasis.position, roundedPosition);
                        if (selection.length > 1) { // multi select
                            applyTranslationToSelection(translation);
                        } else {
                            sendToElm("sync-position", {
                                uuid: object.uuid, position: toShipCoordinates(roundedPosition.x, roundedPosition.y, roundedPosition.z, coordinatesTransform)
                            });
                        }

                        break;

                    case "scale":
                        const scale = object.scale;
                        const size = getObjectSize(object);
                        const newSize = { // rounded to .2f
                            x: Math.round(100 * scale.x * size.x) / 100,
                            y: Math.round(100 * scale.y * size.y) / 100,
                            z: Math.round(100 * scale.z * size.z) / 100
                        };
                        // the size can't be 0 or negative. We set the minimum as 0.1m, 10cm
                        if (newSize.x <= 0) {
                            newSize.x = 0.1;
                        }
                        if (newSize.y <= 0) {
                            newSize.y = 0.1;
                        }
                        if (newSize.z <= 0) {
                            newSize.z = 0.1;
                        }

                        object.scale.set(newSize.x / size.x, newSize.y / size.y, newSize.z / size.z)
                        sendToElm("sync-size", {
                            uuid: object.uuid, size: sizeToShipCoordinates(newSize)
                        });
                        break;
                    default:
                        break;
                }

                // store the state after the transform as the initial state for the next transform
                setTransformControlsBasis(object);
            });

            control.addEventListener("mouseDown", event => {
                preventSelection = true; // prevents selecting another block while transforming one with the gizmo
            });
            control.addEventListener("mouseUp", event => {
                preventSelection = false;
            });

            control.size = 120; // init size of the gizmo. Should be updated if the default frustum of the camera is modified
            control.setMode("translate");
            // set the axis controlled by the gizmo for the current viewport
            control.showX = canControl[0];
            control.showY = canControl[1];
            control.showZ = canControl[2];

            view.control = control;
            scene.add(control);
        }
    });
}

// the orbit controls are used in the Perspective view, they enable moving the camera freely and rotating around its target
let initOrbitControls = function () {
    views
        .filter(view => view.cameraType === "Perspective")
        .forEach(view => {
            const control = new THREE.OrbitControls(view.camera);
            view.orbitControls = control;
        });
}

let initCanvas = function (parent) {
    // create a new canvas element
    canvas = document.createElement("canvas");
    canvas.id = "three-canvas";
    canvas.style.position = "absolute"; // used to indicate that the parent can get smaller than the canvas, it will be resized at the next frame to fit its parent

    document.addEventListener("mousedown", onClick, false);
    canvas.addEventListener("dblclick", onDoubleClick, false); // used to cycle through the transform modes

    parent.appendChild(canvas);
    fitCanvas(canvas, wrapper);
}

let onClick = function (event) {
    const activeViewport = getActiveViewport(views);
    switch (event.which) {
        case 1: // left click
            // if the cursor is hover a viewport and an object within this viewport and nothing prevents a new element from being selected
            if (activeViewport && hovered && !preventSelection) {
                if (multipleSelect) {
                    // add/remove the hovered object from multiple selection
                    toggleBlockSelection(hovered);
                } else {
                    // select hovered object
                    selectObject(hovered);
                }
            }
            break;
        case 2: // middle/wheel click
            resetSelection();
            sendToElm("unselect", null);
            break;
        default: // right click

    }
}

let isObjectSelected = function (object) {
    return selection.length && (selection.includes(object.uuid));
}

let isObjectHovered = function (object) {
    return hovered && (hovered.uuid === object.uuid);
}

let onDoubleClick = function (event) { // cycle through the transform modes
    const activeViewport = getActiveViewport(views);
    if (activeViewport) {
        views.forEach(view => {
            // if the mode of the gizmo is translate, set it to scale
            if (view.control && view.control.getMode() === "translate") {
                view.control.setMode("scale");
            } else if (view.control) {
                // if it is not translate, set it to translate
                view.control.setMode("translate");
            }

            // We don't use (yet) the rotate mode. It could be used to rotate a block, the hull or any object
        })
    }
}

// used on window resize for example
let updateCameras = function (views, scene) {
    views.forEach(view => updateCamera(view, scene));
}

let updateCamera = function (view, scene) {
    if (view) {
        const camera = view.camera;
        if (camera) {
            // update the camera to the new size of the viewport/canvas
            renderer.setViewport(view.clientLeft, view.clientTop, view.clientWidth, view.clientHeight);
            renderer.setScissor(view.clientLeft, view.clientTop, view.clientWidth, view.clientHeight);
            renderer.setScissorTest(true);
            renderer.setClearColor(view.getBackground());

            camera.aspect = view.clientWidth / view.clientHeight;
            // needs to be called to account for our updates
            camera.updateProjectionMatrix();
            renderer.render(scene, camera);
        }
    }
}

let fitCameras = function (views) {
    views.forEach(view => {
        var camera = view.camera;

        // resize the orthographic cameras frustum to keep displaying the scene the same size no matter the size of the window
        if (camera && view.cameraType === "Orthographic") {
            camera.left = view.clientWidth / - 2;
            camera.right = view.clientWidth / 2;
            camera.top = view.clientHeight / 2;
            camera.bottom = view.clientHeight / - 2
            // needs to be called to account for our updates
            camera.updateProjectionMatrix();
        }
    })
}

let fitRenderer = function (canvas) {
    if (renderer) {
        renderer.setSize(canvas.width, canvas.height);
    }
}

let fitCanvas = function () {
    if (canvas) {
        // resize the canvas to fit its parent
        canvas.width = wrapper.clientWidth;
        canvas.height = wrapper.clientHeight;
    }
}

// size in pixels on the page
let computeViewportSize = function (view, canvas) {
    view.clientWidth = Math.round(view.width * canvas.width);
    view.clientHeight = Math.round(view.height * canvas.height);
}

// absolute position on the page
let computeViewportPosition = function (view, canvas) {
    view.clientLeft = Math.round(view.left * canvas.width);
    view.clientTop = Math.round(view.top * canvas.height);
};

// bool : is the cursor over the given view
let mouseIsOver = function (view) {
    return mouse.y >= (view.clientTop + wrapper.offsetTop)
        && mouse.y <= (view.clientTop + wrapper.offsetTop + view.clientHeight) // the cursor is between the top and the bottom of the view
        && mouse.x >= (view.clientLeft + wrapper.offsetLeft)
        && mouse.x <= (view.clientLeft + wrapper.offsetLeft + view.clientWidth); // the cursor is between the left and the right of the view
}

// return an array of all objects within the scene that are under the cursor
let getElementsUnderCursor = function (mouse, views, scene) {
    const activeView = getActiveViewport(views);
    if (activeView) {
        const elements = getElementsUnderCursorForView(mouse, activeView, scene);
        // the previous function returns an object containing the object the user is hovering, we only want to keep that
        return elements.map(element => element.object);
    } else {
        // if the cursor isn't over a view, there's no element under the cursor
        return [];
    }
}

// get the viewport the cursor is on
let getActiveViewport = function (views) {
    return views.find(view => mouseIsOver(view));
}

// only keep the elements closest to the camera if several objects are under the cursor
// return null or one 3D object
let getFirstElementUnderCursor = function (mouse, views, scene) {
    const elements = getElementsUnderCursor(mouse, views, scene);
    // only keep the object "active" in the current ViewMode (blocks in block, hull in hull, decks and bulkheads in partition...)
    const modeElements = elements.filter(element => element.sbType && element.sbType === mode);
    if (modeElements.length) {
        return modeElements[0];
    } else {
        return null;
    }
}

let getElementsUnderCursorForView = function (mouse, view, scene) {
    if (view) {
        // the mouse coordinates need to range from 0 to 1 within the viewport
        const normalizedMouse = normalizeMouseCoordinatesForView(mouse, view);
        raycaster.setFromCamera(normalizedMouse, view.camera);
        return raycaster.intersectObjects(scene.children);
    } else {
        return [];
    }
}

let normalizeMouseCoordinatesForView = function (mouse, view) {
    // {x: [-1,1], y: [-1,1] }
    // (-1,-1) = bottom left
    // ( 1, 1) = top right

    // clientLeft is the distance of the view from the left of the canvas
    // wrapper.offsetLeft is the distance between the left of the window and the left of the canvas
    // same thing for the distance from the top
    // STRONG HYPOTHESIS : the wrapper isn't positioned.
    // if the wrapper has its position set to relative or absolute in CSS, we must account for the offset of its parent, its parent's parent (if the parent is positioned) etc
    const offsetX = mouse.x - view.clientLeft - wrapper.offsetLeft;
    const offsetY = mouse.y - (view.clientTop + view.clientHeight + wrapper.offsetTop);
    const normalizedX = (offsetX / view.clientWidth) * 2 - 1;
    const normalizedY = - (offsetY / view.clientHeight) * 2 - 1;
    return new THREE.Vector2(normalizedX, normalizedY);
}

function exportSTL(json){
  // find the hull in the scene based on the sbType attribute (evaluate to null, if there is none)
  // const object = scene.children.find(child => child.sbType && child.sbType === "hull");
  // if ( object != null )
  // {
    // var geometry = object.geometry.clone();
    // const shipVertices = geometry.vertices;
    // // convert the coordinate system to Threejs' one, otherwise the hull would be rotated
    // geometry.vertices = shipVertices.map(vertex => {
    //     return toThreeJsCoordinates(vertex.x, vertex.y, vertex.z, coordinatesTransform);
    // });
    // const hull = new THREE.Mesh(geometry, object.material);
    // saveSTL (hull, name );

  //   saveSTL (object, name );
  // }

  const geometry = buildHullGeometry(json.data);
  const hullColor = new THREE.Color(3/255, 146/255, 255/255); // light blue
  const material = new THREE.MeshLambertMaterial({color: hullColor, side: THREE.DoubleSide});

  // conversion coordinates convention zUp
  const shipVertices = geometry.vertices;
  geometry.vertices = shipVertices.map(vertex => {
      return new THREE.Vector3(vertex.x, -vertex.y, -vertex.z);
  });
  //compute Normals
  geometry.computeVertexNormals();
  geometry.computeFaceNormals();


  const object = new THREE.Mesh(geometry, material);
  saveSTL (object, json.name );

}

function saveSTL( scene, name ){
  var exporter = new THREE.STLExporter();
  var stlString = exporter.parse( scene );

  var blob = new Blob([stlString], {type: 'text/plain'});

  saveAs(blob, name + '.stl');
}

function saveCSV ( name, datas ) {

  var str = "";
  for(var i=0; i< datas.length; i++)
  {
    var z = datas[i].z;
    var xy = datas[i].xy;

    for(var j=0; j< xy.length; j++) {
      var l = z.toString() + ';' + xy[j][0].toString() + ';' + xy[j][1].toString() + '\n';
      str += l;
    }
  }
  var blob = new Blob([str], {type: 'text/plain'});
  saveAs(blob, name + '.csv');
}
