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

const checks = [
  { id: 'p-name', err: 'p-name-err', test: v => v.trim() !== '' },
  { id: 'c-name', err: 'c-name-err', test: v => v.trim() !== '' },
  { id: 'email', err: 'email-err', test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
  { id: 'c-age', err: 'c-age-err', test: v => v !== '' },
];

// Clear errors as users correct their entries
checks.forEach(c => {
  const el = document.getElementById(c.id);
  const err = document.getElementById(c.err);

  el.addEventListener(c.id === 'c-age' ? 'change' : 'input', () => {
    const pass = c.test(el.value);

    if (pass) {
      err.classList.remove('show');
      el.setAttribute('aria-invalid', 'false');
    }
  });
});

function submitForm(e) {
  e.preventDefault();

  let firstErr = null;
  let ok = true;

  checks.forEach(c => {
    const el = document.getElementById(c.id);
    const err = document.getElementById(c.err);
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

  const form = document.getElementById('enroll-form');
  const success = document.getElementById('form-success');

  form.style.display = 'none';
  success.style.display = 'block';
  success.focus();
}

const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

// HAMBURGER MENU
hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");

  const isOpen = navLinks.classList.contains("active");

  hamburger.classList.toggle("active", isOpen);
  hamburger.setAttribute("aria-expanded", isOpen);
  hamburger.setAttribute(
    "aria-label",
    isOpen ? "Close menu" : "Open menu"
  );
});

// CLOSE MENU WITH ESCAPE
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navLinks.classList.contains("active")) {
    navLinks.classList.remove("active");
    hamburger.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Open menu");
    hamburger.focus();
  }
});