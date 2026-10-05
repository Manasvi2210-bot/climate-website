/* =============================================
   EcoAware – Climate Change Awareness
   Main JavaScript File
   ============================================= */

'use strict';

/* ============================================================
   UTILITY HELPERS
   ============================================================ */

/**
 * Selects a single DOM element.
 * @param {string} selector
 * @param {Document|Element} [scope=document]
 * @returns {Element|null}
 */
const $ = (selector, scope = document) => scope.querySelector(selector);

/**
 * Selects all matching DOM elements as an array.
 * @param {string} selector
 * @param {Document|Element} [scope=document]
 * @returns {Element[]}
 */
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

/* ============================================================
   DOM READY – Entry Point
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initHeroParticles();
  initScrollReveal();
  initBackToTop();
  initSmoothScroll();
  initActiveNavHighlight();
  initQuizTopics();
  initGreenhouseViz();
  initGasCards();
  initDidYouKnow();
  initDashboard();
  initCalculator();
  initActionTracker();
  initClimateQuiz();
  initMythFact();
  initClimateTips();
});


/* ============================================================
   NAVBAR – Scroll behaviour & transparent-to-solid transition
   ============================================================ */
function initNavbar() {
  const navbar = $('#navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run once on load
}

/* ============================================================
   MOBILE MENU – Hamburger toggle
   ============================================================ */
function initMobileMenu() {
  const hamburger  = $('#hamburger');
  const mobileMenu = $('#mobile-menu');
  if (!hamburger || !mobileMenu) return;

  const toggleMenu = () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  const closeMenu = () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', toggleMenu);

  // Close menu when any mobile link is clicked
  $$('a', mobileMenu).forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      closeMenu();
    }
  });
}

/* ============================================================
   HERO PARTICLES – Animated floating particles background
   ============================================================ */
function initHeroParticles() {
  const container = $('#hero-particles');
  if (!container) return;

  const PARTICLE_COUNT = 28;

  const colors = [
    'rgba(40,168,88,0.6)',
    'rgba(14,165,233,0.5)',
    'rgba(110,231,160,0.5)',
    'rgba(56,189,248,0.4)',
    'rgba(52,211,153,0.45)',
    'rgba(163,230,53,0.4)',
  ];

  const emojis = ['🌿', '🍃', '💧', '🌱', '✨', '🌾'];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const useEmoji = Math.random() < 0.25;
    const size     = useEmoji ? 14 : Math.random() * 8 + 3;
    const left     = Math.random() * 100;
    const duration = Math.random() * 12 + 8;
    const delay    = Math.random() * 10;

    particle.style.cssText = `
      left: ${left}%;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      background: ${useEmoji ? 'transparent' : colors[Math.floor(Math.random() * colors.length)]};
      box-shadow: ${useEmoji ? 'none' : '0 0 6px ' + colors[0]};
      font-size: ${useEmoji ? '14px' : '0'};
    `;

    if (useEmoji) {
      particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      particle.style.display = 'flex';
      particle.style.alignItems = 'center';
      particle.style.justifyContent = 'center';
      particle.style.width = '24px';
      particle.style.height = '24px';
    }

    container.appendChild(particle);
  }
}

/* ============================================================
   SCROLL REVEAL – Intersection Observer for reveal animations
   ============================================================ */
function initScrollReveal() {
  const revealEls = $$('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Stop observing once revealed
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.05,              // lowered from 0.12 so anchor-jumped sections trigger
      rootMargin: '0px 0px 0px 0px', // removed -40px bottom so top-of-viewport sections fire
    }
  );

  revealEls.forEach(el => observer.observe(el));

  /*
   * Immediate viewport pre-check:
   * Any .reveal element already on-screen when the function runs
   * (e.g. direct navigation to #action-tracker via nav link, or above-fold
   * elements) is revealed right away without needing a scroll event.
   */
  revealEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('visible');
      observer.unobserve(el);
    }
  });
}

/* ============================================================
   BACK TO TOP – Show/hide and scroll functionality
   ============================================================ */
function initBackToTop() {
  const btn = $('#back-to-top');
  if (!btn) return;

  const handleScroll = () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  };

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', handleScroll, { passive: true });
}

/* ============================================================
   SMOOTH SCROLL – Enhanced smooth scrolling for anchor links
   ============================================================ */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#' || !href) return;

      const target = $(href);
      if (!target) return;

      e.preventDefault();

      const navbarHeight = 72; // px – matches CSS nav height
      const offsetTop = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    });
  });
}

/* ============================================================
   ACTIVE NAV HIGHLIGHT – Highlight current section in navbar
   ============================================================ */
function initActiveNavHighlight() {
  const sections = $$('section[id], footer[id]');
  const navLinks = $$('#navbar .nav-links a, #navbar .mobile-menu a');

  if (!sections.length || !navLinks.length) return;

  const OFFSET = 100; // px from top before activating

  const setActiveLink = (id) => {
    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${id}`;
      if (isActive && !link.classList.contains('nav-cta')) {
        link.style.color = 'var(--primary-light)';
        link.style.background = 'rgba(40,168,88,0.1)';
      } else if (!link.classList.contains('nav-cta')) {
        link.style.color = '';
        link.style.background = '';
      }
    });
  };

  const handleScroll = () => {
    let currentSectionId = '';

    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      if (sectionTop <= OFFSET) {
        currentSectionId = section.id;
      }
    });

    if (currentSectionId) {
      setActiveLink(currentSectionId);
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run once on load
}

/* ============================================================
   QUIZ TOPICS – UI interaction for topic selection
   ============================================================ */
function initQuizTopics() {
  const topicBtns = $$('.quiz-topic');
  if (!topicBtns.length) return;

  const quizQCount = $('#quiz-q-count');
  const quizTime   = $('#quiz-time');
  const quizLevel  = $('#quiz-level');

  // Topic configurations
  const topicConfig = {
    'topic-basics':    { questions: 10, time: 7,  level: 'Easy',   label: '📖 Climate Basics' },
    'topic-causes':    { questions: 12, time: 8,  level: 'Medium', label: '⚠️ Causes' },
    'topic-effects':   { questions: 12, time: 8,  level: 'Medium', label: '🌊 Effects' },
    'topic-solutions': { questions: 10, time: 7,  level: 'Easy',   label: '💡 Solutions' },
    'topic-all':       { questions: 25, time: 15, level: 'Hard',   label: '🌿 All Topics' },
  };

  topicBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active state from all
      topicBtns.forEach(b => {
        b.style.background = '';
        b.style.borderColor = '';
        b.style.color = '';
        b.style.transform = '';
      });

      // Apply active state to clicked
      btn.style.background = 'rgba(40,168,88,0.18)';
      btn.style.borderColor = 'var(--primary-light)';
      btn.style.color = 'var(--primary)';
      btn.style.transform = 'translateY(-2px)';

      // Update stats
      const config = topicConfig[btn.id];
      if (config) {
        if (quizQCount) quizQCount.textContent = config.questions;
        if (quizTime)   quizTime.textContent   = config.time;
        if (quizLevel)  quizLevel.textContent  = config.level;
      }
    });
  });
}

/* ============================================================
   TEMPERATURE BARS – Animate chart bars on scroll into view
   ============================================================ */
(function animateTempBars() {
  const bars = $$('.temp-bar');
  if (!bars.length) return;

  // Store original heights and collapse them
  const originalHeights = bars.map(bar => bar.style.height);
  bars.forEach(bar => { bar.style.height = '4px'; bar.style.transition = 'height 0.8s ease'; });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          bars.forEach((bar, i) => {
            setTimeout(() => {
              bar.style.height = originalHeights[i];
            }, i * 60);
          });
          observer.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  const chart = $('.temp-chart');
  if (chart) observer.observe(chart);
})();

/* ============================================================
   NAVBAR SCROLL EFFECT – Subtle logo size reduction on scroll
   ============================================================ */
(function navScrollEffect() {
  const logoIcon = $('.nav-logo-icon');
  const logoText = $('.nav-logo-text');

  if (!logoIcon || !logoText) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      logoIcon.style.transform = 'scale(0.92)';
      logoText.style.fontSize  = '1.2rem';
    } else {
      logoIcon.style.transform = '';
      logoText.style.fontSize  = '';
    }
  }, { passive: true });
})();

/* ============================================================
   CARD HOVER TILT – Subtle 3D tilt effect on cause/solution cards
   ============================================================ */
(function initCardTilt() {
  const cards = $$('.cause-card, .solution-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const midX   = rect.width  / 2;
      const midY   = rect.height / 2;
      const tiltX  = ((y - midY) / midY) * 4;
      const tiltY  = ((midX - x) / midX) * 4;

      card.style.transform = `translateY(-6px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'all 0.3s cubic-bezier(0.4,0,0.2,1)';
    });
  });
})();

