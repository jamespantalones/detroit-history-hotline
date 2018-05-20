//-----------------------------------------
// General utils
//

import marked from 'marked';

// @flow

//-----------------------------------------
// Defer work
//
export const deferWork = fn => {
  if (typeof requestIdleCallback !== 'undefined') {
    window.requestIdleCallback(fn, {
      timeout: 60
    });
  } else if (typeof requestAnimationFrame !== 'undefined') {
    window.requestAnimationFrame(fn);
  } else {
    window.setTimeout(fn, 16.66);
  }

  return true;
};

export const renderMarkdown = text => {
  return {
    __html: marked(text)
  };
};

export const renderHTML = text => {
  return {
    __html: text
  };
};

//-----------------------------------------
// Check for WebGL presence
//
export const checkWebGL = (): boolean => {
  const canvas = document.createElement('canvas');
  const gl =
    canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  if (gl && gl instanceof WebGLRenderingContext) {
    return true;
  }

  return false;
};
