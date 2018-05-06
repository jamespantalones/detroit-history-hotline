// Canvas

import {
  PerspectiveCamera,
  PlaneBufferGeometry,
  TextureLoader,
  WebGLRenderer,
  ShaderMaterial,
  Vector2,
  RepeatWrapping,
  Mesh,
  Scene
} from 'three';
import createFragmentShader from './fragment';
import createVertexShader from './vertex';
import parker from '../../images/parker.png';
import parker2 from '../../images/parker2.jpg';

export default class Canvas {
  constructor(el, callback) {
    this.parent = el;
    this.callback = callback;
    this.renderer = null;
    this.scene = null;
    this.material = null;
    this.mesh = null;
    this.delta = 1.0;
    this.render = this.render.bind(this);
    this.isOne = true;
    this.init();
  }

  init() {
    this.addCamera();
    this.scene = new Scene();
    this.addBG();

    this.renderer = new WebGLRenderer({ preserveDrawingBuffer: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.parent.appendChild(this.renderer.domElement);
    this.timer = setInterval(this.swap, 2000);
    this.render();
  }

  addCamera() {
    this.camera = new PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    this.camera.position.z = 2;
  }

  swap = () => {
    const loader = new TextureLoader();
    let img = parker;

    if (this.isOne) {
      img = parker2;
      this.isOne = false;
    } else {
      this.isOne = true;
    }

    loader.load(img, texture => {
      texture.wrapS = texture.wrapT = RepeatWrapping;
      if (this.material) {
        this.material.uniforms.u_texture.value = texture;
        //this.material.needsUpdate();
      }
    });
  };

  addBG() {
    const loader = new TextureLoader();

    const geometry = new PlaneBufferGeometry(5, 2, 128, 128);

    this.material = new ShaderMaterial({
      uniforms: {
        u_time: {
          type: '1f',
          value: 1.0
        },
        u_resolution: {
          type: 'v2',
          value: new Vector2(window.innerWidth, window.innerHeight)
        },
        u_texture: { type: 't', value: null }
      },
      vertexShader: createVertexShader,
      fragmentShader: createFragmentShader
    });
    this.material.needsUpdate = true;

    loader.load(parker, texture => {
      texture.wrapS = texture.wrapT = RepeatWrapping;
      this.material.uniforms.u_texture.value = texture;
      this.mesh = new Mesh(geometry, this.material);
      this.mesh.position.z = 0;
      this.scene.add(this.mesh);
      this.callback();
    });
  }

  render() {
    requestAnimationFrame(this.render);
    this.delta += 0.1;

    this.material.uniforms.u_time.value = this.delta;
    this.renderer.render(this.scene, this.camera);
  }
}
