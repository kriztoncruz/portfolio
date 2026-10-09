(() => {
  const layer = document.querySelector('.pointer-layer');
  const glow = layer.querySelector('.pointer-glow');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let fadeTimer;
  let x = innerWidth / 2;
  let y = innerHeight / 2;

  function fade(delay = 1600) {
    clearTimeout(fadeTimer);
    fadeTimer = setTimeout(() => layer.classList.remove('pointer-visible'), delay);
  }
  function show(event) {
    if (reducedMotion.matches || document.hidden || !event.isPrimary) return;
    x = event.clientX;
    y = event.clientY;
    layer.classList.add('pointer-visible');
    fade();
    if (!frame) frame = requestAnimationFrame(() => {
      frame = 0;
      const radius = Math.min(600, Math.max(innerWidth, innerHeight) * .8) / 2;
      glow.style.transform = `translate3d(${x - radius}px,${y - radius}px,0)`;
    });
  }
  window.addEventListener('pointermove', show, {passive: true});
  window.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0 || reducedMotion.matches) return;
    show(event);
    layer.classList.add('pointer-pressed');
  }, {passive: true});
  function release(event) {
    layer.classList.remove('pointer-pressed');
    fade(event.pointerType === 'touch' ? 300 : 1100);
  }
  window.addEventListener('pointerup', release, {passive: true});
  window.addEventListener('pointercancel', release, {passive: true});
  document.addEventListener('pointerleave', () => fade(0), {passive: true});
  function reset() {
    clearTimeout(fadeTimer);
    cancelAnimationFrame(frame);
    frame = 0;
    layer.classList.remove('pointer-visible', 'pointer-pressed');
  }
  document.addEventListener('visibilitychange', reset);
  reducedMotion.addEventListener('change', reset);
  window.addEventListener('resize', reset, {passive: true});
})();
