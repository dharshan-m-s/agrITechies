// Home Page JavaScript
// Handles homepage animations, counters, and interactions

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname === '/' || window.location.pathname.includes('index')) {
        initializeHomePage();
    }
});

function initializeHomePage() {
    console.log('🏠 Initializing Home Page...');

    // Initialize features
    initializeStatsCounters();
    initializeFeatureCards();
    initializeHeroAnimations();
    initializeScrollEffects();
}

function initializeStatsCounters() {
    const statsNumbers = document.querySelectorAll('.stat-number');

    if (statsNumbers.length === 0) return;

    // Sample statistics data
    const stats = [
        { element: statsNumbers[0], target: 25000, suffix: '+', label: 'farmers' },
        { element: statsNumbers[1], target: 96, suffix: '%', label: 'accuracy' },
        { element: statsNumbers[2], target: 150000, suffix: '+', label: 'detections' },
        { element: statsNumbers[3], target: 500, suffix: '+', label: 'crops' }
    ];

    // Create intersection observer for stats animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats(stats);
                statsObserver.disconnect(); // Only animate once
            }
        });
    }, { threshold: 0.5 });

    // Observe the first stat element
    if (statsNumbers[0]) {
        statsObserver.observe(statsNumbers[0].closest('.stats-section, .hero-stats'));
    }
}

function animateStats(stats) {
    stats.forEach((stat, index) => {
        if (!stat.element) return;

        // Reset counter
        stat.element.textContent = '0';

        // Animate with delay
        setTimeout(() => {
            animateCounter(stat.element, 0, stat.target, stat.suffix, 2000);
        }, index * 200);
    });
}

function animateCounter(element, start, end, suffix = '', duration = 2000) {
    const increment = end / (duration / 16); // 60 FPS
    let current = start;

    const timer = setInterval(() => {
        current += increment;

        if (current >= end) {
            element.textContent = formatNumber(end) + suffix;
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current)) + suffix;
        }
    }, 16);
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function initializeFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');

    featureCards.forEach((card, index) => {
        // Add stagger animation delay
        card.style.animationDelay = `${index * 0.1}s`;

        // Add hover interactions
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });

        // Add click handler for feature cards
        card.addEventListener('click', function() {
            const title = this.querySelector('h3')?.textContent;
            handleFeatureClick(title, this);
        });
    });
}

function handleFeatureClick(featureTitle, cardElement) {
    const featureRoutes = {
        'Disease Detection': 'plant-disease.html',
        'Plant Disease Detection': 'plant-disease.html',
        'Crop Recommendations': 'crop.html',
        'Crop Recommendation': 'crop.html',
        'Market Intelligence': 'market.html',
        'Market Trends': 'market.html'
    };

    const route = featureRoutes[featureTitle];

    if (route) {
        // Add click animation
        cardElement.style.transform = 'scale(0.95)';

        setTimeout(() => {
            window.location.href = route;
        }, 150);
    } else {
        AgriSense.showNotification(`Learn more about ${featureTitle}`, 'info');
    }
}

function initializeHeroAnimations() {
    const heroTitle = document.querySelector('.hero-title, .about-title, h1');
    const heroSubtitle = document.querySelector('.hero-subtitle, .about-subtitle');
    const heroCTA = document.querySelector('.hero-buttons, .cta-buttons');

    // Animate hero elements on load
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(30px)';

        setTimeout(() => {
            heroTitle.style.transition = 'all 0.8s ease-out';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 200);
    }

    if (heroSubtitle) {
        heroSubtitle.style.opacity = '0';
        heroSubtitle.style.transform = 'translateY(30px)';

        setTimeout(() => {
            heroSubtitle.style.transition = 'all 0.8s ease-out';
            heroSubtitle.style.opacity = '1';
            heroSubtitle.style.transform = 'translateY(0)';
        }, 400);
    }

    if (heroCTA) {
        heroCTA.style.opacity = '0';
        heroCTA.style.transform = 'translateY(30px)';

        setTimeout(() => {
            heroCTA.style.transition = 'all 0.8s ease-out';
            heroCTA.style.opacity = '1';
            heroCTA.style.transform = 'translateY(0)';
        }, 600);
    }
}

function initializeScrollEffects() {
    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero-section, .about-hero');

    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;

            if (scrolled < window.innerHeight) {
                heroSection.style.transform = `translateY(${rate}px)`;
            }
        });
    }

    // Fade in animation for sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections for fade-in animation
    const sections = document.querySelectorAll('.features-section, .stats-section, .process-section, .mission-section, .team-section');

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.8s ease-out';
        fadeInObserver.observe(section);
    });
}

