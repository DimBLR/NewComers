// Mobile nav drawer toggle
const burger = document.getElementById('burgerBtn');
const drawer = document.getElementById('navbarDrawer');

function closeDrawer() {
  drawer.classList.remove('open');
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
}

if (burger && drawer) {
  burger.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
  });
  drawer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });
}

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el) => io.observe(el));

// Library search + category filter (data-driven, see js/library-data.js)
const librarySearch = document.getElementById('librarySearch');
const libraryTabs = document.getElementById('libraryTabs');
const libraryResults = document.getElementById('libraryResults');

if (librarySearch && libraryTabs && libraryResults && typeof LIBRARY !== 'undefined') {
  const countEl = document.getElementById('libraryCount');
  const emptyEl = document.getElementById('libraryEmpty');
  const totalCount = LIBRARY.length;
  const CATEGORY_LABEL = { series: 'Сериалы', movies: 'Фильмы', anime: 'Аниме' };
  const CATEGORY_ORDER = ['series', 'movies', 'anime'];
  const GENERIC_POSTERS = ['poster-g1', 'poster-g2', 'poster-g3', 'poster-g4', 'poster-g5', 'poster-g6'];
  let activeFilter = 'all';

  function cardHTML(item) {
    const badge = item.badge ? `<span class="project-badge">${item.badge}</span>` : '';
    const posterClass = item.poster ? '' : (item.posterClass || GENERIC_POSTERS[LIBRARY.indexOf(item) % GENERIC_POSTERS.length]);
    const img = item.poster ? `<img src="${item.poster}" alt="${item.title}" loading="lazy">` : '';
    const posterAttrs = item.poster ? '' : ` data-title="${item.title}" data-initial="${item.title.trim().charAt(0).toUpperCase()}"`;
    return `<a class="project-card library-card" href="project.html?slug=${item.slug}">` +
      `<div class="project-poster ${posterClass}"${posterAttrs}>${img}${badge}</div>` +
      `<div class="project-body"><h3>${item.title}</h3><p>${item.meta}</p></div></a>`;
  }

  function render() {
    const query = librarySearch.value.trim().toLowerCase();
    const filtered = LIBRARY.filter((item) => {
      const matchesTab = activeFilter === 'all' || item.category === activeFilter;
      const matchesQuery = query === '' || item.title.toLowerCase().includes(query);
      return matchesTab && matchesQuery;
    });

    libraryResults.innerHTML = CATEGORY_ORDER.map((cat) => {
      const items = filtered.filter((i) => i.category === cat);
      if (items.length === 0) return '';
      return `<div class="library-group" data-category="${cat}">` +
        `<h3 class="library-group-title">${CATEGORY_LABEL[cat]}</h3>` +
        `<div class="projects-grid library-grid">${items.map(cardHTML).join('')}</div></div>`;
    }).join('');

    countEl.textContent = `Показано ${filtered.length} из ${totalCount}`;
    emptyEl.classList.toggle('show', filtered.length === 0);
  }

  librarySearch.addEventListener('input', render);
  libraryTabs.querySelectorAll('.library-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      libraryTabs.querySelectorAll('.library-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      activeFilter = tab.dataset.filter;
      render();
    });
  });

  render();
}

// News slider (home page): auto-rotating feature panel + dots
const sliderFeature = document.getElementById('sliderFeature');
const sliderList = document.getElementById('sliderList');
const sliderDots = document.getElementById('sliderDots');

if (sliderFeature && sliderList && sliderDots) {
  const items = Array.from(sliderList.querySelectorAll('.slider-item'));
  const dots = Array.from(sliderDots.querySelectorAll('.slider-dot'));
  const badgeEl = document.getElementById('sliderBadge');
  const titleEl = document.getElementById('sliderTitle');
  let current = 0;
  let timer;

  function showSlide(index) {
    current = index;
    const item = items[index];
    sliderFeature.href = item.getAttribute('href');
    sliderFeature.className = `slider-feature ${item.dataset.poster}`;
    badgeEl.textContent = item.dataset.badge;
    titleEl.textContent = item.dataset.title;
    items.forEach((el, i) => el.classList.toggle('active', i === index));
    dots.forEach((el, i) => el.classList.toggle('active', i === index));
  }

  function restartAutoplay() {
    clearInterval(timer);
    timer = setInterval(() => showSlide((current + 1) % items.length), 6000);
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      showSlide(Number(dot.dataset.index));
      restartAutoplay();
    });
  });

  restartAutoplay();
}
