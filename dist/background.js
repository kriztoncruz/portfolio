// Decorative interaction only: never capture pointers or prevent browser gestures.
(() => {
  const background = document.querySelector('.ambient-background');
  const field = background.querySelector('.ambient-field');
  const response = background.querySelector('.ambient-response');
  const bloom = background.querySelector('.ambient-bloom');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let width = innerWidth;
  let height = innerHeight;
  let glowSize = response.offsetWidth;
  let scrollRange = Math.max(1, document.documentElement.scrollHeight - height);
  let scrollProgress = scrollY / scrollRange;
  let targetX = .5;
  let targetY = .5;
  let currentX = .5;
  let currentY = .5;
  let currentScroll = scrollProgress;
  let targetStrength = 0;
  let strength = 0;
  let frame = 0;
  let previousTime = 0;
  let fadeTimer;
  let pulse;

  function render(time) {
    frame = 0;
    if (document.hidden || reducedMotion.matches) return;
    const elapsed = Math.min(64, time - (previousTime || time - 16));
    previousTime = time;
    const blend = 1 - Math.exp(-elapsed / 160);
    currentX += (targetX - currentX) * blend;
    currentY += (targetY - currentY) * blend;
    currentScroll += (scrollProgress - currentScroll) * blend;
    strength += (targetStrength - strength) * blend;
    field.style.transform = `translate3d(${(currentX - .5) * 28}px,${(currentY - .5) * 20 + (currentScroll - .5) * 90}px,0) rotate(${(currentScroll - .5) * 4}deg)`;
    response.style.transform = `translate3d(${currentX * width - glowSize / 2}px,${currentY * height - glowSize / 2}px,0)`;
    response.style.opacity = strength.toFixed(3);
    const unsettled = Math.abs(targetX - currentX) + Math.abs(targetY - currentY) + Math.abs(scrollProgress - currentScroll) + Math.abs(targetStrength - strength) > .002;
    if (unsettled) requestRender();
    else previousTime = 0;
  }
  function requestRender() {
    if (!frame && !document.hidden && !reducedMotion.matches) frame = requestAnimationFrame(render);
  }
  function relaxGlow(delay = 1200) {
    clearTimeout(fadeTimer);
    fadeTimer = setTimeout(() => {
      targetStrength = 0;
      requestRender();
    }, delay);
  }
  function pointGlow(event) {
    if (reducedMotion.matches || !event.isPrimary) return;
    targetX = Math.max(0, Math.min(1, event.clientX / width));
    targetY = Math.max(0, Math.min(1, event.clientY / height));
    targetStrength = .65;
    relaxGlow();
    requestRender();
  }
  function pulseGlow() {
    if (reducedMotion.matches) return;
    targetStrength = 1;
    pulse?.cancel();
    pulse = bloom.animate([
      {transform: 'scale(.7)', opacity: .6},
      {transform: 'scale(1.18)', opacity: 1, offset: .4},
      {transform: 'scale(1)', opacity: 1}
    ], {duration: 1000, easing: 'ease-out'});
    relaxGlow(950);
    requestRender();
  }
  window.addEventListener('pointermove', pointGlow, {passive: true});
  window.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    pointGlow(event);
    pulseGlow();
  }, {passive: true});
  window.addEventListener('pointerup', () => relaxGlow(650), {passive: true});
  window.addEventListener('pointercancel', () => relaxGlow(300), {passive: true});
  document.addEventListener('pointerleave', () => relaxGlow(300), {passive: true});
  window.addEventListener('keydown', event => {
    if (!event.repeat && ['Enter', ' '].includes(event.key) && !event.target.closest('input, textarea, select, [contenteditable]')) pulseGlow();
  });
  window.addEventListener('scroll', () => {
    scrollProgress = Math.max(0, Math.min(1, scrollY / scrollRange));
    requestRender();
  }, {passive: true});
  function measure() {
    width = innerWidth;
    height = innerHeight;
    glowSize = response.offsetWidth;
    scrollRange = Math.max(1, document.documentElement.scrollHeight - height);
    scrollProgress = scrollY / scrollRange;
    requestRender();
  }
  window.addEventListener('resize', measure, {passive: true});
  window.addEventListener('load', measure);
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(document.querySelector('.page-shell'));
  function pauseOrResume() {
    cancelAnimationFrame(frame);
    frame = 0;
    previousTime = 0;
    clearTimeout(fadeTimer);
    pulse?.cancel();
    targetStrength = strength = 0;
    response.style.opacity = '0';
    if (!document.hidden && !reducedMotion.matches) measure();
  }
  document.addEventListener('visibilitychange', pauseOrResume);
  reducedMotion.addEventListener('change', pauseOrResume);
  requestRender();
})();
