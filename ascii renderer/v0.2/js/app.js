import loadBmFont from "load-bmfont";
import createLayout from "layout-bmfont-text";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import fragment from "./shader/fragment.glsl";
import vertex from "./shader/vertex.glsl";

import texture from "../img/texture.jpg";
import numberTest from "../img/numbers.png";
import FNTFile from "../fonts/comic.fnt";
import PNGFile from "../fonts/comic.png";

import * as dat from "dat.gui";
import gsap from "gsap";

export default class Sketch {
  constructor(options) {
    this.scene = new THREE.Scene();
    this.options = options;

    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor("#cccccc", 1);

    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    );

    // var frustumSize = 10;
    // var aspect = window.innerWidth / window.innerHeight;
    // this.camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, -1000, 1000 );
    this.camera.position.set(0, 0, 2);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;

    this.isPlaying = true;

    this.addObjects();
    this.resize();
    this.render();
    this.setupResize();
    // this.settings();
  }

  settings() {
    let that = this;
    this.settings = {
      progress: 0,
    };
    this.gui = new dat.GUI();
    this.gui.add(this.settings, "progress", 0, 1, 0.01);
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  addObjects() {
    console.log({ texture });
    let that = this;
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector4() },
        imageTexture: { value: new THREE.TextureLoader().load(texture) },
        fontTexture: { value: new THREE.TextureLoader().load(numberTest) },
        fontData: { value: that.options.fontData },
      },
      // wireframe: true,
      // transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.geometry = new THREE.PlaneGeometry(1, 1, 10, 10);

    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.plane);
  }

  stop() {
    this.isPlaying = false;
  }

  play() {
    if (!this.isPlaying) {
      this.render();
      this.isPlaying = true;
    }
  }

  render() {
    if (!this.isPlaying) return;
    this.time += 0.05;
    this.material.uniforms.time.value = this.time;
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

loadBmFont(FNTFile, function (err, font) {
  if (err) throw err;

  // Ensure that the "font" file has all the characters bewlow!
  const greyscalePattern = "lorem";
  console.log(greyscalePattern.length);

  const layout = createLayout({
    font: font,
    text: greyscalePattern,
    width: 300,
    letterSpacing: 2,
    align: "center",
  });
  console.log({ layout });

  // https://github.com/Jam3/three-bmfont-text/blob/master/index.js#L65
  // check to see how we can convert the "layout" into uvs

  new Sketch({
    dom: document.getElementById("container"),
    fontData: font,
  });
});