/* ============================================================
   EFFECT CARDS – Color-coded hover backgrounds
   ============================================================ */
(function initEffectCardColors() {
  const colorMap = {
    'ec-1': 'rgba(239,68,68,0.04)',
    'ec-2': 'rgba(96,165,250,0.04)',
    'ec-3': 'rgba(14,165,233,0.04)',
    'ec-4': 'rgba(139,92,246,0.04)',
    'ec-5': 'rgba(245,158,11,0.04)',
    'ec-6': 'rgba(59,130,246,0.04)',
    'ec-7': 'rgba(249,115,22,0.04)',
    'ec-8': 'rgba(16,185,129,0.04)',
  };

  Object.entries(colorMap).forEach(([cls, color]) => {
    const card = $(`.${cls}`);
    if (!card) return;
    card.addEventListener('mouseenter', () => { card.style.background = color; });
    card.addEventListener('mouseleave', () => { card.style.background = ''; });
  });
})();

/* ============================================================
   COUNTER ANIMATION – Animate stat numbers in hero section
   ============================================================ */
(function initCounterAnimation() {
  const statsSection = document.querySelector('.hero-stats');
  if (!statsSection) return;

  let animated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;

          // Animate temperature stat (just a pulse effect since it's text)
          const statItems = $$('.stat-num');
          statItems.forEach((stat, i) => {
            setTimeout(() => {
              stat.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              stat.style.opacity = '0';
              stat.style.transform = 'translateY(10px)';
              setTimeout(() => {
                stat.style.opacity = '1';
                stat.style.transform = 'translateY(0)';
              }, 150);
            }, i * 120);
          });

          observer.disconnect();
        }
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(statsSection);
})();

/* ============================================================
   SCROLL PROGRESS – Thin progress bar at top of page
   ============================================================ */
(function initScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.id = 'scroll-progress';
  progressBar.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    height: 3px;
    width: 0%;
    background: linear-gradient(90deg, #28a858, #0ea5e9);
    z-index: 9999;
    transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.prepend(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
  }, { passive: true });
})();

/* ============================================================
   FOOTER YEAR – Dynamic copyright year
   ============================================================ */
(function updateFooterYear() {
  const copyEl = document.querySelector('.footer-copy');
  if (!copyEl) return;
  const year = new Date().getFullYear();
  copyEl.textContent = `© ${year} EcoAware · A College Project · All Rights Reserved`;
})();

/* ============================================================
   GREENHOUSE EFFECT – STEP-BY-STEP VISUALIZATION
   ============================================================ */

/** Definitions for each of the 5 animation steps */
const GH_STEPS = [
  {
    icon:     '☀️',
    title:    'Step 1 – Sunlight Reaches Earth',
    body:     'The Sun radiates energy as electromagnetic radiation (mainly visible light). This solar energy travels 150 million km across space and reaches Earth in about 8 minutes.',
    rays:     true,  earthGlow: false, heatUp: false,
    atmos:    false, trapped:   false, escape:  false, intensify: false,
    progress: 20
  },
  {
    icon:     '🌍',
    title:    'Step 2 – Earth Absorbs the Energy',
    body:     "Earth's oceans, land, and forests absorb about 70% of incoming solar energy. This warms the surface. The remaining 30% is reflected back to space by clouds, ice, and light-coloured surfaces.",
    rays:     true,  earthGlow: true,  heatUp: false,
    atmos:    false, trapped:   false, escape:  false, intensify: false,
    progress: 40
  },
  {
    icon:     '🔥',
    title:    'Step 3 – Earth Re-emits Heat',
    body:     "Warmed surfaces don't hold energy forever. Earth re-emits absorbed energy as infrared radiation (heat) upward through the atmosphere towards space. Some heat escapes directly into space.",
    rays:     true,  earthGlow: true,  heatUp: true,
    atmos:    false, trapped:   false, escape:  true,  intensify: false,
    progress: 60
  },
  {
    icon:     '☁️',
    title:    'Step 4 – Greenhouse Gases Trap Heat',
    body:     'CO₂, CH₄, N₂O, and other gases in the atmosphere absorb this outgoing infrared heat and re-radiate it in all directions — including back towards Earth. This is the natural greenhouse effect.',
    rays:     true,  earthGlow: true,  heatUp: true,
    atmos:    true,  trapped:   true,  escape:  true,  intensify: false,
    progress: 80
  },
  {
    icon:     '🌡️',
    title:    'Step 5 – More Gases = More Warming',
    body:     'Human activities are adding extra greenhouse gases — thickening the atmospheric blanket. A thicker layer traps more heat, raising global temperatures. This enhanced greenhouse effect is climate change.',
    rays:     true,  earthGlow: true,  heatUp: true,
    atmos:    true,  trapped:   true,  escape:  false, intensify: true,
    progress: 100
  }
];

