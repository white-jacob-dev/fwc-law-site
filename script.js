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
  mobileMenuToggle.classList.toggle('is-active', !isOpen);
  mainNav.classList.toggle('is-open', !isOpen);

  // Prevent body scroll when menu is open
  document.body.style.overflow = !isOpen ? 'hidden' : '';
}

/**
 * Close mobile menu when a nav link is clicked
 */
function closeMobileMenu() {
  mobileMenuToggle.setAttribute('aria-expanded', 'false');
  mobileMenuToggle.classList.remove('is-active');
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
    const scrolled = window.scrollY > 50;
    header.classList.toggle('scrolled', scrolled);
  }

  /**
   * Handle form submission
   */
  function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Get or create form message element
    let formMessage = form.querySelector('.form-message');
    if (!formMessage) {
      formMessage = document.createElement('div');
      formMessage.className = 'form-message';
      form.insertBefore(formMessage, form.firstChild);
    }

    // Hide any existing message
    formMessage.classList.remove('show', 'form-message--success', 'form-message--error');

    // Simple validation
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add('error');
        field.classList.remove('success');
      } else {
        field.classList.remove('error');
        field.classList.add('success');
      }
    });

    // Email validation
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailField.value)) {
        isValid = false;
        emailField.classList.add('error');
        emailField.classList.remove('success');
      }
    }

    if (!isValid) {
      formMessage.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg><span>Please fill in all required fields correctly.</span>';
      formMessage.classList.add('show', 'form-message--error');
      return;
    }

    // Add loading state
    submitBtn.classList.add('btn--loading');
    submitBtn.disabled = true;

    // In production, replace with actual form submission
    setTimeout(() => {
      submitBtn.classList.remove('btn--loading');
      submitBtn.textContent = 'Message Sent!';
      
      // Show success message
      formMessage.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><span>Thank you! We\'ve received your message and will be in touch soon.</span>';
      formMessage.classList.add('show', 'form-message--success');

      // Reset form after delay
      setTimeout(() => {
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Remove validation classes
        form.querySelectorAll('.error, .success').forEach(el => {
          el.classList.remove('error', 'success');
        });
      }, 3000);
    }, 1500);
  }

  /**
   * Animate elements on scroll
   */
  function initScrollAnimations() {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, observerOptions);

    // Observe practice cards and attorney cards
    document.querySelectorAll('.practice-card, .attorney-card, .value-item').forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
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
                transform: translateY(0) !important;
            }
        `;
    document.head.appendChild(style);
  }

  /**
   * Testimonials Slider functionality
   */
  function initTestimonialsSlider() {
    const slider = document.querySelector('.testimonials-slider');
    if (!slider) return;

    const track = slider.querySelector('.testimonials-track');
    const cards = slider.querySelectorAll('.testimonial-card');
    const prevBtn = slider.querySelector('.testimonial-prev');
    const nextBtn = slider.querySelector('.testimonial-next');
    const dotsContainer = slider.querySelector('.testimonials-dots');

    if (cards.length === 0) return;

    let currentIndex = 0;

    // Get number of visible cards based on screen width
    function getVisibleCards() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    // Calculate number of pages (dot count)
    function getPageCount() {
      const visibleCards = getVisibleCards();
      return Math.ceil(cards.length / visibleCards);
    }

    // Create/update dots based on page count
    function updateDots() {
      dotsContainer.innerHTML = '';
      const pageCount = getPageCount();
      
      for (let i = 0; i < pageCount; i++) {
        const dot = document.createElement('button');
        dot.classList.add('testimonial-dot');
        dot.setAttribute('aria-label', `Go to page ${i + 1}`);
        if (i === currentIndex) dot.classList.add('active');
        dot.addEventListener('click', () => {
          goToSlide(i);
        });
        dotsContainer.appendChild(dot);
      }
    }

    function updateSlider() {
      const visibleCards = getVisibleCards();
      const cardWidth = 100 / visibleCards;
      const offset = currentIndex * visibleCards * cardWidth;
      
      track.style.transform = `translateX(-${offset}%)`;

      // Update dots
      const dots = dotsContainer.querySelectorAll('.testimonial-dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });

      // Update button states
      const maxIndex = getPageCount() - 1;
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= maxIndex;
    }

    function goToSlide(index) {
      const maxIndex = getPageCount() - 1;
      currentIndex = Math.max(0, Math.min(index, maxIndex));
      updateSlider();
    }

    function nextSlide() {
      const maxIndex = getPageCount() - 1;
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateSlider();
      }
    }

    function prevSlide() {
      if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
      }
    }

    // Event listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Keyboard navigation
    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      }
      if (e.key === 'ArrowRight') {
        nextSlide();
      }
    });

    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        currentIndex = 0;
        updateDots();
        updateSlider();
      }, 150);
    });

    // Initialize
    updateDots();
    updateSlider();
  }

  /**
   * FAQ Accordion functionality
   */
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach((item) => {
      const question = item.querySelector('.faq-question');
      
      if (question) {
        question.addEventListener('click', () => {
          const isOpen = item.classList.contains('is-open');
          
          // Close all other FAQ items (optional: remove this block for multi-open)
          faqItems.forEach((otherItem) => {
            if (otherItem !== item) {
              otherItem.classList.remove('is-open');
              otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            }
          });
          
          // Toggle current item
          item.classList.toggle('is-open', !isOpen);
          question.setAttribute('aria-expanded', !isOpen);
        });
      }
    });
  }

  /**
   * Bio Accordion functionality (attorney profile pages)
   */
  function initBioAccordion() {
    const bioSections = document.querySelectorAll('.bio-section');
    
    bioSections.forEach((section) => {
      const toggle = section.querySelector('.bio-section-toggle');
      
      if (toggle) {
        toggle.addEventListener('click', () => {
          const isOpen = section.classList.contains('is-open');
          
          // Toggle current section
          section.classList.toggle('is-open', !isOpen);
          toggle.setAttribute('aria-expanded', !isOpen);
        });
      }
    });
  }

  /**
   * Back to Top Button functionality
   */
  function initBackToTop() {
    // Create button element
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    backToTopBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>';
    document.body.appendChild(backToTopBtn);

    // Show/hide based on scroll position
    function toggleVisibility() {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Scroll to top on click
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility(); // Check on load
  }

  /**
   * Enhanced scroll reveal animations
   */
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.section-header, .building-feature, .story-highlight, .contact-info, .contact-form');
    
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach((el) => {
      el.classList.add('reveal');
      observer.observe(el);
    });
  }

  /**
   * Update copyright year automatically
   */
  function updateCopyrightYear() {
    const copyrightElements = document.querySelectorAll('.copyright');
    const currentYear = new Date().getFullYear();
    
    copyrightElements.forEach((el) => {
      // Replace any 4-digit year after © with current year
      el.innerHTML = el.innerHTML.replace(/©\s*\d{4}/, '© ' + currentYear);
    });
  }

  /**
   * Update privacy policy date to January of current year
   */
  function updatePrivacyPolicyDate() {
    const dateElement = document.getElementById('privacy-policy-date');
    if (dateElement) {
      const currentYear = new Date().getFullYear();
      dateElement.textContent = 'January ' + currentYear;
    }
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

    // FAQ Accordion
    initFaqAccordion();

    // Bio Accordion (attorney profile pages)
    initBioAccordion();

    // Testimonials Slider
    initTestimonialsSlider();

    // Back to Top Button
    initBackToTop();

    // Enhanced scroll reveal
    initScrollReveal();

    // Update copyright year
    updateCopyrightYear();

    // Update privacy policy date
    updatePrivacyPolicyDate();

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
