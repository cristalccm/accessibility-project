/**
 * Crumb & Bloom Bakery — main.js
 * Accessible JavaScript: keyboard navigation, ARIA state management,
 * focus trapping, reduced-motion support, scroll reveals.
 * WCAG 2.2 AA compliant interactions.
 */
 
'use strict';
 
/* ─────────────────────────────────────────
   UTILITY: Detect if user prefers reduced motion
   (WCAG 2.3.3 — Animation from Interactions)
───────────────────────────────────────── */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 
/* ─────────────────────────────────────────
   MOBILE NAVIGATION — keyboard & ARIA
   WCAG 2.1.1 Keyboard, 4.1.2 Name/Role/Value
───────────────────────────────────────── */
(function initMobileNav() {
  const hamburger  = document.querySelector('.hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
 
  if (!hamburger || !mobileMenu) return;
 
  // All focusable elements inside the mobile menu
  const getFocusable = () =>
    Array.from(mobileMenu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])'));
 
  function openMenu() {
    mobileMenu.hidden = false;
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close navigation menu');
    // Move focus to first link in menu
    const firstLink = getFocusable()[0];
    if (firstLink) firstLink.focus();
  }
 
  function closeMenu() {
    mobileMenu.hidden = true;
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation menu');
    hamburger.focus(); // return focus to trigger
  }
 
  hamburger.addEventListener('click', () => {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    isExpanded ? closeMenu() : openMenu();
  });
 
  /* Focus trap inside mobile menu (WCAG 2.1.2 — No Keyboard Trap) */
  mobileMenu.addEventListener('keydown', (e) => {
    const focusable = getFocusable();
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
 
    if (e.key === 'Escape') {
      closeMenu();
      return;
    }
 
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        // Shift+Tab from first → wrap to last
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab from last → wrap to first
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });
 
  /* Close menu when a link is clicked */
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
 
  /* Close menu on outside click */
  document.addEventListener('click', (e) => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    if (isOpen && !hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      closeMenu();
    }
  });
 
  /* Close on Escape from anywhere */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger.getAttribute('aria-expanded') === 'true') {
      closeMenu();
    }
  });
})();
 
 
/* ─────────────────────────────────────────
   SCROLL-REVEAL — respects prefers-reduced-motion
   WCAG 2.3.3 Animation from Interactions
───────────────────────────────────────── */
(function initScrollReveal() {
  const revealTargets = document.querySelectorAll('.menu-card, .testi-card, .about-card');
 
  if (prefersReducedMotion) {
    // Skip animations — show everything immediately
    revealTargets.forEach(el => el.classList.add('visible'));
    return;
  }
 
  revealTargets.forEach(el => el.classList.add('reveal'));
 
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // fire only once
        }
      });
    },
    { threshold: 0.12 }
  );
 
  revealTargets.forEach(el => observer.observe(el));
})();
 
 
/* ─────────────────────────────────────────
   SMOOTH SCROLL — keyboard & click
   WCAG 2.4.1 Bypass Blocks, 2.1.1 Keyboard
───────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
 
      const target = document.querySelector(targetId);
      if (!target) return;
 
      e.preventDefault();
 
      // Scroll
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
 
      // Manage focus: move to the section heading or the section itself
      const heading = target.querySelector('h1, h2, h3');
      const focusTarget = heading || target;
 
      // Temporarily make it focusable if it isn't
      if (!focusTarget.hasAttribute('tabindex')) {
        focusTarget.setAttribute('tabindex', '-1');
        focusTarget.addEventListener('blur', () => focusTarget.removeAttribute('tabindex'), { once: true });
      }
      focusTarget.focus({ preventScroll: true });
    });
  });
})();
 
 
/* ─────────────────────────────────────────
   MARQUEE — pause on hover / focus
   WCAG 2.2.2 — Pause, Stop, Hide
───────────────────────────────────────── */
(function initMarqueePause() {
  const track = document.querySelector('.marquee-track');
  const wrap  = document.querySelector('.marquee-wrap');
  if (!track || !wrap) return;
 
  function pauseMarquee()  { track.style.animationPlayState = 'paused'; }
  function resumeMarquee() { track.style.animationPlayState = 'running'; }
 
  // Pause on hover
  wrap.addEventListener('mouseenter', pauseMarquee);
  wrap.addEventListener('mouseleave', resumeMarquee);
 
  // Pause when any element inside gains focus (keyboard users)
  wrap.addEventListener('focusin',  pauseMarquee);
  wrap.addEventListener('focusout', resumeMarquee);
})();
 
 
/* ─────────────────────────────────────────
   LIVE REGION — announce page section on nav
   WCAG 4.1.3 Status Messages
───────────────────────────────────────── */
(function initLiveRegion() {
  // Create a visually hidden live region for announcements
  const live = document.createElement('div');
  live.setAttribute('role', 'status');
  live.setAttribute('aria-live', 'polite');
  live.setAttribute('aria-atomic', 'true');
  live.className = 'sr-only';
  live.id = 'live-region';
  document.body.appendChild(live);
 
  function announce(message) {
    live.textContent = '';
    // Small delay so screen readers catch the change
    setTimeout(() => { live.textContent = message; }, 100);
  }
 
  // Announce when nav links are used
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      const label = link.textContent.trim();
      announce(`Navigated to ${label} section`);
    });
  });
})();
 
 
/* ─────────────────────────────────────────
   HERO FLOATING EMOJI — pause on prefers-reduced-motion
   Already handled in CSS, but also guard JS-driven motion
───────────────────────────────────────── */
(function initHeroFloat() {
  if (prefersReducedMotion) {
    document.querySelectorAll('.hero-emoji, .deco-dot').forEach(el => {
      el.style.animation = 'none';
    });
  }
})();
 
 
/* ─────────────────────────────────────────
   KEYBOARD NAVIGATION INDICATOR
   Adds a class to body when user is navigating by keyboard
   so we can show stronger focus styles
───────────────────────────────────────── */
(function initKeyboardDetection() {
  let usingKeyboard = false;
 
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && !usingKeyboard) {
      usingKeyboard = true;
      document.body.classList.add('using-keyboard');
    }
  });
 
  document.addEventListener('mousedown', () => {
    if (usingKeyboard) {
      usingKeyboard = false;
      document.body.classList.remove('using-keyboard');
    }
  });
})();
 
 
/* ─────────────────────────────────────────
   DYNAMIC YEAR — update footer copyright
───────────────────────────────────────── */
(function updateCopyrightYear() {
  const yearEl = document.querySelector('.footer-bottom p');
  if (!yearEl) return;
 
  const currentYear = new Date().getFullYear();
  yearEl.innerHTML = yearEl.innerHTML.replace('2026', currentYear);
})();