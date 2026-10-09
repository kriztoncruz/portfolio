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
