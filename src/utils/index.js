export const deferWork = fn => {
  if (typeof requestIdleCallback !== 'undefined') {
    window.requestIdleCallback(fn, { timeout: 60 });
  } else if (typeof requestAnimationFrame !== 'undefined') {
    window.requestAnimationFrame(fn);
  } else {
    window.setTimeout(fn, 16.66);
  }

  return true;
};