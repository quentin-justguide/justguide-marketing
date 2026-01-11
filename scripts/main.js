/**
 * ============================================================
 * JustGuide Marketing - Main JavaScript
 * ============================================================
 * Minimal, dependency-free JavaScript for the landing page.
 * ============================================================
 */

// ============================================================
// CONFIGURATION (Easy to update)
// ============================================================
const CONFIG = {
  APP_URL: 'https://app.justguide.app',
  CONTACT_EMAIL: 'quentin@justguide.app',
};

// ============================================================
// DOM ELEMENTS
// ============================================================
const header = document.getElementById('header');
const mobileToggle = document.querySelector('.header__mobile-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
const mobileMenuClose = document.querySelector('.mobile-menu__close');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu__link');

// ============================================================
// MOBILE MENU
// ============================================================
function openMobileMenu() {
  mobileMenu.classList.add('is-open');
  mobileMenuOverlay.classList.add('is-open');
  mobileMenu.setAttribute('aria-hidden', 'false');
  mobileMenuOverlay.setAttribute('aria-hidden', 'false');
  mobileToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  mobileMenu.classList.remove('is-open');
  mobileMenuOverlay.classList.remove('is-open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  mobileMenuOverlay.setAttribute('aria-hidden', 'true');
  mobileToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

if (mobileToggle) {
  mobileToggle.addEventListener('click', openMobileMenu);
}

if (mobileMenuClose) {
  mobileMenuClose.addEventListener('click', closeMobileMenu);
}

if (mobileMenuOverlay) {
  mobileMenuOverlay.addEventListener('click', closeMobileMenu);
}

// Close menu when clicking navigation links
mobileMenuLinks.forEach((link) => {
  link.addEventListener('click', closeMobileMenu);
});

// Close menu on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
    closeMobileMenu();
  }
});

// ============================================================
// HEADER SCROLL EFFECT
// ============================================================
let lastScrollY = 0;
const scrollThreshold = 50;

function handleScroll() {
  const currentScrollY = window.scrollY;
  
  if (currentScrollY > scrollThreshold) {
    header.classList.add('header--scrolled');
  } else {
    header.classList.remove('header--scrolled');
  }
  
  lastScrollY = currentScrollY;
}

window.addEventListener('scroll', handleScroll, { passive: true });

// Run once on load
handleScroll();

// ============================================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    
    // Skip if it's just "#" or empty
    if (targetId === '#' || targetId === '') return;
    
    const target = document.querySelector(targetId);
    
    if (target) {
      e.preventDefault();
      
      const headerHeight = header.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    }
  });
});

// ============================================================
// CTA TRACKING HELPER
// ============================================================
// This function can be called by GTM or other analytics tools
// to track CTA clicks. The data-cta attribute is already on buttons.
function trackCTA(ctaName, additionalData = {}) {
  // If GTM dataLayer exists, push event
  if (typeof window.dataLayer !== 'undefined') {
    window.dataLayer.push({
      event: 'cta_click',
      cta_name: ctaName,
      ...additionalData,
    });
  }
  
  // Console log for debugging (remove in production)
  console.log(`CTA Clicked: ${ctaName}`, additionalData);
}

// Attach click listeners to all CTAs with data-cta attribute
document.querySelectorAll('[data-cta]').forEach((cta) => {
  cta.addEventListener('click', function () {
    const ctaName = this.getAttribute('data-cta');
    trackCTA(ctaName, {
      cta_text: this.textContent.trim(),
      cta_url: this.href,
    });
  });
});

// ============================================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================================
// Add subtle fade-in animation for sections as they come into view
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1,
};

const animationObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-fade-in-up');
      animationObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Only observe elements that should animate if reduced motion is not preferred
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.feature-card, .testimonial-card, .step, .screenshot-card').forEach((el) => {
    el.style.opacity = '0';
    animationObserver.observe(el);
  });
}

// ============================================================
// UTILITY: Update all links with CONFIG values
// ============================================================
// This ensures all app links point to the correct URL
function updateAppLinks() {
  document.querySelectorAll('a[href="https://app.justguide.app"]').forEach((link) => {
    link.href = CONFIG.APP_URL;
  });
  
  document.querySelectorAll('a[href^="mailto:quentin@justguide.app"]').forEach((link) => {
    link.href = `mailto:${CONFIG.CONTACT_EMAIL}`;
  });
}

// Run on load
updateAppLinks();

// ============================================================
// EXPORT CONFIG FOR EXTERNAL ACCESS
// ============================================================
window.JustGuideConfig = CONFIG;
