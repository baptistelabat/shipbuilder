'use strict';

const div = document.getElementById('elm-app');
const app = Elm.Main.embed(div);

const mouse = new THREE.Vector2();
const wrapperId = "three-wrapper"; // defined in elm

let views = [];

let hovered = null; // the first object under the cursor in the scene
let selected = null; // the selected element in the scene
let wrapper = null; // parent of canvas, used for resizing
let canvas = null;
let renderer = null;
let scene = null;
let raycaster = null; // used to find the elements under the cursor on click, mousemove etc

app.ports.send.subscribe(function (message) {
    const data = message.data;
    switch (message.tag) {
        case "init-viewports":
            initThree(data);
            break;
        case "add-cube":
            addCube(data)
        case "remove-block":
            removeBlock(data);
        default:
    }
})

let sendToElm = function (tag, data) {
    app.ports.receive.send({ tag: tag, data: data });
}

let addCube = function (label, width = 80, height = 50, depth = 70, x = 0, y = 0, z = 0, color = 0x5078ff) {
    var cube = makeCube(width, height, depth, x, y, z, color);
    scene.add(cube);
    sendToElm("new-element", { uuid: cube.uuid, label: label })
}

let makeCube = function (width, height, depth, x, y, z, color) {
    var geometry = new THREE.BoxGeometry(width, height, depth);
    geometry.translate(width / 2, height / 2, depth / 2);

    var material = new THREE.MeshBasicMaterial({ color: color /*, opacity: 0.7*/ });
    //material.transparent = true;

    var cube = new THREE.Mesh(geometry, material);
    cube.position.fromArray([x, y, z]);
    cube.baseColor = color;
    cube.geometryType = "cube";
    return cube;
}

let removeBlock = function (block) {
    const objectToRemove = scene.children.find(child => child.uuid === block.uuid);
    if (objectToRemove) {
        if (hovered && hovered.uuid === block.uuid) {
            hovered = null;
        }
        if (selected && selected.uuid === block.uuid) {
            selected = null;
        }
        scene.remove(objectToRemove);
    }
}

let initThree = function (viewsData) {
    window.addEventListener('resize', (window, event) => onResize(), false);
    document.addEventListener('mousemove', (document, event) => onMouseMove(document), false)

    views = viewsData.map(view => {
        view.getEye = () => [view.eye.x, view.eye.y, view.eye.z];
        view.getBackground = () => new THREE.Color(view.background.red / 255, view.background.green / 255, view.background.blue / 255);
        view.getCanControl = () => [view.canControl.x, view.canControl.y, view.canControl.z];
        return view;
    });
    wrapper = document.getElementById(wrapperId);

    initCanvas(wrapper);
    initRenderer();
    initScene();
    initCameras();
    displayLabels();

    /**
     * var gridHelper = new THREE.GridHelper(100, 10);
     * scene.add(gridHelper);
     */

    raycaster = new THREE.Raycaster();
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

let shadeHexColor = function (color, percent) {
    var t = percent < 0 ? 0 : 255, p = percent < 0 ? percent * -1 : percent, R = color >> 16, G = color >> 8 & 0x00FF, B = color & 0x0000FF;
    return 0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B);
}

let animate = function () {
    updateCameras(views, scene);
    if (hovered && (!selected || selected && (hovered.uuid !== selected.uuid))) { // remove highlight from the previous "hovered" element
        hovered.material.color.set(hovered.baseColor)
    }
    hovered = getFirstElementUnderCursor(mouse, views, scene);
    if (hovered) { // highlight the current "hovered" element
        hovered.material.color.set(shadeHexColor(hovered.baseColor, 0.333))
    }
    requestAnimationFrame(animate);
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

let initCanvas = function (parent) {
    canvas = document.createElement("canvas");
    canvas.id = "three-canvas";
    canvas.style.position = "absolute"; // the parent can get smaller than the canvas, that will be resized later

    document.addEventListener("click", onClick, false);

    parent.appendChild(canvas);
    fitCanvas(canvas, wrapper);
}

let onClick = function (event) {
    switch (event.which) {
        case 1: // left click
            if (hovered) {
                selected = hovered;
                sendToElm("select", selected.uuid);
            }
            break;
        case 2: // middle click
            if (selected && (!hovered || hovered && (selected.uuid !== hovered.uuid))) {
                selected.material.color.set(selected.baseColor);
            }
            selected = null;
            sendToElm("unselect", null);
            break;
        default: // right click

    }
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
    // /!\ there should only be one active view at a time
    const activeView = views.find(view => mouseIsOver(view));
    if (activeView) {
        const elements = getElementsUnderCursorForView(mouse, activeView, scene);
        return elements.map(element => element.object);
    } else {
        return [];
    }
}

let getFirstElementUnderCursor = function (mouse, views, scene) {
    const elements = getElementsUnderCursor(mouse, views, scene);
    if (elements.length) {
        return elements[0];
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
        mesh.material.color.set(shadeHexColor(mesh.baseColor, 0.2));
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

function shadeHexColor(color, percent) {
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