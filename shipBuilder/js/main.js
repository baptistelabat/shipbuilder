'use strict';

const div = document.getElementById('elm-app');
const app = Elm.Main.embed(div);

const mouse = new THREE.Vector2();
const wrapperId = "three-wrapper"; // defined in elm

let views = [];
let mode = null;

let hovered = null; // the first object under the cursor in the scene
let selected = null; // the selected object in the scene
let wrapper = null; // parent of canvas, used for resizing
let canvas = null;
let renderer = null;
let scene = null;
let raycaster = new THREE.Raycaster(); // used to find the objects under the cursor on click, mousemove etc
let loader = new THREE.STLLoader();

let preventSelection = false;

// Ship to ThreeJs
let coordinatesTransform = new THREE.Matrix3();
coordinatesTransform.set(
    1, 0, 0,
    0, 0, -1,
    0, 1, 0
);

let toThreeJsCoordinates = function (x, y, z, coordinatesTransform) {
    const initVector = new THREE.Vector3(x, y, z);
    const resultVector = initVector.applyMatrix3(coordinatesTransform);
    return resultVector;
}

let toShipCoordinates = function (x, y, z, coordinatesTransform) {
    const initVector = new THREE.Vector3(x, y, z);
    const inversedTransform = new THREE.Matrix3();
    inversedTransform.getInverse(coordinatesTransform);
    const resultVector = initVector.applyMatrix3(inversedTransform);
    return resultVector;
}

