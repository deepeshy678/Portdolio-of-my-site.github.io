
/* ============================================================
   SUPABASE CONNECTION
============================================================ */

const SUPABASE_URL = "https://fdcusagqytiatvetgldt.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_CBA8NPW4B34h0RR96WDoIw_eSsjMV94";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


/* ============================================================
   TEST SUPABASE CONNECTION
============================================================ */

async function testSupabase() {
  const { data, error } = await supabaseClient
    .from("blogs")
    .select("*");

  if (error) {
    console.error("Supabase Error:", error);
    return;
  }

  console.log("Blogs from Supabase:", data);
}

testSupabase();
async function loadBlogs() {
  const blogGrid = document.getElementById("blogGrid");
  if (!blogGrid) return;

  const { data, error } = await supabaseClient
    .from("blogs")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading blogs:", error);
    return;
  }

  blogGrid.innerHTML = data.map(blog => `
    <article class="blog-card">

      <div class="blog-meta">
        <span class="blog-tag">${blog.category}</span>

        <span class="blog-date">
          ${new Date(blog.created_at).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric"
  })}
        </span>
      </div>

      <h3 class="blog-title">
        ${blog.title}
      </h3>

      <p class="blog-desc">
        ${blog.excerpt || ""}
      </p>

      <a
        href="blog.html?slug=${encodeURIComponent(blog.slug)}"
        class="blog-link"
      >
        Read more →
      </a>

    </article>
  `).join("");
}

loadBlogs();

/* ============================================================
LOAD SINGLE BLOG POST
============================================================ */

async function loadSingleBlog() {

    // Get slug from URL
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug");

    // If there is no slug, don't run this function
    if (!slug) return;

    console.log("Loading blog slug:", slug);

    // Get blog elements
    const blogLoading = document.getElementById("blogLoading");
    const blogError = document.getElementById("blogError");
    const blogArticle = document.getElementById("blogArticle");

    const blogCategory = document.getElementById("blogCategory");
    const blogDate = document.getElementById("blogDate");
    const blogTitle = document.getElementById("blogTitle");
    const blogExcerpt = document.getElementById("blogExcerpt");
    const blogImage = document.getElementById("blogImage");
    const blogContent = document.getElementById("blogContent");

    try {

        // Fetch the blog from Supabase
        const { data, error } = await supabaseClient
            .from("blogs")
            .select("*")
            .eq("slug", slug)
            .eq("published", true)
            .single();

        // Supabase error
        if (error) {
            console.error("Supabase blog error:", error);
            showBlogError();
            return;
        }

        // Blog not found
        if (!data) {
            console.error("No blog found for slug:", slug);
            showBlogError();
            return;
        }

        console.log("Blog loaded successfully:", data);

        // Hide loading
        if (blogLoading) {
            blogLoading.style.display = "none";
        }

        // Hide error
        if (blogError) {
            blogError.style.display = "none";
        }

        // Show article
        if (blogArticle) {
            blogArticle.style.display = "block";
        }

        // Category
        if (blogCategory) {
            blogCategory.textContent = data.category || "";
        }

        // Date
        if (blogDate && data.created_at) {
            blogDate.textContent = new Date(
                data.created_at
            ).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric"
            });
        }

        // Title
        if (blogTitle) {
            blogTitle.textContent = data.title || "";
        }

        // Excerpt
        if (blogExcerpt) {
            blogExcerpt.textContent = data.excerpt || "";
        }

        // Featured image
        // IMPORTANT:
        // Your Supabase column is called "image"
        if (blogImage && data.image) {

            blogImage.src = data.image;
            blogImage.alt = data.title || "Blog featured image";
            blogImage.style.display = "block";

        } else if (blogImage) {

            blogImage.style.display = "none";

        }

        // Full article content
        if (blogContent) {
            blogContent.innerHTML = data.content || "";
        }

        // Update browser title
        document.title =
            `${data.title} | Dipesh Kumar Yadav`;

        // Update meta description
        const metaDescription =
            document.querySelector('meta[name="description"]');

        if (metaDescription) {
            metaDescription.setAttribute(
                "content",
                data.excerpt ||
                data.title ||
                "Read technology articles and insights by Dipesh Kumar Yadav."
            );
        }

    } catch (error) {

        console.error("Unexpected error loading blog:", error);
        showBlogError();

    }


    // Show error helper
    function showBlogError() {

        if (blogLoading) {
            blogLoading.style.display = "none";
        }

        if (blogArticle) {
            blogArticle.style.display = "none";
        }

        if (blogError) {
            blogError.style.display = "block";
        }

    }
}


