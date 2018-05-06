const fragment = `
  precision mediump float;
  varying vec2 vUv;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform sampler2D u_texture;
  void main(){

    vec2 q = gl_FragCoord.xy / u_resolution.xy;
    vec2 uv = 0.5 + (q - 0.5) * (0.9 + 0.1 * sin(0.2 * u_time / 5.0));

    vec3 tex = texture2D(u_texture, vec2(q.x,q.y)).xyz;
    vec3 col;

    col.r = texture2D(u_texture, vec2(uv.x + 0.003, uv.y)).x;
    col.g = texture2D(u_texture, vec2(uv.x + 0.00, uv.y)).y;
    col.b = texture2D(u_texture, vec2(uv.x - 0.003, uv.y)).z;

    col = clamp(col * 0.5 + 0.5 * col * col * 1.2, 0.0, 1.0);

    float brightness = 0.5;
    col *= brightness + 0.5 * 16.0 * uv.x * uv.y * (1.0 - uv.x) * (uv.y);
    
  
    float s = step(sin(u_time / 8.0), 0.0);

    float alt = 10.0 * u_time + uv.y * s * 100.0;

    if (s <= 0.5){
      alt = 10.0 * u_time + uv.y * 1000.0;
    }

    col *= 0.9 + 0.1 * sin(alt);    
    col *= 0.99 + 0.01 * sin(110.0 * u_time);

    // offset colors a bit
    float green = col.g;
    col.g = col.b * 1.5;
    col.b = green;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default fragment;