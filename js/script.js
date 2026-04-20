// DOM Elements
const navbar = document.querySelector('.navbar');
const navbarToggler = document.querySelector('.navbar-toggler');
const navbarCollapse = document.querySelector('.navbar-collapse');
const navLinks = document.querySelectorAll('.nav-link');
const backToTopBtn = document.getElementById('back-to-top');

// Mobile menu
navbarToggler?.addEventListener('click', () => {
    navbarToggler.classList.toggle('active');
    navbarCollapse.classList.toggle('show');
    document.body.style.overflow = navbarCollapse.classList.contains('show') ? 'hidden' : '';
});
navLinks.forEach(link => link.addEventListener('click', () => {
    navbarToggler.classList.remove('active');
    navbarCollapse.classList.remove('show');
    document.body.style.overflow = '';
}));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        }
    });
});

// Back to top
window.addEventListener('scroll', () => {
    backToTopBtn?.classList.toggle('show', window.scrollY > 500);
});
backToTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Navbar scroll effect
window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 50);
});

// Scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

// Load Projects from JSON
async function loadProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;
    try {
        const res = await fetch('data/projects.json');
        const projects = await res.json();
        container.innerHTML = '';
        projects.forEach((project, i) => {
            const div = document.createElement('div');
            div.className = 'project animate-on-scroll';
            div.style.animationDelay = `${i * 0.1}s`;
            div.innerHTML = `
                <h3>${project.title}</h3>
                <div class="project-cards">
                    ${project.cards.map(card => `
                        <a href="${card.link}" target="_blank" rel="noopener" class="project-card">
                            <div class="project-image-container">
                                <img src="${card.image}" alt="${card.alt}" class="project-image" loading="lazy">
                                <div class="project-overlay"><span class="view-btn">View Project</span></div>
                            </div>
                        </a>
                    `).join('')}
                </div>
                <p class="project-description">${project.description}</p>
            `;
            container.appendChild(div);
        });
        document.querySelectorAll('.project.animate-on-scroll').forEach(el => observer.observe(el));
    } catch (err) {
        console.error('Projects load error:', err);
        container.innerHTML = '<p class="error">Unable to load projects.</p>';
    }
}

// Load Work Experience from JSON
async function loadExperience() {
    const container = document.getElementById('experience-container');
    if (!container) return;
    try {
        const res = await fetch('data/work-experience.json');
        const experiences = await res.json();
        container.innerHTML = '';
        experiences.forEach((exp, i) => {
            const div = document.createElement('div');
            div.className = 'experience-card glass-card animate-on-scroll';
            div.style.animationDelay = `${i * 0.1}s`;
            div.innerHTML = `
                <div class="exp-header">
                    <div>
                        <h3 class="exp-title">${exp.title}</h3>
                        <div class="exp-company">${exp.company}</div>
                    </div>
                    <div class="exp-period">${exp.period}</div>
                </div>
                <div class="exp-description">${exp.description}</div>
                <div class="exp-tech">
                    ${exp.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            `;
            container.appendChild(div);
        });
        document.querySelectorAll('.experience-card').forEach(el => observer.observe(el));
    } catch (err) {
        console.error('Experience load error:', err);
        container.innerHTML = '<p class="error">Work experience data unavailable.</p>';
    }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    loadExperience();
});