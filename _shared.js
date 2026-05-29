/* ═══════════════════════════════════════
   _shared.js — include at bottom of every page
   <script src="_shared.js"></script>
═══════════════════════════════════════ */

/* STEP 1 — Apply theme immediately (sync, before DOMContentLoaded)
   This prevents any flash of wrong theme.                          */
(function () {
  var t;
  try { t = localStorage.getItem('tj-theme'); } catch (e) {}
  document.documentElement.setAttribute('data-theme',
    (t === 'light' || t === 'dark') ? t : 'dark'
  );
}());

/* STEP 2 — Everything else waits for DOM */
document.addEventListener('DOMContentLoaded', function () {

  /* ── Theme helpers ── */
  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    /* Sync every theme icon on the page */
    document.querySelectorAll('.tj-icon').forEach(function (el) {
      el.className = (theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun') + ' tj-icon';
    });
    /* Sync theme label if present */
    var lbl = document.getElementById('theme-label');
    if (lbl) lbl.textContent = theme === 'dark' ? 'Dark' : 'Light';
    try { localStorage.setItem('tj-theme', theme); } catch (e) {}
  }

  /* Sync icons to already-applied theme */
  applyTheme(currentTheme());

  /* Add smooth transition class after first paint (avoids FOUC) */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      document.body.classList.add('theme-ready');
    });
  });

  /* Wire every toggle button */
  document.querySelectorAll('.tj-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
    });
  });

  /* ── Scroll progress bar ── */
  var prog = document.getElementById('scroll-progress');
  if (prog) {
    window.addEventListener('scroll', function () {
      var max = document.body.scrollHeight - window.innerHeight;
      prog.style.width = (max > 0 ? Math.round(window.scrollY / max * 100) : 0) + '%';
    }, { passive: true });
  }

  /* ── Mobile nav ── */
  var ham    = document.getElementById('nav-ham');
  var mobNav = document.getElementById('mob-nav');

  if (ham && mobNav) {
    function closeNav() {
      mobNav.classList.remove('open');
      ham.classList.remove('open');
      ham.setAttribute('aria-expanded', 'false');
    }
    function toggleNav(e) {
      e.stopPropagation();
      var opening = !mobNav.classList.contains('open');
      if (opening) {
        mobNav.classList.add('open');
        ham.classList.add('open');
        ham.setAttribute('aria-expanded', 'true');
      } else {
        closeNav();
      }
    }

    ham.addEventListener('click', toggleNav);

    /* Close when a menu link is clicked */
    mobNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeNav);
    });

    /* Close on outside click */
    document.addEventListener('click', function (e) {
      if (!ham.contains(e.target) && !mobNav.contains(e.target)) closeNav();
    });

    /* Close when resized to desktop */
    window.addEventListener('resize', function () {
      if (window.innerWidth > 820) closeNav();
    }, { passive: true });
  }

  /* ── Nav active link (hash-based pages only) ── */
  window.addEventListener('scroll', function () {
    var cur = '';
    document.querySelectorAll('section[id]').forEach(function (s) {
      if (window.scrollY >= s.offsetTop - 220) cur = s.id;
    });
    document.querySelectorAll('.nav-link-item[href^="#"]').forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
    });
  }, { passive: true });

  /* ── Scroll reveal ── */
  var els = document.querySelectorAll('.reveal,.reveal-l,.reveal-r');

  function revealVisible() {
    els.forEach(function (el, i) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        setTimeout(function () { el.classList.add('vis'); }, i * 55);
      }
    });
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e, i) {
        if (e.isIntersecting) {
          setTimeout(function () { e.target.classList.add('vis'); }, i * 55);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.06 });
    els.forEach(function (el) { io.observe(el); });
  }

  revealVisible();
  window.addEventListener('load', revealVisible);

  /* ── Smooth anchor scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

});