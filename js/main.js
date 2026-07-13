// Header background on scroll
const header = document.getElementById('siteHeader');
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
};
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile nav toggle
const burger = document.getElementById('burgerBtn');
const nav = document.getElementById('mainNav');

burger.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', String(isOpen));
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  });
});

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

// Library search + category filter
const librarySearch = document.getElementById('librarySearch');
const libraryTabs = document.getElementById('libraryTabs');

if (librarySearch && libraryTabs) {
  const rows = Array.from(document.querySelectorAll('.library-row'));
  const groups = Array.from(document.querySelectorAll('.library-group'));
  const countEl = document.getElementById('libraryCount');
  const emptyEl = document.getElementById('libraryEmpty');
  const totalCount = rows.length;
  let activeFilter = 'all';

  const applyFilters = () => {
    const query = librarySearch.value.trim().toLowerCase();
    let visibleCount = 0;

    groups.forEach((group) => {
      const matchesTab = activeFilter === 'all' || group.dataset.category === activeFilter;
      let groupVisible = 0;

      group.querySelectorAll('.library-row').forEach((row) => {
        const title = row.querySelector('.library-row-title').textContent.toLowerCase();
        const show = matchesTab && (query === '' || title.includes(query));
        row.classList.toggle('is-hidden', !show);
        if (show) { groupVisible += 1; visibleCount += 1; }
      });

      group.style.display = groupVisible > 0 ? '' : 'none';
    });

    countEl.textContent = `Показано ${visibleCount} из ${totalCount}`;
    emptyEl.classList.toggle('show', visibleCount === 0);
  };

  librarySearch.addEventListener('input', applyFilters);

  libraryTabs.querySelectorAll('.library-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      libraryTabs.querySelectorAll('.library-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      activeFilter = tab.dataset.filter;
      applyFilters();
    });
  });

  applyFilters();
}
