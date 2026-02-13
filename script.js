/**
 * ============================================
 * PREMIUM WEBSITE REDESIGN - SOBHA PROPERTIES
 * Advanced JavaScript with Modern Features
 * ============================================
 */

// ===== Performance Optimization Utilities =====
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

// ===== Wait for DOM to be fully loaded =====
document.addEventListener('DOMContentLoaded', function() {

    // ===== SANITY CONFIG (FILL THESE FROM YOUR PROJECT) =====
    const SANITY_PROJECT_ID = 'em5knz6r';   
    const SANITY_DATASET = 'production';        
    const SANITY_API_VERSION = '2023-10-10';      // e.g. from sanity.config.ts
    // Use the non-CDN API so that fresh content appears immediately after you publish in Sanity
    const SANITY_BASE_URL = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`;


    // Basic helper to call GROQ
    async function fetchFromSanity(groqQuery) {
        const url = `${SANITY_BASE_URL}?query=${encodeURIComponent(groqQuery)}`;
        // Disable caching so that updates in Sanity show up on the site immediately
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error('Sanity request failed');
        const json = await res.json();
        return json.result || [];
    }

    // ===== Scroll Progress Indicator =====
    const scrollProgress = document.getElementById('scrollProgress');
    
    const updateScrollProgress = throttle(() => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        if (scrollProgress) {
            scrollProgress.style.width = scrolled + '%';
        }
    }, 10);
    
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();
    
    // ===== Navbar scroll effect =====
    const navbar = document.querySelector('.navbar');
    const mainNav = document.getElementById('mainNav');
    
    const handleNavbarScroll = throttle(() => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
            mainNav?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
            mainNav?.classList.remove('scrolled');
        }
    }, 10);
    
    handleNavbarScroll();
    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    
    // ===== Active nav link on scroll =====
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const activateNavLink = throttle(() => {
        let scrollY = window.pageYOffset;
        let current = '';
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
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
    activateNavLink();
    
    // ===== Smooth scroll for navigation links =====
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 90;
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
                        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                        if (bsCollapse) {
                            bsCollapse.hide();
                        }
                    }
                }
            }
        });
    });
    
    // ===== Scroll to top button =====
    const scrollTopBtn = document.getElementById('scrollTop');
    
    const handleScrollTop = throttle(() => {
        if (window.scrollY > 300) {
            scrollTopBtn?.classList.add('active');
        } else {
            scrollTopBtn?.classList.remove('active');
        }
    }, 50);
    
    window.addEventListener('scroll', handleScrollTop, { passive: true });
    
    scrollTopBtn?.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ===== Scroll Reveal Animations (Intersection Observer) =====
    const revealElements = document.querySelectorAll('.reveal-fade, .reveal-slide-left, .reveal-slide-right, .reveal-scale, .reveal-zoom');
    
    const revealObserverOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                requestAnimationFrame(() => {
                    entry.target.classList.add('revealed');
                });
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
    
    // ===== Parallax Effect for Hero Section =====
    let ticking = false;
    const heroSection = document.querySelector('.hero-section');
    const heroBackground = document.querySelector('.hero-background');
    
    const updateParallax = () => {
        if (heroSection && window.scrollY < window.innerHeight) {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            
            requestAnimationFrame(() => {
                if (heroBackground) {
                    heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
                }
                
                if (heroSection) {
                    heroSection.style.transform = `translateY(${scrolled * 0.3}px)`;
                }
            });
        }
        ticking = false;
    };
    
    const handleParallaxScroll = () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    };
    
    window.addEventListener('scroll', handleParallaxScroll, { passive: true });
    
    // ===== Image Lazy Loading with Intersection Observer =====
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserverOptions = {
        rootMargin: '50px',
        threshold: 0.01
    };
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
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
                    
                    img.addEventListener('error', function() {
                        this.style.opacity = '1';
                    }, { once: true });
                }
                
                observer.unobserve(img);
            }
        });
    }, imageObserverOptions);
    
    images.forEach(img => {
        if (!img.complete) {
            img.style.opacity = '0';
        } else {
            img.classList.add('loaded');
            img.style.opacity = '1';
        }
        imageObserver.observe(img);
    });
    
    // ===== Hero Form Submission =====
    const heroForm = document.getElementById('heroForm');
    
    if (heroForm) {
        heroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const consentCheck = document.getElementById('heroConsent');
            if (!consentCheck?.checked) {
                alert('Please accept the consent to proceed.');
                return;
            }
            
            // Add loading state
            const submitBtn = heroForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                alert('Thank you for your enquiry! Our representative will contact you shortly.');
                heroForm.reset();
                if (consentCheck) consentCheck.checked = true;
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1000);
        });
    }
    
    // ===== Contact Form Submission =====
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const consentCheck = document.getElementById('contactConsent');
            if (!consentCheck?.checked) {
                alert('Please accept the consent to proceed.');
                return;
            }
            
            // Add loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                alert('Thank you for contacting Sobha Properties! We will get back to you soon.');
                contactForm.reset();
                if (consentCheck) consentCheck.checked = true;
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1000);
        });
    }
    
    // ===== Pricing Card Button Click Handlers (static & Sanity-loaded) =====
    function attachPricingButtonHandlers() {
        const pricingButtons = document.querySelectorAll('.btn-pricing');
        
        pricingButtons.forEach(button => {
            // avoid duplicate listeners
            if (button.dataset.bound === 'true') return;
            button.dataset.bound = 'true';

            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Add ripple effect
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
                
                // Scroll to contact form
                const contactSection = document.getElementById('contactus');
                if (contactSection) {
                    const offsetTop = contactSection.offsetTop - 90;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    attachPricingButtonHandlers();
    
    // ===== Floor Plan Button Handlers =====
    const floorplanButtons = document.querySelectorAll('.floorplan-card .btn');
    const floorplanLinks = document.querySelectorAll('.floorplan-link');
    
    floorplanButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const floorplanTitle = this.closest('.floorplan-card')?.querySelector('h3')?.textContent;
            if (floorplanTitle) {
                alert(`Floor Plan: ${floorplanTitle}\n\nDetailed floor plans will be available soon.`);
            }
        });
    });
    
    floorplanLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Master Plan details will be available soon.');
        });
    });
    
    // ===== Gallery Item Click Handlers =====
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const img = this.querySelector('img');
            if (img) {
                // Could implement a lightbox here
                console.log('Gallery image clicked:', img.src);
                // For now, just show alert
                alert('Gallery image clicked. Lightbox feature can be added here.');
            }
        });
    });
    
    // ===== Button Ripple Effect =====
    const buttons = document.querySelectorAll('.btn-primary, .btn-animated');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
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
    
    // ===== Smooth Scroll for Anchor Links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offsetTop = target.offsetTop - 90;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // ===== Load dynamic content from Sanity =====
    async function loadPricingCards() {
        const container = document.getElementById('pricingCardsContainer');
       if (!container || !SANITY_PROJECT_ID) return;


        try {
            const cards = await fetchFromSanity(
                '*[_type == "pricingCard"] | order(order asc)'
            );

            if (!cards.length) return;

            container.innerHTML = '';

            const row = document.createElement('div');
            row.className = 'row g-4 mb-4';

            cards.forEach(card => {
                const col = document.createElement('div');
                col.className = 'col-lg-4 col-md-6';

                col.innerHTML = `
                    <div class="pricing-card reveal-scale">
                        <div class="paperclip-icons">
                            <i class="fas fa-paperclip"></i>
                            <i class="fas fa-paperclip"></i>
                        </div>
                        <div class="pricing-header">
                            <h3>${card.title}</h3>
                            <div class="price-tag">${card.priceLabel}</div>
                        </div>
                        <div class="pricing-body">
                            <ul class="price-details">
                                <li>Size: ${card.size}</li>
                                <li>Type: ${card.unitType}</li>
                            </ul>
                            <button class="btn-pricing w-100">Interested</button>
                        </div>
                    </div>
                `;

                row.appendChild(col);
            });

            container.appendChild(row);

            // re-attach button handlers to new buttons
            attachPricingButtonHandlers();

            // Observe newly added pricing cards for reveal animations
            const newRevealElements = container.querySelectorAll('.reveal-fade, .reveal-slide-left, .reveal-slide-right, .reveal-scale, .reveal-zoom');
            newRevealElements.forEach(element => {
                revealObserver.observe(element);
            });
        } catch (err) {
            console.error('Error loading pricing cards from Sanity:', err);
        }
    }

    async function loadFloorPlans() {
        const container = document.getElementById('floorPlansContainer');
        if (!container || !SANITY_PROJECT_ID) return;


        try {
            const plans = await fetchFromSanity(
                `*[_type == "floorPlan"] | order(order asc){
                    _id,
                    title,
                    category,
                    showButton,
                    "imageUrl": image.asset->url
                }`
            );

            if (!plans.length) return;

            container.innerHTML = '';

            plans.forEach(plan => {
                const col = document.createElement('div');
                col.className = 'col-lg-4 col-md-6';

                const showButton = plan.showButton !== false;

                // Fallback image in case the Sanity asset is missing
                const imageSrc = plan.imageUrl || 'https://via.placeholder.com/600x400?text=Floor+Plan';

                col.innerHTML = `
                    <div class="floorplan-card reveal-fade">
                        <div class="floorplan-image-wrapper">
                            <div class="image-container">
                                <img src="${imageSrc}" alt="${plan.title}" class="img-fluid" loading="lazy">
                                <div class="image-overlay-hover"></div>
                            </div>
                            ${showButton ? '<a href="#" class="btn btn-light btn-sm btn-hover-effect">Know More</a>' : ''}
                        </div>
                        <h3>${plan.category}</h3>
                    </div>
                `;

                container.appendChild(col);
            });

            // Observe newly added floor plan cards for reveal animations
            const newRevealElements = container.querySelectorAll('.reveal-fade, .reveal-slide-left, .reveal-slide-right, .reveal-scale, .reveal-zoom');
            newRevealElements.forEach(element => {
                revealObserver.observe(element);
            });

            // Hook newly added lazy images into the lazy-loading observer
            const newLazyImages = container.querySelectorAll('img[loading="lazy"]');
            newLazyImages.forEach(img => {
                if (!img.complete) {
                    img.style.opacity = '0';
                } else {
                    img.classList.add('loaded');
                    img.style.opacity = '1';
                }
                imageObserver.observe(img);
            });
        } catch (err) {
            console.error('Error loading floor plans from Sanity:', err);
        }
    }

    // Trigger Sanity content loading
    loadPricingCards();
    loadFloorPlans();

    // ===== Performance: Preload Critical Images =====
    const preloadCriticalImages = () => {
        const criticalImages = [
            'img/heroImg.jpg',
            'img/logo.jfif'
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    };
    
    // Preload on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', preloadCriticalImages);
    } else {
        preloadCriticalImages();
    }
    
    // ===== Console Log for Development =====
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('%cSobha Properties Website', 'color: #D4AF37; font-size: 20px; font-weight: bold;');
        console.log('%cPremium Redesign Loaded Successfully!', 'color: #1F2A2E; font-size: 14px;');
        console.log('All interactive features are now active.');
        console.log('Performance optimizations enabled.');
    }
    
    // ===== Initialize animations on page load =====
    window.addEventListener('load', () => {
        // Trigger initial animation check
        requestAnimationFrame(() => {
            activateNavLink();
            handleScrollTop();
        });
    });
    
});

// ===== Add CSS for Ripple Effect Dynamically =====
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
        z-index: 1;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    /* Ensure smooth animations */
    * {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    
    /* Optimize scrolling performance */
    .hero-section,
    .hero-background {
        will-change: transform;
    }
    
    /* Reduce motion for accessibility */
    @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
        }
    }
`;
document.head.appendChild(style);

// ===== Handle Window Resize =====
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Recalculate animations on resize
        const revealElements = document.querySelectorAll('.reveal-fade, .reveal-slide-left, .reveal-slide-right, .reveal-scale, .reveal-zoom');
        revealElements.forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight) {
                el.classList.add('revealed');
            }
        });
    }, 250);
}, { passive: true });

// ===== Keyboard Navigation Support =====
document.addEventListener('keydown', (e) => {
    // ESC key to close mobile menu
    if (e.key === 'Escape') {
        const navbarCollapse = document.querySelector('.navbar-collapse.show');
        if (navbarCollapse) {
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
            if (bsCollapse) {
                bsCollapse.hide();
            }
        }
    }
    
    // Arrow keys for navigation (when focused on nav links)
    const activeLink = document.querySelector('.nav-link:focus');
    if (activeLink && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        e.preventDefault();
        const navLinks = Array.from(document.querySelectorAll('.nav-link'));
        const currentIndex = navLinks.indexOf(activeLink);
        const nextIndex = e.key === 'ArrowDown' 
            ? (currentIndex + 1) % navLinks.length 
            : (currentIndex - 1 + navLinks.length) % navLinks.length;
        navLinks[nextIndex]?.focus();
    }
});

// ===== Performance Monitoring (Development Only) =====
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.addEventListener('load', () => {
        if ('performance' in window) {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page Load Time: ${(pageLoadTime / 1000).toFixed(2)}s`);
        }
    });
}
