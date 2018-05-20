// Canvas

import createFragmentShader from './fragment';
import createVertexShader from './vertex';
import createUniforms from './uniforms';
import data from '../data';

const THREE = window.THREE;

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
    this.scene = new THREE.Scene();
  }

  onResize = ev => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();

    this.material.uniforms.u_resolution.value = new THREE.Vector2(w, h);
    this.renderer.setSize(w, h);
  };

  addRenderer() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.parent.appendChild(this.renderer.domElement);
  }

  //-----------------------------------------
  // Generic camera
  //
  addCamera() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    this.camera.position.z = 2;
  }

  loadSingleTexture(item) {
    return new Promise((resolve, reject) => {
      console.log('ITEM', item);
      const loader = new THREE.TextureLoader();

      loader.load(
        item.image,
        texture => {
          resolve(
            Object.assign({}, item, {
              texture
            })
          );
        },
        undefined,
        err => {
          console.warn('Error loading image', item.image);
          reject(err);
        }
      );
    });
  }

  // Load all textures
  loadMultiTextures() {
    return new Promise(async (resolve, reject) => {
      try {
        const promises = data.map(i => this.loadSingleTexture(i));
        this.images = await Promise.all(promises);
        console.log(this.images);
        resolve(this.images);
      } catch (err) {
        reject(err);
      }
    });
  }

  swapTexture = slug => {
    if (this.images.length === 0) {
      setTimeout(() => {
        this.swapTexture(slug);
      }, 100);
    } else {
      if (!slug) {
        const { texture } = this.images.find(i => i.slug === 'default');
        this.material.uniforms.u_texture.value = texture;
      }

      const t = this.images.find(i => i.slug === slug);
      if (t && t.texture) {
        this.material.uniforms.u_texture.value = t.texture;
      } else {
        const { texture } = this.images.find(i => i.slug === 'default');
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
      const t = this.images.find(i => i.name === 'default');
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
    const geometry = new THREE.PlaneBufferGeometry(5, 2, 128, 128);

    this.material = new THREE.ShaderMaterial({
      uniforms: createUniforms,
      vertexShader: createVertexShader,
      fragmentShader: createFragmentShader
    });

    const t = this.images.find(i => i.name === 'default');

    const texture = t.texture;

    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    this.material.uniforms.u_texture.value = texture;
    this.material.needsUpdate = true;
    this.mesh = new THREE.Mesh(geometry, this.material);
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
