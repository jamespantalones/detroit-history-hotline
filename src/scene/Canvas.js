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

export const canvasImages = [
  {
    name: 'test',
    src: require('../images/test_card.png')
  },
  {
    name: 'phones',
    src: require('../images/phones.jpg')
  },

  {
    name: 'carl_craig',
    src: require('../images/carl_craig.jpg')
  },
  {
    name: 'derrick_may',
    src: require('../images/derrick_may.jpg')
  },

  {
    name: 'dj_holographic',
    src: require('../images/dj_holographic.jpg')
  },
  {
    name: 'dj_minx',
    src: require('../images/dj_minx.jpg')
  },

  {
    name: 'jeff_mills',
    src: require('../images/jeff_mills.jpg')
  },

  {
    name: 'robert_hood',
    src: require('../images/robert_hood.jpg')
  },

  {
    name: 'theo_parrish',
    src: require('../images/theo_parrish.jpg')
  },
  {
    name: 'leon_ware',
    src: require('../images/leon_ware.jpg')
  },
  {
    name: 'waajeed',
    src: require('../images/waajeed.jpg')
  },
  {
    name: 'erika',
    src: require('../images/erika.jpg')
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
    this.flash_val = 0.0;
    this.init();
  }

  //-----------------------------------------
  // set up GL
  //
  async init() {
    this.addScene();
    this.addRenderer();
    this.addCamera();

    try {
      await this.loadMultiTextures();
      this.addMaterial();
      this.render();
    } catch (err) {
      console.log('Error in init', err);
    }

    window.addEventListener('resize', this.onResize, false);
  }

  addScene() {
    this.scene = new Scene();
  }

  onResize = ev => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();

    this.material.uniforms.u_resolution.value = new Vector2(w, h);
    this.renderer.setSize(w, h);
  };

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
        const promises = canvasImages.map(i => this.loadSingleTexture(i));
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
        this.material.uniforms.u_texture.value = texture;
      }
    }
  };

  rootTexture = () => {
    if (this.images.length === 0) {
      setTimeout(() => {
        this.rootTexture();
      }, 100);
    } else {
      const t = this.images.find(i => i.name === 'phones');
      if (t && t.texture) {
        this.material.uniforms.u_texture.value = t.texture;
      }
    }
  };

  flashTexture = () => {
    this.flash_val = 10.0;
  };

  //-----------------------------------------
  // Add material
  //
  addMaterial() {
    const geometry = new PlaneBufferGeometry(5, 2, 128, 128);

    this.material = new ShaderMaterial({
      uniforms: createUniforms,
      vertexShader: createVertexShader,
      fragmentShader: createFragmentShader
    });

    const t = this.images.find(i => i.name === 'phones');

    const texture = t.texture;

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
    if (this.flash_val > 0.0) {
      this.flash_val -= 0.15;
    } else {
      this.flash_val = 0.0;
    }

    this.material.uniforms.u_time.value = this.delta;
    this.material.uniforms.u_flash.value = this.flash_val;
    this.renderer.render(this.scene, this.camera);
  }
}
