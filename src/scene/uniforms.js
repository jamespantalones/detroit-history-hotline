// @flow

const THREE = window.THREE;

type UniformProp = {
  type: string,
  value: number
};

type UniformVectorProp = {
  type: string,
  value: Array<number>
};

type UniformTextureProp = {
  type: string,
  value: ?any
};

type Uniforms = {
  u_time: UniformProp,
  u_resolution: UniformVectorProp,
  u_texture: UniformTextureProp,
  u_flash: UniformProp
};

const getUniforms = (lib: any): Uniforms => {
  return {
    u_time: {
      type: '1f',
      value: 1.0
    },
    u_resolution: {
      type: 'v2',
      value: new lib.Vector2(window.innerWidth, window.innerHeight)
    },
    u_texture: {
      type: 't',
      value: null
    },
    u_flash: {
      type: '1f',
      value: 0.0
    }
  };
};

export default getUniforms;
