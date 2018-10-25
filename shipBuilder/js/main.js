'use strict';

const div = document.getElementById('elm-app');
const app = Elm.Main.embed(div);

const mouse = new THREE.Vector2();
const wrapperId = "three-wrapper"; // defined in elm

let canPan = false;
let panning = false;
let multipleSelect = false;
let selection = [];

let views = [];
let mode = null;

let hovered = null; // the first object under the cursor in the scene
let wrapper = null; // parent of canvas, used for resizing
let canvas = null;
let renderer = null;
let scene = null;
let raycaster = new THREE.Raycaster(); // used to find the objects under the cursor on click, mousemove etc
let loader = new THREE.STLLoader();

let preventSelection = false;

// ThreeJs to ship
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
        case "init-three":
            initThree(data);
            break;
        case "read-json-file":
            readFile(data);
            break;
        case "restore-save":
            restoreSave(data);
            break;
        case "add-block":
            addCube(data.label, getThreeColorFromElmColor(data.color));
            break;
        case "load-hull":
            loadHull(data);
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
        case "remove-block-from-selection":
            removeBlockFromSelectionFromElm(data);
            break;
        case "select-block":
            selectBlockFromElm(data);
            break;
        case "switch-mode":
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
    resetSelection();
    mode = newMode;

    const sbObjects = scene.children.filter(child => child.sbType);
    sbObjects.forEach(object => {
        setObjectOpacityForCurrentMode(object);
    })
}

let setObjectOpacityForCurrentMode = function (object) {
    if (object.sbType === mode) {
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

    mode = viewMode;
    resetScene(views, scene);
    setCoordinatesTransformFromElm(savedCoordinatesTransform);
    restoreBlocks(savedBlocks);
    makeDecks(decks);
    makeBulkheads(bulkheads);
}

let resetScene = function (views, scene) {
    views.forEach(view => { // if we don't detach the controls, the removal of the selected block (if any) won't work
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
        restoreBlock(block.uuid, block.color, block.position, block.size);
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

let absVector3 = function (vector3) {
    return new THREE.Vector3(Math.abs(vector3.x), Math.abs(vector3.y), Math.abs(vector3.z));
}


let makeBulkheads = function (bulkheads) {
    const oldBulkheads = scene.children.filter(child =>
        child.sbType
        && child.sbType === "partition"
        && child.partitionType
        && child.partitionType === "bulkhead"
    );
    oldBulkheads.forEach(oldBulkhead => removeFromScene(oldBulkhead));

    const bulkheadColor = new THREE.Color(0.5, 0.5, 1);
    const zeroColor = new THREE.Color(1, 0.5, 0.5);

    bulkheads.forEach(bulkhead => {
        const index = bulkhead.index;
        const number = bulkhead.number;
        const xPosition = bulkhead.position;
        const size = 500;
        const geometry = new THREE.Geometry();

        geometry.vertices.push(toThreeJsCoordinates(xPosition, -size / 2, -size / 2, coordinatesTransform));
        geometry.vertices.push(toThreeJsCoordinates(xPosition, -size / 2, size / 2, coordinatesTransform));
        geometry.vertices.push(toThreeJsCoordinates(xPosition, size / 2, size / 2, coordinatesTransform));
        geometry.vertices.push(toThreeJsCoordinates(xPosition, size / 2, -size / 2, coordinatesTransform));
        const color = number ? bulkheadColor : zeroColor;
        var material = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });

        var bulkhead = new THREE.LineLoop(geometry, material);
        bulkhead.sbType = "partition";
        bulkhead.baseColor = color;
        bulkhead.partitionType = "bulkhead";
        bulkhead.partitionIndex = index;
        bulkhead.partitionNumber = number;
        setObjectOpacityForCurrentMode(bulkhead);
        scene.add(bulkhead);
    })
}

let makeDecks = function (decks) {
    const oldDecks = scene.children.filter(child =>
        child.sbType
        && child.sbType === "partition"
        && child.partitionType
        && child.partitionType === "deck"
    );
    oldDecks.forEach(oldDeck => removeFromScene(oldDeck));

    const deckColor = new THREE.Color(0.5, 0.5, 1);
    const zeroColor = new THREE.Color(1, 0.5, 0.5);
    decks.forEach(deck => {
        const index = deck.index;
        const number = deck.number;
        const zPosition = deck.position;
        const size = 500;
        const geometry = new THREE.Geometry();

        geometry.vertices.push(toThreeJsCoordinates(-size / 2, -size / 2, zPosition, coordinatesTransform));
        geometry.vertices.push(toThreeJsCoordinates(-size / 2, size / 2, zPosition, coordinatesTransform));
        geometry.vertices.push(toThreeJsCoordinates(size / 2, size / 2, zPosition, coordinatesTransform));
        geometry.vertices.push(toThreeJsCoordinates(size / 2, -size / 2, zPosition, coordinatesTransform));
        const color = number ? deckColor : zeroColor;
        var material = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });

        var deck = new THREE.LineLoop(geometry, material);
        deck.sbType = "partition";
        deck.baseColor = color;
        deck.partitionType = "deck";
        deck.partitionIndex = index;
        deck.partitionNumber = number;
        setObjectOpacityForCurrentMode(deck);
        scene.add(deck);
    })
}

