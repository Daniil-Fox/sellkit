// import * as THREE from "three";

export default async function initRomb() {
  const canvas = document.querySelector("#loyal-canvas");

  if (!canvas) {
    return;
  }

  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  if (isMobile) {
    console.log("Three.js (romb) не загружается на мобильных устройствах.");
    // Можно добавить какой-то простой fallback-контент или заглушку для мобильных,
    // если #loyal-canvas должен что-то отображать.
    // Например, установить фоновое изображение или простой CSS-анимированный элемент.
    // canvas.style.backgroundImage = "url('path/to/mobile-fallback-image.jpg')";
    return;
  }

  try {
    const THREE = await import("three");

    let scene, camera, renderer, rhombus, wireframeRhombus;
    let isDragging = false,
      previousMouseX = 0,
      rotationSpeed = 0.006;
    let isWireframe = true;

    const colors = [0xe5e8f3, 0xf0f2fb, 0xf6f8ff, 0xeef0f8, 0xe5e8f3, 0xf0f2fb];

    function init() {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        75,
        canvas.clientWidth / canvas.clientHeight,
        0.1,
        1000
      );
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        canvas: canvas,
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
        const angle = (i / numPoints) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        middlePoints.push(new THREE.Vector3(x, 0, z));
      }

      rhombus = new THREE.Group();

      const topVertex = new THREE.Vector3(0, 2.0, 0);
      const bottomVertex = new THREE.Vector3(0, -2.0, 0);

      const wireframeGeometryVertices = [];

      for (let i = 0; i < numPoints; i++) {
        wireframeGeometryVertices.push(topVertex.x, topVertex.y, topVertex.z);
        wireframeGeometryVertices.push(
          middlePoints[i].x,
          middlePoints[i].y,
          middlePoints[i].z
        );
      }

      for (let i = 0; i < numPoints; i++) {
        wireframeGeometryVertices.push(
          middlePoints[i].x,
          middlePoints[i].y,
          middlePoints[i].z
        );
        wireframeGeometryVertices.push(
          middlePoints[(i + 1) % numPoints].x,
          middlePoints[(i + 1) % numPoints].y,
          middlePoints[(i + 1) % numPoints].z
        );
      }

      for (let i = 0; i < numPoints; i++) {
        wireframeGeometryVertices.push(
          bottomVertex.x,
          bottomVertex.y,
          bottomVertex.z
        );
        wireframeGeometryVertices.push(
          middlePoints[i].x,
          middlePoints[i].y,
          middlePoints[i].z
        );
      }

      const wireframeGeometry = new THREE.BufferGeometry();
      wireframeGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(wireframeGeometryVertices, 3)
      );

      const wireframeMaterial = new THREE.LineBasicMaterial({
        color: 0xd6d8e5,
        transparent: true,
        opacity: 1,
        depthTest: false, // This ensures wireframe is always visible
      });

      wireframeRhombus = new THREE.LineSegments(
        wireframeGeometry,
        wireframeMaterial
      );

      for (let i = 0; i < numPoints; i++) {
        const currentPoint = middlePoints[i];
        const nextPoint = middlePoints[(i + 1) % numPoints];

        const topFaceGeometry = new THREE.BufferGeometry();
        const topVertices = new Float32Array([
          topVertex.x,
          topVertex.y,
          topVertex.z,
          nextPoint.x,
          nextPoint.y,
          nextPoint.z,
          currentPoint.x,
          currentPoint.y,
          currentPoint.z,
        ]);
        topFaceGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(topVertices, 3)
        );
        topFaceGeometry.computeVertexNormals();

        const bottomFaceGeometry = new THREE.BufferGeometry();
        const bottomVertices = new Float32Array([
          bottomVertex.x,
          bottomVertex.y,
          bottomVertex.z,
          currentPoint.x,
          currentPoint.y,
          currentPoint.z,
          nextPoint.x,
          nextPoint.y,
          nextPoint.z,
        ]);
        bottomFaceGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(bottomVertices, 3)
        );
        bottomFaceGeometry.computeVertexNormals();

        const colorIndex = i % colors.length;
        const materialProps = {
          color: colors[colorIndex],
          transparent: true,
          opacity: 0,
          side: THREE.FrontSide,
          depthWrite: true,
          depthTest: true,
        };

        const topMaterial = new THREE.MeshBasicMaterial(materialProps);
        const bottomMaterial = new THREE.MeshBasicMaterial(materialProps);

        const topMesh = new THREE.Mesh(topFaceGeometry, topMaterial);
        const bottomMesh = new THREE.Mesh(bottomFaceGeometry, bottomMaterial);

        rhombus.add(topMesh);
        rhombus.add(bottomMesh);
      }

      scene.add(rhombus);
      scene.add(wireframeRhombus);
    }

    function startTransitionTimer() {
      setInterval(() => {
        isWireframe = !isWireframe;

        if (isWireframe) {
          fadeOutMaterials();
        } else {
          fadeInMaterials();
        }
      }, 3000);
    }

    // Добавляем новые функции для анимации прозрачности
    let isAnimating = false;
    let animationStartTime = 0;
    const animationDuration = 1000; // миллисекунды

    function fadeOutMaterials() {
      isAnimating = true;
      animationStartTime = performance.now();
      requestAnimationFadeOut();
    }

    function fadeInMaterials() {
      isAnimating = true;
      animationStartTime = performance.now();
      requestAnimationFadeIn();
    }

    function requestAnimationFadeOut() {
      const currentTime = performance.now();
      const elapsedTime = currentTime - animationStartTime;
      const progress = Math.min(elapsedTime / animationDuration, 1);

      rhombus.children.forEach((mesh) => {
        mesh.material.opacity = 1 - progress;
      });

      if (progress < 1 && isAnimating) {
        requestAnimationFrame(requestAnimationFadeOut);
      } else {
        isAnimating = false;
      }
    }

    function requestAnimationFadeIn() {
      const currentTime = performance.now();
      const elapsedTime = currentTime - animationStartTime;
      const progress = Math.min(elapsedTime / animationDuration, 1);

      rhombus.children.forEach((mesh) => {
        mesh.material.opacity = progress;
      });

      if (progress < 1 && isAnimating) {
        requestAnimationFrame(requestAnimationFadeIn);
      } else {
        isAnimating = false;
      }
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
      canvas.addEventListener("mousedown", onMouseDown);
      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("mousemove", onMouseMove);
    }

    // Инициализация
    init();
  } catch (err) {
    console.error("Не удалось загрузить Three.js (romb):", err);
  }
}
