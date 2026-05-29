/* ═══════════════════════════════════════════
   _shared.js  — paste <script src="_shared.js"></script>
   at the bottom of every page (after Bootstrap JS)
═══════════════════════════════════════════ */

/* ─── THEME — Apply IMMEDIATELY to prevent FOUC ─── */
/* FIX: Read theme synchronously and apply before any paint */
(function () {
  var saved;
  try { saved = localStorage.getItem('tj-theme'); } catch (e) {}
  /* Default to dark if nothing saved */
  var theme = (saved === 'light' || saved === 'dark') ? saved : 'dark';
  document.documentElement.setAttribute('data-theme', theme);
})();

/* Wait for DOM then wire up interactive pieces */
document.addEventListener('DOMContentLoaded', function () {

  /* ─── THEME TOGGLE ─── */
  var html = document.documentElement;

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    /* Sync all moon/sun icons on the page */
    document.querySelectorAll('.tj-theme-icon').forEach(function (ic) {
      ic.className = 'fas ' + (theme === 'dark' ? 'fa-moon' : 'fa-sun') + ' tj-theme-icon';
    });
    try { localStorage.setItem('tj-theme', theme); } catch (e) {}
  }

  /* Apply saved theme (already set above, but sync icons now DOM exists) */
  applyTheme(html.getAttribute('data-theme') || 'dark');

  /* FIX: Add transition class AFTER first paint so there's no FOUC flash */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      document.body.classList.add('theme-ready');
    });
  });

  /* Wire all theme toggle buttons */
  document.querySelectorAll('.tj-theme-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  });

  /* ─── SCROLL PROGRESS ─── */
  var prog = document.getElementById('scroll-progress');
  if (prog) {
    window.addEventListener('scroll', function () {
      var max = document.body.scrollHeight - window.innerHeight;
      prog.style.width = (max > 0 ? (window.scrollY / max * 100) : 0) + '%';
    }, { passive: true });
  }

  /* ─── NAV ACTIVE STATE (hash-based links only) ─── */
  window.addEventListener('scroll', function () {
    var current = '';
    document.querySelectorAll('section[id]').forEach(function (s) {
      if (window.scrollY >= s.offsetTop - 220) current = s.id;
    });
    document.querySelectorAll('.nav-link-item[href^="#"]').forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }, { passive: true });

  /* ─── MOBILE NAV ─── */
  var ham = document.getElementById('nav-ham');
  var mobNav = document.getElementById('mob-nav');

  if (ham && mobNav) {
    function closeMobNav() {
      mobNav.classList.remove('open');
      ham.classList.remove('open');
      ham.setAttribute('aria-expanded', 'false');
    }
    function openMobNav() {
      mobNav.classList.add('open');
      ham.classList.add('open');
      ham.setAttribute('aria-expanded', 'true');
    }

    ham.addEventListener('click', function (e) {
      e.stopPropagation();
      if (mobNav.classList.contains('open')) { closeMobNav(); } else { openMobNav(); }
    });

    /* Close when a link inside is clicked */
    mobNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMobNav);
    });

    /* FIX: Close when clicking anywhere outside nav or mob-nav */
    document.addEventListener('click', function (e) {
      if (!ham.contains(e.target) && !mobNav.contains(e.target)) {
        closeMobNav();
      }
    });

    /* FIX: Close mob-nav on resize to desktop so it doesn't stay open */
    window.addEventListener('resize', function () {
      if (window.innerWidth > 820) { closeMobNav(); }
    });
  }

  /* ─── SCROLL REVEAL ─── */
  var revealEls = document.querySelectorAll('.reveal, .reveal-l, .reveal-r');

  function checkInView() {
    revealEls.forEach(function (el, i) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setTimeout(function () { el.classList.add('vis'); }, i * 55);
      }
    });
  }

  /* IntersectionObserver for scroll-triggered reveals */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e, i) {
        if (e.isIntersecting) {
          setTimeout(function () { e.target.classList.add('vis'); }, i * 55);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.06 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* Immediately reveal anything already in viewport */
  checkInView();
  window.addEventListener('load', checkInView);

  /* ─── SMOOTH ANCHOR SCROLL ─── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});