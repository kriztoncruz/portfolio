document.querySelector('#year').textContent = new Date().getFullYear();

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const education = document.querySelector('.education-list');
const stages = [...education.querySelectorAll('.education-entry')];
if (!motionPreference.matches && 'IntersectionObserver' in window) {
  education.classList.add('timeline-animated');
  stages.forEach((stage, index) => stage.style.setProperty('--timeline-step', index));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        education.classList.add('timeline-started');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });
  observer.observe(education);
  motionPreference.addEventListener('change', () => {
    education.classList.remove('timeline-animated');
    observer.disconnect();
  }, { once: true });
}

const work = document.querySelector('#work');
const track = work.querySelector('.work-track');
const viewport = work.querySelector('.work-viewport');
const projects = [...track.querySelectorAll('.project')];
const controls = work.querySelector('.work-controls');
const status = work.querySelector('#work-status');
const projectNames = ['DocTrack', 'HR Payslip System'];
let currentProject = 0;

function resizeProject() {
  viewport.style.height = `${projects[currentProject].offsetHeight}px`;
}
function showProject(index) {
  currentProject = (index + projects.length) % projects.length;
  projects.forEach((project, projectIndex) => {
    const inactive = projectIndex !== currentProject;
    project.inert = inactive;
    project.setAttribute('aria-hidden', String(inactive));
  });
  track.style.transform = `translateX(-${currentProject * 100}%)`;
  status.textContent = `${projectNames[currentProject]} · ${currentProject + 1} / ${projects.length}`;
  resizeProject();
}
work.classList.add('carousel-ready');
controls.hidden = false;
showProject(0);
work.querySelector('#work-previous').addEventListener('click', () => showProject(currentProject - 1));
work.querySelector('#work-next').addEventListener('click', () => showProject(currentProject + 1));
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

// Reveal content once, while retaining readable content without JavaScript.
if (!motionPreference.matches && 'IntersectionObserver' in window) {
  const revealTargets = [...document.querySelectorAll('.section-heading, .services-intro, .service-list article, .experience-entry, .education-summary, .about-label, .about > div, .contact h2, .contact-bottom, .project-details')];
  const textObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.closest('[aria-hidden="true"]')) {
        entry.target.classList.add('text-visible');
        textObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealTargets.forEach(target => {
    target.classList.add('text-reveal');
    textObserver.observe(target);
  });
  motionPreference.addEventListener('change', () => {
    revealTargets.forEach(target => target.classList.remove('text-reveal'));
    textObserver.disconnect();
  }, { once: true });
}
