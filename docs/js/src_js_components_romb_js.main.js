"use strict";
(self["webpackChunkgulp_builder"] = self["webpackChunkgulp_builder"] || []).push([["src_js_components_romb_js"],{

/***/ "./src/js/components/romb.js":
/*!***********************************!*\
  !*** ./src/js/components/romb.js ***!
  \***********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.core.js");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var gsap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! gsap */ "./node_modules/gsap/index.js");



const canvas = document.querySelector("#loyal-canvas");
let scene, camera, renderer, rhombus, wireframeRhombus;
let isDragging = false,
  previousMouseX = 0,
  rotationSpeed = 0.006;
let isWireframe = true;
const colors = [0xf1f1f1, 0xececec, 0xe9e9e9, 0xf1f1f1, 0xececec, 0xe9e9e9];
function init() {
  scene = new three__WEBPACK_IMPORTED_MODULE_0__.Scene();
  camera = new three__WEBPACK_IMPORTED_MODULE_0__.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  renderer = new three__WEBPACK_IMPORTED_MODULE_1__.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas: canvas
  });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setClearColor(0x000000, 0);
  renderer.sortObjects = true;
  // document.body.appendChild(renderer.domElement);

  camera.position.z = 2.9;
  createRhombus();
  setupEventListeners();
  startTransitionTimer();
  animate();
}
function createRhombus() {
  const numPoints = 12;
  const radius = 1.3;
  const middlePoints = [];
  for (let i = 0; i < numPoints; i++) {
    const angle = i / numPoints * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    middlePoints.push(new three__WEBPACK_IMPORTED_MODULE_0__.Vector3(x, 0, z));
  }
  rhombus = new three__WEBPACK_IMPORTED_MODULE_0__.Group();
  const topVertex = new three__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 2.0, 0);
  const bottomVertex = new three__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, -2.0, 0);
  const wireframeGeometryVertices = [];
  for (let i = 0; i < numPoints; i++) {
    wireframeGeometryVertices.push(topVertex.x, topVertex.y, topVertex.z);
    wireframeGeometryVertices.push(middlePoints[i].x, middlePoints[i].y, middlePoints[i].z);
  }
  for (let i = 0; i < numPoints; i++) {
    wireframeGeometryVertices.push(middlePoints[i].x, middlePoints[i].y, middlePoints[i].z);
    wireframeGeometryVertices.push(middlePoints[(i + 1) % numPoints].x, middlePoints[(i + 1) % numPoints].y, middlePoints[(i + 1) % numPoints].z);
  }
  for (let i = 0; i < numPoints; i++) {
    wireframeGeometryVertices.push(bottomVertex.x, bottomVertex.y, bottomVertex.z);
    wireframeGeometryVertices.push(middlePoints[i].x, middlePoints[i].y, middlePoints[i].z);
  }
  const wireframeGeometry = new three__WEBPACK_IMPORTED_MODULE_0__.BufferGeometry();
  wireframeGeometry.setAttribute("position", new three__WEBPACK_IMPORTED_MODULE_0__.Float32BufferAttribute(wireframeGeometryVertices, 3));
  const wireframeMaterial = new three__WEBPACK_IMPORTED_MODULE_0__.LineBasicMaterial({
    color: 0xcccccc,
    transparent: true,
    opacity: 1,
    depthTest: false // This ensures wireframe is always visible
  });
  wireframeRhombus = new three__WEBPACK_IMPORTED_MODULE_0__.LineSegments(wireframeGeometry, wireframeMaterial);
  for (let i = 0; i < numPoints; i++) {
    const currentPoint = middlePoints[i];
    const nextPoint = middlePoints[(i + 1) % numPoints];
    const topFaceGeometry = new three__WEBPACK_IMPORTED_MODULE_0__.BufferGeometry();
    const topVertices = new Float32Array([topVertex.x, topVertex.y, topVertex.z, nextPoint.x, nextPoint.y, nextPoint.z, currentPoint.x, currentPoint.y, currentPoint.z]);
    topFaceGeometry.setAttribute("position", new three__WEBPACK_IMPORTED_MODULE_0__.BufferAttribute(topVertices, 3));
    topFaceGeometry.computeVertexNormals();
    const bottomFaceGeometry = new three__WEBPACK_IMPORTED_MODULE_0__.BufferGeometry();
    const bottomVertices = new Float32Array([bottomVertex.x, bottomVertex.y, bottomVertex.z, currentPoint.x, currentPoint.y, currentPoint.z, nextPoint.x, nextPoint.y, nextPoint.z]);
    bottomFaceGeometry.setAttribute("position", new three__WEBPACK_IMPORTED_MODULE_0__.BufferAttribute(bottomVertices, 3));
    bottomFaceGeometry.computeVertexNormals();
    const colorIndex = i % colors.length;
    const materialProps = {
      color: colors[colorIndex],
      transparent: true,
      opacity: 0,
      side: three__WEBPACK_IMPORTED_MODULE_0__.FrontSide,
      depthWrite: true,
      depthTest: true
    };
    const topMaterial = new three__WEBPACK_IMPORTED_MODULE_0__.MeshBasicMaterial(materialProps);
    const bottomMaterial = new three__WEBPACK_IMPORTED_MODULE_0__.MeshBasicMaterial(materialProps);
    const topMesh = new three__WEBPACK_IMPORTED_MODULE_0__.Mesh(topFaceGeometry, topMaterial);
    const bottomMesh = new three__WEBPACK_IMPORTED_MODULE_0__.Mesh(bottomFaceGeometry, bottomMaterial);
    rhombus.add(topMesh);
    rhombus.add(bottomMesh);
  }
  scene.add(rhombus);
  scene.add(wireframeRhombus);
}
function startTransitionTimer() {
  setInterval(() => {
    isWireframe = !isWireframe;
    const duration = 1000;
    if (isWireframe) {
      rhombus.children.forEach(mesh => {
        gsap__WEBPACK_IMPORTED_MODULE_2__["default"].to(mesh.material, {
          opacity: 0,
          duration: duration / 1000,
          ease: "power2.inOut"
        });
      });
    } else {
      rhombus.children.forEach(mesh => {
        gsap__WEBPACK_IMPORTED_MODULE_2__["default"].to(mesh.material, {
          opacity: 1,
          duration: duration / 1000,
          ease: "power2.inOut"
        });
      });
    }
  }, 3000);
}
function animate() {
  requestAnimationFrame(animate);
  if (!isDragging) {
    wireframeRhombus.rotation.y += rotationSpeed;
    rhombus.rotation.y += rotationSpeed;
  }
  renderer.render(scene, camera);
}
function onMouseDown(event) {
  isDragging = true;
  previousMouseX = event.clientX;
}
function onMouseUp() {
  isDragging = false;
}
function onMouseMove(event) {
  if (isDragging) {
    const deltaX = event.clientX - previousMouseX;
    previousMouseX = event.clientX;
    const rotation = deltaX * 0.003;
    wireframeRhombus.rotation.y -= rotation;
    rhombus.rotation.y -= rotation;
  }
}
function setupEventListeners() {
  renderer.domElement.addEventListener("mousedown", onMouseDown);
  renderer.domElement.addEventListener("mouseup", onMouseUp);
  renderer.domElement.addEventListener("mousemove", onMouseMove);
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
  window.addEventListener("resize", () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
  });
}
init();

/***/ })

}]);
//# sourceMappingURL=src_js_components_romb_js.main.js.map