app.ports.toJs.subscribe(function (message) {
    const data = message.data;
    switch (message.tag) {
        case "init-three":
            initThree(data);
            break;
        case "add-block":
            addCube(data.label, getThreeColorFromElmColor(data.color));
            break;
        case "load-hull":
            loadHull(data);
            break;
        case "remove-block":
            removeObject(data);
            break;
        case "select-block":
            selectBlock(data);
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
    unselectObject();
    mode = newMode;
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


let loadHull = function (path) {
    loader.load(path, (bufferGeometry) => {
        // there can only be one hull in the scene
        const previousHull = scene.children.find(child => child.sbType && child.sbType === "hull");
        if (previousHull) {
            if (isObjectSelected(previousHull)) {
                unselectObject();
            }
            removeFromScene(previousHull);
        }

        const hullColor = new THREE.Color(0.77, 0.77, 0.80);
        const geometry = new THREE.Geometry().fromBufferGeometry(bufferGeometry);
        const shipVertices = geometry.vertices;
        geometry.vertices = shipVertices.map(vertex => {
            return toThreeJsCoordinates(vertex.x, vertex.y, vertex.z, coordinatesTransform);
        });
        const material = new THREE.MeshBasicMaterial({ color: hullColor, opacity: 0.7 });
        material.transparent = true;
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

let addCube = function (label, color = 0x5078ff, sizeX = 80, sizeY = 50, sizeZ = 70, x = 0, y = 0, z = 0) {
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
            unselectObject();
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


let selectBlock = function (block) {
    if (block && block.uuid) {
        const objectToSelect = findObjectByUUID(block.uuid);
        if (objectToSelect && objectToSelect.sbType === mode) {
            if (selected) {
                resetElementColor(selected);
            }
            highlightObject(objectToSelect);
            selected = objectToSelect;
        }
        attachViewControl(selected);
    }
}

let selectObject = function (object) {
    switch (mode) {
        case "block":
            selectBlock(object);
            break;

        case "hull":
            selectHull(object);
            break;

        default:
            break;
    }
}

let selectHull = function (hull) {
    if (hull && hull.uuid) {
        const objectToSelect = findObjectByUUID(hull.uuid);
        if (objectToSelect && objectToSelect.sbType === mode) {
            selected = objectToSelect;
        }
        attachViewControl(selected);
    }
}


let attachViewControl = function (block) {
    let currentView = getActiveViewport(views);
    if (!currentView && views.length) {
        currentView = views[0];
    }
    if (currentView) {
        currentView.control.attach(block);
    }
    var otherViews = views.filter(view => view.camera.uuid !== currentView.camera.uuid);
    otherViews.forEach(view => {
        view.control.detach();
    })
}

let findObjectByUUID = function (uuid) {
    return scene.children.find(child => child.uuid === uuid);
}

let initThree = function (data) {
    window.addEventListener('resize', (window, event) => onResize(), false);
    document.addEventListener('mousemove', (document, event) => onMouseMove(document), false)

    const viewports = data.viewports;
    views = viewports.map(view => {
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
    wrapper = document.getElementById(wrapperId);

    initCanvas(wrapper);
    initRenderer();
    initScene();
    initCameras();
    displayLabels();
    initGizmos();
    /**
     * var gridHelper = new THREE.GridHelper(100, 10);
     * scene.add(gridHelper);
     */

    animate();
};

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
    if (hovered && (!selected || selected && (hovered.uuid !== selected.uuid))) { // remove highlight from the previous "hovered" element
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
}

let onMouseMove = function (event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
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

            var camera = new THREE.OrthographicCamera( // --> frustum
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
            view.camera = camera;
        });
    }
}

let initGizmos = function () {
    views.forEach(view => {
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
        const canControl = view.getCanControl();
        control.showX = canControl[0];
        control.showY = canControl[1];
        control.showZ = canControl[2];

        view.control = control;
        scene.add(control);
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
                selectObject(hovered);
                sendToElm("select", selected.uuid);
            }
            break;
        case 2: // middle click
            unselectObject();
            sendToElm("unselect", null);
            break;
        default: // right click

    }
}

let isObjectSelected = function (object) {
    return selected && (selected.uuid === object.uuid);
}
let isObjectHovered = function (object) {
    return hovered && (hovered.uuid === object.uuid);
}

let onDoubleClick = function (event) { // cycle through the transform modes
    const activeViewport = getActiveViewport(views);
    if (activeViewport && hovered) {
        views.forEach(view => {
            if (view.control.getMode() === "translate") {
                view.control.setMode("scale");
            } else {
                view.control.setMode("translate");
            }
        })
    }
}

let unselectObject = function () {
    if (selected) {
        if (!hovered || hovered && (selected.uuid !== hovered.uuid)) {
            resetElementColor(selected);
        }
        // detach gizmo
        views.forEach(view => {
            view.control.detach();
        })
    }
    selected = null;
}

let updateCameras = function (views, scene) {
    views.forEach(view => updateCamera(view, scene));
}

let updateCamera = function (view, scene) {
    if (view) {
        const camera = view.camera;

        renderer.setViewport(view.clientLeft, view.clientTop, view.clientWidth, view.clientHeight);
        renderer.setScissor(view.clientLeft, view.clientTop, view.clientWidth, view.clientHeight);
        renderer.setScissorTest(true);
        renderer.setClearColor(view.getBackground());
        camera.lookAt(scene.position);

        camera.aspect = view.clientWidth / view.clientHeight;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
    }
}

let fitCameras = function (views) {
    views.forEach(view => {
        var camera = view.camera;
        camera.left = view.clientWidth / - 2;
        camera.right = view.clientWidth / 2;
        camera.top = view.clientHeight / 2;
        camera.bottom = view.clientHeight / - 2

        camera.updateProjectionMatrix();
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

/** TODO: rewrite
let scene;
let renderer;
let meshes = [];
let mouse = new THREE.Vector2();
let raycaster = new THREE.Raycaster();
let selectedMesh = null;


document.addEventListener('mousemove', onMouseMove, false)
document.addEventListener('click', onClick, false)
document.addEventListener('keypress', onKeyPress, false)


initScene();
addCube(100, 140, 50);
addCube(100, 100, 100, -20, -140, -100, 0xE68833);
addPyramid(120, 100, 80, -100, -80);
animate();

var cellSize = 20;
var size = 2000;
var divisions = size / cellSize;

var colorCenterLines = 0xE6E6E6;
var colorGrid = 0xE6E6E6;
// bottom grid
var gridHelper = new THREE.GridHelper(size, divisions, colorCenterLines, colorGrid);
gridHelper.position.y = -500;
scene.add(gridHelper);
// background side grid
var gridHelper2 = new THREE.GridHelper(size, divisions, colorCenterLines, colorGrid);
gridHelper2.rotation.x = (0.5 * Math.PI);
gridHelper2.position.z = 0;
gridHelper2.color = 0x676767;
scene.add(gridHelper2);


function onKeyPress(event) {
    console.log(event);
    switch (event.key) {
        case "Delete":
        case "Backspace":
            if (selectedMesh) { // remove mesh
                views.forEach(view => view.control.detach());
                scene.remove(selectedMesh);
                selectedMesh.geometry.dispose();
                selectedMesh.material.dispose();
                meshes = meshes.filter(mesh => mesh.uuid !== selectedMesh.uuid);
                selectedMesh = null;
            }
        case "ArrowRight":
            if (selectedMesh) {
                selectedMesh.position.x += cellSize;
            }
            break;
        case "ArrowUp":
            if (selectedMesh && event.shiftKey) {
                selectedMesh.position.y % cellSize
                    ? selectedMesh.position.y += (cellSize - selectedMesh.position.y % cellSize)
                    : selectedMesh.position.y += cellSize;
            } else {
                selectedMesh.position.y += 1;
            }
            break;
        case "ArrowLeft":
            if (selectedMesh && event.shiftKey) {
                selectedMesh.position.x % cellSize ? selectedMesh.position.x -= selectedMesh.position.x % cellSize : selectedMesh.position.x -= cellSize;
            } else {
                selectedMesh.position.x -= 1;
            }
            break;
        case "ArrowDown":
            if (selectedMesh) {
                selectedMesh.position.y -= cellSize;
            }
            break;
        default:
            break;
    }
}
function onClick(event) {
    switch (event.which) {
        case 1: // left click
            mouse.x = event.clientX;
            mouse.y = event.clientY;
            var intersectedMeshes = getMeshesUnder();
            if (intersectedMeshes.length) {
                selectedMesh = intersectedMeshes[0];
                document.getElementById("color").value = selectedMesh.material.color.getHexString();
            }
            console.log(selectedMesh);
            break;
        case 2: // middle click
            if (selectedMesh) {
                views.forEach(view => {
                    if (view.control.mode === "translate") {
                        view.control.setMode("scale")
                    } else {
                        view.control.setMode("translate");
                    }
                });
            }
            break;
        default: // right click
            selectedMesh = null;

    }

}


function normalizeMouseCoordinates(view) {
    const viewBoundingBox = getViewportBounds(view);
    const normalized = new THREE.Vector2();
    let boxWidth = viewBoundingBox.bottomRight.x - viewBoundingBox.topLeft.x;
    let boxHeight = viewBoundingBox.bottomRight.y - viewBoundingBox.topLeft.y;
    let mouseOffset = new THREE.Vector2(mouse.x - viewBoundingBox.topLeft.x, mouse.y - viewBoundingBox.bottomRight.y);
    normalized.x = (mouseOffset.x / boxWidth) * 2 - 1;
    normalized.y = - (mouseOffset.y / boxHeight) * 2 - 1;
    return normalized;
}

function onWindowResize() {
    displayLabels();
    const wrapper = document.getElementById("canvas-wrapper");
    canvas.width = wrapper.clientWidth;
    canvas.height = wrapper.clientHeight;
    views.forEach(view => {
        var camera = view.camera;
        camera.left = view.width * canvas.width / - 2;
        camera.right = view.width * canvas.width / 2;
        camera.top = view.height * canvas.height / 2;
        camera.bottom = view.height * canvas.height / - 2

        camera.updateProjectionMatrix();
    })

    renderer.setSize(canvas.width, canvas.height);

}

function initCameras() {
    views.forEach(view => {
        var camera = new THREE.OrthographicCamera(view.width * canvas.width / - 2, view.width * canvas.width / 2, view.height * canvas.height / 2, view.height * canvas.height / - 2, 0, 2000);
        camera.position.fromArray(view.eye);
        view.camera = camera;

        var control = new THREE.TransformControls(view, canvas);
        control.addEventListener("objectChange", event => {
            console.log(event);
            console.log(selectedMesh);
        })

        control.size = 120;
        control.setMode("translate");
        control.showX = view.canControl[0];
        control.showY = view.canControl[1];
        control.showZ = view.canControl[2];

        view.control = control;
        scene.add(control);
    });
}

function displayLabels() {
    var labels = document.getElementsByClassName("viewport-label");
    for (var i = labels.length - 1; i >= 0; --i) {
        labels[i].remove();
    }

    views.forEach(view => {

        var label = document.createElement('div');
        label.innerText = view.label;
        label.classList.add("viewport-label");
        label.style.top = 20 + view.top * wrapper.clientHeight + "px";
        label.style.right = "20px";
        wrapper.appendChild(label);
    })
}

function initScene() {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(canvas.width, canvas.height);

    scene = new THREE.Scene();
    initCameras();
    displayLabels();


    //var axesHelper = new THREE.AxesHelper(500);
    //scene.add(axesHelper);
}


function addCube(width, height, depth, x = 0, y = 0, z = 0, color = 0x5078ff) {
    var cube = makeCube(width, height, depth, x, y, z, color);
    meshes.push(cube);
    scene.add(cube);
}

function addPyramid(width, height, depth, x = 0, y = 0, z = 0, color = 0xff66A2) {
    var pyramid = makePyramid(width, height, depth, x, y, z, color);
    meshes.push(pyramid);
    scene.add(pyramid);
}

function makePyramid(width, height, depth, x, y, z, color) {
    var geometry = new THREE.Geometry();

    geometry.vertices = [
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(1, 0, 1),
        new THREE.Vector3(0.5, 1, 0.5)
    ];

    geometry.faces = [
        new THREE.Face3(0, 1, 2),
        new THREE.Face3(0, 2, 3),
        new THREE.Face3(1, 0, 4),
        new THREE.Face3(2, 1, 4),
        new THREE.Face3(3, 2, 4),
        new THREE.Face3(0, 3, 4)
    ];

    var transformation = new THREE.Matrix4().makeScale(width, depth, height);

    geometry.applyMatrix(transformation);

    var material = new THREE.MeshBasicMaterial({ color: color, opacity: 0.7 });
    material.transparent = true;
    var pyramid = new THREE.Mesh(geometry, material);
    pyramid.position.fromArray([x, y, z]);
    pyramid.baseColor = color;
    pyramid.geometryType = "pyramid";
    return pyramid;
}

function getMouseIntersectionForCurrentView() {
    const currentView = views.find(view => mouseIsOver(view));
    if (currentView) {
        const normalizedMouse = normalizeMouseCoordinates(currentView);
        raycaster.setFromCamera(normalizedMouse, currentView.camera);
        return raycaster.intersectObjects(scene.children);
    } else {
        return [];
    }

}

function animate() {
    // better than setTimeout because it pauses when the tab is inactive
    views.forEach(view => {
        var camera = view.camera;
        var left = Math.floor(canvas.width * view.left);
        var top = Math.floor(canvas.height * view.top);
        var width = Math.floor(canvas.width * view.width);
        var height = Math.floor(canvas.height * view.height);
        renderer.setViewport(left, top, width, height);
        renderer.setScissor(left, top, width, height);
        renderer.setScissorTest(true);
        renderer.setClearColor(view.background);
        camera.lookAt(scene.position);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
    });

    attachCurrentViewControl();

    meshes.forEach(mesh => {
        mesh.material.color.set(mesh.baseColor);
    });

    const intersectMeshes = getMeshesUnder();

    if (intersectMeshes.length) {
        let mesh = intersectMeshes[0];
        mesh.material.color.set(shadeThreeColor(mesh.baseColor, 0.2));
    }

    requestAnimationFrame(animate);
    //rotate();
}

function getMeshesUnder() {
    const intersects = getMouseIntersectionForCurrentView();
    const intersectObjects = intersects.map(intersect => intersect.object);
    const intersectMeshes = intersectObjects.filter(intersect =>
        meshes.some(mesh => mesh.uuid === intersect.uuid));
    return intersectMeshes;

}

function shadeThreeColor(color, percent) {
    var t = percent < 0 ? 0 : 255, p = percent < 0 ? percent * -1 : percent, R = color >> 16, G = color >> 8 & 0x00FF, B = color & 0x0000FF;
    return 0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B);
}

function rotate() {
    meshes.forEach(mesh => {
        //mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.01;
    })
}

function attachCurrentViewControl() {
    var currentView = views.find(view => mouseIsOver(view));
    var otherViews = views.filter(view => !mouseIsOver(view));
    otherViews.forEach(view => {
        view.control.detach();
    })

    if (currentView && selectedMesh) {
        currentView.control.attach(selectedMesh);
    } else if (currentView) {
        currentView.control.detach();
    }
}

function addObject(type, hexcolor) {
    switch (type) {
        case "pyramid":
            addPyramid(100, 100, 100, 0, 0, 0, hexcolor);
            break;

        default:
            addCube(100, 100, 100, 0, 0, 0, hexcolor);
    }
}

function onSubmit() {
    var type = document.getElementById("type").value;
    var color = document.getElementById("color").value;
    var hexcolor = parseInt(color, 16);
    addObject(type, hexcolor);
}

function updateSelectedMeshFromForm() {
    var color = document.getElementById("color").value;
    var hexcolor = parseInt(color, 16);
    if (selectedMesh && color.length === 6) {
        selectedMesh.material.color.set(hexcolor);
        selectedMesh.baseColor = hexcolor;
    }
}
*/