let loadHull = function (path) {
    loader.load(path, (bufferGeometry) => {
        // there can only be one hull in the scene
        const previousHull = scene.children.find(child => child.sbType && child.sbType === "hull");
        if (previousHull) {
            removeFromScene(previousHull);
        }

        const hullColor = new THREE.Color(0.56, 0.69, 1);
        const geometry = new THREE.Geometry().fromBufferGeometry(bufferGeometry);
        const shipVertices = geometry.vertices;
        geometry.vertices = shipVertices.map(vertex => {
            return toThreeJsCoordinates(vertex.x, vertex.y, vertex.z, coordinatesTransform);
        });
        const material = new THREE.MeshBasicMaterial({ color: hullColor });
        const hull = new THREE.Mesh(geometry, material);

        hull.baseColor = hullColor;
        hull.sbType = "hull";
        scene.add(hull);

        sendToElm("loaded-hull", { uuid: hull.uuid, faces: hull.geometry.faces, vertices: shipVertices });
    });
}

let updatePosition = function (data) {
    const object = findObjectByUUID(data.uuid);
    if (object) {
        const position = toThreeJsCoordinates(data.position.x, data.position.y, data.position.z, coordinatesTransform);
        object.position.copy(position);
        if (isObjectSelected(object)) {
            selectObject(object);
        } else if (isObjectHovered(object)) {
            hovered = object;
        }
    }
}

let updateSize = function (data) {
    const object = findObjectByUUID(data.uuid);
    if (object) {
        const newSize = sizeToThreeJsCoordinates(data.size.x, data.size.y, data.size.z, coordinatesTransform);
        const currentSize = getObjectSize(object);
        const newXSize = newSize.x;
        const currentXSize = currentSize.x;
        const newYSize = newSize.y;
        const currentYSize = currentSize.y;
        const newZSize = newSize.z;
        const currentZSize = currentSize.z;
        object.scale.set(newXSize / currentXSize, newYSize / currentYSize, newZSize / currentZSize);
        if (isObjectSelected(object)) {
            selectObject(object);
        } else if (isObjectHovered(object)) {
            hovered = object;
        }
    }
}

let getThreeColorFromElmColor = function (color) {
    return (new THREE.Color(color.red / 255, color.green / 255, color.blue / 255));
}

let getObjectSize = function (object) {
    object.geometry.computeBoundingBox();
    var bb = object.geometry.boundingBox;
    return {
        x: bb.max.x - bb.min.x,
        y: bb.max.y - bb.min.y,
        z: bb.max.z - bb.min.z
    }
}

let addCube = function (label, color = 0x5078ff, sizeX = 10, sizeY = 5, sizeZ = 5, x = 0, y = 0, z = 0) {
    var cube = makeCube(sizeX, sizeY, sizeZ, x, y, z, color);
    scene.add(cube);
    sendToElm("new-block", {
        uuid: cube.uuid,
        label: label,
        color: getRgbRecord(color),
        position: toShipCoordinates(cube.position.x, cube.position.y, cube.position.z, coordinatesTransform),
        size: sizeToShipCoordinates(getObjectSize(cube))
    });
    // TODO: rewrite size and position !
}