function initGreenhouseViz() {
  const startBtn = document.getElementById('gh-start-btn');
  const nextBtn  = document.getElementById('gh-next-btn');
  const resetBtn = document.getElementById('gh-reset-btn');
  const sdots    = document.querySelectorAll('.gh-sdot');

  if (!startBtn) return;

  // SVG targets
  const rays      = document.querySelectorAll('.gh-ray');
  const rayLabel  = document.querySelector('.gh-ray-label');
  const eGlow     = document.getElementById('ghEarthGlow');
  const eBody     = document.getElementById('ghEarthBody');
  const heatUps   = document.querySelectorAll('.gh-heat-up');
  const heatEsc   = document.getElementById('ghHEsc');
  const heatLabel = document.querySelector('.gh-heat-label');
  const traps     = document.querySelectorAll('.gh-trap');
  const trapLabel = document.querySelector('.gh-trap-label');
  const atmosFill = document.getElementById('ghAtmosFill');
  const atmosBand = document.getElementById('ghAtmosBand');
  const mols      = document.querySelectorAll('.gh-mol');
  const stepBadge = document.getElementById('ghStepBadge');
  const stepSvgTx = document.getElementById('ghStepSvgText');

  // UI targets
  const idleEl    = document.getElementById('gh-idle-state');
  const activeEl  = document.getElementById('gh-active-state');
  const pillEl    = document.getElementById('gh-step-pill');
  const iconEl    = document.getElementById('gh-step-big-icon');
  const titleEl   = document.getElementById('gh-step-title');
  const bodyEl    = document.getElementById('gh-step-body');
  const progBar   = document.getElementById('gh-prog-bar');

  let currentStep = -1;
  let isRunning   = false;

  /** Apply all visual state for a given step index */
  function applyStep(idx) {
    if (idx < 0 || idx >= GH_STEPS.length) return;
    const s = GH_STEPS[idx];

    // — SVG: sunrays
    rays.forEach(r  => r.classList.toggle('active',  !!s.rays));
    if (rayLabel)    rayLabel.classList.toggle('active',  !!s.rays);

    // — SVG: Earth glow
    if (eGlow) {
      eGlow.classList.toggle('absorbing',   !!s.earthGlow && !s.intensify);
      eGlow.classList.toggle('intensified', !!s.intensify);
    }
    if (eBody) {
      eBody.classList.toggle('absorbing',   !!s.earthGlow && !s.intensify);
      eBody.classList.toggle('intensified', !!s.intensify);
    }

    // — SVG: heat arrows up
    heatUps.forEach(h => h.classList.toggle('active', !!s.heatUp));
    if (heatLabel) heatLabel.classList.toggle('active', !!s.heatUp);

    // — SVG: heat escape
    if (heatEsc) heatEsc.style.opacity = (s.escape && !s.intensify) ? '0.55' : '0';

    // — SVG: atmosphere
    if (atmosFill) {
      atmosFill.classList.toggle('active',      !!s.atmos && !s.intensify);
      atmosFill.classList.toggle('intensified', !!s.intensify);
    }
    if (atmosBand) {
      atmosBand.classList.toggle('active',      !!s.atmos || !!s.intensify);
      atmosBand.classList.toggle('intensified', !!s.intensify);
    }
    mols.forEach(m => m.classList.toggle('active', !!s.atmos || !!s.intensify));

    // — SVG: trapped arrows
    traps.forEach(t => t.classList.toggle('active', !!s.trapped));
    if (trapLabel) trapLabel.classList.toggle('active', !!s.trapped);

    // — SVG: step badge
    if (stepBadge) stepBadge.classList.add('visible');
    if (stepSvgTx) {
      stepSvgTx.textContent = `Step ${idx + 1}/5`;
      stepSvgTx.classList.add('visible');
    }

    // — UI: step panel
    if (idleEl)  idleEl.style.display  = 'none';
    if (activeEl) activeEl.style.display = 'flex';
    if (pillEl)  pillEl.textContent  = `Step ${idx + 1} of 5`;
    if (iconEl)  iconEl.textContent  = s.icon;
    if (titleEl) titleEl.textContent = s.title;
    if (bodyEl)  bodyEl.textContent  = s.body;
    if (progBar) progBar.style.width = s.progress + '%';

    // — Dot highlights
    sdots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  /** Fully reset all SVG and UI state */
  function resetAll() {
    currentStep = -1;
    isRunning   = false;

    rays.forEach(r  => r.classList.remove('active'));
    if (rayLabel)    rayLabel.classList.remove('active');
    if (eGlow)  { eGlow.classList.remove('absorbing', 'intensified'); }
    if (eBody)  { eBody.classList.remove('absorbing', 'intensified'); }
    heatUps.forEach(h => h.classList.remove('active'));
    if (heatLabel)   heatLabel.classList.remove('active');
    if (heatEsc)     heatEsc.style.opacity   = '0';
    if (atmosFill) { atmosFill.classList.remove('active', 'intensified'); }
    if (atmosBand) { atmosBand.classList.remove('active', 'intensified'); }
    mols.forEach(m  => m.classList.remove('active'));
    traps.forEach(t => t.classList.remove('active'));
    if (trapLabel)   trapLabel.classList.remove('active');
    if (stepBadge)   stepBadge.classList.remove('visible');
    if (stepSvgTx)   stepSvgTx.classList.remove('visible');

    if (idleEl)   idleEl.style.display   = 'flex';
    if (activeEl) activeEl.style.display = 'none';
    if (progBar)  progBar.style.width    = '20%';
    sdots.forEach(d => d.classList.remove('active'));

    startBtn.style.display = 'inline-flex';
    nextBtn.style.display  = 'none';
    resetBtn.style.display = 'none';
    nextBtn.textContent    = 'Next Step \u2192';
    nextBtn.disabled       = false;
    nextBtn.style.opacity  = '1';
  }

  /** Enter running mode (show Next/Reset, hide Start) */
  function enterRunMode() {
    isRunning = true;
    startBtn.style.display  = 'none';
    nextBtn.style.display   = 'inline-flex';
    resetBtn.style.display  = 'inline-flex';
  }

  /** Mark last step reached */
  function markComplete() {
    nextBtn.textContent   = '\u2713 Complete';
    nextBtn.disabled      = true;
    nextBtn.style.opacity = '0.55';
  }

  // Start button
  startBtn.addEventListener('click', () => {
    currentStep = 0;
    enterRunMode();
    applyStep(currentStep);
  });

  // Next button
  nextBtn.addEventListener('click', () => {
    if (currentStep < GH_STEPS.length - 1) {
      currentStep++;
      applyStep(currentStep);
    }
    if (currentStep === GH_STEPS.length - 1) markComplete();
  });

  // Reset button
  resetBtn.addEventListener('click', resetAll);

  // Step dot clicks (allow jumping to any step)
  sdots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      if (!isRunning) enterRunMode();
      currentStep = i;
      applyStep(currentStep);
      nextBtn.textContent   = 'Next Step \u2192';
      nextBtn.disabled      = false;
      nextBtn.style.opacity = '1';
      if (currentStep === GH_STEPS.length - 1) markComplete();
    });
  });
}

/* ============================================================
   GAS CARDS – Clickable greenhouse gas info
   ============================================================ */

/** Data for each of the 4 greenhouse gases */
const GAS_DATA = {
  co2: {
    symbol:  'CO₂',
    name:    'Carbon Dioxide',
    tag:     'Most Abundant Greenhouse Gas',
    color:   '#ef4444',
    desc:    'Carbon dioxide is a colourless, odourless gas naturally present in the atmosphere through respiration and decomposition. Since the Industrial Revolution, human activities have driven its concentration from ~280 ppm to over 421 ppm today — the highest in 3 million years.',
    sources: [
      'Burning coal, oil & natural gas for energy',
      'Deforestation & land clearing',
      'Cement and steel manufacturing',
      'Cars, aircraft & shipping',
      'Agricultural practices'
    ],
    warming: 'CO₂ is responsible for ~76% of human-caused greenhouse warming. Although less potent per molecule than some gases, its enormous volume makes it the dominant driver of climate change. It persists in the atmosphere for hundreds to thousands of years.'
  },
  ch4: {
    symbol:  'CH₄',
    name:    'Methane',
    tag:     '80× More Potent than CO₂ (20-yr)',
    color:   '#f59e0b',
    desc:    'Methane is a powerful greenhouse gas — about 80 times more effective at trapping heat than CO₂ over a 20-year timeframe, though it breaks down in around 12 years. It is the main component of natural gas and is produced by livestock digestion, wetlands, and decomposing waste.',
    sources: [
      'Livestock digestion (cattle & sheep)',
      'Rice paddy cultivation',
      'Oil & gas extraction leaks',
      'Landfill waste decomposition',
      'Coal mining operations'
    ],
    warming: 'Methane accounts for ~16% of global GHG emissions but has an outsized short-term warming impact. Cutting methane emissions is considered one of the fastest ways to slow near-term global warming, since its effects are felt within years rather than decades.'
  },
  n2o: {
    symbol:  'N₂O',
    name:    'Nitrous Oxide',
    tag:     '273× Warming Potential vs CO₂',
    color:   '#7c3aed',
    desc:    'Nitrous oxide is a long-lived greenhouse gas — one molecule can persist in the atmosphere for over 100 years and is 273 times more potent than CO₂ over a 100-year period. It also damages the ozone layer in the stratosphere, giving it a double environmental impact.',
    sources: [
      'Nitrogen-based fertilisers in agriculture',
      'Livestock manure management',
      'Sewage treatment facilities',
      'Industrial chemical production',
      'Combustion of fossil fuels & biomass'
    ],
    warming: 'N₂O contributes about 6% of total GHG emissions. Agriculture is the primary source. It is both a potent climate-forcer and an ozone-depleter, making it one of the most environmentally damaging gases emitted by modern farming practices.'
  },
  fgas: {
    symbol:  'F-Gas',
    name:    'Fluorinated Gases',
    tag:     'Up to 25,000× Warming Potential',
    color:   '#0d9488',
    desc:    'Fluorinated gases (F-gases) are entirely man-made chemicals — including HFCs, PFCs, SF₆, and NF₃. They do not occur naturally and are released from industrial processes and consumer products. Though small in volume (~2% of emissions), some are extraordinarily potent and extremely long-lived.',
    sources: [
      'Refrigeration & air conditioning systems',
      'Aerosol propellants & foam insulation',
      'Electrical switchgear (SF₆)',
      'Semiconductor manufacturing (NF₃)',
      'Aluminium & magnesium smelting'
    ],
    warming: 'Some F-gases have global warming potentials thousands of times greater than CO₂ — SF₆ can be up to 25,200× more potent over 100 years, and can persist for thousands of years. The Kigali Amendment to the Montreal Protocol targets a global phase-down of HFCs specifically.'
  }
};

