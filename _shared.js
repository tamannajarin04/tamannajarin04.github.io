/* ═══════════════════════════════════════════
   _shared.js  — paste <script src="_shared.js"></script>
   at the bottom of every page (after Bootstrap JS)
═══════════════════════════════════════════ */

/* ─── THEME TOGGLE ─── */
const html = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');
const toggleIcon = document.getElementById('toggle-icon');

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  if (toggleIcon) toggleIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
  try { localStorage.setItem('tj-theme', theme); } catch(e){}
}
(function() {
  let saved; try { saved = localStorage.getItem('tj-theme'); } catch(e){}
  applyTheme(saved || 'dark');
})();
if (themeBtn) themeBtn.addEventListener('click', () => {
  applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

/* ─── SCROLL PROGRESS ─── */
const prog = document.getElementById('scroll-progress');
if (prog) window.addEventListener('scroll', () => {
  prog.style.width = (window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100) + '%';
}, { passive: true });

/* ─── NAV ACTIVE STATE ─── */
const navItems = document.querySelectorAll('.nav-link-item[href^="#"]');
window.addEventListener('scroll', () => {
  let current = '';
  document.querySelectorAll('section[id]').forEach(s => {
    if (window.scrollY >= s.offsetTop - 220) current = s.id;
  });
  navItems.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
}, { passive: true });

/* ─── MOBILE NAV ─── */
const ham = document.getElementById('nav-ham');
const mobNav = document.getElementById('mob-nav');
if (ham && mobNav) {
  ham.addEventListener('click', () => {
    const isOpen = mobNav.classList.toggle('open');
    ham.classList.toggle('open', isOpen);
    ham.setAttribute('aria-expanded', isOpen);
  });
  mobNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobNav.classList.remove('open'); ham.classList.remove('open'); ham.setAttribute('aria-expanded', 'false');
  }));
  document.addEventListener('click', e => {
    if (!ham.contains(e.target) && !mobNav.contains(e.target)) {
      mobNav.classList.remove('open'); ham.classList.remove('open');
    }
  });
}

/* ─── SCROLL REVEAL ─── */
const revealEls = document.querySelectorAll('.reveal, .reveal-l, .reveal-r');

// Immediately show anything already in the viewport on load (fixes blank page bug)
function checkInView() {
  revealEls.forEach((el, i) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setTimeout(() => el.classList.add('vis'), i * 55);
    }
  });
}

// Also observe for scroll-triggered reveals
const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('vis'), i * 55);
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.06 });

revealEls.forEach(el => io.observe(el));

// Run immediately + after fonts/images load
checkInView();
window.addEventListener('load', checkInView);

/* ─── SMOOTH ANCHOR SCROLL ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});