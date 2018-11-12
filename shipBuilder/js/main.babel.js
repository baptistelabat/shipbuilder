'use strict';

var div = document.getElementById('elm-app');
var app = Elm.Main.embed(div, gitSha);
var mouse = new THREE.Vector2();
var wrapperId = "three-wrapper"; // defined in elm

var canPan = false;
var panning = false;
var multipleSelect = false;
var selection = [];
var transformControlsBasis = {
  // is used to calculate the transformations applied by a transformControls and apply them to other elements
  position: null
};
var views = [];
var mode = null;
var hovered = null; // the first object under the cursor in the scene

var wrapper = null; // parent of canvas, used for resizing

var canvas = null;
var renderer = null;
var scene = null;
var raycaster = new THREE.Raycaster(); // used to find the objects under the cursor on click, mousemove etc

var loader = new THREE.STLLoader();
var preventSelection = false;
var showingPartitions = true; // ThreeJs to ship

var coordinatesTransform = new THREE.Matrix3();

var toShipCoordinates = function toShipCoordinates(x, y, z, coordinatesTransform) {
  var initVector = new THREE.Vector3(x, y, z);
  var resultVector = initVector.applyMatrix3(coordinatesTransform);
  return resultVector;
};

var toThreeJsCoordinates = function toThreeJsCoordinates(x, y, z, coordinatesTransform) {
  var initVector = new THREE.Vector3(x, y, z);
  var inversedTransform = new THREE.Matrix3();
  inversedTransform.getInverse(coordinatesTransform);
  var resultVector = initVector.applyMatrix3(inversedTransform);
  return resultVector;
};