function initGasCards() {
  const cards    = document.querySelectorAll('.gh-gas-card');
  const panel    = document.getElementById('gh-gas-panel');
  const closeBtn = document.getElementById('ghgp-close');

  if (!cards.length || !panel) return;

  const symEl     = document.getElementById('ghgp-sym');
  const nameEl    = document.getElementById('ghgp-name');
  const tagEl     = document.getElementById('ghgp-tag');
  const descEl    = document.getElementById('ghgp-desc');
  const srcEl     = document.getElementById('ghgp-sources');
  const warmEl    = document.getElementById('ghgp-warming');

  function populatePanel(key) {
    const d = GAS_DATA[key];
    if (!d) return;
    symEl.textContent   = d.symbol;
    symEl.style.color   = d.color;
    nameEl.textContent  = d.name;
    tagEl.textContent   = d.tag;
    descEl.textContent  = d.desc;
    warmEl.textContent  = d.warming;
    srcEl.innerHTML     = d.sources.map(s => `<li>${s}</li>`).join('');
    panel.style.display = 'block';
    // Smoothly scroll panel into view
    setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 60);
  }

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const wasSelected = card.classList.contains('selected');
      // Deselect all
      cards.forEach(c => {
        c.classList.remove('selected');
        c.setAttribute('aria-pressed', 'false');
      });
      if (wasSelected) {
        panel.style.display = 'none';  // toggle off if same card
      } else {
        card.classList.add('selected');
        card.setAttribute('aria-pressed', 'true');
        populatePanel(card.dataset.gas);
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      panel.style.display = 'none';
      cards.forEach(c => {
        c.classList.remove('selected');
        c.setAttribute('aria-pressed', 'false');
      });
    });
  }
}

/* ============================================================
   DID YOU KNOW – Rotating climate facts
   ============================================================ */

const DYK_FACTS = [
  'The last decade (2011–2020) was the warmest on record — every year since 2015 ranks among the top 8 hottest years ever measured.',
  'Since 1880, the global average surface temperature has risen by ~1.1°C, but the Arctic is warming nearly 4 times faster.',
  'Every tonne of CO₂ emitted today may stay in the atmosphere for over 1,000 years, affecting many future generations.',
  'The ocean has absorbed more than 90% of the excess heat trapped by the enhanced greenhouse effect since the 1970s.',
  "If Greenland's entire ice sheet melted, global sea levels would rise by approximately 7 metres — inundating hundreds of coastal cities.",
  'Methane is about 80 times more potent than CO₂ as a greenhouse gas over a 20-year period, but only lasts ~12 years in the atmosphere.',
  'Atmospheric CO₂ is now above 421 ppm — higher than at any point in at least 3 million years of Earth\'s history.',
  'Coral reefs, which support 25% of all marine species, are dying at alarming rates due to ocean warming and acidification.',
  'Renewable energy (solar + wind) is now the cheapest source of new electricity in history — cheaper than coal in most of the world.',
  'Planting 1 trillion trees globally could capture up to 205 billion tonnes of carbon — about two-thirds of all human CO₂ emissions.'
];

