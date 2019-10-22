import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import transformSVGPath from "./d3threeD";
import svg from "./svgObject";

import "./App.css";

function App() {
  var camera, scene, renderer, floor;
  var light1, light2, light3, light4;
  let meshes = [];
  let raycaster;
  const BASE_COLOUR = 0x156289;

  const mouse3D = { x: 0, y: 0 };

  const onRef = container => {
    scene = new THREE.Scene();
    raycaster = new THREE.Raycaster();

    camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.set(0, 0, 200);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    //
    var controls = new OrbitControls(camera, renderer.domElement);

    var group = new THREE.Group();

    var paths = svg.paths;
    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    var ambientLight = new THREE.AmbientLight(0xcccccc, 0.2);

    directionalLight.position.set(0.75, 0.75, 1.0).normalize();

    scene.add(group);
    scene.add(directionalLight);
    scene.add(ambientLight);

    const row = 6;
    const col = 6;
    meshes = [];

    var pathOfSVG = transformSVGPath(paths[0]);
    var shapeOfSVG = pathOfSVG.toShapes(true)[0];

    var length = 12,
      width = 8;

    // temp shape for positioning
    var shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0, width);
    shape.lineTo(length, width);
    shape.lineTo(length, 0);
    shape.lineTo(0, 0);

    var material = new THREE.MeshLambertMaterial({
      color: BASE_COLOUR,
      emissive: BASE_COLOUR
    });
    const topLeft = new THREE.Vector3(-60, 60, 0);
    for (let currentRow = 0; currentRow < row; currentRow++) {
      for (let currentCol = 0; currentCol < col; currentCol++) {
        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute(
          "position",
          new THREE.Float32BufferAttribute([], 3)
        );
        var mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.y = Math.PI;
        const xpos = topLeft.x + currentRow * 25;
        const ypos = topLeft.y + currentCol * -25;
        const zpos = topLeft.z;
        mesh.position.set(xpos, ypos, zpos);

        group.add(mesh);
        scene.add(group);

        meshes.push({ mesh, shape: shape });
        //
      }
    }

    var strength = 1;
    var sphere = new THREE.SphereBufferGeometry(0.5, 16, 8);
    //lights
    light1 = new THREE.PointLight(0xff0040, strength, 50);
    light1.add(
      new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xff0040 }))
    );
    scene.add(light1);
    light2 = new THREE.PointLight(0x0040ff, strength, 50);
    light2.add(
      new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0x0040ff }))
    );
    scene.add(light2);
    light3 = new THREE.PointLight(0x80ff80, strength, 50);
    light3.add(
      new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0x80ff80 }))
    );
    scene.add(light3);
    light4 = new THREE.PointLight(0xffaa00, strength, 50);
    light4.add(
      new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xffaa00 }))
    );
    scene.add(light4);

    floor = new THREE.Mesh(new THREE.PlaneGeometry(230, 230), material);

    scene.add(floor);

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    animate();
  };

  const onMouseMove = ({ clientX, clientY }) => {
    mouse3D.x = (clientX / window.innerWidth) * 2 - 1;
    mouse3D.y = -(clientY / window.innerHeight) * 2 + 1;
  };

  const updateGroupGeometry = (mesh, geometry, z) => {
    if (geometry.isGeometry) {
      geometry = new THREE.BufferGeometry().fromGeometry(geometry);

      console.warn(
        "THREE.GeometryBrowser: Converted Geometry to BufferGeometry."
      );
    }

    mesh.geometry.attributes.position = geometry.attributes.position;
    mesh.geometry.computeVertexNormals();
    mesh.geometry.attributes.position.needsUpdate = true;
  };

  const distance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  };

  const animate = () => {
    raycaster.setFromCamera(mouse3D, camera);
    const intersects = raycaster.intersectObjects([floor]);

    var time = Date.now() * 0.005;

    // if ( object ) object.rotation.y -= 0.5 * delta;
    light1.position.x = Math.sin(time * 0.7) * 10;
    light1.position.y = Math.cos(time * 0.5) * 15;
    light1.position.z = Math.cos(time * 0.3) * 100;
    light2.position.x = Math.cos(time * 0.3) * 10;
    light2.position.y = Math.sin(time * 0.5) * 15;
    light2.position.z = Math.sin(time * 0.7) * 100;
    light3.position.x = Math.sin(time * 0.7) * 10;
    light3.position.y = Math.cos(time * 0.3) * 15;
    light3.position.z = Math.sin(time * 0.5) * 100;
    light4.position.x = Math.sin(time * 0.3) * 10;
    light4.position.y = Math.cos(time * 0.7) * 15;
    light4.position.z = Math.sin(time * 0.5) * 100;

    if (intersects.length) {
      // get the x and z positions of the intersection
      const { x, z, y } = intersects[0].point;
      meshes.forEach(({ mesh, shape }, index) => {
        const mouseDistance = distance(x, y, mesh.position.x, mesh.position.y);
        const maxDist = 30;
        const pct = 1 - Math.min(1, Math.max(0, mouseDistance / maxDist));

        const depth = pct * 50;
        const data = {
          steps: 1,
          bevelEnabled: true,
          bevelThickness: 0,
          bevelSize: 10,
          bevelOffset: 0,
          bevelSegments: 0,
          depth: depth
        };

        var geometry = new THREE.ExtrudeBufferGeometry(shape, data);

        updateGroupGeometry(mesh, geometry);
        const pos = mesh.position.clone();
        pos.setZ(-1 + depth);

        mesh.position.set(pos.x, pos.y, pos.z);
      });
    }

    renderer.render(scene, camera);
    // stats.update();
    requestAnimationFrame(animate);
  };

  return <div id="container" ref={onRef} />;
}

export default App;
