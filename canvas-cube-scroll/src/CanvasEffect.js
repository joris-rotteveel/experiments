import React from "react";
import * as THREE from "three";

import flower_1 from "./assets/flower-1.jpg";
import flower_2 from "./assets/flower-2.jpg";
import flower_3 from "./assets/flower-3.jpg";
import flower_4 from "./assets/flower-4.jpg";
import flower_5 from "./assets/flower-5.jpg";
import flower_6 from "./assets/flower-6.jpg";
import { TweenMax } from "gsap";
import { EEXIST } from "constants";

let hasThree, textureA;
let scene, camera, renderer, cube, raycaster, followScrollPosition;

const mouse = new THREE.Vector2();
const fixedDepth = -100;
const DOMPosition = { x: 0, y: 0, z: 0 };
let targetPos = { x: 0, y: 0, z: fixedDepth };
let previousMousePosition = {
  x: 0,
  y: 0
};
let startMousePosition = {
  x: 0,
  y: 0
};
let isDragging;

const visibleHeightAtZDepth = (depth, camera) => {
  // compensate for cameras not positioned at z=0
  const cameraOffset = camera.position.z;
  if (depth < cameraOffset) depth -= cameraOffset;
  else depth += cameraOffset;

  // vertical fov in radians
  const vFOV = (camera.fov * Math.PI) / 180;

  // Math.abs to ensure the result is always positive
  return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
};

const visibleWidthAtZDepth = (depth, camera) => {
  const height = visibleHeightAtZDepth(depth, camera);
  const fullWidth = height * camera.aspect;

  return fullWidth;
};

