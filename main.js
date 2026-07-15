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

// Staggered skill tag entrance animation
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

// ═══════════════════════════════════════════
//  DRAG-AND-DROP SKILLS
// ═══════════════════════════════════════════
(function () {
  const grid = document.getElementById('skills-grid');
  if (!grid) return;

  let dragSrc = null;          // the tag being dragged
  let ghost = null;            // custom floating ghost element
  let offsetX = 0, offsetY = 0;

  // ── Create custom ghost element ──────────
  function createGhost(tag) {
    const g = document.createElement('div');
    g.className = 'skill-drag-ghost';

    // Clone icon + text
    const icon = tag.querySelector('.skill-icon, .skill-icon-text');
    if (icon) g.appendChild(icon.cloneNode(true));

    const name = tag.getAttribute('data-skill') || tag.textContent.trim();
    const text = document.createTextNode(' ' + name);
    g.appendChild(text);

    document.body.appendChild(g);
    return g;
  }

  // ── Destroy ghost ─────────────────────────
  function removeGhost() {
    if (ghost) { ghost.remove(); ghost = null; }
  }

  // ── Get which half of a tag we're over ───
  function getHalf(tag, clientX) {
    const rect = tag.getBoundingClientRect();
    return clientX < rect.left + rect.width / 2 ? 'before' : 'after';
  }

  // ── Clear all over-indicators ────────────
  function clearIndicators() {
    grid.querySelectorAll('.skill-tag').forEach(t => {
      t.classList.remove('drag-over-before', 'drag-over-after');
    });
  }

  // ── Pointer Down → start drag ─────────────
  grid.addEventListener('pointerdown', (e) => {
    const tag = e.target.closest('.skill-tag');
    if (!tag) return;

    e.preventDefault();
    dragSrc = tag;
    tag.setPointerCapture(e.pointerId);

    const rect = tag.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    // Small delay so it doesn't fire on quick clicks
    setTimeout(() => {
      if (!dragSrc) return;
      tag.classList.add('dragging');
      ghost = createGhost(tag);
      moveGhost(e.clientX, e.clientY);
    }, 80);
  });

  // ── Pointer Move → move ghost + show indicator ──
  function moveGhost(cx, cy) {
    if (!ghost) return;
    ghost.style.left = (cx - offsetX) + 'px';
    ghost.style.top  = (cy - offsetY) + 'px';
  }

  grid.addEventListener('pointermove', (e) => {
    if (!dragSrc) return;
    moveGhost(e.clientX, e.clientY);

    clearIndicators();

    // Find target tag under cursor
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el) return;
    const overTag = el.closest('.skill-tag');
    if (!overTag || overTag === dragSrc) return;

    const half = getHalf(overTag, e.clientX);
    overTag.classList.add(half === 'before' ? 'drag-over-before' : 'drag-over-after');
  });

  // ── Pointer Up → drop ────────────────────
  grid.addEventListener('pointerup', (e) => {
    if (!dragSrc) return;

    dragSrc.classList.remove('dragging');
    clearIndicators();
    removeGhost();

    // Find drop target
    dragSrc.style.pointerEvents = 'none';
    const el = document.elementFromPoint(e.clientX, e.clientY);
    dragSrc.style.pointerEvents = '';

    if (el) {
      const dropTarget = el.closest('.skill-tag');
      if (dropTarget && dropTarget !== dragSrc) {
        const half = getHalf(dropTarget, e.clientX);

        // Re-insert dragSrc before or after dropTarget
        if (half === 'before') {
          grid.insertBefore(dragSrc, dropTarget);
        } else {
          grid.insertBefore(dragSrc, dropTarget.nextSibling);
        }

        // Pop animation on dropped tag
        dragSrc.style.animation = 'none';
        void dragSrc.offsetWidth;
        dragSrc.style.animation = 'skill-drop 0.35s cubic-bezier(0.34,1.56,0.64,1) both';
      }
    }

    dragSrc = null;
  });

  // ── Cancel on pointer leave or cancel ────
  grid.addEventListener('pointercancel', () => {
    if (dragSrc) dragSrc.classList.remove('dragging');
    clearIndicators();
    removeGhost();
    dragSrc = null;
  });

  // ── Inject drop bounce animation ─────────
  const style = document.createElement('style');
  style.textContent = `
    @keyframes skill-drop {
      0%   { transform: scale(0.85) rotate(-4deg); opacity: 0.5; }
      60%  { transform: scale(1.1) rotate(1deg); opacity: 1; }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  // ── "drag me" hint: fade out after first drag ──
  const hint = document.querySelector('.skills-drag-hint');
  grid.addEventListener('pointerdown', () => {
    if (hint) {
      hint.style.transition = 'opacity 0.6s ease';
      hint.style.opacity = '0';
      setTimeout(() => hint.style.display = 'none', 700);
    }
  }, { once: true });

})();

console.log('%cDeeam Jha Portfolio', 'font-size:20px;font-weight:900;color:#fff;background:#0a0a0a;padding:8px 16px;border-radius:8px;');
console.log('%cBuilt with ❤ — CSS + Vanilla JS + Drag & Drop', 'font-size:12px;color:#888;');
