// ───────────────────────────────────────────
// DEEPAM JHA PORTFOLIO – main.js
// ───────────────────────────────────────────

// Theme toggle
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  document.documentElement.setAttribute('data-theme', current === 'light' ? '' : 'light');
  localStorage.setItem('theme', current === 'light' ? 'dark' : 'light');
}

// Load saved theme
(function () {
  const saved = localStorage.getItem('theme');
  if (saved === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();

// Active nav highlight on scroll
(function () {
  const sections = ['home', 'about', 'skills', 'projects', 'hire', 'education', 'contact'];
  const navLinks = document.querySelectorAll('.nav-item[href^="#"]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
})();

// Staggered skill tag animation
(function () {
  const tags = document.querySelectorAll('.skill-tag');
  tags.forEach((tag, i) => {
    tag.style.animationDelay = `${i * 0.04}s`;
    tag.style.animation = `fade-in-up 0.4s ease both`;
  });
})();

// Smooth hover pulse on avatar
(function () {
  const avatar = document.querySelector('.avatar');
  if (!avatar) return;
  avatar.addEventListener('mouseenter', () => {
    avatar.style.transform = 'scale(1.05) rotate(-2deg)';
    avatar.style.transition = 'transform 0.3s ease';
  });
  avatar.addEventListener('mouseleave', () => {
    avatar.style.transform = '';
  });
})();

console.log('%cDeeam Jha Portfolio', 'font-size:20px;font-weight:900;color:#fff;background:#0a0a0a;padding:8px 16px;border-radius:8px;');
console.log('%cBuilt with ❤ — CSS + Vanilla JS', 'font-size:12px;color:#888;');
