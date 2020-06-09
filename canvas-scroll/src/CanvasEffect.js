import React from "react";
import * as THREE from "three";


let hasThree;
let scene, camera, renderer;

const positionLookup = {};
const planeIDs = [];

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

function CanvasEffect({ imageData }) {
  React.useEffect(() => {
    imageData.forEach(({ element, index }) => {
      if (!positionLookup[index]) {
        const image = element;
        const rect = image.getBoundingClientRect();
        const DOMPostion = { x: rect.left, y: rect.top + window.scrollY };

        const aspect = rect.width / rect.height;

        const texture = new THREE.Texture(image);
        texture.needsUpdate = true;

        const fixedDepth = -700;
        const fullWidthUnits = visibleWidthAtZDepth(fixedDepth, camera);
        const fullHeightUnits = visibleHeightAtZDepth(fixedDepth, camera);

        const pixelInUnits = fullWidthUnits / window.innerWidth;

        const originalWidthUnits = pixelInUnits * rect.width;
        const originalHeightUnits = originalWidthUnits / aspect;
        const zeroX = -fullWidthUnits / 2 + originalWidthUnits / 2;
        const zeroY = fullHeightUnits / 2 - originalHeightUnits / 2;

        const left = zeroX + DOMPostion.x * pixelInUnits;
        const top = zeroY - DOMPostion.y * pixelInUnits;

        // set up a lookup
        positionLookup[index] = {
          pixelInUnits,
          fullWidthUnits,
          fullHeightUnits,
          left,
          top,
        };

        var geometry = new THREE.PlaneGeometry(
          originalWidthUnits,
          originalHeightUnits,
          1
        );
        var material = new THREE.MeshBasicMaterial({ map: texture });

        const plane = new THREE.Mesh(geometry, material);
        plane.position.set(left, top, fixedDepth);
        planeIDs.push({ id: index, geom: plane });

        scene.add(plane);
      }
    });
  }, [imageData]);

  //scroll updated

  const onContainer = (div) => {
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
    planeIDs.forEach(({ id, geom }) => {
      if (positionLookup[id]) {
        const { pixelInUnits, top } = positionLookup[id];
        const newY = top + window.scrollY * pixelInUnits;
        geom.position.y += (newY - geom.position.y) * 0.2;
      }
    });
    renderScene();
    window.requestAnimationFrame(animate);
  };

  const renderScene = () => {
    renderer.render(scene, camera);
  };

  return <div className="effect-container" ref={onContainer} />;
}

export default CanvasEffect;
