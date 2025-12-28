/**
 * Ferguson Widmayer & Clark PC
 * Minimal JavaScript for site functionality
 */

(function() {
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
     * (Fallback for browsers without native smooth scroll support)
     */
    function handleSmoothScroll(event) {
        const href = event.currentTarget.getAttribute('href');
        
        if (href.startsWith('#')) {
            const target = document.querySelector(href);
            
            if (target) {
                event.preventDefault();
                closeMobileMenu();
                
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Update URL without jumping
                history.pushState(null, null, href);
            }
        }
    }

    /**
     * Add subtle header shadow on scroll
     */
    function handleHeaderScroll() {
        const scrolled = window.scrollY > 10;
        header.style.boxShadow = scrolled 
            ? '0 1px 3px rgba(0, 0, 0, 0.08)' 
            : 'none';
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
        
        requiredFields.forEach(field => {
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
     * Initialize event listeners
     */
    function init() {
        // Mobile menu
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        }

        // Nav links
        navLinks.forEach(link => {
            link.addEventListener('click', handleSmoothScroll);
        });

        // Footer nav links
        document.querySelectorAll('.footer-nav a[href^="#"]').forEach(link => {
            link.addEventListener('click', handleSmoothScroll);
        });

        // Escape key handler
        document.addEventListener('keydown', handleEscapeKey);

        // Header scroll effect
        window.addEventListener('scroll', handleHeaderScroll, { passive: true });

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
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

