import React from "react";
import * as THREE from "three";

let hasThree;
let scene, camera, renderer, plane;

const lookup = {};

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

function CanvasEffect({ imageData, scrollOffset }) {
  // imageData updated
  React.useEffect(() => {
    if (imageData.length === 0) return;

    const image = imageData[0].element;
    const rect = image.getBoundingClientRect();
    const DOMPostion = { x: rect.left, y: rect.top };

    const aspect = image.width / image.height;

    const texture = new THREE.Texture(image);
    texture.needsUpdate = true;

    const fixedDepth = -100;
    const fullWidthUnits = visibleWidthAtZDepth(fixedDepth, camera);
    const fullHeightUnits = visibleHeightAtZDepth(fixedDepth, camera);

    const pixelInUnits = fullWidthUnits / window.innerWidth;

    const originalWidthUnits = pixelInUnits * image.width;
    const originalHeightUnits = originalWidthUnits / aspect;
    const zeroX = -fullWidthUnits / 2 + originalWidthUnits / 2;
    const zeroY = fullHeightUnits / 2 - originalHeightUnits / 2;

    const left = zeroX + DOMPostion.x * pixelInUnits;
    const top = zeroY - DOMPostion.y * pixelInUnits;

    // set up a lookup
    lookup[0] = { pixelInUnits, fullWidthUnits, fullHeightUnits, left, top };
    var geometry = new THREE.PlaneGeometry(
      originalWidthUnits,
      originalHeightUnits,
      1
    );
    var material = new THREE.MeshBasicMaterial({ map: texture });

    plane = new THREE.Mesh(geometry, material);
    plane.position.set(left + 10, top, fixedDepth);

    scene.add(plane);
  }, [imageData]);

  //scroll updated

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
    renderer.setClearColor("#000000", 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    div.appendChild(renderer.domElement);

    start();
  };

  const start = () => {
    requestAnimationFrame(animate);
  };

  const animate = () => {
    if (lookup[0]) {
      const {
        pixelInUnits,
        top
      } = lookup[0];
      const newY = top + window.scrollY * pixelInUnits;
      plane.position.y += (newY-plane.position.y)*0.2;
    }
    renderScene();
    window.requestAnimationFrame(animate);
  };

  const renderScene = () => {
    renderer.render(scene, camera);
  };

  return <div className="effect-container" ref={onContainer} />;
}

export default CanvasEffect;