// Run single blog loader
loadSingleBlog();

/* ============================================================
   MAIN PORTFOLIO SCRIPT
============================================================ */

(function () {
  'use strict';

  var root = document.documentElement;


  /* ---------------- Theme persistence ---------------- */

  var THEME_KEY = 'dy.theme';
  var COLOR_KEY = 'dy.color';

  var VALID_COLORS = [
    'fire',
    'rose',
    'blue',
    'forest',
    'violet',
    'amber'
  ];

  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (e) {
      return null;
    }
  }

  function getStoredColor() {
    try {
      return localStorage.getItem(COLOR_KEY);
    } catch (e) {
      return null;
    }
  }

  function store(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      /* ignore */
    }
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
      if (preloader) {
        preloader.classList.add('hidden');
      }
    }, 500);
  });

  // Safety: never block the page longer than 4s

  setTimeout(function () {
    if (preloader) {
      preloader.classList.add('hidden');
    }
  }, 4000);


  /* ---------------- Theme toggle (light/dark) ---------------- */

  var themeToggle = document.getElementById('themeToggle');

  if (themeToggle) {

    themeToggle.addEventListener('click', function () {

      var next =
        root.getAttribute('data-theme') === 'dark'
          ? 'light'
          : 'dark';

      root.setAttribute('data-theme', next);

      store(THEME_KEY, next);

    });

  }


  /* ---------------- Color palette dropdown ---------------- */

  var colorPickerBtn =
    document.getElementById('colorPickerBtn');

  var colorMenu =
    document.getElementById('colorMenu');

  var swatches =
    document.querySelectorAll('.color-swatch');


  function setActiveSwatch() {

    var current =
      root.getAttribute('data-color') || 'fire';

    swatches.forEach(function (s) {

      s.classList.toggle(
        'active',
        s.dataset.color === current
      );

    });

  }

  setActiveSwatch();


  if (colorPickerBtn && colorMenu) {

    colorPickerBtn.addEventListener('click', function (e) {

      e.stopPropagation();

      colorMenu.classList.toggle('open');

    });


    document.addEventListener('click', function (e) {

      if (
        !colorMenu.contains(e.target) &&
        e.target !== colorPickerBtn
      ) {

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

      if (colorMenu) {
        colorMenu.classList.remove('open');
      }

    });

  });


  /* ---------------- Navbar: scrolled state ---------------- */

  var navbar =
    document.getElementById('navbar');

  var scrollProgress =
    document.getElementById('scrollProgress');


  function onScroll() {

    var y =
      window.scrollY ||
      document.documentElement.scrollTop;


    if (navbar) {
      navbar.classList.toggle(
        'scrolled',
        y > 30
      );
    }


    if (scrollProgress) {

      var max =
        document.documentElement.scrollHeight -
        window.innerHeight;

      var pct =
        max > 0
          ? (y / max) * 100
          : 0;

      scrollProgress.style.width =
        pct + '%';

    }


    updateActiveLink();

  }


  window.addEventListener(
    'scroll',
    onScroll,
    { passive: true }
  );


  /* ---------------- Mobile menu ---------------- */

  var hamburger =
    document.getElementById('hamburger');

  var navLinks =
    document.getElementById('navLinks');


  if (hamburger && navLinks) {

    hamburger.addEventListener('click', function () {

      hamburger.classList.toggle('open');

      navLinks.classList.toggle('open');

    });


    navLinks
      .querySelectorAll('a')
      .forEach(function (link) {

        link.addEventListener('click', function () {

          hamburger.classList.remove('open');

          navLinks.classList.remove('open');

        });

      });

  }


  /* ---------------- Active nav link on scroll ---------------- */

  var navAnchors =
    document.querySelectorAll('.nav-link');


  function updateActiveLink() {

    var pos =
      window.scrollY ||
      document.documentElement.scrollTop;

    var sections =
      document.querySelectorAll(
        'main section[id]'
      );

    var currentId = 'home';


    sections.forEach(function (sec) {

      var top =
        sec.offsetTop - 120;

      var bottom =
        top + sec.offsetHeight;

      if (
        pos >= top &&
        pos < bottom
      ) {

        currentId = sec.id;

      }

    });


    navAnchors.forEach(function (a) {

      a.classList.toggle(
        'active',
        a.getAttribute('href') ===
        '#' + currentId
      );

    });

  }


  updateActiveLink();


  /* ---------------- Typewriter effect ---------------- */

  var typewriterEl =
    document.getElementById('typewriter');


  if (typewriterEl) {

    var phrases = [
      'Flutter Developer',
      'Graphic Designer',
      'Digital Marketer',
      'Wordpress Developer',
      'Tutor'
    ];

    var phraseIdx = 0;

    var charIdx = 0;

    var deleting = false;


    function type() {

      var phrase =
        phrases[phraseIdx];

      var speed =
        deleting
          ? 45
          : 90;


      if (!deleting) {

        charIdx++;

        typewriterEl.textContent =
          phrase.slice(0, charIdx);


        if (
          charIdx ===
          phrase.length
        ) {

          deleting = true;

          speed = 1600;

        }

      } else {

        charIdx--;

        typewriterEl.textContent =
          phrase.slice(0, charIdx);


        if (charIdx === 0) {

          deleting = false;

          phraseIdx =
            (phraseIdx + 1) %
            phrases.length;

          speed = 500;

        }

      }


      setTimeout(type, speed);

    }


    setTimeout(type, 800);

  }


  /* ---------------- Reveal on scroll ---------------- */

  var revealObserver =
    new IntersectionObserver(
      function (entries) {

        entries.forEach(function (entry) {

          if (entry.isIntersecting) {

            entry.target.classList.add(
              'visible'
            );

            revealObserver.unobserve(
              entry.target
            );

          }

        });

      },
      {
        threshold: 0.12
      }
    );


  document
    .querySelectorAll('.reveal')
    .forEach(function (el) {

      revealObserver.observe(el);

    });


  /* ---------------- Skill bars + counters ---------------- */

  var barObserver =
    new IntersectionObserver(
      function (entries) {

        entries.forEach(function (entry) {

          if (entry.isIntersecting) {

            var bars =
              entry.target.querySelectorAll(
                '.bar-fill'
              );


            bars.forEach(function (b) {

              b.style.width =
                b.dataset.w
                  ? b.dataset.w
                  : getComputedStyle(b)
                    .getPropertyValue('--w')
                    .trim();

              b.classList.add(
                'filled'
              );

            });


            var nums =
              entry.target.querySelectorAll(
                '[data-count]'
              );


            nums.forEach(
              animateCounter
            );


            barObserver.unobserve(
              entry.target
            );

          }

        });

      },
      {
        threshold: 0.3
      }
    );


  document
    .querySelectorAll(
      '.about-stats, .skills-grid'
    )
    .forEach(function (el) {

      barObserver.observe(el);

    });


  function animateCounter(el) {

    var target =
      parseInt(
        el.getAttribute('data-count'),
        10
      ) || 0;

    var duration = 1400;

    var start = null;


    function step(timestamp) {

      if (!start) {
        start = timestamp;
      }


      var progress =
        Math.min(
          (timestamp - start) /
          duration,
          1
        );


      var eased =
        1 -
        Math.pow(
          1 - progress,
          3
        );


      el.textContent =
        Math.round(
          eased * target
        );


      if (progress < 1) {

        requestAnimationFrame(step);

      } else {

        el.textContent =
          target;

      }

    }


    requestAnimationFrame(step);

  }


  /* ---------------- Project filters ---------------- */

  var filterButtons =
    document.querySelectorAll(
      '.filter-btn'
    );

  var projectCards =
    document.querySelectorAll(
      '.project-card'
    );


  filterButtons.forEach(function (btn) {

    btn.addEventListener('click', function () {

      filterButtons.forEach(
        function (b) {

          b.classList.remove(
            'active'
          );

        }
      );


      btn.classList.add('active');


      var filter =
        btn.dataset.filter;


      projectCards.forEach(
        function (card) {

          var show =
            filter === 'all' ||
            card.dataset.category ===
            filter;


          card.classList.toggle(
            'hide',
            !show
          );


          if (show) {

            card.style.animation =
              'none';

            void card.offsetWidth;

            card.style.animation =
              'cardIn 0.5s ease both';

          }

        }
      );

    });

  });


  /* ---------------- Contact form ---------------- */

  var contactForm =
    document.getElementById(
      'contactForm'
    );

  var formStatus =
    document.getElementById(
      'formStatus'
    );


  if (contactForm) {

    contactForm.addEventListener(
      'submit',
      function (e) {

        e.preventDefault();


        var name =
          contactForm.name;

        var email =
          contactForm.email;

        var message =
          contactForm.message;

        var valid = true;


        [name, email, message]
          .forEach(function (field) {

            field.classList.remove(
              'invalid'
            );

          });


        if (!name.value.trim()) {

          markInvalid(name);

          valid = false;

        }


        if (
          !email.value.trim() ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(email.value)
        ) {

          markInvalid(email);

          valid = false;

        }


        if (
          message.value.trim().length < 5
        ) {

          markInvalid(message);

          valid = false;

        }


        if (!valid) {

          setStatus(
            'Please fill all the required fields correctly.',
            'error'
          );

          return;

        }


        var btn =
          contactForm.querySelector(
            'button[type="submit"]'
          );


        var original =
          btn.textContent;


        btn.textContent =
          'Sending...';

        btn.disabled = true;


        setTimeout(function () {

          btn.textContent =
            original;

          btn.disabled = false;


          setStatus(
            'Thanks, ' +
            name.value.split(' ')[0] +
            '! Your message has been sent. I will reply soon.',
            'success'
          );


          contactForm.reset();

        }, 1200);

      }
    );


    function markInvalid(field) {

      field.classList.add(
        'invalid'
      );


      field.addEventListener(
        'input',
        function h() {

          field.classList.remove(
            'invalid'
          );

          field.removeEventListener(
            'input',
            h
          );

        }
      );

    }


    function setStatus(msg, type) {

      if (formStatus) {

        formStatus.textContent =
          msg;

        formStatus.className =
          'form-status ' + type;

      }

    }

  }


  /* ---------------- Footer year + CV ---------------- */

  var yearEl =
    document.getElementById('year');


  if (yearEl) {

    yearEl.textContent =
      new Date().getFullYear();

  }


  var downloadCv =
    document.getElementById(
      'downloadCv'
    );


  if (downloadCv) {

    downloadCv.addEventListener(
      'click',
      function (e) {

        e.preventDefault();


        var status =
          document.getElementById(
            'formStatus'
          );


        if (status) {

          status.textContent =
            'CV download started (demo link).';

          status.className =
            'form-status success';

        }


        e.target.textContent =
          'Downloading...';


        setTimeout(function () {

          e.target.textContent =
            'Download CV';

        }, 1600);

      }
    );

  }
  onScroll();

})();
