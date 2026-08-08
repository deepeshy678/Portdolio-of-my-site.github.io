/* ============================================================
   DIPESH YADAV — Portfolio scripts
   Preloader, theming, navigation, typewriter, animations, filters
   ============================================================ */

(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------------- Theme persistence ---------------- */
  var THEME_KEY = 'dy.theme';
  var COLOR_KEY = 'dy.color';
  var VALID_COLORS = ['fire', 'rose', 'blue', 'forest', 'violet', 'amber'];

  function getStoredTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }
  function getStoredColor() {
    try { return localStorage.getItem(COLOR_KEY); } catch (e) { return null; }
  }
  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* ignore */ }
  }

  var savedTheme = getStoredTheme();
  if (savedTheme === 'light' || savedTheme === 'dark') {
    root.setAttribute('data-theme', savedTheme);
  }
  var savedColor = getStoredColor();
  if (VALID_COLORS.indexOf(savedColor) !== -1) {
    root.setAttribute('data-color', savedColor);
  }

  /* ---------------- Preloader ---------------- */
  var preloader = document.getElementById('preloader');
  window.addEventListener('load', function () {
    setTimeout(function () {
      if (preloader) preloader.classList.add('hidden');
    }, 500);
  });
  // Safety: never block the page longer than 4s
  setTimeout(function () {
    if (preloader) preloader.classList.add('hidden');
  }, 4000);

  /* ---------------- Theme toggle (light/dark) ---------------- */
  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      store(THEME_KEY, next);
    });
  }

  /* ---------------- Color palette dropdown ---------------- */
  var colorPickerBtn = document.getElementById('colorPickerBtn');
  var colorMenu = document.getElementById('colorMenu');
  var swatches = document.querySelectorAll('.color-swatch');

  function setActiveSwatch() {
    var current = root.getAttribute('data-color') || 'fire';
    swatches.forEach(function (s) {
      s.classList.toggle('active', s.dataset.color === current);
    });
  }
  setActiveSwatch();

  if (colorPickerBtn && colorMenu) {
    colorPickerBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      colorMenu.classList.toggle('open');
    });
    document.addEventListener('click', function (e) {
      if (!colorMenu.contains(e.target) && e.target !== colorPickerBtn) {
        colorMenu.classList.remove('open');
      }
    });
  }

  swatches.forEach(function (sw) {
    sw.addEventListener('click', function () {
      var color = sw.dataset.color;
      root.setAttribute('data-color', color);
      store(COLOR_KEY, color);
      setActiveSwatch();
      colorMenu.classList.remove('open');
    });
  });

  /* ---------------- Navbar: scrolled state ---------------- */
  var navbar = document.getElementById('navbar');
  var scrollProgress = document.getElementById('scrollProgress');

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (navbar) navbar.classList.toggle('scrolled', y > 30);

    if (scrollProgress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var pct = max > 0 ? (y / max) * 100 : 0;
      scrollProgress.style.width = pct + '%';
    }

    updateActiveLink();
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------------- Mobile menu ---------------- */
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ---------------- Active nav link on scroll ---------------- */
  var navAnchors = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    var pos = window.scrollY || document.documentElement.scrollTop;
    var sections = document.querySelectorAll('main section[id]');
    var currentId = 'home';

    sections.forEach(function (sec) {
      var top = sec.offsetTop - 120;
      var bottom = top + sec.offsetHeight;
      if (pos >= top && pos < bottom) currentId = sec.id;
    });

    navAnchors.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + currentId);
    });
  }
  updateActiveLink();

  /* ---------------- Typewriter effect ---------------- */
  var typewriterEl = document.getElementById('typewriter');
  if (typewriterEl) {
    var phrases = [
      'Flutter Developer',
      'Graphic Designer',
      'Digital Marketer',
      'Wordpress Developer',
      'Tutor',
    ];
    var phraseIdx = 0;
    var charIdx = 0;
    var deleting = false;

    function type() {
      var phrase = phrases[phraseIdx];
      var speed = deleting ? 45 : 90;

      if (!deleting) {
        charIdx++;
        typewriterEl.textContent = phrase.slice(0, charIdx);
        if (charIdx === phrase.length) {
          deleting = true;
          speed = 1600;
        }
      } else {
        charIdx--;
        typewriterEl.textContent = phrase.slice(0, charIdx);
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          speed = 500;
        }
      }
      setTimeout(type, speed);
    }
    setTimeout(type, 800);
  }

  /* ---------------- Reveal on scroll ---------------- */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ---------------- Skill bars + counters ---------------- */
  var barObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var bars = entry.target.querySelectorAll('.bar-fill');
        bars.forEach(function (b) {
          b.style.width = b.dataset.w ? b.dataset.w : getComputedStyle(b).getPropertyValue('--w').trim();
          b.classList.add('filled');
        });
        var nums = entry.target.querySelectorAll('[data-count]');
        nums.forEach(animateCounter);
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.about-stats, .skills-grid').forEach(function (el) {
    barObserver.observe(el);
  });

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var duration = 1400;
    var start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  /* ---------------- Project filters ---------------- */
  var filterButtons = document.querySelectorAll('.filter-btn');
  var projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterButtons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var filter = btn.dataset.filter;
      projectCards.forEach(function (card) {
        var show = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hide', !show);
        if (show) {
          card.style.animation = 'none';
          void card.offsetWidth; // reflow to restart animation
          card.style.animation = 'cardIn 0.5s ease both';
        }
      });
    });
  });

  /* ---------------- Contact form ---------------- */
  var contactForm = document.getElementById('contactForm');
  var formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = contactForm.name;
      var email = contactForm.email;
      var message = contactForm.message;
      var valid = true;

      [name, email, message].forEach(function (field) {
        field.classList.remove('invalid');
      });

      if (!name.value.trim()) { markInvalid(name); valid = false; }
      if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        markInvalid(email); valid = false;
      }
      if (message.value.trim().length < 5) { markInvalid(message); valid = false; }

      if (!valid) {
        setStatus('Please fill all the required fields correctly.', 'error');
        return;
      }

      var btn = contactForm.querySelector('button[type="submit"]');
      var original = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      setTimeout(function () {
        btn.textContent = original;
        btn.disabled = false;
        setStatus('Thanks, ' + name.value.split(' ')[0] + '! Your message has been sent. I will reply soon.', 'success');
        contactForm.reset();
      }, 1200);
    });

    function markInvalid(field) {
      field.classList.add('invalid');
      field.addEventListener('input', function h() {
        field.classList.remove('invalid');
        field.removeEventListener('input', h);
      });
    }

    function setStatus(msg, type) {
      if (formStatus) {
        formStatus.textContent = msg;
        formStatus.className = 'form-status ' + type;
      }
    }
  }

  /* ---------------- Footer year + CV ---------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var downloadCv = document.getElementById('downloadCv');
  if (downloadCv) {
    downloadCv.addEventListener('click', function (e) {
      e.preventDefault();
      var status = document.getElementById('formStatus');
      if (status) {
        status.textContent = 'CV download started (demo link).';
        status.className = 'form-status success';
      }
      e.target.textContent = 'Downloading...';
      setTimeout(function () { e.target.textContent = 'Download CV'; }, 1600);
    });
  }

  onScroll();
})();
