/**
 * =============================================================================
 * ОСНОВНАЯ ЛОГИКА САЙТА:
 * - Плавный переход между страницами (PJAX + кэш + fallback для file://)
 * - Плавное скольжение чёрного овала в верхнем меню
 * - Интерактив всех 6 страниц и отправка формы на почту
 * =============================================================================
 */

(function () {
  'use strict';

  const pageCache = new Map();
  let isTransitioning = false;
  let toastTimer = null;

  const CAMERA_ICON_SVG = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="3"></rect>
      <circle cx="9" cy="10.5" r="1.6"></circle>
      <path d="M21 15.5l-4.5-4.5a1.6 1.6 0 0 0-2.3 0L7 18.2"></path>
    </svg>
  `;

  const INFO_ICON_SVG = `
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
      <circle cx="10" cy="10" r="8"></circle>
      <path d="M10 9v4.5M10 6.5h.01" stroke-linecap="round"></path>
    </svg>
  `;

  const ARROW_UP_RIGHT_SVG = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M7 17L17 7M9 7h8v8"></path>
    </svg>
  `;

  const ARROW_RIGHT_SVG = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6"></path>
    </svg>
  `;

  const CHEVRON_LEFT_SVG = `
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M19 12H5M11 6l-6 6 6 6"></path>
    </svg>
  `;

  const CHEVRON_RIGHT_SVG = `
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6"></path>
    </svg>
  `;

  const CHEVRON_DOWN_SVG = `
    <svg class="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M6 9l6 6 6-6"></path>
    </svg>
  `;

  /* -------------------------------------------------------------------------
     ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
     ------------------------------------------------------------------------- */

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getNavKeyForPage(pageName) {
    if (pageName === 'project') return 'portfolio';
    return pageName || 'home';
  }

  function getNavKeyFromUrl(urlString) {
    try {
      const url = new URL(urlString, window.location.href);
      const file = (url.pathname.split('/').pop() || 'index.html').toLowerCase();
      if (file === '' || file === 'index.html') return 'home';
      if (file === 'about.html') return 'about';
      if (file === 'portfolio.html' || file === 'project.html') return 'portfolio';
      if (file === 'services.html') return 'services';
      if (file === 'contact.html') return 'contact';
      return 'home';
    } catch (_) {
      return 'home';
    }
  }

  function isInternalPageLink(anchor) {
    if (!anchor || !anchor.hasAttribute('href')) return false;
    const rawHref = anchor.getAttribute('href').trim();
    if (
      !rawHref ||
      rawHref.startsWith('#') ||
      rawHref.startsWith('mailto:') ||
      rawHref.startsWith('tel:') ||
      rawHref.startsWith('javascript:')
    ) {
      return false;
    }
    if (anchor.target && anchor.target !== '_self') return false;
    if (anchor.hasAttribute('download')) return false;

    try {
      const url = new URL(rawHref, window.location.href);
      if (url.origin !== window.location.origin) return false;
      const file = (url.pathname.split('/').pop() || 'index.html').toLowerCase();
      const allowed = ['', 'index.html', 'about.html', 'portfolio.html', 'project.html', 'services.html', 'contact.html'];
      return allowed.includes(file);
    } catch (_) {
      return false;
    }
  }

  function renderPhotoSlot(imagePath, placeholderText, variantClass) {
    const cls = variantClass ? `photo-slot ${variantClass}` : 'photo-slot';
    if (imagePath) {
      return `
        <div class="${cls}">
          <img src="${escapeHtml(imagePath)}" alt="${escapeHtml(placeholderText)}" loading="lazy">
        </div>
      `;
    }
    return `
      <div class="${cls}">
        <span class="photo-slot-badge">
          ${CAMERA_ICON_SVG}
          <span>${escapeHtml(placeholderText)}</span>
        </span>
      </div>
    `;
  }

  /* -------------------------------------------------------------------------
     ТОСТ И МОДАЛЬНОЕ ОКНО
     ------------------------------------------------------------------------- */

  function ensureOverlays() {
    if (!document.getElementById('site-toast')) {
      const toast = document.createElement('div');
      toast.id = 'site-toast';
      toast.className = 'site-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }

    if (!document.getElementById('site-modal')) {
      const modal = document.createElement('div');
      modal.id = 'site-modal';
      modal.className = 'site-modal';
      modal.setAttribute('aria-hidden', 'true');
      modal.innerHTML = `
        <div class="site-modal-card" role="dialog" aria-modal="true" aria-labelledby="site-modal-title">
          <div class="site-modal-head">
            <h3 id="site-modal-title" class="site-modal-title"></h3>
            <button type="button" class="mobile-close-btn" id="site-modal-close" aria-label="Закрыть">✕</button>
          </div>
          <div id="site-modal-body" class="site-modal-body"></div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
      modal.querySelector('#site-modal-close').addEventListener('click', closeModal);
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
      });
    }
  }

  function showToast(message) {
    ensureOverlays();
    const toast = document.getElementById('site-toast');
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 3400);
  }

  function openModal(title, htmlContent) {
    ensureOverlays();
    const modal = document.getElementById('site-modal');
    modal.querySelector('#site-modal-title').textContent = title;
    modal.querySelector('#site-modal-body').innerHTML = htmlContent;
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('is-open');
  }

  function closeModal() {
    const modal = document.getElementById('site-modal');
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('is-open');
  }

  /* -------------------------------------------------------------------------
     ЧЁРНЫЙ ОВАЛ НАВИГАЦИИ — ПЛАВНОЕ СКОЛЬЖЕНИЕ
     ------------------------------------------------------------------------- */

  function setActiveNavLinks(navKey) {
    document.querySelectorAll('.nav-link[data-nav]').forEach((link) => {
      const match = link.dataset.nav === navKey;
      link.classList.toggle('is-active', match);
      if (match) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    document.querySelectorAll('.mobile-nav-link[data-nav]').forEach((link) => {
      const match = link.dataset.nav === navKey;
      link.classList.toggle('is-active', match);
    });
  }

  function moveNavPill(navKey, animate) {
    const capsule = document.getElementById('nav-capsule');
    const pill = document.getElementById('nav-pill');
    if (!capsule || !pill) return;

    const target = capsule.querySelector(`.nav-link[data-nav="${navKey}"]`);
    if (!target) return;

    setActiveNavLinks(navKey);

    const left = target.offsetLeft;
    const width = target.offsetWidth;
    if (width === 0) return;

    if (!animate) {
      pill.classList.remove('is-animated');
      pill.style.width = `${width}px`;
      pill.style.transform = `translate3d(${left}px, 0, 0)`;
      pill.classList.add('is-ready');
      // Принудительный reflow, чтобы следующая анимация стартовала отсюда
      void pill.offsetWidth;
      requestAnimationFrame(() => pill.classList.add('is-animated'));
    } else {
      pill.classList.add('is-ready', 'is-animated');
      pill.style.width = `${width}px`;
      pill.style.transform = `translate3d(${left}px, 0, 0)`;
    }
  }

  function initNavPill() {
    const capsule = document.getElementById('nav-capsule');
    const pill = document.getElementById('nav-pill');
    if (!capsule || !pill) return;

    const currentKey = getNavKeyForPage(document.body.dataset.page);
    let prevGeom = null;

    try {
      const raw = sessionStorage.getItem('navPillPrev');
      if (raw) {
        prevGeom = JSON.parse(raw);
        sessionStorage.removeItem('navPillPrev');
      }
    } catch (_) {
      prevGeom = null;
    }

    if (prevGeom && typeof prevGeom.left === 'number' && typeof prevGeom.width === 'number') {
      pill.classList.remove('is-animated');
      pill.style.width = `${prevGeom.width}px`;
      pill.style.transform = `translate3d(${prevGeom.left}px, 0, 0)`;
      pill.classList.add('is-ready');
      void pill.offsetWidth;
      requestAnimationFrame(() => {
        moveNavPill(currentKey, true);
      });
    } else {
      moveNavPill(currentKey, false);
    }

    // Пересчитываем геометрию после загрузки шрифтов и при изменении ширины окна
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        const key = getNavKeyForPage(document.body.dataset.page);
        moveNavPill(key, false);
      });
    }

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => {
        const key = getNavKeyForPage(document.body.dataset.page);
        moveNavPill(key, false);
      });
      ro.observe(capsule);
    } else {
      window.addEventListener('resize', () => {
        const key = getNavKeyForPage(document.body.dataset.page);
        moveNavPill(key, false);
      });
    }
  }

  function saveCurrentPillForFallback() {
    const capsule = document.getElementById('nav-capsule');
    if (!capsule) return;
    const active = capsule.querySelector('.nav-link.is-active');
    if (!active) return;
    try {
      sessionStorage.setItem(
        'navPillPrev',
        JSON.stringify({ left: active.offsetLeft, width: active.offsetWidth })
      );
    } catch (_) {
      // ignore storage errors
    }
  }

  /* -------------------------------------------------------------------------
     ПЛАВНЫЕ МНОГОСТРАНИЧНЫЕ ПЕРЕХОДЫ (PJAX + PREFETCH + FALLBACK)
     ------------------------------------------------------------------------- */

  async function fetchPageHtml(url) {
    const cacheKey = new URL(url, window.location.href).pathname;
    if (pageCache.has(cacheKey)) {
      return pageCache.get(cacheKey);
    }
    const resp = await fetch(url, { credentials: 'same-origin' });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const html = await resp.text();
    pageCache.set(cacheKey, html);
    return html;
  }

  function prefetchPage(url) {
    if (window.location.protocol === 'file:') return;
    const cacheKey = new URL(url, window.location.href).pathname;
    if (pageCache.has(cacheKey)) return;
    fetchPageHtml(url).catch(() => {});
  }

  async function navigateTo(targetUrl, pushHistory = true) {
    if (isTransitioning) return;

    const currentFull = new URL(window.location.href);
    const nextFull = new URL(targetUrl, window.location.href);

    if (
      pushHistory &&
      currentFull.pathname === nextFull.pathname &&
      currentFull.search === nextFull.search
    ) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    closeMobileDrawer();

    const targetNavKey = getNavKeyFromUrl(nextFull.href);
    moveNavPill(targetNavKey, true);

    // Если открыто напрямую через file://, браузер блокирует fetch — используем FLIP-переход через sessionStorage
    if (window.location.protocol === 'file:') {
      saveCurrentPillForFallback();
      const mainEl = document.getElementById('page-main');
      if (mainEl) mainEl.classList.add('is-leaving');
      setTimeout(() => {
        window.location.href = nextFull.href;
      }, 240);
      return;
    }

    isTransitioning = true;
    const mainEl = document.getElementById('page-main');
    if (mainEl) mainEl.classList.add('is-leaving');

    const minExitDelay = new Promise((resolve) => setTimeout(resolve, 210));

    try {
      const [html] = await Promise.all([fetchPageHtml(nextFull.href), minExitDelay]);
      const parser = new DOMParser();
      const nextDoc = parser.parseFromString(html, 'text/html');
      const nextMain = nextDoc.getElementById('page-main');
      if (!nextMain || !mainEl) {
        throw new Error('Missing #page-main container');
      }

      const nextPageName = nextDoc.body.dataset.page || 'home';
      document.title = nextDoc.title || document.title;
      document.body.dataset.page = nextPageName;

      if (pushHistory) {
        window.history.pushState({ url: nextFull.href }, '', nextFull.href);
      }

      mainEl.innerHTML = nextMain.innerHTML;
      mainEl.classList.remove('is-leaving');
      mainEl.classList.add('is-entering');

      window.scrollTo({ top: 0, behavior: 'instant' });
      updateHeaderScrollState();
      moveNavPill(getNavKeyForPage(nextPageName), true);

      initCurrentPage();

      // Плавное проявление новой страницы
      void mainEl.offsetWidth;
      requestAnimationFrame(() => {
        mainEl.classList.remove('is-entering');
      });
    } catch (_) {
      saveCurrentPillForFallback();
      window.location.href = nextFull.href;
    } finally {
      isTransitioning = false;
    }
  }

  function setupGlobalNavigation() {
    document.addEventListener('click', (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      const anchor = e.target.closest('a[href]');
      if (!anchor || !isInternalPageLink(anchor)) return;

      e.preventDefault();
      navigateTo(anchor.getAttribute('href'), true);
    });

    document.addEventListener(
      'pointerenter',
      (e) => {
        const anchor = e.target.closest && e.target.closest('a[href]');
        if (!anchor || !isInternalPageLink(anchor)) return;
        prefetchPage(anchor.getAttribute('href'));
      },
      true
    );

    window.addEventListener('popstate', () => {
      navigateTo(window.location.href, false);
    });
  }

  /* -------------------------------------------------------------------------
     МОБИЛЬНОЕ МЕНЮ И СОСТОЯНИЕ ШАПКИ ПРИ ПРОКРУТКЕ
     ------------------------------------------------------------------------- */

  function closeMobileDrawer() {
    const drawer = document.getElementById('mobile-nav-drawer');
    if (drawer) {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
    }
  }

  function initMobileMenu() {
    const openBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('mobile-close-btn');
    const drawer = document.getElementById('mobile-nav-drawer');
    if (!openBtn || !drawer) return;

    openBtn.addEventListener('click', () => {
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeMobileDrawer);
    }

    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) closeMobileDrawer();
    });
  }

  function updateHeaderScrollState() {
    const header = document.getElementById('site-header');
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 18);
  }

  /* -------------------------------------------------------------------------
     ГИДРАЦИЯ КОНТАКТОВ И СОЦСЕТЕЙ ИЗ SITE_CONFIG
     ------------------------------------------------------------------------- */

  function hydrateContacts() {
    const cfg = window.SITE_CONFIG;
    if (!cfg) return;

    document.querySelectorAll('[data-contact-key]').forEach((el) => {
      const key = el.dataset.contactKey;
      const item = cfg.contacts && cfg.contacts[key];
      if (!item) return;

      el.setAttribute('href', item.href);
      const labelEl = el.querySelector('.contact-label');
      if (labelEl) labelEl.textContent = item.label;

      if (item.href && item.href.startsWith('http')) {
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');
      }

      if (!el.dataset.boundPlaceholder) {
        el.dataset.boundPlaceholder = '1';
        el.addEventListener('click', (e) => {
          const href = el.getAttribute('href') || '';
          if (href.startsWith('#')) {
            e.preventDefault();
            showToast(
              `${item.placeholderHint || 'Место для ссылки'} — укажите реальный URL в файле assets/js/data.js`
            );
          }
        });
      }
    });

    document.querySelectorAll('[data-social-key]').forEach((el) => {
      const key = el.dataset.socialKey;
      const item = cfg.socials && cfg.socials[key];
      if (!item) return;

      el.setAttribute('href', item.href);
      el.setAttribute('title', item.title);
      if (item.href && item.href.startsWith('http')) {
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');
      }

      if (!el.dataset.boundPlaceholder) {
        el.dataset.boundPlaceholder = '1';
        el.addEventListener('click', (e) => {
          const href = el.getAttribute('href') || '';
          if (href.startsWith('#')) {
            e.preventDefault();
            showToast(`Место для ссылки «${item.title}» — вставьте её в assets/js/data.js`);
          }
        });
      }
    });
  }

  /* -------------------------------------------------------------------------
     ИНИЦИАЛИЗАЦИЯ СТРАНИЦЫ 1: ГЛАВНАЯ (index.html)
     ------------------------------------------------------------------------- */

  function initHomePage() {
    const projectsGrid = document.getElementById('home-projects-grid');
    if (projectsGrid && Array.isArray(window.PROJECTS)) {
      projectsGrid.innerHTML = window.PROJECTS.slice(0, 4)
        .map((project, idx) => {
          const coverImg = (project.slides && project.slides[0] && project.slides[0].image) || '';
          const placeholder = project.coverPlaceholder || `Место для фото проекта ${idx + 1}`;
          return `
            <a href="project.html?id=${encodeURIComponent(project.id)}" class="home-project-card" aria-label="Открыть проект ${escapeHtml(project.title)}">
              <div class="home-project-visual">
                <span class="home-project-badge">${escapeHtml(project.badge)}</span>
                ${renderPhotoSlot(coverImg, placeholder)}
              </div>
              <div class="home-project-footer">
                <div>
                  <h2 class="home-project-name">${escapeHtml(project.title)}</h2>
                  <div class="home-project-tools">
                    ${INFO_ICON_SVG}
                    <span>${escapeHtml(project.tools)}</span>
                  </div>
                </div>
                <span class="circle-arrow-btn" aria-hidden="true">${ARROW_UP_RIGHT_SVG}</span>
              </div>
            </a>
          `;
        })
        .join('');
    }

    // Слайдер отзывов
    const testimonials = window.TESTIMONIALS || [];
    const bodyEl = document.getElementById('testimonial-body');
    const quoteEl = document.getElementById('testimonial-quote');
    const authorEl = document.getElementById('testimonial-author');
    const roleEl = document.getElementById('testimonial-role');
    const ratingEl = document.getElementById('testimonial-rating-value');
    const avatarEl = document.getElementById('testimonial-avatar');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');

    if (testimonials.length && quoteEl) {
      let currentIdx = 0;

      const renderTestimonial = (index, animate) => {
        const item = testimonials[index];
        const apply = () => {
          quoteEl.textContent = item.quote;
          authorEl.textContent = item.author;
          roleEl.textContent = item.role;
          ratingEl.textContent = item.rating;
          if (item.avatar) {
            avatarEl.innerHTML = `<img src="${escapeHtml(item.avatar)}" alt="${escapeHtml(item.author)}">`;
          } else {
            const initials = item.author
              .split(' ')
              .map((w) => w[0] || '')
              .join('')
              .slice(0, 2)
              .toUpperCase();
            avatarEl.textContent = initials;
          }
        };

        if (animate && bodyEl) {
          bodyEl.classList.add('is-switching');
          setTimeout(() => {
            apply();
            bodyEl.classList.remove('is-switching');
          }, 200);
        } else {
          apply();
        }
      };

      renderTestimonial(0, false);

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          currentIdx = (currentIdx - 1 + testimonials.length) % testimonials.length;
          renderTestimonial(currentIdx, true);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          currentIdx = (currentIdx + 1) % testimonials.length;
          renderTestimonial(currentIdx, true);
        });
      }
    }
  }

  /* -------------------------------------------------------------------------
     ИНИЦИАЛИЗАЦИЯ СТРАНИЦЫ 2: ОБО МНЕ (about.html)
     ------------------------------------------------------------------------- */

  function initAboutPage() {
    const photos = (window.SITE_CONFIG && window.SITE_CONFIG.aboutPhotos) || {};

    const portraitSlot = document.getElementById('about-portrait-slot');
    if (portraitSlot) {
      portraitSlot.innerHTML = renderPhotoSlot(
        photos.portrait || '',
        photos.portraitLabel || 'Место для фото (портрет)',
        'photo-slot--dark'
      );
    }

    const sidePhotoSlot = document.getElementById('about-side-photo-slot');
    if (sidePhotoSlot) {
      sidePhotoSlot.innerHTML = renderPhotoSlot(
        photos.lifestyle || '',
        photos.lifestyleLabel || 'Место для фото (обо мне)'
      );
    }

    const resumeBtn = document.getElementById('download-resume-btn');
    if (resumeBtn) {
      resumeBtn.addEventListener('click', () => {
        const resumeUrl = window.SITE_CONFIG && window.SITE_CONFIG.resumeUrl;
        if (resumeUrl) {
          window.open(resumeUrl, '_blank', 'noopener');
          return;
        }
        openModal(
          'Резюме — Булат',
          `
            <p style="margin-top:0"><strong>UI/UX &amp; Brand Designer</strong> · 5+ лет опыта в создании цифровых продуктов.</p>
            <p><strong>Специализация:</strong> дизайн сайтов, UI/UX-проектирование, редизайн, брендинг, графический дизайн, оформление соцсетей.</p>
            <p><strong>Инструменты:</strong> Figma, Adobe Illustrator, Adobe Photoshop, Sketch, Webflow.</p>
            <p><strong>Достижения:</strong> 1 место на конкурсе «Дизайн молодых / Young Design» (2025).</p>
            <p style="font-size:12.5px;color:#5A7A77">Чтобы кнопка сразу скачивала ваш PDF-файл резюме, укажите путь к файлу в <code>SITE_CONFIG.resumeUrl</code> в <code>assets/js/data.js</code>.</p>
            <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:16px">
              <button type="button" class="feedback-btn" onclick="window.print()">Сохранить / распечатать PDF</button>
              <a href="contact.html" class="feedback-btn feedback-btn--ghost" id="modal-go-contact">Обсудить проект</a>
            </div>
          `
        );
        const goContact = document.getElementById('modal-go-contact');
        if (goContact) {
          goContact.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal();
            navigateTo('contact.html', true);
          });
        }
      });
    }
  }

  /* -------------------------------------------------------------------------
     ИНИЦИАЛИЗАЦИЯ СТРАНИЦЫ 3: ПОРТФОЛИО (portfolio.html)
     ------------------------------------------------------------------------- */

  function initPortfolioPage() {
    const grid = document.getElementById('portfolio-grid');
    const filterBar = document.getElementById('portfolio-filters');
    if (!grid) return;

    const projects = window.PROJECTS || [];
    let currentFilter = 'all';

    function renderGrid(filterKey) {
      const list =
        filterKey === 'all'
          ? projects
          : projects.filter((p) => Array.isArray(p.categories) && p.categories.includes(filterKey));

      if (!list.length) {
        grid.innerHTML = `
          <div style="grid-column:1/-1;text-align:center;padding:56px 20px;background:var(--mint-pale);border-radius:36px;">
            <p style="font-family:var(--font-serif-sc);font-size:24px;margin:0">В этой категории скоро появятся проекты</p>
          </div>
        `;
        return;
      }

      grid.innerHTML = list
        .map((project, idx) => {
          const slides =
            project.slides && project.slides.length
              ? project.slides
              : [{ image: '', label: `Место для фото проекта ${idx + 1}` }];

          const slidesHtml = slides
            .map(
              (slide, sIdx) => `
                <div class="portfolio-slide ${sIdx === 0 ? 'is-active' : ''}" data-slide-index="${sIdx}">
                  ${renderPhotoSlot(slide.image, slide.label)}
                </div>
              `
            )
            .join('');

          const dotsHtml = slides
            .map(
              (_, sIdx) => `
                <button
                  type="button"
                  class="portfolio-slide-dot ${sIdx === 0 ? 'is-active' : ''}"
                  data-dot-index="${sIdx}"
                  aria-label="Фото ${sIdx + 1}"
                ></button>
              `
            )
            .join('');

          return `
            <article class="portfolio-card" data-project-id="${escapeHtml(project.id)}" tabindex="0">
              <div class="portfolio-stage">
                <div class="portfolio-slides-track">${slidesHtml}</div>

                <span class="portfolio-slide-counter" data-slide-counter>1 / ${slides.length}</span>

                <button type="button" class="portfolio-arrow portfolio-arrow--prev" data-slide-dir="-1" aria-label="Предыдущее фото">
                  ${CHEVRON_LEFT_SVG}
                </button>
                <button type="button" class="portfolio-arrow portfolio-arrow--next" data-slide-dir="1" aria-label="Следующее фото">
                  ${CHEVRON_RIGHT_SVG}
                </button>

                <a
                  href="project.html?id=${encodeURIComponent(project.id)}"
                  class="portfolio-open-pill"
                  aria-label="Открыть работу ${escapeHtml(project.title)}"
                >
                  <span>Открыть работу</span>
                  <span class="open-pill-circle">${ARROW_RIGHT_SVG}</span>
                </a>

                <div class="portfolio-slide-dots">${dotsHtml}</div>
              </div>

              <div class="portfolio-card-bar">
                <div>
                  <h2 class="portfolio-card-title">${escapeHtml(project.title)}</h2>
                  <div class="portfolio-card-sub">
                    ${INFO_ICON_SVG}
                    <span>${escapeHtml(project.subtitle)}</span>
                  </div>
                </div>
                <a
                  href="project.html?id=${encodeURIComponent(project.id)}"
                  class="portfolio-bar-arrow"
                  aria-label="Перейти к проекту ${escapeHtml(project.title)}"
                >
                  ${ARROW_UP_RIGHT_SVG}
                </a>
              </div>
            </article>
          `;
        })
        .join('');

      // Привязываем карусель фотографий внутри каждой карточки и открытие проекта
      grid.querySelectorAll('.portfolio-card').forEach((card) => {
        const slides = Array.from(card.querySelectorAll('.portfolio-slide'));
        const dots = Array.from(card.querySelectorAll('.portfolio-slide-dot'));
        const counter = card.querySelector('[data-slide-counter]');
        let slideIdx = 0;

        const showSlide = (nextIdx) => {
          slideIdx = (nextIdx + slides.length) % slides.length;
          slides.forEach((s, i) => s.classList.toggle('is-active', i === slideIdx));
          dots.forEach((d, i) => d.classList.toggle('is-active', i === slideIdx));
          if (counter) counter.textContent = `${slideIdx + 1} / ${slides.length}`;
        };

        card.querySelectorAll('[data-slide-dir]').forEach((btn) => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showSlide(slideIdx + Number(btn.dataset.slideDir));
          });
        });

        dots.forEach((dot) => {
          dot.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showSlide(Number(dot.dataset.dotIndex));
          });
        });

        // Клик по самой карточке: на тач-устройстве первый тап подсвечивает карточку голубым, второй открывает; на десктопе фиксирует голубую подсветку и плавно открывает проект
        card.addEventListener('click', (e) => {
          if (e.target.closest('a, button')) {
            if (e.target.closest('a')) {
              card.classList.add('is-highlighted');
            }
            return;
          }
          const isTouch = window.matchMedia('(hover: none)').matches;
          if (isTouch && !card.classList.contains('is-highlighted')) {
            grid.querySelectorAll('.portfolio-card.is-highlighted').forEach((c) => {
              c.classList.remove('is-highlighted');
            });
            card.classList.add('is-highlighted');
            return;
          }
          card.classList.add('is-highlighted');
          const projectId = card.dataset.projectId;
          navigateTo(`project.html?id=${encodeURIComponent(projectId)}`, true);
        });

        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            if (document.activeElement === card) {
              e.preventDefault();
              navigateTo(`project.html?id=${encodeURIComponent(card.dataset.projectId)}`, true);
            }
          }
        });
      });
    }

    renderGrid(currentFilter);

    if (filterBar) {
      filterBar.querySelectorAll('.filter-pill').forEach((btn) => {
        btn.addEventListener('click', () => {
          const next = btn.dataset.filter || 'all';
          if (next === currentFilter) return;
          currentFilter = next;
          filterBar.querySelectorAll('.filter-pill').forEach((b) => {
            b.classList.toggle('is-active', b === btn);
          });
          renderGrid(currentFilter);
        });
      });
    }
  }

  /* -------------------------------------------------------------------------
     ИНИЦИАЛИЗАЦИЯ СТРАНИЦЫ 4: ВНУТРИ ПРОЕКТА (project.html)
     ------------------------------------------------------------------------- */

  function initProjectPage() {
    const root = document.getElementById('project-detail-root');
    if (!root || !Array.isArray(window.PROJECTS)) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id') || '1';
    const project = window.PROJECTS.find((p) => String(p.id) === String(id)) || window.PROJECTS[0];
    if (!project) return;

    document.title = `${project.title} — Портфолио`;

    const titleEl = document.getElementById('project-title');
    const clientEl = document.getElementById('project-client');
    const typeEl = document.getElementById('project-type');
    const yearEl = document.getElementById('project-year');
    const linkEl = document.getElementById('project-link');
    const mediaEl = document.getElementById('project-hero-media');
    const galleryEl = document.getElementById('project-gallery-strip');
    const contextEl = document.getElementById('project-context');
    const problemEl = document.getElementById('project-problem');
    const solutionEl = document.getElementById('project-solution');

    if (titleEl) titleEl.textContent = project.title;
    if (clientEl) clientEl.textContent = project.client;
    if (typeEl) typeEl.textContent = project.type;
    if (yearEl) yearEl.textContent = project.year;
    if (contextEl) contextEl.textContent = project.context;
    if (problemEl) problemEl.textContent = project.problem;
    if (solutionEl) solutionEl.textContent = project.solution;

    if (linkEl) {
      linkEl.textContent = project.linkLabel || 'LINK VIEW';
      if (project.linkUrl) {
        linkEl.setAttribute('href', project.linkUrl);
        linkEl.setAttribute('target', '_blank');
        linkEl.setAttribute('rel', 'noopener noreferrer');
      } else {
        linkEl.setAttribute('href', '#project-link');
        linkEl.addEventListener('click', (e) => {
          e.preventDefault();
          showToast('Место для внешней ссылки на проект — добавьте linkUrl в assets/js/data.js');
        });
      }
    }

    const slides =
      project.slides && project.slides.length
        ? project.slides
        : [{ image: project.bannerImage || '', label: project.bannerPlaceholder || `Место для фото проекта ${project.id}` }];

    const renderHeroMedia = (slideIdx) => {
      if (!mediaEl) return;
      if (slideIdx === 0 && project.bannerImage) {
        mediaEl.innerHTML = renderPhotoSlot(project.bannerImage, project.bannerPlaceholder);
      } else {
        const s = slides[slideIdx] || slides[0];
        const label = slideIdx === 0 ? project.bannerPlaceholder || s.label : s.label;
        mediaEl.innerHTML = renderPhotoSlot(s.image, label);
      }
    };

    renderHeroMedia(0);

    if (galleryEl && slides.length > 1) {
      galleryEl.innerHTML = slides
        .map(
          (slide, idx) => `
            <button type="button" class="project-gallery-thumb ${idx === 0 ? 'is-active' : ''}" data-thumb-idx="${idx}" aria-label="${escapeHtml(slide.label)}">
              ${renderPhotoSlot(slide.image, slide.label)}
            </button>
          `
        )
        .join('');

      galleryEl.querySelectorAll('.project-gallery-thumb').forEach((thumb) => {
        thumb.addEventListener('click', () => {
          const idx = Number(thumb.dataset.thumbIdx);
          galleryEl.querySelectorAll('.project-gallery-thumb').forEach((t, i) => {
            t.classList.toggle('is-active', i === idx);
          });
          renderHeroMedia(idx);
        });
      });
    }
  }

  /* -------------------------------------------------------------------------
     ИНИЦИАЛИЗАЦИЯ СТРАНИЦЫ 5: УСЛУГИ (services.html)
     ------------------------------------------------------------------------- */

  function initServicesPage() {
    const servicesGrid = document.getElementById('services-grid');
    if (servicesGrid && Array.isArray(window.SERVICES)) {
      servicesGrid.innerHTML = window.SERVICES.map(
        (srv) => `
          <a href="contact.html?service=${encodeURIComponent(srv.projectType)}" class="service-card" title="Обсудить услугу «${escapeHtml(srv.title)}»">
            <div class="service-card-head">
              <h2 class="service-card-title">${escapeHtml(srv.title)}</h2>
            </div>
            <div class="service-card-body">
              <ul class="service-list">
                ${srv.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
              </ul>
              <div class="service-card-foot">
                <span class="service-duration">${escapeHtml(srv.duration)}</span>
                <span class="service-price">${escapeHtml(srv.price)}</span>
              </div>
            </div>
          </a>
        `
      ).join('');
    }

    const faqList = document.getElementById('faq-list');
    if (faqList && Array.isArray(window.FAQ_ITEMS)) {
      faqList.innerHTML = window.FAQ_ITEMS.map(
        (item, idx) => `
          <div class="faq-item ${item.openByDefault ? 'is-open' : ''}">
            <button
              type="button"
              class="faq-trigger"
              aria-expanded="${item.openByDefault ? 'true' : 'false'}"
              aria-controls="faq-panel-${idx}"
            >
              <span class="faq-question-text">${escapeHtml(item.question)}</span>
              ${CHEVRON_DOWN_SVG}
            </button>
            <div class="faq-panel" id="faq-panel-${idx}">
              <div class="faq-panel-inner">
                <p class="faq-answer-text">${escapeHtml(item.answer)}</p>
              </div>
            </div>
          </div>
        `
      ).join('');

      faqList.querySelectorAll('.faq-trigger').forEach((trigger) => {
        trigger.addEventListener('click', () => {
          const item = trigger.closest('.faq-item');
          const wasOpen = item.classList.contains('is-open');

          faqList.querySelectorAll('.faq-item').forEach((el) => {
            el.classList.remove('is-open');
            const btn = el.querySelector('.faq-trigger');
            if (btn) btn.setAttribute('aria-expanded', 'false');
          });

          if (!wasOpen) {
            item.classList.add('is-open');
            trigger.setAttribute('aria-expanded', 'true');
          }
        });
      });
    }
  }

  /* -------------------------------------------------------------------------
     ИНИЦИАЛИЗАЦИЯ СТРАНИЦЫ 6: КУПИТЬ / ФОРМА НА ПОЧТУ (contact.html)
     ------------------------------------------------------------------------- */

  function initContactPage() {
    const form = document.getElementById('project-contact-form');
    const selectWrap = document.getElementById('project-type-select');
    if (!form || !selectWrap) return;

    const trigger = document.getElementById('select-trigger');
    const selectedLabel = document.getElementById('select-value-label');
    const hiddenInput = document.getElementById('project-type-input');
    const otherWrap = document.getElementById('custom-other-wrap');
    const otherInput = document.getElementById('custom-other-input');
    const submitBtn = document.getElementById('contact-submit-btn');
    const feedback = document.getElementById('form-feedback');

    const applySelection = (val) => {
      selectedLabel.textContent = val;
      hiddenInput.value = val;
      selectWrap.querySelectorAll('.custom-select-option').forEach((opt) => {
        opt.classList.toggle('is-selected', opt.dataset.value === val);
      });
      if (otherWrap) {
        const isOther = val === 'Другое';
        otherWrap.classList.toggle('is-visible', isOther);
        if (otherInput) otherInput.required = isOther;
      }
    };

    // Если пришли со страницы «Услуги», подставляем выбранную услугу
    const serviceParam = new URLSearchParams(window.location.search).get('service');
    if (serviceParam) {
      applySelection(serviceParam);
    }

    trigger.addEventListener('click', () => {
      const open = selectWrap.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    selectWrap.querySelectorAll('.custom-select-option').forEach((opt) => {
      opt.addEventListener('click', () => {
        applySelection(opt.dataset.value);
        selectWrap.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      });
    });

    // Закрытие выпадающего списка при клике вне его
    const outsideHandler = (e) => {
      if (!document.body.contains(selectWrap)) {
        document.removeEventListener('click', outsideHandler);
        return;
      }
      if (!selectWrap.contains(e.target)) {
        selectWrap.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    };
    document.addEventListener('click', outsideHandler);

    // Отправка заявки на почту владельца (FormSubmit AJAX + умный mailto-фолбэк)
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const ownerEmail = (window.SITE_CONFIG && window.SITE_CONFIG.email) || 'bulithonor@gmail.com';
      const nameInput = form.querySelector('#field-name');
      const emailInput = form.querySelector('#field-email');
      const messageInput = form.querySelector('#field-message');

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const chosenType = hiddenInput.value || 'Веб-сайт';
      const finalType =
        chosenType === 'Другое' && otherInput && otherInput.value.trim()
          ? `Другое: ${otherInput.value.trim()}`
          : chosenType;
      const budget = form.querySelector('#field-budget').value.trim() || 'Не указан';
      const message = messageInput.value.trim();

      if (!name) {
        showToast('Пожалуйста, укажите ваше имя');
        nameInput.focus();
        return;
      }

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Пожалуйста, введите корректный Email для связи');
        emailInput.focus();
        return;
      }

      if (chosenType === 'Другое' && otherInput && !otherInput.value.trim()) {
        showToast('Укажите тип вашего проекта');
        otherInput.focus();
        return;
      }

      if (!message) {
        showToast('Опишите хотя бы кратко ваши пожелания по проекту');
        messageInput.focus();
        return;
      }

      const plainTextBody = [
        `Имя: ${name}`,
        `Email для связи: ${email}`,
        `Тип проекта: ${finalType}`,
        `Бюджет: ${budget}`,
        '',
        'Пожелания по проекту:',
        message
      ].join('\n');

      const mailtoHref = `mailto:${encodeURIComponent(ownerEmail)}?subject=${encodeURIComponent(
        `Новая заявка с портфолио: ${finalType} (${name})`
      )}&body=${encodeURIComponent(plainTextBody)}`;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправляем...';
      feedback.classList.remove('is-visible');

      try {
        const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(ownerEmail)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            name,
            email,
            project_type: finalType,
            budget,
            message,
            _subject: `Новая заявка с сайта: ${finalType} — ${name}`,
            _template: 'table',
            _captcha: 'false'
          })
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok || data.success === 'false') {
          throw new Error(data.message || 'Ошибка отправки');
        }

        form.reset();
        applySelection('Веб-сайт');
        feedback.innerHTML = `
          <div class="form-feedback-title">Заявка успешно отправлена!</div>
          <div>Спасибо, ${escapeHtml(name)}! Ваше сообщение отправлено на <strong>${escapeHtml(ownerEmail)}</strong>. Я свяжусь с вами в течение 24 часов.</div>
        `;
        feedback.classList.add('is-visible');
      } catch (_) {
        feedback.innerHTML = `
          <div class="form-feedback-title">Почти готово — отправьте письмо в 1 клик</div>
          <div>Сервис мгновенной отправки сейчас недоступен из этого окружения, но ваша заявка уже сформирована для <strong>${escapeHtml(ownerEmail)}</strong>:</div>
          <div class="form-feedback-actions">
            <a href="${mailtoHref}" class="feedback-btn">Открыть в почтовом клиенте</a>
            <button type="button" class="feedback-btn feedback-btn--ghost" id="copy-inquiry-btn">Скопировать текст заявки</button>
          </div>
        `;
        feedback.classList.add('is-visible');

        const copyBtn = document.getElementById('copy-inquiry-btn');
        if (copyBtn) {
          copyBtn.addEventListener('click', () => {
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(plainTextBody).then(() => {
                showToast('Текст заявки скопирован в буфер обмена');
              });
            } else {
              showToast(`Отправьте заявку на ${ownerEmail}`);
            }
          });
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить';
      }
    });
  }

  /* -------------------------------------------------------------------------
     ДИСПЕТЧЕР ИНИЦИАЛИЗАЦИИ ТЕКУЩЕЙ СТРАНИЦЫ
     ------------------------------------------------------------------------- */

  function initCurrentPage() {
    const page = document.body.dataset.page || 'home';
    hydrateContacts();

    if (page === 'home') initHomePage();
    else if (page === 'about') initAboutPage();
    else if (page === 'portfolio') initPortfolioPage();
    else if (page === 'project') initProjectPage();
    else if (page === 'services') initServicesPage();
    else if (page === 'contact') initContactPage();
  }

  /* -------------------------------------------------------------------------
     ЗАПУСК ПРИЛОЖЕНИЯ
     ------------------------------------------------------------------------- */

  document.addEventListener('DOMContentLoaded', () => {
    ensureOverlays();
    initNavPill();
    initMobileMenu();
    setupGlobalNavigation();
    updateHeaderScrollState();
    window.addEventListener('scroll', updateHeaderScrollState, { passive: true });
    initCurrentPage();
  });
})();