app.ports.toJs.subscribe(function (message) {
  var data = message.data;

  switch (message.tag) {
    case "add-block-to-selection":
      addBlockToSelectionFromElm(data);
      break;

    case "blocks-visibility":
      toggleBlocksVisibility(data);
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

    case "showing-partitions":
      toggleShowingPartitions(data);
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
});

var sendToElm = function sendToElm(tag, data) {
  app.ports.fromJs.send({
    tag: tag,
    data: data
  });
};

var switchMode = function switchMode(newMode) {
  if (newMode !== mode) {
    resetSelection();
    mode = newMode;
    var sbObjects = scene.children.filter(function (child) {
      return child.sbType;
    });
    sbObjects.forEach(function (object) {
      setObjectOpacityForCurrentMode(object);
    });
  }
};

var toggleBlocksVisibility = function toggleBlocksVisibility(data) {
  var visible = data.visible;
  var uuids = data.uuids;
  var blocks = scene.children.filter(function (child) {
    return isBlock(child) && uuids.includes(child.uuid);
  });
  blocks.forEach(function (block) {
    block.visible = visible;
  });
};

var setObjectOpacityForCurrentMode = function setObjectOpacityForCurrentMode(object) {
  if (object.sbType === mode) {
    object.material.opacity = 1;
    object.material.transparent = false;
  } else {
    object.material.opacity = 0.2;
    object.material.transparent = true;
  }
};

var readFile = function readFile(inputId) {
  var node = document.getElementById(inputId);

  if (node === null) {
    return;
  }

  var file = node.files[0];
  var reader = new FileReader(); // FileReader API is event based. Once a file is selected
  // it fires events. We hook into the `onload` event for our reader.

  reader.onload = function (event) {
    var contents = event.target.result;
    sendToElm("save-data", JSON.parse(contents));
  }; // Connect our FileReader with the file that was selected in our `input` node.


  reader.readAsText(file);
};

var restoreSave = function restoreSave(savedData) {
  var savedBlocks = savedData.blocks;
  var savedCoordinatesTransform = savedData.coordinatesTransform;
  var decks = savedData.decks;
  var bulkheads = savedData.bulkheads;
  var viewMode = savedData.viewMode;
  var showing = savedData.showingPartitions;
  mode = viewMode;
  showingPartitions = showing;
  resetScene(views, scene);
  setCoordinatesTransformFromElm(savedCoordinatesTransform);
  restoreBlocks(savedBlocks);
  makeDecks(decks);
  makeBulkheads(bulkheads);
};

var resetScene = function resetScene(views, scene) {
  views.forEach(function (view) {
    // if we don't detach the controls, the removal of the selected block (if any) won't work
    if (view.control) {
      view.control.detach();
    }
  });
  resetSelection();
  var sbObjectsToDelete = scene.children.filter(function (child) {
    return child.sbType;
  });
  sbObjectsToDelete.forEach(function (toDelete) {
    return removeFromScene(toDelete);
  });
};

var restoreBlocks = function restoreBlocks(blocks) {
  blocks.forEach(function (block) {
    restoreBlock(block.uuid, block.color, block.position, block.size);
  });
};

var setCoordinatesTransformFromElm = function setCoordinatesTransformFromElm(elmCoordinatesTransform) {
  // the elm matrix maps threejs's coordinate system to the ship's one
  // we want the ship's coordinate system mapped to threejs' one
  var inversedCoordinatesTransform = new THREE.Matrix3();
  inversedCoordinatesTransform.fromArray(elmCoordinatesTransform);
  coordinatesTransform.getInverse(inversedCoordinatesTransform);
};

var updateColor = function updateColor(data) {
  var object = findObjectByUUID(data.uuid);

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
};

var absVector3 = function absVector3(vector3) {
  return new THREE.Vector3(Math.abs(vector3.x), Math.abs(vector3.y), Math.abs(vector3.z));
};

var makeBulkheads = function makeBulkheads(bulkheads) {
  var oldBulkheads = scene.children.filter(function (child) {
    return child.sbType && child.sbType === "partition" && child.partitionType && child.partitionType === "bulkhead";
  });
  oldBulkheads.forEach(function (oldBulkhead) {
    return removeFromScene(oldBulkhead);
  });
  var bulkheadColor = new THREE.Color(0.5, 0.5, 1);
  var zeroColor = new THREE.Color(1, 0.5, 0.5);
  bulkheads.forEach(function (bulkhead) {
    var index = bulkhead.index;
    var number = bulkhead.number;
    var xPosition = bulkhead.position;
    var size = 500;
    var geometry = new THREE.Geometry();
    geometry.vertices.push(toThreeJsCoordinates(0, -size / 2, -size / 2, coordinatesTransform));
    geometry.vertices.push(toThreeJsCoordinates(0, -size / 2, size / 2, coordinatesTransform));
    geometry.vertices.push(toThreeJsCoordinates(0, size / 2, size / 2, coordinatesTransform));
    geometry.vertices.push(toThreeJsCoordinates(0, size / 2, -size / 2, coordinatesTransform));
    var color = number ? bulkheadColor : zeroColor;
    var material = new THREE.MeshBasicMaterial({
      color: color,
      side: THREE.DoubleSide
    });
    var bulkhead = new THREE.LineLoop(geometry, material);
    bulkhead.position.copy(toThreeJsCoordinates(xPosition, 0, 0, coordinatesTransform));
    bulkhead.sbType = "partition";
    bulkhead.baseColor = color;
    bulkhead.visible = showingPartitions;
    bulkhead.partitionType = "bulkhead";
    bulkhead.partitionIndex = index;
    bulkhead.partitionNumber = number;
    setObjectOpacityForCurrentMode(bulkhead);
    scene.add(bulkhead);
  });
};

var toggleShowingPartitions = function toggleShowingPartitions(showing) {
  showingPartitions = showing;
  scene.children.filter(function (child) {
    return child.sbType && child.sbType === "partition";
  }).forEach(function (partition) {
    partition.visible = showing;
  });
};

var makeDecks = function makeDecks(decks) {
  var oldDecks = scene.children.filter(function (child) {
    return child.sbType && child.sbType === "partition" && child.partitionType && child.partitionType === "deck";
  });
  oldDecks.forEach(function (oldDeck) {
    return removeFromScene(oldDeck);
  });
  var deckColor = new THREE.Color(0.5, 0.5, 1);
  var zeroColor = new THREE.Color(1, 0.5, 0.5);
  decks.forEach(function (deck) {
    var index = deck.index;
    var number = deck.number;
    var zPosition = deck.position;
    var size = 500;
    var geometry = new THREE.Geometry();
    geometry.vertices.push(toThreeJsCoordinates(-size / 2, -size / 2, 0, coordinatesTransform));
    geometry.vertices.push(toThreeJsCoordinates(-size / 2, size / 2, 0, coordinatesTransform));
    geometry.vertices.push(toThreeJsCoordinates(size / 2, size / 2, 0, coordinatesTransform));
    geometry.vertices.push(toThreeJsCoordinates(size / 2, -size / 2, 0, coordinatesTransform));
    var color = number ? deckColor : zeroColor;
    var material = new THREE.MeshBasicMaterial({
      color: color,
      side: THREE.DoubleSide
    });
    var deck = new THREE.LineLoop(geometry, material);
    deck.position.copy(toThreeJsCoordinates(0, 0, zPosition, coordinatesTransform));
    deck.sbType = "partition";
    deck.baseColor = color;
    deck.visible = showingPartitions;
    deck.partitionType = "deck";
    deck.partitionIndex = index;
    deck.partitionNumber = number;
    setObjectOpacityForCurrentMode(deck);
    scene.add(deck);
  });
};

var loadHull = function loadHull(path) {
  loader.load(path, function (bufferGeometry) {
    // there can only be one hull in the scene
    var previousHull = scene.children.find(function (child) {
      return child.sbType && child.sbType === "hull";
    });

    if (previousHull) {
      removeFromScene(previousHull);
    }

    var hullColor = new THREE.Color(0.56, 0.69, 1);
    var geometry = new THREE.Geometry().fromBufferGeometry(bufferGeometry);
    var shipVertices = geometry.vertices;
    geometry.vertices = shipVertices.map(function (vertex) {
      return toThreeJsCoordinates(vertex.x, vertex.y, vertex.z, coordinatesTransform);
    });
    var material = new THREE.MeshBasicMaterial({
      color: hullColor
    });
    var hull = new THREE.Mesh(geometry, material);
    hull.baseColor = hullColor;
    hull.sbType = "hull";
    scene.add(hull);
    sendToElm("loaded-hull", {
      uuid: hull.uuid,
      faces: hull.geometry.faces,
      vertices: shipVertices
    });
  });
};

var updatePosition = function updatePosition(data) {
  var object = findObjectByUUID(data.uuid);

  if (object) {
    var position = toThreeJsCoordinates(data.position.x, data.position.y, data.position.z, coordinatesTransform);
    object.position.copy(position);

    if (isObjectSelected(object)) {
      selectObject(object);
    } else if (isObjectHovered(object)) {
      hovered = object;
    }
  }
};

var updateSize = function updateSize(data) {
  var object = findObjectByUUID(data.uuid);

  if (object) {
    var newSize = sizeToThreeJsCoordinates(data.size.x, data.size.y, data.size.z, coordinatesTransform);
    var currentSize = getObjectSize(object);
    var newXSize = newSize.x;
    var currentXSize = currentSize.x;
    var newYSize = newSize.y;
    var currentYSize = currentSize.y;
    var newZSize = newSize.z;
    var currentZSize = currentSize.z;
    object.scale.set(newXSize / currentXSize, newYSize / currentYSize, newZSize / currentZSize);

    if (isObjectSelected(object)) {
      selectObject(object);
    } else if (isObjectHovered(object)) {
      hovered = object;
    }
  }
};

var getThreeColorFromElmColor = function getThreeColorFromElmColor(color) {
  return new THREE.Color(color.red / 255, color.green / 255, color.blue / 255);
};

var getObjectSize = function getObjectSize(object) {
  object.geometry.computeBoundingBox();
  var bb = object.geometry.boundingBox;
  return {
    x: bb.max.x - bb.min.x,
    y: bb.max.y - bb.min.y,
    z: bb.max.z - bb.min.z
  };
};

var addCube = function addCube(label) {
  var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0x5078ff;
  var sizeX = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
  var sizeY = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 5;
  var sizeZ = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 5;
  var x = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
  var y = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
  var z = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;
  var cube = makeCube(sizeX, sizeY, sizeZ, x, y, z, color); // center on Y axis

  var size = sizeToShipCoordinates(getObjectSize(cube));
  cube.position.copy(toThreeJsCoordinates(0, -size.y / 2, 0, coordinatesTransform));
  scene.add(cube);
  sendToElm("new-block", {
    uuid: cube.uuid,
    label: label,
    color: getRgbRecord(color),
    position: toShipCoordinates(cube.position.x, cube.position.y, cube.position.z, coordinatesTransform),
    size: sizeToShipCoordinates(getObjectSize(cube))
  }); // TODO: rewrite size and position !
}; // position and size in ship coordinates


var restoreBlock = function restoreBlock(uuid, color, position, size) {
  var threeJsSize = sizeToThreeJsCoordinates(size.x, size.y, size.z, coordinatesTransform);
  var threeJsPosition = toThreeJsCoordinates(position.x, position.y, position.z, coordinatesTransform);
  var threeJsColor = getThreeColorFromElmColor(color);
  var geometry = restoreCubeGeometry(threeJsSize);
  var material = restoreMaterial(threeJsColor);
  var block = new THREE.Mesh(geometry, material);
  setObjectOpacityForCurrentMode(block);
  block.uuid = uuid;
  block.position.fromArray([threeJsPosition.x, threeJsPosition.y, threeJsPosition.z]);
  block.baseColor = threeJsColor;
  block.sbType = "block";
  scene.add(block);
}; // input : size in threejs coordinates


var restoreCubeGeometry = function restoreCubeGeometry(size) {
  var geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
  geometry.translate(size.x / 2, size.y / 2, size.z / 2); // place the origin in the bottom left 

  return geometry;
}; // input : threejs color


var restoreMaterial = function restoreMaterial(color) {
  var opacity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var material = new THREE.MeshBasicMaterial({
    color: color,
    opacity: opacity
  });

  if (opacity < 1) {
    material.transparent = true;
  }

  return material;
};

var sizeToShipCoordinates = function sizeToShipCoordinates(size) {
  return absVector3(toShipCoordinates(size.x, size.y, size.z, coordinatesTransform));
};

var sizeToThreeJsCoordinates = function sizeToThreeJsCoordinates(x, y, z) {
  return absVector3(toThreeJsCoordinates(x, y, z, coordinatesTransform));
};

var getRgbRecord = function getRgbRecord(threeColor) {
  var rgbArray = threeColor.toArray();
  return {
    red: Math.round(rgbArray[0] * 255),
    green: Math.round(rgbArray[1] * 255),
    blue: Math.round(rgbArray[2] * 255)
  };
};

var makeCube = function makeCube(sizeX, sizeY, sizeZ, x, y, z, color) {
  var geometry = new THREE.BoxGeometry(sizeX, sizeY, sizeZ);
  geometry.translate(sizeX / 2, sizeY / 2, sizeZ / 2);
  var material = new THREE.MeshBasicMaterial({
    color: color
    /*, opacity: 0.7*/

  }); //material.transparent = true;

  var cube = new THREE.Mesh(geometry, material);
  cube.position.fromArray([x, y, z]);
  cube.baseColor = color;
  cube.sbType = "block";
  return cube;
};

var removeObject = function removeObject(block) {
  var objectToRemove = findObjectByUUID(block.uuid);

  if (objectToRemove) {
    if (isObjectHovered(objectToRemove)) {
      hovered = null;
    }

    if (isObjectSelected(objectToRemove)) {
      resetSelection();
    }

    removeFromScene(objectToRemove);
  }
};

var removeFromScene = function removeFromScene(objectToRemove) {
  scene.remove(objectToRemove); // memory optimization

  objectToRemove.geometry.dispose();
  objectToRemove.material.dispose();
};

var isBlock = function isBlock(object) {
  return object && object.uuid && object.sbType === "block";
};

var isHull = function isHull(object) {
  return object && object.uuid && object.sbType === "hull";
};

var isPartition = function isPartition(object) {
  return object && object.uuid && object.sbType === "partition";
};

var canChangeInMode = function canChangeInMode(object, mode) {
  return object && object.sbType === mode;
};

var selectBlock = function selectBlock(block) {
  if (isBlock(block)) {
    resetSelection();
    addToSelection(block);
    attachViewControl(block);
    sendToElm("select", block.uuid);
  }
};

var selectBlockFromElm = function selectBlockFromElm(elmBlock) {
  var block = getBlockByUuid(elmBlock.uuid);
  selectBlock(block);
};

var addBlockToSelectionFromElm = function addBlockToSelectionFromElm(elmBlock) {
  var block = getBlockByUuid(elmBlock.uuid);
  addToSelection(block);
};

var removeBlockFromSelectionFromElm = function removeBlockFromSelectionFromElm(elmBlock) {
  var block = getBlockByUuid(elmBlock.uuid);
  removeFromSelection(block);
};

var toggleBlockSelection = function toggleBlockSelection(block) {
  if (isBlock(block)) {
    if (isObjectSelected(block)) {
      removeFromSelection(block);
      sendToElm("remove-from-selection", block.uuid);
    } else {
      addToSelection(block);
      sendToElm("add-to-selection", block.uuid);
    }
  }
};

var addToSelection = function addToSelection(object) {
  highlightObject(object);
  selection.push(object.uuid);
};

var removeFromSelection = function removeFromSelection(object) {
  resetElementColor(object);
  selection = selection.filter(function (uuid) {
    return uuid !== object.uuid;
  });
};

var resetSelection = function resetSelection() {
  if (selection.length) {
    selection.forEach(function (uuid) {
      var selectedBlock = getBlockByUuid(uuid);
      resetElementColor(selectedBlock);
    });
    selection = [];
  }

  detachControls();
};

var getBlockByUuid = function getBlockByUuid(uuid) {
  var block = scene.children.find(function (child) {
    return child.sbType && child.sbType === "block" && child.uuid === uuid;
  });
  return block;
};

var getBlocksByUuids = function getBlocksByUuids(uuids) {
  var blocks = uuids.map(function (uuid) {
    return getBlockByUuid(uuid);
  });
  return blocks;
};

var selectObject = function selectObject(object) {
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
};

var selectHull = function selectHull(hull) {// manipulating the hull in 3D is no allowed for now
};

var selectPartition = function selectPartition(partition) {
  if (isPartition(partition)) {
    var positionToSend = 0;
    var positionInShipCoordinates = toShipCoordinates(partition.position.x, partition.position.y, partition.position.z, coordinatesTransform);

    if (partition.partitionType === "deck") {
      positionToSend = positionInShipCoordinates.z;
    } else if (partition.partitionType === "bulkhead") {
      positionToSend = positionInShipCoordinates.x;
    }

    sendToElm("select-partition", {
      partitionType: partition.partitionType,
      partitionIndex: partition.partitionIndex,
      partitionPosition: positionToSend
    });
  }
};

var attachViewControl = function attachViewControl(block) {
  var currentView = getActiveViewport(views);

  if (!currentView && views.length) {
    currentView = views[0];
  }

  if (currentView && currentView.control) {
    detachControls();
    currentView.control.attach(block);
    setTransformControlsBasis(block);
  }
};

var detachControls = function detachControls() {
  views.forEach(function (view) {
    if (view.control) {
      view.control.detach();
    }
  });
  setTransformControlsBasis();
};

var setTransformControlsBasis = function setTransformControlsBasis(object) {
  if (object) {
    transformControlsBasis.position = object.position.clone();
  } else {
    transformControlsBasis.position = null;
  }
};

var getTranslationBetween = function getTranslationBetween(positionStart, positionEnd) {
  // both arguments must be THREE.Vector3
  return positionEnd.clone().sub(positionStart);
};

var applyTranslationToObjects = function applyTranslationToObjects(objects, translation) {
  // translation must be THREE.Vector3
  objects.forEach(function (object) {
    object.position.add(translation.clone());
  });
};

var applyTranslationToSelection = function applyTranslationToSelection(translation) {
  var selectedBlocks = getBlocksByUuids(selection);
  var blocksToTransform = selectedBlocks.slice(1); // we don't want to transform the first object, which is the active object already transformed by the gizmo

  applyTranslationToObjects(blocksToTransform, translation);
  sendToElm("sync-positions", selectedBlocks.map(function (block) {
    return {
      uuid: block.uuid,
      position: toShipCoordinates(block.position.x, block.position.y, block.position.z, coordinatesTransform)
    };
  }));
};

var findObjectByUUID = function findObjectByUUID(uuid) {
  return scene.children.find(function (child) {
    return child.uuid === uuid;
  });
};

var onKeyUp = function onKeyUp(event) {
  if (event.key === "Control") {
    multipleSelect = false;
  }
};

var onKeyDown = function onKeyDown(event) {
  if (event.key === "Control") {
    multipleSelect = true;
  }
};

var onMouseUp = function onMouseUp(event) {
  if (panning && event.which === 3) {
    // right click
    panning = null;
    preventSelection = false;
  }
};

var onMouseDown = function onMouseDown(event) {
  var currentView = getActiveViewport(views);

  if (!preventSelection && currentView && event.which === 3) {
    // right click
    panning = currentView;
    preventSelection = true;
  }
};

var initThree = function initThree(data) {
  window.addEventListener('resize', function (event) {
    return onResize();
  }, false);
  document.addEventListener('mousemove', function (event) {
    return onMouseMove(event);
  }, false);
  document.addEventListener('keydown', function (event) {
    return onKeyDown(event);
  }, false);
  document.addEventListener('keyup', function (event) {
    return onKeyUp(event);
  }, false);
  document.addEventListener('mousedown', function (event) {
    return onMouseDown(event);
  }, false);
  document.addEventListener('mouseup', function (event) {
    return onMouseUp(event);
  }, false);
  document.addEventListener('wheel', function (event) {
    return onWheel(event);
  }, false);
  var initViewports = data.viewports;
  var initMode = data.mode;
  var initCoordinatesTransform = data.coordinatesTransform;
  var initDecks = data.decks;
  var initBulkheads = data.bulkheads;
  var showing = data.showingPartitions;
  views = initViewports.map(function (view) {
    view.getEye = function () {
      var converted = toThreeJsCoordinates(view.eye.x, view.eye.y, view.eye.z, coordinatesTransform);
      return [converted.x, converted.y, converted.z];
    };

    view.getBackground = function () {
      return new THREE.Color(view.background.red / 255, view.background.green / 255, view.background.blue / 255);
    };

    view.getCanControl = function () {
      var converted = toThreeJsCoordinates(view.canControl.x, view.canControl.y, view.canControl.z, coordinatesTransform);
      return [converted.x, converted.y, converted.z];
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
  makeDecks(initDecks);
  makeBulkheads(initBulkheads);
  animate();
};

var onWheel = function onWheel(event) {
  var activeView = getActiveViewport(views);

  if (activeView && activeView.cameraType === "Orthographic") {
    var orthographicViews = views.filter(function (view) {
      return view.cameraType === "Orthographic";
    });
    orthographicViews.forEach(function (orthoView) {
      orthoView.camera.zoom -= event.deltaY * 0.2;

      if (orthoView.camera.zoom < 0.5) {
        orthoView.camera.zoom = 0.5;
      }

      orthoView.control.size = 120 / orthoView.camera.zoom;
    });
  }
};

var displayLabels = function displayLabels() {
  var labels = document.getElementsByClassName("viewport-label");

  for (var i = labels.length - 1; i >= 0; --i) {
    labels[i].remove();
  }

  views.forEach(function (view) {
    var label = document.createElement('div');
    label.innerText = view.label;
    label.classList.add("viewport-label");
    label.style.top = 20 + view.top * wrapper.clientHeight + "px";
    label.style.left = 20 + view.left * wrapper.clientWidth + "px";
    wrapper.appendChild(label);
  });
};

var shadeThreeColor = function shadeThreeColor(threeColor, percent) {
  var color = threeColor.getHex();
  var t = percent < 0 ? 0 : 255,
      p = percent < 0 ? percent * -1 : percent,
      R = color >> 16,
      G = color >> 8 & 0x00FF,
      B = color & 0x0000FF;
  return 0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B);
};

var animate = function animate() {
  updateCameras(views, scene);

  if (hovered && !isObjectSelected(hovered)) {
    // remove highlight from the previous "hovered" element
    resetElementColor(hovered);
  }

  hovered = getFirstElementUnderCursor(mouse, views, scene);

  if (hovered) {
    // highlight the current "hovered" element
    highlightObject(hovered);
  }

  requestAnimationFrame(animate);
};

var highlightObject = function highlightObject(object) {
  object.material.color.set(shadeThreeColor(object.baseColor, 0.333));
};

var resetElementColor = function resetElementColor(element) {
  element.material.color.set(element.baseColor);
};

var onResize = function onResize(window, event) {
  fitCanvas(canvas, wrapper);
  fitRenderer(canvas);
  updateViewports(views, canvas);
  fitCameras(views, scene);
  displayLabels();
};

var onMouseMove = function onMouseMove(event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY; // if can control 2 axis and is orthographic

  if (panning && panning.cameraType === "Orthographic" && panning.getCanControl().reduce(function (prev, current) {
    return prev + (current ? 1 : 0);
  }) === 2) {
    var camera = panning.camera;
    var canControl = panning.getCanControl(); // we weight the movement of the camera with the zoom to keep a constant speed across all zoom levels

    var movementX = event.movementX / camera.zoom; // -event.movementY because in the browser, Y = 0 is at the bottom of the screen

    var movementY = -event.movementY / camera.zoom;
    views.filter(function (view) {
      return view.cameraType === "Orthographic";
    }).forEach(function (view) {
      var camera = view.camera;

      if (canControl[0]) {
        // can control the X axis (threejs)
        camera.position.x -= movementX;

        if (canControl[2]) {
          camera.position.z += movementY;
        }
      }

      if (canControl[1]) {
        // can control the Y axis (threejs)
        camera.position.y -= movementY;

        if (canControl[2]) {
          camera.position.z += movementX;
        }
      }
    });
  }

  views.forEach(function (view) {
    if (view.orbitControls && view.orbitControls.enabled) {
      view.orbitControls.enabled = false;
    }
  }); // Switch the active gizmo to the new active view if it changed

  var viewWithGizmo = views.find(function (view) {
    return view.control && view.control.object;
  });
  var currentView = getActiveViewport(views);

  if (currentView) {
    if (!preventSelection) {
      // when using a control, preventSelection is set to true. It allows the user to move the cursor past the viewport when performing a transform
      if (viewWithGizmo && currentView.camera.uuid !== viewWithGizmo.camera.uuid) {
        // detach the last active transformControl if the active view is different from the view that owns it
        detachControls();
      } // true if the view can control at least one axis


      var currentViewCanControl = currentView.getCanControl().some(function (canControl) {
        return canControl;
      });

      if (currentView && currentViewCanControl && currentView.control && !currentView.control.object && selection.length) {
        var activeObject = getBlockByUuid(selection[0]);

        if (activeObject) {
          currentView.control.attach(activeObject);
          setTransformControlsBasis(activeObject);
        }
      }
    }

    if (currentView && currentView.orbitControls && !currentView.orbitControls.enabled) {
      currentView.orbitControls.enabled = true;
    }
  }
};

var updateViewports = function updateViewports(views, canvas) {
  views.forEach(function (view) {
    computeViewportPosition(view, canvas);
    computeViewportSize(view, canvas);
  });
};

var initRenderer = function initRenderer() {
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
  });
  fitRenderer(canvas);
};

var initScene = function initScene() {
  scene = new THREE.Scene();
};

var initCameras = function initCameras() {
  if (views && views.length) {
    views.forEach(function (view) {
      computeViewportPosition(view, canvas);
      computeViewportSize(view, canvas);
      var camera = null;

      if (view.cameraType === "Orthographic") {
        camera = new THREE.OrthographicCamera( // --> frustum
        // centered in viewport
        view.clientWidth / -2, view.clientWidth / 2, view.clientHeight / 2, view.clientHeight / -2, // includes everything between {first} units from the camera to {second} units from the camera
        0, 2000);
        camera.position.fromArray(view.getEye());
      } else if (view.cameraType === "Perspective") {
        camera = new THREE.PerspectiveCamera( // fov
        18, // ratio
        view.clientWidth / view.clientHeight, // includes everything between {first} units from the camera to {second} units from the camera
        0.1, 2000);
        camera.position.fromArray(view.getEye());
      }

      camera.lookAt(scene.position);
      view.camera = camera;
    });
  }
};

var initGizmos = function initGizmos() {
  views.forEach(function (view) {
    var canControl = view.getCanControl();

    if (canControl[0] || canControl[1] || canControl[2]) {
      // make a control if at least one axis can be controlled
      var control = new THREE.TransformControls(view, canvas);
      control.addEventListener("objectChange", function (event) {
        var mode = control.getMode();
        var object = control.object;

        switch (mode) {
          case "translate":
            // Round position to .2f
            var position = object.position;
            var roundedPosition = new THREE.Vector3(Math.round(position.x * 100) / 100, Math.round(position.y * 100) / 100, Math.round(position.z * 100) / 100);
            object.position.set(roundedPosition.x, roundedPosition.y, roundedPosition.z);
            var translation = getTranslationBetween(transformControlsBasis.position, roundedPosition);

            if (selection.length > 1) {
              // multi select
              applyTranslationToSelection(translation);
            } else {
              sendToElm("sync-position", {
                uuid: object.uuid,
                position: toShipCoordinates(roundedPosition.x, roundedPosition.y, roundedPosition.z, coordinatesTransform)
              });
            }

            break;

          case "scale":
            var scale = object.scale;
            var size = getObjectSize(object);
            var newSize = {
              // rounded to .2f
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

            object.scale.set(newSize.x / size.x, newSize.y / size.y, newSize.z / size.z);
            sendToElm("sync-size", {
              uuid: object.uuid,
              size: sizeToShipCoordinates(newSize)
            });
            break;

          default:
            break;
        }

        setTransformControlsBasis(object);
      });
      control.addEventListener("mouseDown", function (event) {
        preventSelection = true; // prevents selecting another block while transforming one with the gizmo
      });
      control.addEventListener("mouseUp", function (event) {
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
};

var initOrbitControls = function initOrbitControls() {
  views.filter(function (view) {
    return view.cameraType === "Perspective";
  }).forEach(function (view) {
    var control = new THREE.OrbitControls(view.camera);
    view.orbitControls = control;
  });
};

var initCanvas = function initCanvas(parent) {
  canvas = document.createElement("canvas");
  canvas.id = "three-canvas";
  canvas.style.position = "absolute"; // the parent can get smaller than the canvas, that will be resized later

  document.addEventListener("mousedown", onClick, false);
  canvas.addEventListener("dblclick", onDoubleClick, false); // used to cycle through the transform modes

  parent.appendChild(canvas);
  fitCanvas(canvas, wrapper);
};

var onClick = function onClick(event) {
  var activeViewport = getActiveViewport(views);

  switch (event.which) {
    case 1:
      // left click
      if (activeViewport && hovered && !preventSelection) {
        if (multipleSelect) {
          toggleBlockSelection(hovered);
        } else {
          selectObject(hovered);
        }
      }

      break;

    case 2:
      // middle click
      resetSelection();
      sendToElm("unselect", null);
      break;

    default: // right click

  }
};

var isObjectSelected = function isObjectSelected(object) {
  return selection.length && selection.includes(object.uuid);
};

var isObjectHovered = function isObjectHovered(object) {
  return hovered && hovered.uuid === object.uuid;
};

var onDoubleClick = function onDoubleClick(event) {
  // cycle through the transform modes
  var activeViewport = getActiveViewport(views);

  if (activeViewport) {
    views.forEach(function (view) {
      if (view.control && view.control.getMode() === "translate") {
        view.control.setMode("scale");
      } else if (view.control) {
        view.control.setMode("translate");
      }
    });
  }
};

var updateCameras = function updateCameras(views, scene) {
  views.forEach(function (view) {
    return updateCamera(view, scene);
  });
};

var updateCamera = function updateCamera(view, scene) {
  if (view) {
    var camera = view.camera;

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
};

var fitCameras = function fitCameras(views) {
  views.forEach(function (view) {
    var camera = view.camera;

    if (camera && view.cameraType === "Orthographic") {
      camera.left = view.clientWidth / -2;
      camera.right = view.clientWidth / 2;
      camera.top = view.clientHeight / 2;
      camera.bottom = view.clientHeight / -2;
      camera.updateProjectionMatrix();
    }
  });
};

var fitRenderer = function fitRenderer(canvas) {
  if (renderer) {
    renderer.setSize(canvas.width, canvas.height);
  }
};

var fitCanvas = function fitCanvas() {
  if (canvas) {
    canvas.width = wrapper.clientWidth;
    canvas.height = wrapper.clientHeight;
  }
};

var computeViewportSize = function computeViewportSize(view, canvas) {
  view.clientWidth = Math.round(view.width * canvas.width);
  view.clientHeight = Math.round(view.height * canvas.height);
};

var computeViewportPosition = function computeViewportPosition(view, canvas) {
  view.clientLeft = Math.round(view.left * canvas.width);
  view.clientTop = Math.round(view.top * canvas.height);
};

var mouseIsOver = function mouseIsOver(view) {
  return mouse.y >= view.clientTop + wrapper.offsetTop && mouse.y <= view.clientTop + wrapper.offsetTop + view.clientHeight && mouse.x >= view.clientLeft + wrapper.offsetLeft && mouse.x <= view.clientLeft + wrapper.offsetLeft + view.clientWidth;
};

var getElementsUnderCursor = function getElementsUnderCursor(mouse, views, scene) {
  var activeView = getActiveViewport(views);

  if (activeView) {
    var elements = getElementsUnderCursorForView(mouse, activeView, scene);
    return elements.map(function (element) {
      return element.object;
    });
  } else {
    return [];
  }
};

var getActiveViewport = function getActiveViewport(views) {
  return views.find(function (view) {
    return mouseIsOver(view);
  });
};

var getFirstElementUnderCursor = function getFirstElementUnderCursor(mouse, views, scene) {
  var elements = getElementsUnderCursor(mouse, views, scene);
  var modeElements = elements.filter(function (element) {
    return element.sbType && element.sbType === mode;
  });

  if (modeElements.length) {
    return modeElements[0];
  } else {
    return null;
  }
};

var getElementsUnderCursorForView = function getElementsUnderCursorForView(mouse, view, scene) {
  if (view) {
    var normalizedMouse = normalizeMouseCoordinatesForView(mouse, view);
    raycaster.setFromCamera(normalizedMouse, view.camera);
    return raycaster.intersectObjects(scene.children);
  } else {
    return [];
  }
};

var normalizeMouseCoordinatesForView = function normalizeMouseCoordinatesForView(mouse, view) {
  // {x: [-1,1], y: [-1,1] }
  // (-1,-1) = bottom left
  // ( 1, 1) = top right
  var offsetX = mouse.x - view.clientLeft - wrapper.offsetLeft;
  var offsetY = mouse.y - (view.clientTop + view.clientHeight + wrapper.offsetTop);
  var normalizedX = offsetX / view.clientWidth * 2 - 1;
  var normalizedY = -(offsetY / view.clientHeight) * 2 - 1;
  return new THREE.Vector2(normalizedX, normalizedY);
};
