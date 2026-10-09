// Live workflow graphics: build, transfer, resolve, then a quiet hold.
(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const control = document.querySelector('.motion-toggle');
  const work = document.querySelector('#work');
  let manuallyPaused = false;
  const scenes = [...work.querySelectorAll('.project-visual')].map(visual => {
    const token = document.createElement('span');
    token.className = 'flow-token';
    token.setAttribute('aria-hidden', 'true');
    visual.append(token);
    return {visual, token, stages: [...visual.querySelectorAll('.project-flow li')], animations: [], visible: false, geometry: ''};
  });

  function buildScene(scene) {
    if (motion.matches || scene.visual.closest('.project').hidden) return;
    const bounds = scene.visual.getBoundingClientRect();
    const positions = scene.stages.map(stage => {
      const station = stage.querySelector('.flow-station').getBoundingClientRect();
      return `translate3d(${station.left - bounds.left}px,${station.top - bounds.top}px,0)`;
    });
    const geometry = positions.join('|');
    if (geometry === scene.geometry && scene.animations.length) return;
    scene.animations.forEach(animation => animation.cancel());
    scene.geometry = geometry;
    const travel = 'cubic-bezier(.65,0,.35,1)';
    const tokenFrames = [
      {transform: positions[0], opacity: 0, offset: 0},
      {transform: positions[0], opacity: 1, offset: .06},
      {transform: positions[0], opacity: 1, offset: .2, easing: travel},
      {transform: positions[1], opacity: 1, offset: .31},
      {transform: positions[1], opacity: 1, offset: .46, easing: travel},
      {transform: positions[2], opacity: 1, offset: .58},
      {transform: positions[2], opacity: 1, offset: .84},
      {transform: positions[2], opacity: 0, offset: .9},
      {transform: positions[2], opacity: 0, offset: 1}
    ];
    scene.animations = [scene.token.animate(tokenFrames, {duration: 6800, iterations: Infinity})];
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    const line = getComputedStyle(document.documentElement).getPropertyValue('--line').trim();
    const windows = [[.06, .2], [.31, .46], [.58, .84]];
    scene.stages.forEach((stage, index) => {
      const base = index === 2 ? accent : line;
      const [start, end] = windows[index];
      scene.animations.push(stage.animate([
        {boxShadow: 'inset 0 0 0 0 transparent', borderColor: base, offset: 0},
        {boxShadow: 'inset 0 0 0 0 transparent', borderColor: base, offset: start - .035},
        {boxShadow: `inset 0 0 0 1px ${accent}`, borderColor: accent, offset: start},
        {boxShadow: `inset 0 0 0 1px ${accent}`, borderColor: accent, offset: end},
        {boxShadow: 'inset 0 0 0 0 transparent', borderColor: base, offset: end + .035},
        {boxShadow: 'inset 0 0 0 0 transparent', borderColor: base, offset: 1}
      ], {duration: 6800, iterations: Infinity}));
    });
    scene.animations.forEach(animation => animation.pause());
  }
  function syncScenes() {
    if (control.hidden !== motion.matches) control.hidden = motion.matches;
    scenes.forEach(scene => {
      if (motion.matches) {
        scene.animations.forEach(animation => animation.cancel());
        scene.animations = [];
        scene.geometry = '';
        return;
      }
      buildScene(scene);
      const active = !scene.visual.closest('[aria-hidden="true"]') && !scene.visual.closest('.project').hidden;
      const playing = scene.visible && active && !document.hidden && !manuallyPaused;
      scene.animations.forEach(animation => {
        if (playing) animation.play();
        else {
          animation.pause();
          if (!scene.visible || !active) animation.currentTime = 0;
        }
      });
    });
  }
  control.addEventListener('click', () => {
    manuallyPaused = !manuallyPaused;
    const label = manuallyPaused ? 'Play project animations' : 'Pause project animations';
    control.setAttribute('aria-label', label);
    control.title = label;
    control.querySelector('.motion-pause-icon').hidden = manuallyPaused;
    control.querySelector('.motion-play-icon').hidden = !manuallyPaused;
    syncScenes();
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const scene = scenes.find(item => item.visual === entry.target);
        scene.visible = entry.isIntersecting && entry.intersectionRatio >= .1;
      });
      syncScenes();
    }, {threshold: [0, .1]});
    scenes.forEach(scene => observer.observe(scene.visual));
  } else scenes.forEach(scene => scene.visible = true);
  new MutationObserver(syncScenes).observe(work, {subtree: true, attributes: true, attributeFilter: ['hidden', 'aria-hidden']});
  if ('ResizeObserver' in window) {
    const resize = new ResizeObserver(syncScenes);
    scenes.forEach(scene => resize.observe(scene.visual));
  } else window.addEventListener('resize', syncScenes);
  document.addEventListener('visibilitychange', syncScenes);
  motion.addEventListener('change', syncScenes);
  syncScenes();
})();