function CanvasEffect({ centerCube, onCubeClick, onOutsideClick }) {
  React.useEffect(() => {
    if (!centerCube) {
      targetPos = { ...DOMPosition };
      followScrollPosition = true;
      TweenMax.to(cube.rotation, 1, { x: 0, y: 1.6, z: 0 });
      TweenMax.to(camera.position, 1, { z: 100 });
    } else {
      followScrollPosition = false;
      targetPos = { x: 0, y: 0, z: fixedDepth };
      TweenMax.to(camera.position, 1, { z: 300 });
    }
  }, [centerCube]);

  const createCube = () => {
    const aspect = 512 / 512;

    const fullWidthUnits = visibleWidthAtZDepth(fixedDepth, camera);
    const fullHeightUnits = visibleHeightAtZDepth(fixedDepth, camera);
    const pixelInUnits = fullWidthUnits / window.innerWidth;

    const originalWidthUnits = pixelInUnits * 512;
    const originalHeightUnits = originalWidthUnits / aspect;
    const zeroX = -fullWidthUnits / 2 + originalWidthUnits / 2;
    const zeroY = fullHeightUnits / 2 - originalHeightUnits / 2;

    const left = zeroX;
    const top = zeroY;

    const geometry2 = new THREE.BoxBufferGeometry(
      originalWidthUnits,
      originalHeightUnits,
      originalWidthUnits
    );
    const loader = new THREE.TextureLoader();
    textureA = loader.load(flower_1);
    const materials = [
      new THREE.MeshBasicMaterial({ map: textureA }),
      new THREE.MeshBasicMaterial({ map: loader.load(flower_2) }),
      new THREE.MeshBasicMaterial({ map: loader.load(flower_3) }),
      new THREE.MeshBasicMaterial({ map: loader.load(flower_4) }),
      new THREE.MeshBasicMaterial({ map: loader.load(flower_5) }),
      new THREE.MeshBasicMaterial({ map: loader.load(flower_6) })
    ];
    cube = new THREE.Mesh(geometry2, materials);
    cube.position.z = fixedDepth;

    DOMPosition.x = left - 60;
    DOMPosition.y = top + 60;
    DOMPosition.z = fixedDepth - originalWidthUnits / 2;
    DOMPosition.pixelInUnits = pixelInUnits;

    scene.add(cube);
  };

  const onMouseClick = e => {
    isDragging = false;

    const offsetX = e.touches ? e.changedTouches[0].clientX : e.clientX;
    const offsetY = e.touches ? e.changedTouches[0].clientY : e.clientY;

    const deltaX = offsetX - startMousePosition.x;
    const deltaY = offsetY - startMousePosition.y;

    const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    console.log(dist);
    if (dist > 20) return;

    mouse.x = (offsetX / window.innerWidth) * 2 - 1;
    mouse.y = -(offsetY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([cube]);

    if (intersects.length > 0) {
      const intersectWithCube = intersects[0];
      console.log(intersectWithCube.faceIndex);

      followScrollPosition = true;
      onCubeClick();
    } else {
      // onOutsideClick();
    }
  };

  const onMouseUp = e => {
    if (followScrollPosition) return;
    isDragging = false;
  };
  const onMouseDown = e => {
    if (followScrollPosition) return;

    if (e.touches) {
      // document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("click", onMouseClick);
    }
    isDragging = true;
    const offsetX = e.touches ? e.touches[0].clientX : e.clientX;
    const offsetY = e.touches ? e.touches[0].clientY : e.clientY;
    startMousePosition = {
      x: offsetX,
      y: offsetY
    };
  };
  const onMouseMove = e => {
    if (followScrollPosition) return;
    const offsetX = e.touches ? e.touches[0].clientX : e.clientX;
    const offsetY = e.touches ? e.touches[0].clientY : e.clientY;
    var deltaMove = {
      x: offsetX - previousMousePosition.x,
      y: offsetY - previousMousePosition.y
    };

    console.log("moving", deltaMove);
    if (isDragging && !followScrollPosition) {
      var deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(
          THREE.Math.degToRad(deltaMove.y * 1),
          THREE.Math.degToRad(deltaMove.x * 1),
          0,
          "XYZ"
        )
      );

      cube.quaternion.multiplyQuaternions(
        deltaRotationQuaternion,
        cube.quaternion
      );
    }
    console.log(cube.rotation);
    previousMousePosition = {
      x: offsetX,
      y: offsetY
    };
  };

  const onContainer = div => {
    if (!div || hasThree) return;
    hasThree = true;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor("#000000", 1);
    document.addEventListener("mousedown", onMouseDown, false);
    document.addEventListener("touchstart", onMouseDown, false);
    document.addEventListener("touchend", onMouseClick, false);
    document.addEventListener("click", onMouseClick, false);
    document.addEventListener("mouseup", onMouseUp, false);
    document.addEventListener("mousemove", onMouseMove, false);
    document.addEventListener("touchmove", onMouseMove, false);
    raycaster = new THREE.Raycaster();

    createCube();
    div.appendChild(renderer.domElement);

    start();
  };

  const resizeRendererToDisplaySize = renderer => {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  };

  const start = () => {
    requestAnimationFrame(animate);
  };

  const animate = () => {
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    if (followScrollPosition) {
      // const originalWidthUnits = pixelInUnits * 512;
      // const zeroY = fullHeightUnits / 2 - originalHeightUnits / 2;
      const { x, y, z, pixelInUnits } = DOMPosition;
      const scrollY = pixelInUnits * window.scrollY;

      targetPos = { ...DOMPosition };
      targetPos.y += scrollY * 5;
    } else {
      // cube.rotation.x += 0.01;
      // cube.rotation.y += 0.01;
    }

    if (cube) {
      const ease = 0.1;
      cube.position.x += (targetPos.x - cube.position.x) * ease;
      cube.position.y += (targetPos.y - cube.position.y) * ease;
      cube.position.z += (targetPos.z - cube.position.z) * ease;
    }
    // if(textureA){
    //   textureA.rotation.z=cube.rotation.z;
    // }
    renderScene();
    window.requestAnimationFrame(animate);
  };

  const renderScene = () => {
    renderer.render(scene, camera);
  };

  return <div className="effect-container" ref={onContainer} />;
}

export default CanvasEffect;
