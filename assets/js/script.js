/* ── FAQ ACCORDION ─────────────────────────────────
   Toggles each FAQ item open/closed.
   Only one item can be open at a time.
────────────────────────────────────────────────── */
document.querySelectorAll('.faq-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
 
    // Close all items first
    document.querySelectorAll('.faq-btn').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      document.getElementById(b.getAttribute('aria-controls'))?.classList.remove('open');
    });
 
    // If it wasn't open, open it now
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      document.getElementById(btn.getAttribute('aria-controls'))?.classList.add('open');
    }
  });
});
 
 
/* ── ENROLLMENT FORM VALIDATION ─────────────────────
   Validates required fields on submit, shows inline
   error messages, and moves focus to the first error.
   On success, hides the form and shows confirmation.
────────────────────────────────────────────────── */
function submitForm(e) {
  e.preventDefault();
  let firstErr = null;
  let ok = true;
 
  const checks = [
    { id: 'p-name', err: 'p-name-err', test: v => v.trim() !== '' },
    { id: 'c-name', err: 'c-name-err', test: v => v.trim() !== '' },
    { id: 'email',  err: 'email-err',  test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
    { id: 'c-age',  err: 'c-age-err',  test: v => v !== '' },
  ];
 
  checks.forEach(c => {
    const el   = document.getElementById(c.id);
    const err  = document.getElementById(c.err);
    const pass = c.test(el.value);
 
    err.classList.toggle('show', !pass);
    el.setAttribute('aria-invalid', pass ? 'false' : 'true');
 
    if (!pass && !firstErr) firstErr = el;
    if (!pass) ok = false;
  });
 
  if (!ok) {
    firstErr.focus();
    return;
  }
 
  document.getElementById('enroll-form').style.display = 'none';
  document.getElementById('form-success').style.display = 'block';
}