//-----------------------------------------
// General utils
//

import marked from 'marked';

// @flow

const SOCIAL_OPTS = [
  'toobar=no',
  'width=450',
  'height=400',
  'directories=no',
  'status=no',
  'scrollbars=yes',
  'resize=no',
  'menubar=no',
  'top=200',
  'left=200'
].join(',');

const TWEET =
  'Dial 313-986-4606 to hear artists share their stories on @RBMA’s #DetroitHistoryHotline';

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

export const loadThree = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = err => reject(err);

    script.src =
      'https://ajax.googleapis.com/ajax/libs/threejs/r84/three.min.js';
    document.getElementsByTagName('head')[0].appendChild(script);
  });
};

export const shareFB = (): void => {
  const u = encodeURIComponent(window.location.href);

  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    'Facebook',
    SOCIAL_OPTS
  );
};

export const shareTW = (): void => {
  const u = encodeURIComponent(`${TWEET} ${window.location.href}`);
  window.open(`https://twitter.com/home?status=${u}`, 'Twitter', SOCIAL_OPTS);
};
