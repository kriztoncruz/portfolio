(() => {
  const layer = document.querySelector('.pointer-layer');
  const glow = layer.querySelector('.pointer-glow');
  const ripple = layer.querySelector('.pointer-pulse');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let fadeTimer;
  let targetX = innerWidth / 2;
  let targetY = innerHeight / 2;
  let x = targetX;
  let y = targetY;
  let size = Math.min(640, Math.max(320, innerWidth * .65));
  let opacity = 0;
  let targetOpacity = 0;
  let previousTime = 0;
  let initialized = false;
  let pulse;

  function draw(time) {
    frame = 0;
    if (document.hidden || reducedMotion.matches) return;
    const elapsed = Math.min(64, time - (previousTime || time - 16));
    previousTime = time;
    const follow = 1 - Math.exp(-elapsed / 85);
    const fadeBlend = 1 - Math.exp(-elapsed / (targetOpacity ? 110 : 240));
    x += (targetX - x) * follow;
    y += (targetY - y) * follow;
    opacity += (targetOpacity - opacity) * fadeBlend;
    glow.style.transform = `translate3d(${x - size / 2}px,${y - size / 2}px,0)`;
    glow.style.opacity = opacity.toFixed(3);
    if (Math.abs(targetX - x) + Math.abs(targetY - y) > .2 || Math.abs(targetOpacity - opacity) > .002) requestDraw();
    else previousTime = 0;
  }
  function requestDraw() {
    if (!frame && !document.hidden && !reducedMotion.matches) frame = requestAnimationFrame(draw);
  }

  function fade(delay = 1600) {
    clearTimeout(fadeTimer);
    fadeTimer = setTimeout(() => {
      targetOpacity = 0;
      requestDraw();
    }, delay);
  }
  function show(event) {
    if (reducedMotion.matches || document.hidden || !event.isPrimary) return;
    targetX = event.clientX;
    targetY = event.clientY;
    if (!initialized || opacity < .01) {
      x = targetX;
      y = targetY;
      initialized = true;
    }
    targetOpacity = event.pointerType === 'touch' ? .75 : .9;
    fade(2400);
    requestDraw();
  }
  window.addEventListener('pointermove', show, {passive: true});
  window.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0 || reducedMotion.matches) return;
    show(event);
    targetOpacity = 1;
    pulse?.cancel();
    pulse = ripple.animate([
      {transform: 'scale(.55)', opacity: 0},
      {transform: 'scale(.8)', opacity: .75, offset: .25},
      {transform: 'scale(1.3)', opacity: 0}
    ], {duration: 1000, easing: 'cubic-bezier(.16,1,.3,1)'});
    requestDraw();
  }, {passive: true});
  function release(event) {
    fade(event.pointerType === 'touch' ? 850 : 2000);
  }
  window.addEventListener('pointerup', release, {passive: true});
  window.addEventListener('pointercancel', release, {passive: true});
  document.addEventListener('pointerleave', () => fade(0), {passive: true});
  function reset() {
    clearTimeout(fadeTimer);
    cancelAnimationFrame(frame);
    frame = 0;
    previousTime = 0;
    initialized = false;
    opacity = targetOpacity = 0;
    glow.style.opacity = '0';
    pulse?.cancel();
    size = Math.min(640, Math.max(320, innerWidth * .65));
  }
  document.addEventListener('visibilitychange', reset);
  reducedMotion.addEventListener('change', reset);
  window.addEventListener('resize', reset, {passive: true});
})();
