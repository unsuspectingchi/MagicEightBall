import { view as config } from "../config.js";

export default class View {
  constructor(app) {
    this.scene;
    this.camera;
    this.renderer;
    this.app = app;
    this.lighting = {
      ambient: undefined,
      directional: undefined,
    };
    this.materials = {
      ball: undefined,
      tetra: undefined,
    };
    this.textures = {
      ball: undefined,
      tetra: undefined,
    };
    this.meshes = {
      ball: undefined,
      tetra: undefined,
    };

    window.onresize = this.resize.bind(this);
  }

  initBall() {
    this.textures.ball = new THREE.TextureLoader().load(config.ball.texUrl);
    // loads correctly... unclear if built in async or not... check docs**

    this.materials.ball = new THREE.MeshPhongMaterial();
    this.materials.ball.map = this.textures.ball;
    this.materials.ball.shininess = config.ball.shine;

    this.meshes.ball = new THREE.Mesh(
      this.app.model.geometries.ball,
      this.materials.ball
    );
    this.meshes.ball.rotation.y = config.ball.defaultRotY;
    this.meshes.ball.position.z = config.ball.zoomZPos;

    this.meshes.ball.material.opacity = 0;
    this.meshes.ball.material.transparent = true;

    this.scene.add(this.meshes.ball);
  }

  initTetra() {
    this.textures.tetra = new THREE.TextureLoader().load(
      config.tetra.responsesUrls[
        Math.floor(Math.random() * config.tetra.responsesUrls.length)
      ]
    );
    // loads correctly... unclear if built in async or not... check docs** also reset

    this.materials.tetra = new THREE.MeshPhongMaterial();
    this.materials.tetra.map = this.textures.tetra;
    this.materials.tetra.shininess = config.tetra.shine;

    this.meshes.tetra = new THREE.Mesh(
      this.app.model.geometries.tetra,
      this.materials.tetra
    );

    this.meshes.tetra.material.opacity = 0;
    this.meshes.tetra.material.transparent = true;
    this.meshes.tetra.position.z = config.tetra.zPos;
  }

  initialize() {
    // Scene init before light
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initObjects();

    this.initLight();
  }

  run() {
    if (this.app.gameState["reveal"]) {
      this.scene.add(this.meshes.tetra);
    }
    this.renderer.render(this.scene, this.camera);
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      config.camera.fov,
      window.innerWidth / window.innerHeight,
      config.camera.near,
      config.camera.far
    );

    this.camera.position.z = config.camera.zPos;
  }

  initLight() {
    this.lighting.ambient = new THREE.AmbientLight(
      config.light.ambient.color,
      config.light.ambient.intensity
    );
    this.lighting.directional = new THREE.DirectionalLight(
      config.light.directional.color,
      config.light.directional.intensity
    );

    this.lighting.directional.position.x = config.light.directional.position.x;
    this.lighting.directional.position.y = config.light.directional.position.y;
    this.lighting.directional.position.z = config.light.directional.position.z;

    this.scene.add(this.lighting.directional);
    this.scene.add(this.lighting.ambient);
  }

  initObjects() {
    this.initBall();
    this.initTetra();
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(config.scene.bgColor);
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  reset() {
    this.meshes.ball.rotation.y = config.ball.defaultRotY;
    this.meshes.ball.position.z = config.ball.zoomZPos;
    this.meshes.tetra.position.z = config.tetra.zPos;
    this.meshes.ball.material.opacity = 0;
    this.meshes.tetra.material.opacity = 0;

    this.textures.tetra = new THREE.TextureLoader().load(
      config.tetra.responsesUrls[
        Math.floor(Math.random() * config.tetra.responsesUrls.length)
      ]
    );
    this.materials.tetra.map = this.textures.tetra;
  }
}