// CTA Button interactions
function initializeCTAButtons() {
    const ctaButtons = document.querySelectorAll('.cta-btn, .hero-btn');

    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add click animation
            this.style.transform = 'scale(0.95)';

            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);

            // Track button clicks for analytics (demo)
            const buttonText = this.textContent.trim();
            console.log(`CTA clicked: ${buttonText}`);
        });
    });
}

// Initialize testimonials carousel (if present)
function initializeTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial');

    if (testimonials.length === 0) return;

    let currentTestimonial = 0;

    // Auto-rotate testimonials every 5 seconds
    setInterval(() => {
        testimonials[currentTestimonial].style.opacity = '0';

        currentTestimonial = (currentTestimonial + 1) % testimonials.length;

        setTimeout(() => {
            testimonials.forEach((testimonial, index) => {
                testimonial.style.display = index === currentTestimonial ? 'block' : 'none';
            });

            testimonials[currentTestimonial].style.opacity = '1';
        }, 300);
    }, 5000);
}

// Newsletter signup (if present)
function initializeNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');

    if (!newsletterForm) return;

    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput?.value;

        if (!email) {
            AgriSense.showNotification('Please enter your email address', 'warning');
            return;
        }

        // Simple email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            AgriSense.showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Save email to local storage (demo)
        let subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
        if (!subscribers.includes(email)) {
            subscribers.push(email);
            localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
        }

        AgriSense.showNotification('Thank you for subscribing!', 'success');
        emailInput.value = '';
    });
}

// Add floating action button for quick access
function addFloatingActionButton() {
    const fab = document.createElement('div');
    fab.className = 'floating-action-btn';
    fab.innerHTML = '🌾';
    fab.title = 'Quick Access Menu';

    fab.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #16a34a, #22c55e);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(22, 163, 74, 0.3);
        z-index: 1000;
        transition: all 0.3s ease;
    `;

    fab.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.boxShadow = '0 6px 25px rgba(22, 163, 74, 0.4)';
    });

    fab.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 4px 20px rgba(22, 163, 74, 0.3)';
    });

    fab.addEventListener('click', function() {
        showQuickAccessMenu();
    });

    document.body.appendChild(fab);
}

function showQuickAccessMenu() {
    const menu = document.createElement('div');
    menu.className = 'quick-access-menu';
    menu.innerHTML = `
        <div class="menu-overlay" onclick="this.parentElement.remove()"></div>
        <div class="menu-content">
            <h3>Quick Access</h3>
            <div class="menu-items">
                <a href="plant-disease.html" class="menu-item">
                    <span>🔍</span>
                    <span>Disease Detection</span>
                </a>
                <a href="crop.html" class="menu-item">
                    <span>🌾</span>
                    <span>Crop Recommendations</span>
                </a>
                <a href="market.html" class="menu-item">
                    <span>📊</span>
                    <span>Market Trends</span>
                </a>
                <a href="about.html" class="menu-item">
                    <span>ℹ️</span>
                    <span>Contact Us</span>
                </a>
            </div>
        </div>
    `;

    menu.style.cssText = `
        position: fixed;
        bottom: 5rem;
        right: 2rem;
        z-index: 10000;
    `;

    const menuContent = menu.querySelector('.menu-content');
    menuContent.style.cssText = `
        background: white;
        border-radius: 1rem;
        padding: 1.5rem;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        min-width: 200px;
    `;

    document.body.appendChild(menu);

    // Auto close after 5 seconds
    setTimeout(() => {
        menu.remove();
    }, 5000);
}

// Initialize all features
document.addEventListener('DOMContentLoaded', function() {
    initializeCTAButtons();
    initializeTestimonials();
    initializeNewsletter();

    // Add FAB after a delay
    setTimeout(() => {
        addFloatingActionButton();
    }, 2000);
});

// Add typing effect for hero title
function addTypingEffect() {
    const heroTitle = document.querySelector('.hero-title h1');
    if (!heroTitle) return;

    const originalText = heroTitle.textContent;
    heroTitle.textContent = '';

    let i = 0;
    const typeWriter = () => {
        if (i < originalText.length) {
            heroTitle.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    };

    // Start typing after hero animation
    setTimeout(typeWriter, 800);
}

// Performance monitoring
function trackPagePerformance() {
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`Page loaded in ${Math.round(loadTime)}ms`);

        // Track user engagement
        let engagementTime = 0;
        const startTime = Date.now();

        window.addEventListener('beforeunload', function() {
            engagementTime = Date.now() - startTime;
            console.log(`User engaged for ${Math.round(engagementTime / 1000)}s`);
        });
    });
}

// Initialize performance tracking
trackPagePerformance();
