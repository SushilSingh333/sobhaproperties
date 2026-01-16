// Performance optimization utilities
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Navbar scroll effect - optimized with throttle
    const navbar = document.querySelector('.navbar');
    
    const handleNavbarScroll = throttle(() => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, 10);
    
    // Check initial scroll position
    handleNavbarScroll();
    
    window.addEventListener('scroll', handleNavbarScroll, { passive: true });

    // Active nav link on scroll - optimized with throttle
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const activateNavLink = throttle(() => {
        let scrollY = window.pageYOffset;
        let current = '';

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = sectionId;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}` || (current === '' && href === '#home')) {
                link.classList.add('active');
            }
        });

        // If at top, activate home link
        if (scrollY < 100) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#home') {
                    link.classList.add('active');
                }
            });
        }
    }, 100);

    window.addEventListener('scroll', activateNavLink, { passive: true });
    activateNavLink(); // Initial call

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Update active nav link
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Close mobile menu if open
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                        const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                        bsCollapse.hide();
                    }
                }
            }
        });
    });

    // Scroll to top button - optimized
    const scrollTopBtn = document.getElementById('scrollTop');

    const handleScrollTop = throttle(() => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
    }, 50);

    window.addEventListener('scroll', handleScrollTop, { passive: true });

    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Carousel auto-play control
    const carousel = document.querySelector('#heroCarousel');
    const carouselInstance = new bootstrap.Carousel(carousel, {
        interval: 5000,
        ride: 'carousel',
        pause: 'hover',
        wrap: true
    });

    // Animate elements on scroll - optimized with IntersectionObserver
    const initAnimations = function() {
        const elements = document.querySelectorAll('.property-card, .project-card, .feature-card');
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px) translateZ(0)';
            element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    };

    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.property-card, .project-card, .feature-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100 && elementBottom > 0) {
                requestAnimationFrame(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0) translateZ(0)';
                });
            }
        });
    };

    // Use IntersectionObserver for better performance
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                requestAnimationFrame(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) translateZ(0)';
                });
                animationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    initAnimations();
    
    // Use IntersectionObserver for better performance
    document.querySelectorAll('.property-card, .project-card, .feature-card').forEach(el => {
        animationObserver.observe(el);
    });
    
    // Fallback for initial check
    requestAnimationFrame(animateOnScroll);

    // Hero form submission
    const heroForm = document.getElementById('heroForm');
    
    if (heroForm) {
        heroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate consent checkbox
            const consentCheck = document.getElementById('heroConsent');
            if (!consentCheck.checked) {
                alert('Please accept the consent to proceed.');
                return;
            }
            
            // Show success message
            alert('Thank you for your enquiry! Our representative will contact you shortly.');
            
            // Reset form
            heroForm.reset();
            consentCheck.checked = true;
        });
    }

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate consent checkbox
            const consentCheck = document.getElementById('contactConsent');
            if (!consentCheck.checked) {
                alert('Please accept the consent to proceed.');
                return;
            }
            
            // Show success message
            alert('Thank you for contacting Sobha Properties! We will get back to you soon.');
            
            // Reset form
            contactForm.reset();
            consentCheck.checked = true;
        });
    }

    // Pricing card button click handlers
    const pricingButtons = document.querySelectorAll('.pricing-card .btn');
    
    pricingButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            // Scroll to contact form
            const contactSection = document.getElementById('contactus');
            if (contactSection) {
                const offsetTop = contactSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Floor plan button handlers
    const floorplanButtons = document.querySelectorAll('.floorplan-card .btn');
    
    floorplanButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const floorplanTitle = this.closest('.floorplan-card').querySelector('h4').textContent;
            alert(`Floor Plan: ${floorplanTitle}\n\nDetailed floor plans will be available soon.`);
        });
    });

    // Gallery item click handlers
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            // Could implement a lightbox here
            console.log('Gallery image clicked:', img.src);
        });
    });

    // Add hover effect to stat boxes - optimized with CSS (removed JS hover, handled by CSS)
    // Stat boxes hover effects are now handled purely by CSS for better performance

    // Counter animation for statistics - optimized
    const animateCounter = function(element, target, suffix = '') {
        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        const startValue = 0;
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(startValue + (target - startValue) * easeOutQuart);
            
            let displayValue = current;
            if (suffix === 'K') {
                displayValue = current + 'K';
            } else if (suffix === 'M') {
                displayValue = current + 'M';
            } else {
                displayValue = current;
            }
            
            element.textContent = displayValue + '+';
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        requestAnimationFrame(updateCounter);
    };

    // Trigger counter animation on scroll - using IntersectionObserver
    let countersAnimated = false;
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                const counterElements = document.querySelectorAll('.stat-box h3');
                const targets = [
                    { value: 40, suffix: '' },
                    { value: 100, suffix: '' },
                    { value: 50, suffix: 'K' },
                    { value: 25, suffix: 'M' }
                ];
                
                counterElements.forEach((element, index) => {
                    const target = targets[index];
                    animateCounter(element, target.value, target.suffix);
                });
                
                countersAnimated = true;
                counterObserver.disconnect();
            }
        });
    }, {
        threshold: 0.3
    });

    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
        counterObserver.observe(aboutSection);
    }

    // Image lazy loading effect - optimized
    const images = document.querySelectorAll('img');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Check if image is already loaded
                if (img.complete) {
                    img.classList.add('loaded');
                    img.style.opacity = '1';
                } else {
                    img.addEventListener('load', function() {
                        this.classList.add('loaded');
                        requestAnimationFrame(() => {
                            this.style.opacity = '1';
                        });
                    }, { once: true });
                }
                
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });

    images.forEach(img => {
        // Set initial opacity for smooth transition
        if (img.complete) {
            img.classList.add('loaded');
            img.style.opacity = '1';
        } else {
            img.style.opacity = '0';
            imageObserver.observe(img);
        }
    });

    // Add parallax effect to hero section - optimized with requestAnimationFrame
    let ticking = false;
    const heroImages = document.querySelectorAll('.carousel-item img');
    
    const updateParallax = () => {
        const scrolled = window.pageYOffset;
        
        heroImages.forEach(img => {
            requestAnimationFrame(() => {
                img.style.transform = `translateY(${scrolled * 0.3}px) translateZ(0)`;
            });
        });
        
        ticking = false;
    };
    
    const handleParallaxScroll = () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    };
    
    window.addEventListener('scroll', handleParallaxScroll, { passive: true });

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        const submitBtn = newsletterForm.querySelector('button');
        
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            if (email && email.includes('@')) {
                alert('Thank you for subscribing to Sobha Properties newsletter!');
                emailInput.value = '';
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }

    // Add active state to carousel indicators - optimized
    const carouselElement = document.querySelector('#heroCarousel');
    
    if (carouselElement) {
        carouselElement.addEventListener('slide.bs.carousel', function(e) {
            requestAnimationFrame(() => {
                const indicators = document.querySelectorAll('.carousel-indicators button');
                indicators.forEach((indicator, index) => {
                    if (index === e.to) {
                        indicator.classList.add('active');
                    } else {
                        indicator.classList.remove('active');
                    }
                });
            });
        });
    }

    // Add ripple effect to buttons - optimized
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            requestAnimationFrame(() => {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple-effect');
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    });

    // Preload critical images for better performance
    const preloadImages = () => {
        const criticalImages = document.querySelectorAll('.carousel-item img, .property-img img');
        criticalImages.forEach(img => {
            if (img.src && !img.complete) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = img.src;
                document.head.appendChild(link);
            }
        });
    };
    
    // Preload images after page load
    window.addEventListener('load', preloadImages);
    
    // Console log for development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Sobha Properties Website Loaded Successfully!');
        console.log('All interactive features are now active.');
        console.log('Performance optimizations enabled.');
    }
    
});

// Add CSS for ripple effect dynamically
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);