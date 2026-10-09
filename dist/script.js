document.querySelector('#year').textContent = new Date().getFullYear();

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
// Type and delete the requested phrases without repeatedly announcing them to screen readers.
const typedWord = document.querySelector('.hero-typed');
const typingWords = ['meet', 'fulfilled', 'to execute'];
let typingIndex = 0;
let typingLength = typingWords[0].length;
let deletingWord = true;
let typingTimer;
let heroVisible = true;
function scheduleTyping(delay = 1400) {
  clearTimeout(typingTimer);
  if (!motionPreference.matches && !document.hidden && heroVisible) {
    typedWord.classList.add('typing-active');
    typingTimer = setTimeout(typeNextCharacter, delay);
  }
}
function typeNextCharacter() {
  const word = typingWords[typingIndex];
  typingLength += deletingWord ? -1 : 1;
  typedWord.textContent = word.slice(0, typingLength);
  if (deletingWord && typingLength === 0) {
    typingIndex = (typingIndex + 1) % typingWords.length;
    deletingWord = false;
    scheduleTyping(250);
  } else if (!deletingWord && typingLength === word.length) {
    deletingWord = true;
    scheduleTyping(1600);
  } else {
    scheduleTyping(deletingWord ? 65 : 100);
  }
}
motionPreference.addEventListener('change', () => {
  clearTimeout(typingTimer);
  typedWord.classList.remove('typing-active');
  typedWord.textContent = typingWords[0];
  typingIndex = 0;
  typingLength = typingWords[0].length;
  deletingWord = true;
  scheduleTyping();
});
function resumeTyping() {
  // Returning to the page should not leave the headline sitting on an empty word.
  if (typingLength === 0) {
    typingLength = typingWords[typingIndex].length;
    typedWord.textContent = typingWords[typingIndex];
    deletingWord = true;
  }
  scheduleTyping();
}
function syncPageVisibility() {
  if (document.hidden) clearTimeout(typingTimer);
  else resumeTyping();
}
document.addEventListener('visibilitychange', syncPageVisibility);
syncPageVisibility();
if ('IntersectionObserver' in window) {
  const heroObserver = new IntersectionObserver(entries => {
    heroVisible = entries[0].isIntersecting;
    if (heroVisible) resumeTyping();
    else clearTimeout(typingTimer);
  });
  heroObserver.observe(document.querySelector('.hero'));
}
scheduleTyping();

const education = document.querySelector('.education-list');
const stages = [...education.querySelectorAll('.education-entry')];
const work = document.querySelector('#work');
const track = work.querySelector('.work-track');
const viewport = work.querySelector('.work-viewport');
const projects = [...track.querySelectorAll('.project')];
const controls = work.querySelector('.work-controls');
const status = work.querySelector('#work-status');
const projectNames = ['DocTrack', 'HR Payslip System'];
let currentProject = 0;

