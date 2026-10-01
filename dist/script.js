const root = document.documentElement;
const toggle = document.querySelector('#theme-toggle');
let theme = 'system';
try { theme = localStorage.getItem('portfolio-theme') || 'system'; } catch {}
if (!['system', 'light', 'dark'].includes(theme)) theme = 'system';
function applyTheme() {
  if (theme === 'system') root.removeAttribute('data-theme');
  else root.dataset.theme = theme;
  toggle.textContent = `Theme: ${theme[0].toUpperCase()}${theme.slice(1)}`;
  toggle.setAttribute('aria-label', `Color theme: ${theme}. Switch to ${theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system'} mode`);
}
applyTheme();
toggle.addEventListener('click', () => {
  theme = theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system';
  applyTheme();
  try { localStorage.setItem('portfolio-theme', theme); } catch {}
});
document.querySelector('#year').textContent = new Date().getFullYear();
