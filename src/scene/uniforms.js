import {
  Vector2
} from 'three';

const uniforms = {
  u_time: {
    type: '1f',
    value: 1.0
  },
  u_resolution: {
    type: 'v2',
    value: new Vector2(window.innerWidth, window.innerHeight)
  },
  u_texture: {
    type: 't',
    value: null
  }
};

export default uniforms;