const dotsContainer = work.querySelector('.project-dots');
const dots = projects.map((project, index) => {
  const dot = document.createElement('button');
  dot.type = 'button';
  dot.className = 'project-dot';
  dot.setAttribute('aria-label', 'Show ' + projectNames[index]);
  dot.setAttribute('aria-controls', 'work-track');
  dot.addEventListener('click', () => queueProject(index, index < currentProject ? 1 : -1));
  dotsContainer.append(dot);
  return dot;
});
let projectQueue = Promise.resolve();
function resizeProject() {
  viewport.style.height = projects[currentProject].offsetHeight + 'px';
}
function updateProjectState() {
  projects.forEach((project, index) => {
    const inactive = index !== currentProject;
    project.inert = inactive;
    project.setAttribute('aria-hidden', String(inactive));
    if (!inactive) project.querySelector('.project-details').classList.add('text-visible');
  });
  dots.forEach((dot, index) => {
    if (index === currentProject) dot.setAttribute('aria-current', 'true');
    else dot.removeAttribute('aria-current');
  });
  status.textContent = projectNames[currentProject] + ' · ' + (currentProject + 1) + ' / ' + projects.length;
  resizeProject();
}
async function showProject(index, direction) {
  const next = (index + projects.length) % projects.length;
  if (next === currentProject) return;
  const outgoing = projects[currentProject];
  const incoming = projects[next];
  incoming.hidden = false;
  currentProject = next;
  updateProjectState();
  if (!motionPreference.matches) {
    const options = { duration: 480, easing: 'cubic-bezier(.22,.68,0,1)' };
    const animations = [
      outgoing.animate([{transform:'translateX(0)'},{transform:'translateX(' + (direction * 100) + '%)'}], options),
      incoming.animate([{transform:'translateX(' + (-direction * 100) + '%)'},{transform:'translateX(0)'}], options)
    ];
    await Promise.all(animations.map(animation => animation.finished.catch(() => {})));
  }
  outgoing.hidden = true;
}
function queueProject(index, direction) {
  projectQueue = projectQueue.then(() => showProject(index, direction));
}
function stepProject(direction) {
  // Resolve the target after earlier clicks finish; the slide direction never reverses at a wrap.
  projectQueue = projectQueue.then(() => showProject(currentProject + (direction < 0 ? -1 : 1), direction));
}
work.classList.add('carousel-ready');
controls.hidden = false;
dotsContainer.hidden = false;
projects.forEach((project, index) => project.hidden = index !== currentProject);
updateProjectState();
work.querySelector('#work-previous').addEventListener('click', () => stepProject(-1));
work.querySelector('#work-next').addEventListener('click', () => stepProject(1));
if ('ResizeObserver' in window) {
  const projectResize = new ResizeObserver(resizeProject);
  projects.forEach(project => projectResize.observe(project));
} else {
  window.addEventListener('resize', resizeProject);
}

// Keep navigation aligned with the section currently passing below the header.
const navLinks = [...document.querySelectorAll('.site-header nav a')];
const navSections = navLinks.map(link => document.querySelector(link.getAttribute('href')));
let navFramePending = false;
function updateNavigation() {
  const readingLine = document.querySelector('.site-header').offsetHeight + Math.min(window.innerHeight * 0.2, 140);
  let activeIndex = -1;
  navSections.forEach((section, index) => {
    if (section.getBoundingClientRect().top <= readingLine) activeIndex = index;
  });
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) activeIndex = navLinks.length - 1;
  navLinks.forEach((link, index) => {
    if (index === activeIndex) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  navFramePending = false;
}
window.addEventListener('scroll', () => {
  if (!navFramePending) {
    navFramePending = true;
    requestAnimationFrame(updateNavigation);
  }
}, { passive: true });
window.addEventListener('resize', updateNavigation);
window.addEventListener('load', updateNavigation);
updateNavigation();

// Replay reveals after content fully leaves the viewport, avoiding flicker at an edge.
const revealTargets = [...document.querySelectorAll('.hero-copy, .portrait, .section-heading, .services-intro, .service-list article, .experience-entry, .about-label, .about > div, .contact h2, .contact-bottom, .project-details')];
let stopScrollAnimations = () => {};
function setupScrollAnimations() {
  stopScrollAnimations();
  if (motionPreference.matches || !('IntersectionObserver' in window)) return;
  education.classList.add('timeline-animated');
  stages.forEach((stage, index) => stage.style.setProperty('--timeline-step', index));
  const timelineObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.05) {
        education.classList.add('timeline-started');
      } else if (!entry.isIntersecting) {
        education.classList.remove('timeline-started');
      }
    });
  }, { threshold: [0, 0.05] });
  timelineObserver.observe(education);
  const textObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.1 && !entry.target.closest('[aria-hidden="true"]')) {
        entry.target.classList.add('text-visible');
      } else if (!entry.isIntersecting) {
        entry.target.classList.remove('text-visible');
      }
    });
  }, { threshold: [0, 0.1] });
  revealTargets.forEach(target => {
    target.classList.add('text-reveal');
    textObserver.observe(target);
  });
  stopScrollAnimations = () => {
    timelineObserver.disconnect();
    textObserver.disconnect();
    education.classList.remove('timeline-animated', 'timeline-started');
    revealTargets.forEach(target => target.classList.remove('text-reveal', 'text-visible'));
  };
}
setupScrollAnimations();
motionPreference.addEventListener('change', setupScrollAnimations);
