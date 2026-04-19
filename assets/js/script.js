    // ── CART ────────────────────────────────────────────
    let cartCount = 0;
    const toast = document.getElementById('cart-toast');
    const cartBtn = document.getElementById('cart-btn');
    const cartBadge = document.getElementById('cart-badge');
 
    function showToast(msg) {
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3200);
    }
 
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        cartCount++;
        const label = btn.getAttribute('aria-label') || '';
        const m = label.match(/Add (.+?) to cart/);
        const name = m ? m[1] : 'Item';
        showToast(`✓ "${name}" added to cart`);
        cartBtn.setAttribute('aria-label', `View cart — ${cartCount} item${cartCount !== 1 ? 's' : ''}`);
        cartBadge.textContent = cartCount;
        cartBadge.classList.add('visible');
      });
    });
 
    // ── FILTER BUTTONS ───────────────────────────────────
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('.products-filter').querySelectorAll('.filter-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      });
    });
 
   // ── TAB BUTTONS ──────────────────────────────────────
const instrCards = document.querySelectorAll('.instr-card');

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.instr-tabs').querySelectorAll('.tab-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    const filter = btn.getAttribute('aria-controls');

    instrCards.forEach(card => {
      if (filter === 'instr-all' || card.dataset.section === filter) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
});
 
    // ── FORM VALIDATION ──────────────────────────────────
    function handleSubmit(e) {
      e.preventDefault();
      let firstError = null;
 
      const fields = [
        { id: 'fn',    errId: 'fn-error',    check: v => v.trim() !== '' },
        { id: 'email', errId: 'email-error',  check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
        { id: 'level', errId: 'level-error',  check: v => v !== '' },
      ];
 
      let valid = true;
      fields.forEach(f => {
        const input = document.getElementById(f.id);
        const errEl = document.getElementById(f.errId);
        const ok = f.check(input.value);
        errEl.classList.toggle('show', !ok);
        input.setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (!ok && !firstError) firstError = input;
        if (!ok) valid = false;
      });
 
      if (!valid) { firstError.focus(); return; }
 
      document.getElementById('newsletter-form').style.display = 'none';
      document.getElementById('form-success').style.display = 'block';
    }