// position and size in ship coordinates
let restoreBlock = function (uuid, color, position, size) {
    const threeJsSize = sizeToThreeJsCoordinates(size.x, size.y, size.z, coordinatesTransform);
    const threeJsPosition = toThreeJsCoordinates(position.x, position.y, position.z, coordinatesTransform);
    const threeJsColor = getThreeColorFromElmColor(color);
    const geometry = restoreCubeGeometry(threeJsSize);
    const material = restoreMaterial(threeJsColor);

    const block = new THREE.Mesh(geometry, material);
    setObjectOpacityForCurrentMode(block);
    block.uuid = uuid;
    block.position.fromArray([threeJsPosition.x, threeJsPosition.y, threeJsPosition.z]);
    block.baseColor = threeJsColor;
    block.sbType = "block";
    scene.add(block);
}

// input : size in threejs coordinates
let restoreCubeGeometry = function (size) {
    const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
    geometry.translate(size.x / 2, size.y / 2, size.z / 2); // place the origin in the bottom left 
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

let sizeToShipCoordinates = function (size) {
    return absVector3(toShipCoordinates(size.x, size.y, size.z, coordinatesTransform));
}
let sizeToThreeJsCoordinates = function (x, y, z) {
    return absVector3(toThreeJsCoordinates(x, y, z, coordinatesTransform));
}

let getRgbRecord = function (threeColor) {
    const rgbArray = threeColor.toArray();
    return { red: Math.round(rgbArray[0] * 255), green: Math.round(rgbArray[1] * 255), blue: Math.round(rgbArray[2] * 255) };
}

let makeCube = function (sizeX, sizeY, sizeZ, x, y, z, color) {
    var geometry = new THREE.BoxGeometry(sizeX, sizeY, sizeZ);
    geometry.translate(sizeX / 2, sizeY / 2, sizeZ / 2);

    var material = new THREE.MeshBasicMaterial({ color: color /*, opacity: 0.7*/ });
    //material.transparent = true;

    var cube = new THREE.Mesh(geometry, material);
    cube.position.fromArray([x, y, z]);
    cube.baseColor = color;
    cube.sbType = "block";
    return cube;
}

let removeObject = function (block) {
    const objectToRemove = findObjectByUUID(block.uuid);
    if (objectToRemove) {
        if (isObjectHovered(objectToRemove)) {
            hovered = null;
        }
        if (isObjectSelected(objectToRemove)) {
            resetSelection();
        }

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
    return object && object.sbType === mode;
}

let selectBlock = function (block) {
    if (isBlock(block)) {

        resetSelection();

        addToSelection(block);


        attachViewControl(block);

        sendToElm("select", block.uuid);
    }
}

let selectBlockFromElm = function (elmBlock) {
    const block = getBlockByUuid(elmBlock.uuid);
    selectBlock(block);
}


let addBlockToSelectionFromElm = function (elmBlock) {
    const block = getBlockByUuid(elmBlock.uuid);
    addToSelection(block);
}


let removeBlockFromSelectionFromElm = function (elmBlock) {
    const block = getBlockByUuid(elmBlock.uuid);
    removeFromSelection(block);
}



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
    resetElementColor(object);
    selection = selection.filter(uuid => uuid !== object.uuid);
}

let resetSelection = function () {
    if (selection.length) {
        selection.forEach(uuid => {
            const selectedBlock = getBlockByUuid(uuid);
            resetElementColor(selectedBlock);
        });
        selection = [];
    }
    detachControls();
}

let getBlockByUuid = function (uuid) {
    const block = scene.children.find(child => child.sbType && child.sbType === "block" && child.uuid === uuid);
    return block;
}

let selectObject = function (object) {
    if (object.sbType && object.sbType === mode) {
        switch (mode) {
            case "block":
                selectBlock(object);
                break;

            case "hull":
                selectHull(object);
                break;

            case "partition":
                selectPartition(object);
                break;

            default:
                break;
        }
    }
}

let selectHull = function (hull) {
    // manipulating the hull in 3D is no allowed for now
}


let selectPartition = function (partition) {
    if (isPartition(partition)) {
        sendToElm("select-partition", {
            partitionType: partition.partitionType,
            partitionIndex: partition.partitionIndex
        });
    }
}


let attachViewControl = function (block) {
    let currentView = getActiveViewport(views);
    if (!currentView && views.length) {
        currentView = views[0];
    }
    if (currentView && currentView.control) {
        detachControls();
        currentView.control.attach(block);
    }
}

let detachControls = function () {
    views.forEach(view => {
        if (view.control) {
            view.control.detach();
        }
    })
}

let findObjectByUUID = function (uuid) {
    return scene.children.find(child => child.uuid === uuid);
}

let onKeyUp = function (event) {
    if (event.key === "Control") { multipleSelect = false; }
}

let onKeyDown = function (event) {
    if (event.key === "Control") { multipleSelect = true; }
}

let onMouseUp = function (event) {
    if (panning && event.which === 3) { // right click
        panning = null;
        preventSelection = false;
    }
}

let onMouseDown = function (event) {
    const currentView = getActiveViewport(views);
    if (!preventSelection && currentView && event.which === 3) { // right click
        panning = currentView;
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
    views = initViewports.map(view => {
        view.getEye = () => {
            const converted = toThreeJsCoordinates(view.eye.x, view.eye.y, view.eye.z, coordinatesTransform);
            return [converted.x, converted.y, converted.z]
        };
        view.getBackground = () => new THREE.Color(view.background.red / 255, view.background.green / 255, view.background.blue / 255);
        view.getCanControl = () => {
            const converted = toThreeJsCoordinates(view.canControl.x, view.canControl.y, view.canControl.z, coordinatesTransform);
            return [converted.x, converted.y, converted.z]
        };
        return view;
    });
    mode = initMode;

    setCoordinatesTransformFromElm(initCoordinatesTransform);

    wrapper = document.getElementById(wrapperId);

    initCanvas(wrapper);
    initRenderer();
    initScene();
    initCameras();
    displayLabels();
    initGizmos();
    initOrbitControls();

    animate();
};

let onWheel = function (event) {
    const activeView = getActiveViewport(views);
    if (activeView && activeView.cameraType === "Orthographic") {
        const orthographicViews = views.filter(view => view.cameraType === "Orthographic");
        orthographicViews.forEach(orthoView => {
            orthoView.camera.zoom -= event.deltaY * 0.2;
            if (orthoView.camera.zoom < 0.5) {
                orthoView.camera.zoom = 0.5
            }

            orthoView.control.size = 120 / orthoView.camera.zoom;
        });
    }

}

let displayLabels = function () {
    var labels = document.getElementsByClassName("viewport-label");
    for (var i = labels.length - 1; i >= 0; --i) {
        labels[i].remove();
    }

    views.forEach(view => {
        var label = document.createElement('div');
        label.innerText = view.label;
        label.classList.add("viewport-label");
        label.style.top = 20 + view.top * wrapper.clientHeight + "px";
        label.style.left = 20 + view.left * wrapper.clientWidth + "px";
        wrapper.appendChild(label);
    });
}

let shadeThreeColor = function (threeColor, percent) {
    var color = threeColor.getHex();
    var t = percent < 0 ? 0 : 255, p = percent < 0 ? percent * -1 : percent, R = color >> 16, G = color >> 8 & 0x00FF, B = color & 0x0000FF;
    return 0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B);
}

let animate = function () {
    updateCameras(views, scene);
    if (hovered && !isObjectSelected(hovered)) { // remove highlight from the previous "hovered" element
        resetElementColor(hovered);
    }
    hovered = getFirstElementUnderCursor(mouse, views, scene);
    if (hovered) { // highlight the current "hovered" element
        highlightObject(hovered);
    }
    requestAnimationFrame(animate);
}

let highlightObject = function (object) {
    object.material.color.set(shadeThreeColor(object.baseColor, 0.333))
}

let resetElementColor = function (element) {
    element.material.color.set(element.baseColor)
}

let onResize = function (window, event) {
    fitCanvas(canvas, wrapper);
    fitRenderer(canvas);
    updateViewports(views, canvas);
    fitCameras(views, scene);
    displayLabels();
}

let onMouseMove = function (event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;

    // if can control 2 axis and is orthographic
    if (panning && panning.cameraType === "Orthographic" && panning.getCanControl().reduce((prev, current) => prev + (current ? 1 : 0)) === 2) {
        const camera = panning.camera;
        const canControl = panning.getCanControl();

        // we weight the movement of the camera with the zoom to keep a constant speed across all zoom levels
        const movementX = event.movementX / camera.zoom;
        // -event.movementY because in the browser, Y = 0 is at the bottom of the screen
        const movementY = -event.movementY / camera.zoom;

        views
            .filter(view => view.cameraType === "Orthographic")
            .forEach(view => {
                const camera = view.camera;
                if (canControl[0]) { // can control the X axis (threejs)
                    camera.position.x -= movementX;
                    if (canControl[2]) {
                        camera.position.z += movementY;
                    }
                }
                if (canControl[1]) { // can control the Y axis (threejs)
                    camera.position.y -= movementY;
                    if (canControl[2]) {
                        camera.position.z += movementX;
                    }
                }
            });
    }

    views.forEach(view => {
        if (view.orbitControls && view.orbitControls.enabled) {
            view.orbitControls.enabled = false;
        }
    });

    const currentView = getActiveViewport(views);
    if (currentView && currentView.orbitControls && !currentView.orbitControls.enabled) {
        currentView.orbitControls.enabled = true;
    }
}

let updateViewports = function (views, canvas) {
    views.forEach(view => {
        computeViewportPosition(view, canvas);
        computeViewportSize(view, canvas);
    })
}

let initRenderer = function () {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    fitRenderer(canvas);
}

let initScene = function () {
    scene = new THREE.Scene();
}

let initCameras = function () {
    if (views && views.length) {
        views.forEach(view => {
            computeViewportPosition(view, canvas);
            computeViewportSize(view, canvas);

            var camera = null;
            if (view.cameraType === "Orthographic") {
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
            camera.lookAt(scene.position);
            view.camera = camera;
        });
    }
}

let initGizmos = function () {
    views.forEach(view => {
        const canControl = view.getCanControl();
        if (canControl[0] || canControl[1] || canControl[2]) {
            // make a control if at least one axis can be controlled
            var control = new THREE.TransformControls(view, canvas);
            control.addEventListener("objectChange", event => {
                const mode = control.getMode();
                const object = control.object;
                switch (mode) {
                    case "translate":
                        // Round position to .2f
                        const position = object.position;
                        const roundedPosition = {
                            x: Math.round(position.x * 100) / 100,
                            y: Math.round(position.y * 100) / 100,
                            z: Math.round(position.z * 100) / 100
                        };
                        object.position.set(roundedPosition.x, roundedPosition.y, roundedPosition.z);
                        sendToElm("sync-position", {
                            uuid: object.uuid, position: toShipCoordinates(roundedPosition.x, roundedPosition.y, roundedPosition.z, coordinatesTransform)
                        });
                        break;

                    case "scale":
                        const scale = object.scale;
                        const size = getObjectSize(object);
                        const newSize = { // rounded to .2f
                            x: Math.round(100 * scale.x * size.x) / 100,
                            y: Math.round(100 * scale.y * size.y) / 100,
                            z: Math.round(100 * scale.z * size.z) / 100
                        };
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
            });
            control.addEventListener("mouseDown", event => {
                preventSelection = true; // prevents selecting another block while transforming one with the gizmo
            });
            control.addEventListener("mouseUp", event => {
                preventSelection = false;
            });

            control.size = 120;
            control.setMode("translate");
            control.showX = canControl[0];
            control.showY = canControl[1];
            control.showZ = canControl[2];

            view.control = control;
            scene.add(control);
        }
    });
}

let initOrbitControls = function () {
    views
        .filter(view => view.cameraType === "Perspective")
        .forEach(view => {
            const control = new THREE.OrbitControls(view.camera);
            view.orbitControls = control;
        });
}

let initCanvas = function (parent) {
    canvas = document.createElement("canvas");
    canvas.id = "three-canvas";
    canvas.style.position = "absolute"; // the parent can get smaller than the canvas, that will be resized later

    document.addEventListener("mousedown", onClick, false);
    canvas.addEventListener("dblclick", onDoubleClick, false); // used to cycle through the transform modes

    parent.appendChild(canvas);
    fitCanvas(canvas, wrapper);
}

let onClick = function (event) {
    const activeViewport = getActiveViewport(views);
    switch (event.which) {
        case 1: // left click
            if (activeViewport && hovered && !preventSelection) {
                if (multipleSelect) {
                    toggleBlockSelection(hovered);
                } else {
                    selectObject(hovered);
                }
            }
            break;
        case 2: // middle click
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
    if (activeViewport && hovered) {
        views.forEach(view => {
            if (view.control && view.control.getMode() === "translate") {
                view.control.setMode("scale");
            } else if (view.control) {
                view.control.setMode("translate");
            }
        })
    }
}

let updateCameras = function (views, scene) {
    views.forEach(view => updateCamera(view, scene));
}

let updateCamera = function (view, scene) {
    if (view) {
        const camera = view.camera;
        if (camera) {
            renderer.setViewport(view.clientLeft, view.clientTop, view.clientWidth, view.clientHeight);
            renderer.setScissor(view.clientLeft, view.clientTop, view.clientWidth, view.clientHeight);
            renderer.setScissorTest(true);
            renderer.setClearColor(view.getBackground());

            camera.aspect = view.clientWidth / view.clientHeight;
            camera.updateProjectionMatrix();
            renderer.render(scene, camera);
        }
    }
}

let fitCameras = function (views) {
    views.forEach(view => {
        var camera = view.camera;

        if (camera && view.cameraType === "Orthographic") {
            camera.left = view.clientWidth / - 2;
            camera.right = view.clientWidth / 2;
            camera.top = view.clientHeight / 2;
            camera.bottom = view.clientHeight / - 2

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
        canvas.width = wrapper.clientWidth;
        canvas.height = wrapper.clientHeight;
    }
}

let computeViewportSize = function (view, canvas) {
    view.clientWidth = Math.round(view.width * canvas.width);
    view.clientHeight = Math.round(view.height * canvas.height);
}

let computeViewportPosition = function (view, canvas) {
    view.clientLeft = Math.round(view.left * canvas.width);
    view.clientTop = Math.round(view.top * canvas.height);
};

let mouseIsOver = function (view) {
    return mouse.y >= (view.clientTop + wrapper.offsetTop)
        && mouse.y <= (view.clientTop + wrapper.offsetTop + view.clientHeight)
        && mouse.x >= (view.clientLeft + wrapper.offsetLeft)
        && mouse.x <= (view.clientLeft + wrapper.offsetLeft + view.clientWidth);
}

let getElementsUnderCursor = function (mouse, views, scene) {
    const activeView = getActiveViewport(views);
    if (activeView) {
        const elements = getElementsUnderCursorForView(mouse, activeView, scene);
        return elements.map(element => element.object);
    } else {
        return [];
    }
}

let getActiveViewport = function (views) {
    return views.find(view => mouseIsOver(view));
}

let getFirstElementUnderCursor = function (mouse, views, scene) {
    const elements = getElementsUnderCursor(mouse, views, scene);
    const modeElements = elements.filter(element => element.sbType && element.sbType === mode);
    if (modeElements.length) {
        return modeElements[0];
    } else {
        return null;
    }
}

let getElementsUnderCursorForView = function (mouse, view, scene) {
    if (view) {
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
    const offsetX = mouse.x - view.clientLeft - wrapper.offsetLeft;
    const offsetY = mouse.y - (view.clientTop + view.clientHeight + wrapper.offsetTop);
    const normalizedX = (offsetX / view.clientWidth) * 2 - 1;
    const normalizedY = - (offsetY / view.clientHeight) * 2 - 1;
    return new THREE.Vector2(normalizedX, normalizedY);
}