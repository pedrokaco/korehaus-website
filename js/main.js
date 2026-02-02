// ========================================
// KOREHAUS - Main JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScroll = 0;

    function handleScroll() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.unidade-card, .preco-card, .galeria-item, .sobre-content, .contato-content').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add visible class styles
    const style = document.createElement('style');
    style.textContent = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Image lazy loading fallback
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    } else {
        // Fallback for older browsers
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // Handle image errors - show placeholder
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.style.backgroundColor = '#f0f0f0';
            this.style.minHeight = '200px';
            this.alt = 'Imagem em breve';
        });
    });

    // Gallery lightbox (simple version)
    const galeriaItems = document.querySelectorAll('.galeria-item');

    galeriaItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (!img) return;

            // Create lightbox
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <button class="lightbox-close">&times;</button>
                    <img src="${img.src}" alt="${img.alt}">
                </div>
            `;

            // Add styles
            lightbox.style.cssText = `
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                padding: 20px;
                cursor: pointer;
            `;

            const content = lightbox.querySelector('.lightbox-content');
            content.style.cssText = `
                position: relative;
                max-width: 90vw;
                max-height: 90vh;
            `;

            const lightboxImg = lightbox.querySelector('img');
            lightboxImg.style.cssText = `
                max-width: 100%;
                max-height: 90vh;
                object-fit: contain;
            `;

            const closeBtn = lightbox.querySelector('.lightbox-close');
            closeBtn.style.cssText = `
                position: absolute;
                top: -40px;
                right: 0;
                background: none;
                border: none;
                color: white;
                font-size: 2rem;
                cursor: pointer;
                padding: 10px;
            `;

            document.body.appendChild(lightbox);
            document.body.style.overflow = 'hidden';

            // Close on click
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox || e.target === closeBtn) {
                    lightbox.remove();
                    document.body.style.overflow = '';
                }
            });

            // Close on escape
            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    lightbox.remove();
                    document.body.style.overflow = '';
                    document.removeEventListener('keydown', handleEscape);
                }
            };
            document.addEventListener('keydown', handleEscape);
        });
    });

    // Current year in footer
    const yearEl = document.querySelector('.footer-bottom p');
    if (yearEl) {
        yearEl.innerHTML = yearEl.innerHTML.replace('2024', new Date().getFullYear());
    }

    // Google Ads conversion tracking for WhatsApp clicks
    document.querySelectorAll('a[href*="whatsapp"], a[href*="wa.me"], .whatsapp-float, .contato-whatsapp').forEach(link => {
        link.addEventListener('click', function() {
            if (typeof gtag === 'function') {
                gtag('event', 'conversion', {'send_to': 'AW-16728206793/ra4FCOKa9OkZEMnb0Kg-'});
            }
        });
    });

    console.log('Korehaus website loaded successfully');
});
