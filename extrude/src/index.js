import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';



import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

import WaltHead from "./models/WaltHead.obj";

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();



var geometry, material, mesh;
var camera, scene, renderer, light1, light2, light3, light4, object, stats;

var clock = new THREE.Clock();

// init();
// animate();

function init() {
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.z = 100;
  scene = new THREE.Scene();

  //model
  var loader = new OBJLoader();
  loader.load(WaltHead, function(obj) {
    object = obj;
    object.scale.multiplyScalar(0.8);
    object.position.y = -30;
    // scene.add( object );
  });

  var length = 12,
    width = 8;

  // temp shape for positioning
  var shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0, width);
  shape.lineTo(length, width);
  shape.lineTo(length, 0);
  shape.lineTo(0, 0);

  const alpha = 0.5;
  const gamma = 0.5;
  const beta = 0.5;
  var specularShininess = Math.pow(2, alpha * 10);
  var specularColor = new THREE.Color( beta * 0.2, beta * 0.2, beta * 0.2 );


  var diffuseColor = new THREE.Color()
    .setHSL(alpha, 0.5, gamma * 0.5 + 0.1)
    .multiplyScalar(1 - beta * 0.2);
  var material = new THREE.MeshPhongMaterial({
    // map: imgTexture,
    // bumpMap: imgTexture,
    // bumpScale: bumpScale,
    color: diffuseColor,
    specular: specularColor,
    reflectivity: beta,
    shininess: specularShininess,
    // envMap: alphaIndex % 2 === 0 ? null : reflectionCube
  });

  var geometry = new THREE.BoxBufferGeometry(10, 10, 10);
  mesh = new THREE.Mesh(geometry, material);
  
  mesh.position.y = 110
  scene.add(mesh);
var strength=100;
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
  //renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  //stats
  stats = new Stats();

  var controls = new OrbitControls(camera, renderer.domElement);
  document.body.appendChild(stats.dom);
  window.addEventListener("resize", onWindowResize, false);
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function animate() {
  requestAnimationFrame(animate);
  render();
  stats.update();
}
function render() {
  var time = Date.now() * 0.005;
  var delta = clock.getDelta();
  // if ( object ) object.rotation.y -= 0.5 * delta;
  light1.position.x = Math.sin(time * 0.7) * 110
  light1.position.y = Math.cos(time * 0.5) * 15;
  light1.position.z = Math.cos(time * 0.3) * 100;
  light2.position.x = Math.cos(time * 0.3) * 110
  light2.position.y = Math.sin(time * 0.5) * 15;
  light2.position.z = Math.sin(time * 0.7) * 100;
  light3.position.x = Math.sin(time * 0.7) * 110
  light3.position.y = Math.cos(time * 0.3) * 15;
  light3.position.z = Math.sin(time * 0.5) * 100;
  light4.position.x = Math.sin(time * 0.3) * 110
  light4.position.y = Math.cos(time * 0.7) * 15;
  light4.position.z = Math.sin(time * 0.5) * 100;
  renderer.render(scene, camera);
}
