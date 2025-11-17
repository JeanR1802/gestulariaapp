(function(){
  // Expose an object to initialize behaviors used by server-rendered pages
  function initHeaderMenus(root){
    // simple adaptation of behavior logic
    const toggles = Array.from((root || document).querySelectorAll('[aria-label="Abrir menú"], button[aria-label="Abrir menú"]'));
    toggles.forEach(toggle => {
      try{
        const menuId = toggle.getAttribute('aria-controls');
        const menu = menuId ? document.getElementById(menuId) : toggle.nextElementSibling;
        const close = menu ? menu.querySelector('[aria-label="Cerrar menú"], [aria-label="Cerrar"]') : null;
        const overlayId = 'public-header-overlay';
        let overlay = document.getElementById(overlayId);
        if(!overlay){ overlay = document.createElement('div'); overlay.id = overlayId; overlay.style.position='fixed'; overlay.style.inset='0'; overlay.style.background='rgba(0,0,0,0.35)'; overlay.style.zIndex='49'; overlay.style.display='none'; document.body.appendChild(overlay); }
        function open(){ if(!menu) return; menu.style.display='block'; overlay.style.display='block'; toggle.setAttribute('aria-expanded','true'); setTimeout(()=>{ menu.querySelector('button,a')?.focus(); },60); }
        function closeMenu(){ if(!menu) return; menu.style.display='none'; overlay.style.display='none'; toggle.setAttribute('aria-expanded','false'); }
        toggle.addEventListener('click', function(){ const expanded = toggle.getAttribute('aria-expanded') === 'true'; if(expanded) closeMenu(); else open(); });
        if(close) close.addEventListener('click', closeMenu);
        overlay.addEventListener('click', closeMenu);
        document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeMenu(); });
      }catch(e){}
    });
  }

  function initCarousels(root){
    const containers = Array.from((root || document).querySelectorAll('[data-block-type="catalog"] .flex.overflow-x-auto, [data-block-type="catalog"] .snap-x'));
    containers.forEach(container => {
      const prev = container.parentElement?.querySelector('[aria-label="Anterior"]');
      const next = container.parentElement?.querySelector('[aria-label="Siguiente"]');
      if(!container || !prev || !next) return;
      const scrollAmount = (container.querySelector('a')?.clientWidth || 320) + 32;
      function update(){ const left = container.scrollLeft; prev.disabled = left <= 0; next.disabled = left >= container.scrollWidth - container.clientWidth -1; }
      prev.addEventListener('click', ()=> container.scrollBy({ left: -scrollAmount, behavior: 'smooth' }));
      next.addEventListener('click', ()=> container.scrollBy({ left: scrollAmount, behavior: 'smooth' }));
      container.addEventListener('scroll', update, { passive: true });
      update();
    });
  }

  window.blockBehaviors = { initHeaderMenus: initHeaderMenus, initCarousels: initCarousels, initAll: function(root){ initHeaderMenus(root); initCarousels(root); } };
})();
