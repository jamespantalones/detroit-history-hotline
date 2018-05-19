import marked from 'marked';
import config from '../config';

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

export const getAudio = ext => {
  const d = parseInt(ext, 10);
  switch (d) {
    case 10:
      return config.audio.dj_minx;

    case 11:
      return config.audio.derrick_may;

    case 12:
      return config.audio.jeff_mills;

    case 13:
      return config.audio.carl_craig;

    case 14:
      return config.audio.robert_hood;

    case 15:
      return config.audio.theo_parrish;

    case 16:
      return config.audio.dj_holographic;

    case 17:
      return config.audio.leon_ware;

    case 18:
      return config.audio.waajeed;

    case 19:
      return config.audio.erika;

    default:
      return config.audio.default;
  }
};
