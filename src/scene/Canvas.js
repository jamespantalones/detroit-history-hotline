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
import createUniforms from './uniforms';

const images = [
  {
    name: 'test',
    src: require('../images/test_card.png')
  },
  {
    name: 'phones',
    src: require('../images/phones.jpg')
  },
  {
    name: 'terrence_parker_01',
    src: require('../images/parker.png')
  },
  {
    name: 'juan_atkins',
    src: require('../images/juan_atkins.jpg')
  },
  {
    name: 'carl_craig',
    src: require('../images/carl_craig.jpg')
  },
  {
    name: 'moodyman',
    src: require('../images/moodyman.jpg')
  },
  {
    name: 'mike_banks',
    src: require('../images/mike_banks.jpg')
  },
  {
    name: 'todd_osborn',
    src: require('../images/todd_osborn.jpg')
  }
];

//-----------------------------------------
// Main
//
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
    this.images = [];
    this.isOne = true;
    this.init();
  }

  //-----------------------------------------
  // set up GL
  //
  async init() {
    try {
      this.addScene();
      this.addRenderer();
      this.addCamera();
      await this.loadMultiTextures();
      this.addMaterial();
      this.render();
    } catch (err) {
      console.log('Error in init', err);
    }
  }

  addScene() {
    this.scene = new Scene();
  }

  addRenderer() {
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.parent.appendChild(this.renderer.domElement);
  }

  //-----------------------------------------
  // Generic camera
  //
  addCamera() {
    this.camera = new PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    this.camera.position.z = 2;
  }

  loadSingleTexture(img) {
    return new Promise((resolve, reject) => {
      const loader = new TextureLoader();

      loader.load(
        img.src,
        texture => {
          resolve(
            Object.assign({}, img, {
              texture
            })
          );
        },
        undefined,
        err => {
          reject(err);
        }
      );
    });
  }

  loadMultiTextures() {
    return new Promise(async (resolve, reject) => {
      try {
        const promises = images.map(i => this.loadSingleTexture(i));
        this.images = await Promise.all(promises);
        resolve(this.images);
      } catch (err) {
        reject(err);
      }
    });
  }

  swapTexture = name => {
    if (this.images.length === 0) {
      setTimeout(() => {
        this.swapTexture(name);
      }, 100);
    } else {
      const t = this.images.find(i => i.name === name);
      if (t && t.texture) {
        this.material.uniforms.u_texture.value = t.texture;
      } else {
        const { texture } = this.images.find(i => i.name === 'phones');
        console.log('TEXTURE', texture);
        this.material.uniforms.u_texture.value = texture;
      }
    }
  };

  //-----------------------------------------
  // Add material
  //
  addMaterial() {
    const loader = new TextureLoader();

    const geometry = new PlaneBufferGeometry(5, 2, 128, 128);

    this.material = new ShaderMaterial({
      uniforms: createUniforms,
      vertexShader: createVertexShader,
      fragmentShader: createFragmentShader
    });

    const t = this.images.find(i => i.name === 'phones');

    const texture = t.texture;
    console.log('IMAGS', texture);

    texture.wrapS = texture.wrapT = RepeatWrapping;
    this.material.uniforms.u_texture.value = texture;
    this.material.needsUpdate = true;
    this.mesh = new Mesh(geometry, this.material);
    this.mesh.position.z = 0;
    this.scene.add(this.mesh);
    this.callback();
  }

  render() {
    requestAnimationFrame(this.render);
    this.delta += 0.1;

    this.material.uniforms.u_time.value = this.delta;
    this.renderer.render(this.scene, this.camera);
  }
}
