// ───────────────────────────────────────────
// PROJECTS PAGE – projects.js
// ───────────────────────────────────────────

// Filter functionality
(function () {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.project-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      cards.forEach((card, i) => {
        const category = card.getAttribute('data-category');
        const match = filter === 'all' || category === filter;

        if (match) {
          card.classList.remove('hidden');
          card.style.animationDelay = `${i * 0.06}s`;
          card.style.animation = 'none';
          void card.offsetWidth; // force reflow
          card.style.animation = `fade-in-up 0.35s ease both`;
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();

// Load saved theme
(function () {
  const saved = localStorage.getItem('theme');
  if (saved === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