function initDidYouKnow() {
  const textEl   = document.getElementById('gh-dyk-text');
  const nextBtn  = document.getElementById('gh-dyk-next-btn');
  const dotsRow  = document.getElementById('gh-dyk-dots-row');

  if (!textEl || !nextBtn) return;

  let current = 0;

  // Build dot buttons
  DYK_FACTS.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('gh-dyk-dot');
    dot.setAttribute('aria-label', `Fact ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => showFact(i));
    if (dotsRow) dotsRow.appendChild(dot);
  });

  /** Animate to a new fact */
  function showFact(idx) {
    current = ((idx % DYK_FACTS.length) + DYK_FACTS.length) % DYK_FACTS.length;

    // Fade out
    textEl.style.opacity   = '0';
    textEl.style.transform = 'translateY(6px)';

    setTimeout(() => {
      textEl.textContent     = DYK_FACTS[current];
      textEl.style.opacity   = '1';
      textEl.style.transform = 'translateY(0)';

      // Update dots
      document.querySelectorAll('.gh-dyk-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }, 220);
  }

  // Initialise text transition styles
  textEl.style.transition = 'opacity 0.22s ease, transform 0.22s ease';
  textEl.textContent = DYK_FACTS[0];

  nextBtn.addEventListener('click', () => showFact(current + 1));

  // Auto-cycle every 8 seconds
  setInterval(() => showFact(current + 1), 8000);
}

/* ============================================================
   CLIMATE DATA DASHBOARD
   ============================================================ */

/* ─── Shared visual constants ──────────────────────────────── */
const DC = {
  red:     '#ef4444', orange:  '#f97316',
  amber:   '#f59e0b', green:   '#28a858',
  teal:    '#0d9488', sky:     '#0ea5e9',
  blue:    '#1e6fa8', purple:  '#7c3aed',
  gray:    '#9ca3af',
  grid:    'rgba(0,0,0,0.05)',
  tick:    '#9ca3af',
  tooltipBg: 'rgba(12,22,44,0.96)',
};

/* Shared tooltip style object */
const DC_TOOLTIP = {
  backgroundColor: DC.tooltipBg,
  titleColor:  '#ffffff',
  bodyColor:   'rgba(255,255,255,0.70)',
  footerColor: 'rgba(245,158,11,0.80)',
  borderColor: 'rgba(40,168,88,0.28)',
  borderWidth: 1,
  padding: 12,
  cornerRadius: 8,
  caretSize: 6,
};

/* Shared axis/scale builder */
function dcScales(yLabel, yMin, yMax) {
  const cfg = {
    x: {
      grid:   { color: DC.grid },
      ticks:  { color: DC.tick, font: { size: 11 } },
      border: { display: false },
    },
    y: {
      grid:   { color: DC.grid },
      ticks:  { color: DC.tick, font: { size: 11 } },
      border: { display: false },
      title:  {
        display: !!yLabel,
        text:    yLabel || '',
        color:   DC.tick,
        font:    { size: 11, weight: '600' },
        padding: { bottom: 8 },
      },
    }
  };
  if (yMin !== undefined) cfg.y.min = yMin;
  if (yMax !== undefined) cfg.y.max = yMax;
  return cfg;
}

/* Shared legend labels */
const DC_LEGEND_LABELS = {
  font: { size: 12, weight: '600' },
  color: '#374151',
  padding: 16,
  usePointStyle: true,
  pointStyleWidth: 10,
};

/* ─── Main entry point ─────────────────────────────────────── */
function initDashboard() {
  if (typeof Chart === 'undefined') {
    console.warn('EcoAware: Chart.js not loaded — dashboard charts skipped.');
    return;
  }

  const section = document.getElementById('data-dashboard');
  if (!section) return;

  /* Set Chart.js global defaults once */
  Chart.defaults.font.family   = "'Inter', sans-serif";
  Chart.defaults.color         = DC.tick;
  Chart.defaults.animation.duration = 900;

  let initialized = false;
  const charts = {};

  /* Build charts lazily when the section enters the viewport */
  const io = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !initialized) {
      initialized = true;
      charts.temp    = dcBuildTemp();
      charts.co2     = dcBuildCO2();
      charts.renew   = dcBuildRenew();
      charts.sources = dcBuildSources();
      dcAnimateStats();
      io.disconnect();
    }
  }, { threshold: 0.08 });
  io.observe(section);

  /* ── Tab switching ─────────────────────────────────────── */
  const tabs  = document.querySelectorAll('.dash-tab');
  const panes = document.querySelectorAll('.dash-chart-pane');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.chart;

      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      panes.forEach(p => (p.hidden = true));
      const pane = document.getElementById('dchart-' + key);
      if (pane) {
        pane.hidden = false;
        /* Give the browser one frame to lay out the pane, then resize the chart */
        requestAnimationFrame(() => {
          if (charts[key]) charts[key].resize();
        });
      }
    });
  });
}

/* ─── Chart 1: Temperature anomaly ────────────────────────── */
function dcBuildTemp() {
  const ctx = document.getElementById('chartTemp');
  if (!ctx) return null;

  const labels = ['1960','1965','1970','1975','1980','1985','1990','1995','2000','2005','2010','2015','2020','2023'];
  const data   = [-0.03, -0.01, 0.02, -0.01, 0.26, 0.12, 0.44, 0.38, 0.42, 0.68, 0.72, 0.87, 1.02, 1.17];

  /* Colour each point by magnitude */
  const ptColors = data.map(v =>
    v >= 0.9 ? DC.red :
    v >= 0.5 ? DC.orange :
    v >= 0.1 ? DC.amber  : '#60a5fa'
  );

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Temp. Anomaly (°C) — Educational Sample',
        data,
        borderColor: DC.red,
        backgroundColor: (ctx) => {
          const { ctx: c, chartArea } = ctx.chart;
          if (!chartArea) return 'rgba(239,68,68,0.08)';
          const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          g.addColorStop(0, 'rgba(239,68,68,0.28)');
          g.addColorStop(1, 'rgba(239,68,68,0.0)');
          return g;
        },
        fill: true,
        tension: 0.42,
        pointBackgroundColor: ptColors,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { labels: DC_LEGEND_LABELS },
        tooltip: {
          ...DC_TOOLTIP,
          callbacks: {
            label:  c => ` ${c.parsed.y >= 0 ? '+' : ''}${c.parsed.y.toFixed(2)} °C anomaly`,
            footer: () => '⚠ Educational sample — not official data',
          },
        },
      },
      scales: dcScales('Temperature Anomaly (°C)', -0.25, 1.45),
    },
  });
}

/* ─── Chart 2: CO₂ concentration ──────────────────────────── */
function dcBuildCO2() {
  const ctx = document.getElementById('chartCO2');
  if (!ctx) return null;

  const labels = ['2000','2002','2004','2006','2008','2010','2012','2014','2016','2018','2020','2022','2023'];
  const data   = [369, 373, 377, 381, 386, 390, 394, 398, 403, 408, 413, 418, 421];

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'CO₂ Concentration (ppm) — Educational Sample',
        data,
        borderColor: DC.sky,
        backgroundColor: (ctx) => {
          const { ctx: c, chartArea } = ctx.chart;
          if (!chartArea) return 'rgba(14,165,233,0.08)';
          const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          g.addColorStop(0, 'rgba(14,165,233,0.24)');
          g.addColorStop(1, 'rgba(14,165,233,0.0)');
          return g;
        },
        fill: true,
        tension: 0.38,
        pointBackgroundColor: DC.sky,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 7,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { labels: DC_LEGEND_LABELS },
        tooltip: {
          ...DC_TOOLTIP,
          callbacks: {
            label:  c => ` ${c.parsed.y} ppm CO₂`,
            footer: () => '⚠ Educational sample — not official data',
          },
        },
      },
      scales: dcScales('CO₂ Concentration (ppm)', 360, 430),
    },
  });
}

/* ─── Chart 3: Renewable energy share ─────────────────────── */
function dcBuildRenew() {
  const ctx = document.getElementById('chartRenew');
  if (!ctx) return null;

  const labels = ['2000','2002','2004','2006','2008','2010','2012','2014','2016','2018','2020','2022','2023'];
  const data   = [18.0, 18.8, 19.4, 19.8, 20.3, 21.4, 22.3, 23.1, 24.6, 26.1, 28.4, 30.0, 30.5];

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Renewable Energy Share (%) — Educational Sample',
        data,
        borderColor: DC.green,
        backgroundColor: (ctx) => {
          const { ctx: c, chartArea } = ctx.chart;
          if (!chartArea) return 'rgba(40,168,88,0.1)';
          const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          g.addColorStop(0, 'rgba(40,168,88,0.3)');
          g.addColorStop(1, 'rgba(40,168,88,0.0)');
          return g;
        },
        fill: true,
        tension: 0.42,
        pointBackgroundColor: DC.green,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 7,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { labels: DC_LEGEND_LABELS },
        tooltip: {
          ...DC_TOOLTIP,
          callbacks: {
            label:  c => ` ${c.parsed.y.toFixed(1)}% of global electricity`,
            footer: () => '⚠ Educational sample — not official data',
          },
        },
      },
      scales: dcScales('Renewable Share (% of Global Electricity)', 10, 40),
    },
  });
}

/* ─── Chart 4: GHG by sector (doughnut) ───────────────────── */
function dcBuildSources() {
  const ctx = document.getElementById('chartSources');
  if (!ctx) return null;

  const sectorColors = [
    'rgba(239,68,68,0.88)',
    'rgba(249,115,22,0.88)',
    'rgba(124,58,237,0.88)',
    'rgba(40,168,88,0.88)',
    'rgba(14,165,233,0.88)',
    'rgba(156,163,175,0.88)',
  ];

  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Energy & Heat','Transportation','Industry','Agriculture','Buildings','Other'],
      datasets: [{
        label: 'GHG Share — Educational Sample',
        data:  [34, 16, 24, 11, 6, 9],
        backgroundColor: sectorColors,
        borderColor: '#ffffff',
        borderWidth: 3,
        hoverOffset: 18,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '58%',
      plugins: {
        legend: {
          position: 'right',
          labels: {
            ...DC_LEGEND_LABELS,
            generateLabels: (chart) =>
              chart.data.labels.map((label, i) => ({
                text:        `${label}  (${chart.data.datasets[0].data[i]}%)`,
                fillStyle:   sectorColors[i],
                strokeStyle: '#ffffff',
                lineWidth:   2,
                hidden:      false,
                index:       i,
              })),
          },
        },
        tooltip: {
          ...DC_TOOLTIP,
          callbacks: {
            label:  c => ` ${c.label}: ~${c.parsed}%`,
            footer: () => '⚠ Educational sample — not official data',
          },
        },
      },
      animation: {
        animateRotate: true,
        animateScale:  true,
        duration: 900,
        easing: 'easeInOutQuart',
      },
    },
  });
}

/* ─── Stat card counter animation ─────────────────────────── */
function dcAnimateStats() {
  const counters = [
    { id: 'dscn-temp',  to: 1.1, dec: 1, dur: 1200 },
    { id: 'dscn-co2',  to: 421, dec: 0, dur: 1600 },
    { id: 'dscn-renew',to: 30,  dec: 0, dur: 1000 },
    { id: 'dscn-sea',  to: 20,  dec: 0, dur: 1000 },
  ];

  counters.forEach(({ id, to, dec, dur }) => {
    const el = document.getElementById(id);
    if (!el) return;
    const t0 = performance.now();
    function step(now) {
      const progress = Math.min((now - t0) / dur, 1);
      const ease     = 1 - Math.pow(1 - progress, 3); /* ease-out-cubic */
      el.textContent = dec > 0
        ? (to * ease).toFixed(dec)
        : Math.floor(to * ease);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

/* ============================================================
   CARBON FOOTPRINT CALCULATOR
   ============================================================ */

/*
 * EMISSION FACTORS (educational – all in one place for easy editing)
 * Sources: approximate IPCC / IEA average values, simplified for education.
 */
const CF_FACTORS = {
  carKgPerKm:    0.21,    // kg CO2e per km (average petrol car)
  busKgPerKm:    0.089,   // kg CO2e per km (average public transport mix)
  elecKgPerKwh:  0.45,    // kg CO2e per kWh (global average grid mix)
  foodKgPerYear: {        // kg CO2e per year by diet level
    low:      1500,
    moderate: 2500,
    high:     3800,
  },
  flightKgEach:  1100,    // kg CO2e per flight (average short-to-medium haul)
  daysPerYear:   365,
  monthsPerYear: 12,
};

/* Personalised tip text per category key */
const CF_TIPS = {
  car:     'Your personal vehicle travel is your biggest contributor. Try carpooling, cycling, or using public transport for shorter journeys.',
  bus:     'While public transport is lower-carbon than driving, combining it with active travel (walking, cycling) for the last mile can reduce your footprint further.',
  elec:    'Your electricity use stands out. Switching off devices on standby, using energy-efficient appliances, and considering a renewable energy tariff can all help.',
  food:    'Your food choices are the largest factor. Even swapping a few high-emission meals per week for plant-based options can make a meaningful difference.',
  flights: 'Flights are your biggest category. One fewer return long-haul flight can save more CO₂ than all other changes combined for many people.',
};

/* Breakdown bar colours */
const CF_COLORS = {
  car:     '#ef4444',
  bus:     '#f97316',
  elec:    '#f59e0b',
  food:    '#28a858',
  flights: '#0ea5e9',
};

/* Category display names */
const CF_LABELS = {
  car:     '🚗 Personal Vehicle',
  bus:     '🚌 Public Transport',
  elec:    '⚡ Electricity',
  food:    '🍗 Food',
  flights: '✈️ Flights',
};

/* Classification thresholds (kg CO2e / year) */
const CF_THRESHOLDS = {
  low:      4000,   // below this = LOW
  moderate: 9000,   // below this = MODERATE, else HIGH
};

/* ── Main initialiser ─────────────────────────────────────── */
function initCalculator() {
  const section     = document.getElementById('calculator');
  if (!section) return;

  const calcBtn     = document.getElementById('calc-btn');
  const resetBtn    = document.getElementById('calc-reset-btn');
  const validEl     = document.getElementById('calc-validation');
  const resultsEl   = document.getElementById('calc-results');

  if (!calcBtn || !resetBtn) return;

  calcBtn.addEventListener('click', runCalculation);
  resetBtn.addEventListener('click', resetCalculator);

  /* Prevent typing negatives directly; clamp on blur */
  document.querySelectorAll('.calc-input').forEach(inp => {
    inp.addEventListener('blur', () => {
      const v = parseFloat(inp.value);
      if (!isNaN(v) && v < 0) inp.value = 0;
    });
  });
}

/* ── Read and validate inputs ─────────────────────────────── */
function cfReadInputs() {
  function readNum(id) {
    const el  = document.getElementById(id);
    if (!el) return 0;
    const val = parseFloat(el.value);
    return (isNaN(val) || val < 0) ? 0 : val;
  }

  return {
    carKmDay:   readNum('inp-car'),
    busKmDay:   readNum('inp-bus'),
    elecKwh:    readNum('inp-elec'),
    meat:       (document.getElementById('inp-meat') || {}).value || 'moderate',
    flights:    readNum('inp-flights'),
  };
}

/* ── Calculate annual emissions by category ──────────────── */
function cfCalculate(inputs) {
  const f = CF_FACTORS;
  const car     = inputs.carKmDay   * f.daysPerYear    * f.carKgPerKm;
  const bus     = inputs.busKmDay   * f.daysPerYear    * f.busKgPerKm;
  const elec    = inputs.elecKwh    * f.monthsPerYear  * f.elecKgPerKwh;
  const food    = f.foodKgPerYear[inputs.meat] || f.foodKgPerYear.moderate;
  const flights = inputs.flights * f.flightKgEach;
  const total   = car + bus + elec + food + flights;
  return { car, bus, elec, food, flights, total };
}

/* ── Classify total ───────────────────────────────────────── */
function cfClassify(total) {
  if (total < CF_THRESHOLDS.low)      return 'low';
  if (total < CF_THRESHOLDS.moderate) return 'moderate';
  return 'high';
}

/* ── Format kg CO2e with thousands separator ─────────────── */
function cfFmt(kg) {
  return Math.round(kg).toLocaleString('en-US');
}

/* ── Animate a number counting up ────────────────────────── */
function cfCountUp(el, target, dur) {
  const t0 = performance.now();
  const rounded = Math.round(target);
  (function step(now) {
    const p    = Math.min((now - t0) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(rounded * ease).toLocaleString('en-US');
    if (p < 1) requestAnimationFrame(step);
  })(t0);
}

/* ── Render breakdown bars ─────────────────────────────────── */
function cfRenderBreakdown(emissions) {
  const container = document.getElementById('cb-bars');
  if (!container) return;
  container.innerHTML = '';

  const total = emissions.total || 1;  // avoid /0
  const keys  = ['car', 'bus', 'elec', 'food', 'flights'];

  keys.forEach(key => {
    const val     = emissions[key];
    const pct     = Math.min((val / total) * 100, 100);
    const color   = CF_COLORS[key];
    const label   = CF_LABELS[key];

    const row     = document.createElement('div');
    row.className = 'cb-row';

    const lbl     = document.createElement('div');
    lbl.className = 'cb-row-label';
    lbl.textContent = label;

    const track   = document.createElement('div');
    track.className = 'cb-bar-track';

    const fill    = document.createElement('div');
    fill.className = 'cb-bar-fill';
    fill.style.background = color;
    fill.style.width = '0%';

    const valEl   = document.createElement('div');
    valEl.className = 'cb-row-value';
    valEl.textContent = cfFmt(val) + ' kg';

    track.appendChild(fill);
    row.appendChild(lbl);
    row.appendChild(track);
    row.appendChild(valEl);
    container.appendChild(row);

    /* Animate bar width after a short delay */
    setTimeout(() => { fill.style.width = pct.toFixed(1) + '%'; }, 80);
  });
}

/* ── Render personalised top tip ──────────────────────────── */
function cfRenderTopTip(emissions) {
  const topTipEl = document.getElementById('ct-top-tip');
  if (!topTipEl) return;

  const keys = ['car', 'bus', 'elec', 'food', 'flights'];
  const worst = keys.reduce((best, k) => emissions[k] > emissions[best] ? k : best, keys[0]);
  topTipEl.textContent = CF_TIPS[worst];
}

/* ── Show the result context message ──────────────────────── */
function cfContextMessage(total, level) {
  const msgs = {
    low:      'Your estimated footprint is relatively low. Maintaining these habits helps — and small further reductions still make a difference.',
    moderate: 'Your footprint is around the global average. Focusing on your largest category can bring it down meaningfully.',
    high:     'Your footprint is above average. Identifying and addressing your top category could significantly reduce your impact.',
  };
  return msgs[level] || '';
}

/* ── Run the full calculation and render results ─────────── */
function runCalculation() {
  const validEl   = document.getElementById('calc-validation');
  const resultsEl = document.getElementById('calc-results');
  const inputs    = cfReadInputs();

  /* Clear validation */
  if (validEl) {
    validEl.hidden = true;
    validEl.textContent = '';
  }

  /* Check all numeric inputs are non-negative */
  const numIds = ['inp-car','inp-bus','inp-elec','inp-flights'];
  const anyNeg = numIds.some(id => {
    const el  = document.getElementById(id);
    return el && parseFloat(el.value) < 0;
  });

  if (anyNeg) {
    if (validEl) {
      validEl.textContent = '⚠️ Please enter 0 or a positive number for all fields. Negative values are not valid.';
      validEl.hidden = false;
    }
    return;
  }

  const emissions = cfCalculate(inputs);

  /* Guard against NaN */
  if (!isFinite(emissions.total)) {
    if (validEl) {
      validEl.textContent = '⚠️ Something went wrong. Please check your inputs and try again.';
      validEl.hidden = false;
    }
    return;
  }

  /* — Render total card — */
  const level    = cfClassify(emissions.total);
  const bigNum   = document.getElementById('ctc-big-num');
  const badge    = document.getElementById('ctc-badge');
  const context  = document.getElementById('ctc-context');

  if (badge) {
    badge.textContent = level.toUpperCase();
    badge.className   = 'ctc-badge ' + level;
  }
  if (context) context.textContent = cfContextMessage(emissions.total, level);
  if (bigNum)  cfCountUp(bigNum, emissions.total, 1200);

  /* — Breakdown bars — */
  cfRenderBreakdown(emissions);

  /* — Personalised tip — */
  cfRenderTopTip(emissions);

  /* — Show results panel — */
  if (resultsEl) {
    resultsEl.hidden = false;
    /* Smooth scroll into view */
    setTimeout(() => resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
  }
}

/* ── Reset calculator ─────────────────────────────────────── */
function resetCalculator() {
  /* Reset inputs to defaults */
  const defaults = {
    'inp-car':     30,
    'inp-bus':     10,
    'inp-elec':    200,
    'inp-flights': 2,
  };
  Object.entries(defaults).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  });
  const meatEl = document.getElementById('inp-meat');
  if (meatEl) meatEl.value = 'moderate';

  /* Hide results and validation */
  const resultsEl = document.getElementById('calc-results');
  const validEl   = document.getElementById('calc-validation');
  if (resultsEl) resultsEl.hidden = true;
  if (validEl)   { validEl.hidden = true; validEl.textContent = ''; }

  /* Scroll back to top of section */
  const section = document.getElementById('calculator');
  if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ============================================================
   CLIMATE ACTION TRACKER
   ============================================================ */

/* localStorage key (unique to this project) */
const AT_STORAGE_KEY = 'ecoAwareActionTracker';

/* Total number of action cards */
const AT_TOTAL = 8;

/* Eco-score tier lookup */
const AT_TIERS = [
  { min: 0, max: 2, label: '🌱 Getting Started',     badge: 'Getting Started' },
  { min: 3, max: 4, label: '🦋 Eco Explorer',         badge: 'Eco Explorer'    },
  { min: 5, max: 6, label: '🏆 Climate Champion',    badge: 'Climate Champion' },
  { min: 7, max: 8, label: '🌍 Planet Protector',    badge: 'Planet Protector' },
];

/* Personalised messages keyed by completed count */
const AT_MESSAGES = {
  0: 'Every journey starts with one small action. 🌱',
  1: 'Great start! Keep building your green habits.',
  2: 'Great start! Keep building your green habits.',
  3: "You're becoming an Eco Explorer! Keep going.",
  4: "You're becoming an Eco Explorer! Keep going.",
  5: "You're making a real difference. You're a Climate Champion!",
  6: "You're making a real difference. You're a Climate Champion!",
  7: 'Almost there! Just one more action.',
  8: "Excellent! You're a Planet Protector! 🌍",
};

/* ── Main initialiser ───────────────────────────────────── */
function initActionTracker() {
  const section = document.getElementById('action-tracker');
  if (!section) return;

  /* Wire up each action card */
  const checkboxes = section.querySelectorAll('.at-checkbox');
  checkboxes.forEach(chk => {
    chk.addEventListener('change', () => {
      atUpdateCardVisual(chk);
      updateActionProgress();
      saveActionTracker();
    });
  });

  /* Keyboard: Space/Enter on the label also toggles */
  section.querySelectorAll('.at-card').forEach(card => {
    card.addEventListener('keydown', e => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        const chk = card.querySelector('.at-checkbox');
        if (chk) {
          chk.checked = !chk.checked;
          atUpdateCardVisual(chk);
          updateActionProgress();
          saveActionTracker();
        }
      }
    });
    /* Make label keyboard-focusable */
    if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');
  });

  /* Reset button */
  const resetBtn = document.getElementById('at-reset-btn');
  if (resetBtn) resetBtn.addEventListener('click', resetActionTracker);

  /* Restore saved state, then update UI */
  loadActionTracker();
}

/* ── Apply / remove at-done class on a card ───────────── */
function atUpdateCardVisual(checkbox) {
  const card = checkbox.closest('.at-card');
  if (!card) return;
  if (checkbox.checked) {
    card.classList.add('at-done');
    card.setAttribute('aria-checked', 'true');
  } else {
    card.classList.remove('at-done');
    card.setAttribute('aria-checked', 'false');
  }
}

/* ── Count completed actions ─────────────────────────── */
function atCountDone() {
  return document.querySelectorAll('.at-checkbox:checked').length;
}

/* ── Update all progress UI elements ─────────────────── */
function updateActionProgress() {
  const done = atCountDone();
  const pct  = Math.round((done / AT_TOTAL) * 100);

  /* Fraction numbers */
  const fracDone = document.getElementById('at-frac-done');
  const pctEl    = document.getElementById('at-pct');
  if (fracDone) fracDone.textContent = done;
  if (pctEl)    pctEl.textContent    = pct + '%';

  /* Progress bar */
  const fill  = document.getElementById('at-bar-fill');
  const track = document.getElementById('at-bar-track');
  if (fill)  fill.style.width = pct + '%';
  if (track) {
    track.setAttribute('aria-valuenow', pct);
  }

  /* Eco tier */
  const tier = AT_TIERS.find(t => done >= t.min && done <= t.max) || AT_TIERS[0];
  const tierEl  = document.getElementById('at-eco-tier');
  const badgeEl = document.getElementById('at-score-badge');
  if (tierEl)  tierEl.textContent  = tier.label;
  if (badgeEl) badgeEl.textContent = tier.badge;

  /* Personalised message */
  const msgEl = document.getElementById('at-message');
  if (msgEl) msgEl.textContent = AT_MESSAGES[done] || AT_MESSAGES[0];

  /* Colour cue on fraction: brighten when all done */
  const fracDoneEl = document.getElementById('at-frac-done');
  const pctNumEl   = document.getElementById('at-pct');
  if (done === AT_TOTAL) {
    if (fracDoneEl) fracDoneEl.style.color = '#6ee7a0';
    if (pctNumEl)   pctNumEl.style.color   = '#6ee7a0';
  } else {
    if (fracDoneEl) fracDoneEl.style.color = '';
    if (pctNumEl)   pctNumEl.style.color   = '';
  }
}

/* ── Save state to localStorage ───────────────────────── */
function saveActionTracker() {
  try {
    const checkboxes = document.querySelectorAll('.at-checkbox');
    const state = {};
    checkboxes.forEach(chk => { state[chk.id] = chk.checked; });
    localStorage.setItem(AT_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    /* localStorage unavailable (private browsing etc.) — fail silently */
  }
}

/* ── Load state from localStorage ─────────────────────── */
function loadActionTracker() {
  try {
    const raw = localStorage.getItem(AT_STORAGE_KEY);
    if (!raw) { updateActionProgress(); return; }
    const state = JSON.parse(raw);
    document.querySelectorAll('.at-checkbox').forEach(chk => {
      if (state[chk.id] === true) {
        chk.checked = true;
        atUpdateCardVisual(chk);
      }
    });
  } catch (e) {
    /* Corrupt storage — ignore and start fresh */
  }
  updateActionProgress();
}

/* ── Reset all actions ───────────────────────────────── */
function resetActionTracker() {
  /* Uncheck all boxes and remove done state */
  document.querySelectorAll('.at-checkbox').forEach(chk => {
    chk.checked = false;
    atUpdateCardVisual(chk);
  });

  /* Clear storage */
  try { localStorage.removeItem(AT_STORAGE_KEY); } catch (e) {}

  /* Update all UI elements */
  updateActionProgress();

  /* Scroll section into view */
  const section = document.getElementById('action-tracker');
  if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ============================================================
   CLIMATE CHANGE QUIZ
   ============================================================ */

/* ── Question bank ──────────────────────────────────── */
const CQ_QUESTIONS = [
  {
    q: 'What is the main cause of current global warming?',
    opts: [
      'Natural changes in Earth’s orbit',
      'Human activities that increase greenhouse gases',
      'Ocean tides',
      'Earth’s rotation',
    ],
    correct: 1, /* 0-indexed */
  },
  {
    q: 'Which greenhouse gas is released in large amounts by burning fossil fuels?',
    opts: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'],
    correct: 2,
  },
  {
    q: 'Which activity can help reduce carbon emissions?',
    opts: [
      'Using public transport',
      'Burning more coal',
      'Wasting electricity',
      'Cutting down forests',
    ],
    correct: 0,
  },
  {
    q: 'What is the greenhouse effect?',
    opts: [
      'Cooling of Earth’s atmosphere',
      'Trapping of heat by gases in the atmosphere',
      'Movement of ocean currents',
      'Formation of clouds',
    ],
    correct: 1,
  },
  {
    q: 'Which of these is a renewable energy source?',
    opts: ['Coal', 'Natural gas', 'Solar energy', 'Petrol'],
    correct: 2,
  },
  {
    q: 'Why are forests important for fighting climate change?',
    opts: [
      'They produce fossil fuels',
      'They absorb carbon dioxide',
      'They increase pollution',
      'They increase global temperature',
    ],
    correct: 1,
  },
  {
    q: 'Which gas is strongly associated with livestock and agriculture?',
    opts: ['Methane', 'Oxygen', 'Hydrogen', 'Helium'],
    correct: 0,
  },
  {
    q: 'Which action helps reduce household energy consumption?',
    opts: [
      'Leaving lights on',
      'Using energy-efficient appliances',
      'Keeping devices running unnecessarily',
      'Increasing electricity waste',
    ],
    correct: 1,
  },
  {
    q: 'What can rising global temperatures contribute to?',
    opts: [
      'Sea-level rise',
      'Lower ocean levels everywhere',
      'Less extreme weather',
      'Permanent cooling',
    ],
    correct: 0,
  },
  {
    q: 'Which is a good individual climate action?',
    opts: [
      'Reduce food waste',
      'Waste water',
      'Use unnecessary single-use plastic',
      'Leave electronics running all day',
    ],
    correct: 0,
  },
];

/* Score messages */
const CQ_MESSAGES = [
  { max: 3, msg: 'Keep learning! Every climate fact you learn can help you make better choices.' },
  { max: 6, msg: 'Good effort! You have a growing understanding of climate change.' },
  { max: 8, msg: 'Great job! You have a strong understanding of climate change.' },
  { max: 10, msg: "Excellent! You're a Climate Champion!" },
];

/* Quiz state */
let cqIndex = 0;   /* current question index (0-9) */
let cqScore = 0;   /* correct answers so far */

/* ── Main initialiser ──────────────────────────────────── */
function initClimateQuiz() {
  const section = document.getElementById('climate-quiz');
  if (!section) return;

  const nextBtn    = document.getElementById('quiz-next-btn');
  const restartBtn = document.getElementById('quiz-restart-btn');

  if (nextBtn)    nextBtn.addEventListener('click', cqNextQuestion);
  if (restartBtn) restartBtn.addEventListener('click', cqRestart);

  /* Wire the old #quiz "Start Quiz" button to the functional quiz.
   * Clicking it resets to Q1/score 0 via cqRestart() which also
   * scrolls smoothly to #climate-quiz. */
  const oldStartBtn = document.getElementById('quiz-start-btn');
  if (oldStartBtn) {
    oldStartBtn.addEventListener('click', (e) => {
      e.preventDefault();   /* stop the href="#climate-quiz" instant jump */
      cqRestart();          /* reset + smooth scroll to #climate-quiz */
    });
  }

  /* Render first question */
  cqRenderQuestion();
}


/* ── Render the current question ───────────────────────── */
function cqRenderQuestion() {
  const data       = CQ_QUESTIONS[cqIndex];
  const total      = CQ_QUESTIONS.length;

  /* Progress bar */
  const fillEl     = document.getElementById('quiz-progress-fill');
  const trackEl    = document.getElementById('quiz-progress');
  const pct        = Math.round(((cqIndex + 1) / total) * 100);
  if (fillEl)  fillEl.style.width = pct + '%';
  if (trackEl) trackEl.setAttribute('aria-valuenow', cqIndex + 1);

  /* Question label */
  const numEl = document.getElementById('quiz-question-number');
  if (numEl) numEl.textContent = `Question ${cqIndex + 1} of ${total}`;

  /* Live score */
  const scoreEl = document.getElementById('cq-score-live');
  if (scoreEl) scoreEl.textContent = `Score: ${cqScore}`;

  /* Question text */
  const qEl = document.getElementById('quiz-question');
  if (qEl) qEl.textContent = data.q;

  /* Build option buttons */
  const optsEl = document.getElementById('quiz-options');
  if (!optsEl) return;
  optsEl.innerHTML = '';

  const letters = ['A', 'B', 'C', 'D'];
  data.opts.forEach((text, i) => {
    const btn = document.createElement('button');
    btn.className  = 'cq-opt-btn';
    btn.id         = `cq-opt-${i}`;
    btn.setAttribute('aria-label', `Option ${letters[i]}: ${text}`);
    btn.innerHTML  =
      `<span class="cq-opt-letter" aria-hidden="true">${letters[i]}</span>` +
      `<span>${text}</span>`;
    btn.addEventListener('click', () => cqSelectAnswer(i));
    optsEl.appendChild(btn);
  });

  /* Hide feedback and Next button */
  const fbEl   = document.getElementById('quiz-feedback');
  const nextEl = document.getElementById('quiz-next-btn');
  if (fbEl)   { fbEl.hidden = true;  fbEl.textContent = ''; fbEl.className = 'cq-feedback'; }
  if (nextEl) nextEl.hidden = true;

  /* Ensure quiz panel visible, results hidden */
  const panel   = document.getElementById('cq-panel');
  const results = document.getElementById('quiz-results');
  if (panel)   panel.hidden   = false;
  if (results) results.hidden = true;
}

/* ── Handle answer selection ──────────────────────────── */
function cqSelectAnswer(selectedIdx) {
  const data     = CQ_QUESTIONS[cqIndex];
  const correct  = data.correct;
  const isRight  = selectedIdx === correct;

  /* Disable all buttons */
  const btns = document.querySelectorAll('.cq-opt-btn');
  btns.forEach(btn => { btn.disabled = true; });

  /* Style selected (wrong) and correct */
  const selectedBtn = document.getElementById(`cq-opt-${selectedIdx}`);
  const correctBtn  = document.getElementById(`cq-opt-${correct}`);

  if (isRight) {
    if (selectedBtn) selectedBtn.classList.add('cq-correct');
    cqScore++;
  } else {
    if (selectedBtn) selectedBtn.classList.add('cq-wrong');
    if (correctBtn)  correctBtn.classList.add('cq-correct');
  }

  /* Update live score */
  const scoreEl = document.getElementById('cq-score-live');
  if (scoreEl) scoreEl.textContent = `Score: ${cqScore}`;

  /* Show feedback */
  const fbEl = document.getElementById('quiz-feedback');
  if (fbEl) {
    fbEl.hidden = false;
    if (isRight) {
      fbEl.className   = 'cq-feedback cq-fb-correct';
      fbEl.textContent = '✅ Correct! Well done.';
    } else {
      const correctLetter = ['A','B','C','D'][correct];
      fbEl.className   = 'cq-feedback cq-fb-wrong';
      fbEl.textContent = `❌ Incorrect. The correct answer is ${correctLetter}: ${data.opts[correct]}.`;
    }
  }

  /* Show Next / Finish button */
  const nextEl = document.getElementById('quiz-next-btn');
  if (nextEl) {
    nextEl.hidden      = false;
    const isLast       = cqIndex === CQ_QUESTIONS.length - 1;
    nextEl.textContent = isLast ? 'See Results →' : 'Next Question →';
  }
}

/* ── Advance to next question or show results ──────────── */
function cqNextQuestion() {
  cqIndex++;
  if (cqIndex < CQ_QUESTIONS.length) {
    cqRenderQuestion();
  } else {
    cqShowResults();
  }
}

/* ── Show final results screen ────────────────────────── */
function cqShowResults() {
  const panel   = document.getElementById('cq-panel');
  const results = document.getElementById('quiz-results');
  if (panel)   panel.hidden   = true;
  if (results) results.hidden = false;

  const total = CQ_QUESTIONS.length;
  const pct   = Math.round((cqScore / total) * 100);

  const scoreEl = document.getElementById('quiz-score');
  const pctEl   = document.getElementById('quiz-percentage');
  const msgEl   = document.getElementById('quiz-message');

  if (scoreEl) scoreEl.textContent = `${cqScore} / ${total}`;
  if (pctEl)   pctEl.textContent   = `${pct}%`;

  const entry = CQ_MESSAGES.find(m => cqScore <= m.max) || CQ_MESSAGES[CQ_MESSAGES.length - 1];
  if (msgEl) msgEl.textContent = entry.msg;

  /* Scroll results into view */
  if (results) results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ── Restart the quiz from the beginning ─────────────── */
function cqRestart() {
  cqIndex = 0;
  cqScore = 0;
  cqRenderQuestion();

  /* Scroll quiz section into view */
  const section = document.getElementById('climate-quiz');
  if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ============================================================
   MYTH VS FACT
   ============================================================ */

function initMythFact() {
  const grid = document.getElementById('mf-grid');
  if (!grid) return;

  /* Wrap ▼ arrows in a span so CSS can rotate them */
  grid.querySelectorAll('.mf-reveal-btn').forEach(btn => {
    btn.innerHTML = `Reveal Fact <span class="mf-arrow" aria-hidden="true">&#9660;</span>`;
  });

  /* Event delegation — one listener for all 6 cards */
  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('.mf-reveal-btn');
    if (!btn) return;
    mfToggle(btn);
  });
}

