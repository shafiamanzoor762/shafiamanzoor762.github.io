// ===== DOM Elements =====
const navbar = document.querySelector('.navbar');
const navbarToggler = document.querySelector('.navbar-toggler');
const navbarCollapse = document.querySelector('.navbar-collapse');
const navLinks = document.querySelectorAll('.nav-link');
const backToTopBtn = document.getElementById('back-to-top');
const body = document.body;

// ===== Mobile Menu =====
function initMobileMenu() {
    navbarToggler.addEventListener('click', () => {
        navbarToggler.classList.toggle('active');
        navbarCollapse.classList.toggle('show');
        body.style.overflow = navbarCollapse.classList.contains('show') ? 'hidden' : '';
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbarToggler.classList.remove('active');
            navbarCollapse.classList.remove('show');
            body.style.overflow = '';
        });
    });
}

// ===== Load Projects from JSON =====
async function loadProjects() {
    try {
        console.log('🚀 Loading projects...');
        const response = await fetch('data/projects.json');
        
        if (!response.ok) {
            throw new Error(`Failed to load: ${response.status}`);
        }
        
        const projects = await response.json();
        console.log('✅ Projects loaded:', projects.length);
        
        const container = document.getElementById('projects-container');
        if (!container) {
            console.error('Projects container not found!');
            return;
        }
        
        // Clear loading message
        container.innerHTML = '';
        
        projects.forEach((project, index) => {
            const projectEl = document.createElement('div');
            projectEl.className = 'project animate-on-scroll';
            projectEl.style.animationDelay = `${index * 0.1}s`;
            
            // Build cards HTML - Using local images from project_cover folder
            const cardsHTML = project.cards.map((card, cardIndex) => `
                <a href="${card.link}" target="_blank" rel="noopener noreferrer" class="project-card" style="animation-delay: ${cardIndex * 0.1}s">
                    <div class="project-image-container">
                        <!-- Check if image exists, otherwise use placeholder -->
                        <img src="${card.image}" alt="${card.alt}" class="project-image" loading="lazy" 
                             onerror="this.src='https://via.placeholder.com/400x300/7F55B1/FFFFFF?text=${encodeURIComponent(project.title)}'">
                        <div class="project-overlay">
                            <span class="view-btn">
                                <i class="fab fa-github"></i>
                                View on GitHub
                            </span>
                        </div>
                    </div>
                </a>
            `).join('');
            
            projectEl.innerHTML = `
                <h3>${project.title}</h3>
                <div class="project-cards">
                    ${cardsHTML}
                </div>
                <p class="project-description">${project.description}</p>
            `;
            
            container.appendChild(projectEl);
        });
        
        console.log('✨ All projects displayed successfully!');
        initScrollAnimations(); // Re-initialize animations for new elements
        
    } catch (error) {
        console.error('❌ Error loading projects:', error);
        const container = document.getElementById('projects-container');
        if (container) {
            container.innerHTML = `
                <div class="error-message" style="text-align: center; padding: 4rem; color: #aaa;">
                    <h3>Unable to Load Projects</h3>
                    <p>There was an error loading the project data. Please check:</p>
                    <ul style="text-align: left; display: inline-block; margin: 1rem 0;">
                        <li>The data/projects.json file exists</li>
                        <li>The JSON format is correct</li>
                        <li>Your internet connection is working</li>
                    </ul>
                    <button onclick="loadProjects()" class="btn btn-primary" style="margin-top: 1rem;">
                        <i class="fas fa-redo"></i> Try Again
                    </button>
                </div>
            `;
        }
    }
}

// ===== Smooth Scrolling =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                const offset = 80; // Navbar height
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - offset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

// ===== Back to Top =====
function initBackToTop() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== Scroll Animations =====
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Observe all elements with animation class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// ===== Navbar Scroll Effect =====
function initNavbarScroll() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active nav link based on scroll position
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// ===== Particle Animation =====
function initParticles() {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return;
    
    // Create particle elements
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: rgba(127, 85, 177, ${Math.random() * 0.3 + 0.1});
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: particleFloat ${Math.random() * 20 + 10}s infinite linear;
        `;
        particlesContainer.appendChild(particle);
    }
}

// Add particle animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes particleFloat {
        0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== Typing Effect for Hero =====
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    };
    
    // Start typing after a delay
    setTimeout(typeWriter, 1000);
}

// ===== Parallax Effect =====
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        const bgElements = document.querySelectorAll('.blob');
        bgElements.forEach((element, index) => {
            element.style.transform = `translateY(${rate * (index + 1) * 0.3}px)`;
        });
    });
}

// ===== Cursor Effect =====
function initCursorEffect() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    document.body.appendChild(cursor);
    
    const cursorFollower = document.createElement('div');
    cursorFollower.className = 'cursor-follower';
    document.body.appendChild(cursorFollower);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 100);
    });
    
    // Add cursor styles
    const cursorStyle = document.createElement('style');
    cursorStyle.textContent = `
        .cursor {
            position: fixed;
            width: 8px;
            height: 8px;
            background: var(--primary);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: difference;
            transition: transform 0.2s ease;
        }
        
        .cursor-follower {
            position: fixed;
            width: 40px;
            height: 40px;
            border: 2px solid rgba(127, 85, 177, 0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            transition: all 0.1s ease;
            mix-blend-mode: difference;
        }
        
        a:hover ~ .cursor,
        button:hover ~ .cursor {
            transform: scale(1.5);
        }
        
        a:hover ~ .cursor-follower,
        button:hover ~ .cursor-follower {
            transform: scale(0.5);
            background: rgba(127, 85, 177, 0.2);
        }
    `;
    document.head.appendChild(cursorStyle);
}

// ===== Preloader =====
function initPreloader() {
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="loading">
            <div></div>
            <div></div>
        </div>
        <p>Loading Portfolio...</p>
    `;
    document.body.prepend(preloader);
    
    // Add preloader styles
    const preloaderStyle = document.createElement('style');
    preloaderStyle.textContent = `
        .preloader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--dark-bg);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 99999;
            transition: opacity 0.5s ease, visibility 0.5s ease;
        }
        
        .preloader p {
            color: var(--text-light);
            margin-top: 2rem;
            font-size: 1.2rem;
            animation: pulse 2s infinite;
        }
    `;
    document.head.appendChild(preloaderStyle);
    
    // Hide preloader when page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }, 1000);
    });
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Portfolio initializing...');
    
    // Initialize preloader first
    initPreloader();
    
    // Initialize all features
    initMobileMenu();
    initSmoothScroll();
    initBackToTop();
    initNavbarScroll();
    initParallax();
    initParticles();
    initTypingEffect();
    initCursorEffect();
    
    // Load projects and initialize animations
    setTimeout(() => {
        loadProjects();
        initScrollAnimations();
    }, 500);
    
    console.log('✨ Portfolio ready!');
    
    // Add performance monitoring
    if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
    }
});

// ===== Window Resize Handler =====
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Reinitialize animations on resize
        initScrollAnimations();
    }, 250);
});

// ===== Error Handling =====
window.addEventListener('error', (e) => {
    console.error('Global error caught:', e.error);
});

// ===== Export for testing =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initMobileMenu,
        loadProjects,
        initScrollAnimations,
        initNavbarScroll,
        initParticles,
        initTypingEffect
    };
}
