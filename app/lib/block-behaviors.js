// app/lib/block-behaviors.js
// Small helpers to initialize interactive behaviors for the static HTML output.

export function initHeaderMenus(root = document) {
  // Find toggles and wire open/close similar to the inline scripts used before.
  const toggles = Array.from(root.querySelectorAll('[aria-label="Abrir menú"], [aria-label="Abrir menú"]'));
  toggles.forEach(toggle => {
    try {
      const menuId = toggle.getAttribute('aria-controls');
      const menu = menuId ? document.getElementById(menuId) : toggle.nextElementSibling;
      const close = menu ? menu.querySelector('[aria-label="Cerrar menú"], [aria-label="Cerrar"]') : null;
      const overlay = (() => {
        const id = 'global-header-overlay';
        let el = document.getElementById(id);
        if (!el) {
          el = document.createElement('div'); el.id = id; el.style.position = 'fixed'; el.style.inset = '0'; el.style.background = 'rgba(0,0,0,0.35)'; el.style.zIndex = '49'; el.style.display = 'none'; document.body.appendChild(el);
        }
        return el;
      })();

      function open() {
        if (!menu) return;
        menu.style.display = 'block';
        overlay.style.display = 'block';
        toggle.setAttribute('aria-expanded', 'true');
        setTimeout(()=>{ menu.querySelector('button, a')?.focus(); }, 60);
      }
      function closeMenu(){ if(!menu) return; menu.style.display='none'; overlay.style.display='none'; toggle.setAttribute('aria-expanded','false'); }

      toggle.addEventListener('click', function(e){ const expanded = toggle.getAttribute('aria-expanded') === 'true'; if(expanded) closeMenu(); else open(); });
      if (close) close.addEventListener('click', closeMenu);
      overlay.addEventListener('click', closeMenu);
      document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeMenu(); });
    } catch(e){/* no-op */}
  });
}

export function initCarousels(root = document) {
  const containers = Array.from(root.querySelectorAll('[data-block-type="catalog"] .flex.overflow-x-auto, [data-block-type="catalog"] .snap-x'));
  containers.forEach(container => {
    const prev = container.parentElement?.querySelector('[aria-label="Anterior"]');
    const next = container.parentElement?.querySelector('[aria-label="Siguiente"]');
    if (!container || !prev || !next) return;
    const scrollAmount = (container.querySelector('a')?.clientWidth || 320) + 32;
    function update(){ const left = container.scrollLeft; prev.disabled = left <= 0; next.disabled = left >= container.scrollWidth - container.clientWidth - 1; }
    prev.addEventListener('click', () => container.scrollBy({ left: -scrollAmount, behavior: 'smooth' }));
    next.addEventListener('click', () => container.scrollBy({ left: scrollAmount, behavior: 'smooth' }));
    container.addEventListener('scroll', update, { passive: true });
    update();
  });
}

export function initAll(root = document){ try{ initHeaderMenus(root); initCarousels(root); }catch(e){} }
