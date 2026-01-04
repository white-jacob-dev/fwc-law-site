/**
 * Ferguson Widmayer & Clark PC
 * JavaScript for site functionality
 */

(function () {
  'use strict';

  // DOM Elements
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  const navLinks = document.querySelectorAll('.nav-list a');
  const header = document.querySelector('.site-header');

  /**
   * Mobile Menu Toggle
   */
  function toggleMobileMenu() {
    const isOpen = mobileMenuToggle.getAttribute('aria-expanded') === 'true';

    mobileMenuToggle.setAttribute('aria-expanded', !isOpen);
    mainNav.classList.toggle('is-open', !isOpen);

    // Prevent body scroll when menu is open
    document.body.style.overflow = !isOpen ? 'hidden' : '';
  }

  /**
   * Close mobile menu when a nav link is clicked
   */
  function closeMobileMenu() {
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    mainNav.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  /**
   * Close mobile menu on escape key
   */
  function handleEscapeKey(event) {
    if (event.key === 'Escape' && mainNav.classList.contains('is-open')) {
      closeMobileMenu();
      mobileMenuToggle.focus();
    }
  }

  /**
   * Handle smooth scroll for anchor links
   */
  function handleSmoothScroll(event) {
    const href = event.currentTarget.getAttribute('href');

    // Only handle same-page anchor links
    if (href.startsWith('#')) {
      const target = document.querySelector(href);

      if (target) {
        event.preventDefault();
        closeMobileMenu();

        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });

        // Update URL without jumping
        history.pushState(null, null, href);
      }
    } else if (href.includes('#')) {
      // Handle cross-page anchors (e.g., index.html#contact)
      closeMobileMenu();
    }
  }

  /**
   * Add header styles on scroll
   */
  function handleHeaderScroll() {
    const scrolled = window.scrollY > 20;
    if (scrolled) {
      header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
      header.style.boxShadow = 'none';
    }
  }

  /**
   * Handle form submission
   */
  function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Simple validation
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        isValid = false;
        field.style.borderColor = '#c53030';
      } else {
        field.style.borderColor = '';
      }
    });

    if (!isValid) {
      return;
    }

    // Simulate form submission
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // In production, replace with actual form submission
    setTimeout(() => {
      submitBtn.textContent = 'Message Sent';

      setTimeout(() => {
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 2000);
    }, 1000);
  }

  /**
   * Animate elements on scroll
   */
  function initScrollAnimations() {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, observerOptions);

    // Observe practice cards with staggered delays
    document.querySelectorAll('.practice-card').forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
      observer.observe(el);
    });

    // Observe attorney cards with staggered delays (reset per group)
    document.querySelectorAll('.attorney-group').forEach((group) => {
      group.querySelectorAll('.attorney-card').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(25px)';
        el.style.transition = `opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.08}s, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.08}s`;
        observer.observe(el);
      });
    });

    // For attorney cards not in groups (homepage preview)
    document.querySelectorAll('.attorneys-preview .attorney-card').forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(25px)';
      el.style.transition = `opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
      observer.observe(el);
    });

    // Observe value items with staggered delays
    document.querySelectorAll('.value-item').forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateX(-20px)';
      el.style.transition = `opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.15}s, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.15}s`;
      observer.observe(el);
    });

    // Observe section headers
    document.querySelectorAll('.section-header, .story-content, .contact-info').forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
      observer.observe(el);
    });
  }

  /**
   * Add visible class styles
   */
  function addVisibleStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .is-visible {
        opacity: 1 !important;
        transform: translateY(0) translateX(0) !important;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Initialize event listeners
   */
  function init() {
    // Mobile menu
    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Nav links - handle both same-page and cross-page anchors
    navLinks.forEach((link) => {
      link.addEventListener('click', handleSmoothScroll);
    });

    // Footer nav links
    document.querySelectorAll('.footer-nav a[href*="#"]').forEach((link) => {
      link.addEventListener('click', handleSmoothScroll);
    });

    // Escape key handler
    document.addEventListener('keydown', handleEscapeKey);

    // Header scroll effect
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll(); // Check on load

    // Form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Close menu on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && mainNav.classList.contains('is-open')) {
        closeMobileMenu();
      }
    });

    // Initialize scroll animations
    addVisibleStyles();
    initScrollAnimations();

    // Handle cross-page anchor scrolling
    if (window.location.hash) {
      setTimeout(() => {
        const target = document.querySelector(window.location.hash);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }, 100);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