/* Toggle a single card's explanation */
function mfToggle(btn) {
  const expId = btn.getAttribute('aria-controls');
  const exp   = document.getElementById(expId);
  if (!exp) return;

  const isOpen = btn.getAttribute('aria-expanded') === 'true';

  if (isOpen) {
    /* Collapse */
    exp.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = `Reveal Fact <span class="mf-arrow" aria-hidden="true">&#9660;</span>`;
  } else {
    /* Expand */
    exp.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    btn.innerHTML = `Hide Explanation <span class="mf-arrow" aria-hidden="true">&#9660;</span>`;
  }
}

/* ============================================================
   CLIMATE TIPS — Step 8
   ============================================================ */

function initClimateTips() {
  const grid = document.getElementById('ct-grid');
  if (!grid) return;

  /* Event delegation — one listener covers all 6 cards */
  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('.ct-toggle-btn');
    if (!btn) return;
    ctToggle(btn);
  });
}

/* Toggle a single tip card's list open / closed */
function ctToggle(btn) {
  const listId = btn.getAttribute('aria-controls');
  const list   = document.getElementById(listId);
  if (!list) return;

  const isOpen = btn.getAttribute('aria-expanded') === 'true';

  if (isOpen) {
    /* Collapse */
    list.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = `Show Tips <span class="ct-arrow" aria-hidden="true">&#9660;</span>`;
  } else {
    /* Expand */
    list.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    btn.innerHTML = `Hide Tips <span class="ct-arrow" aria-hidden="true">&#9660;</span>`;
  }
}
