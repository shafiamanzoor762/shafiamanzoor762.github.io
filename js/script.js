document.addEventListener('DOMContentLoaded', function () {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;

    // Toggle mobile menu
    navbarToggler.addEventListener('click', function () {
        this.classList.toggle('active');
        navbarCollapse.classList.toggle('show');
        body.classList.toggle('menu-open');

        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
    });

    // Close menu when a nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navbarToggler.classList.remove('active');
            navbarCollapse.classList.remove('show');
            body.classList.remove('menu-open');
            navbarToggler.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu on outside click
    document.addEventListener('click', function (e) {
        if (!navbarCollapse.contains(e.target) &&
            !navbarToggler.contains(e.target) &&
            navbarCollapse.classList.contains('show')) {
            navbarToggler.classList.remove('active');
            navbarCollapse.classList.remove('show');
            body.classList.remove('menu-open');
            navbarToggler.setAttribute('aria-expanded', 'false');
        }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navbarCollapse.classList.contains('show')) {
            navbarToggler.classList.remove('active');
            navbarCollapse.classList.remove('show');
            body.classList.remove('menu-open');
            navbarToggler.setAttribute('aria-expanded', 'false');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animate sections on scroll
    const animateOnScroll = function () {
        const elements = document.querySelectorAll('.section-title, .skill-item, .project, .contact-link, .stat-card');
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementPosition < windowHeight - 100) {
                element.classList.add('fade-in');
            }
        });
    };
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    // Hover effect on project cards
    const projectCards = document.querySelectorAll('.github-card');
    projectCards.forEach(card => {
        card.classList.add('hover-grow');
    });

    // Back to top button
    const backToTopButton = document.querySelector('#back-to-top');
    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    backToTopButton.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});







// Fetch and render projects
document.addEventListener('DOMContentLoaded', function() {
// Replace the projects array with this:
fetch('data/projects.json')
  .then(response => response.json())
  .then(projects => {
    

  const projectsContainer = document.getElementById('projects');
  
  // Clear any placeholder content
  projectsContainer.querySelectorAll('.project').forEach(el => el.remove());
  
  // Render each project
  projects.forEach(project => {
    const projectEl = document.createElement('div');
    projectEl.className = 'project animate__animated animate__fadeInUp';
    
    // Create cards HTML
    const cardsHTML = project.cards.map(card => `
      <a href="${card.link}" target="_blank" class="project-card animate__animated animate__fadeIn">
        <img src="${card.image}" alt="${card.alt}" class="project-image">
      </a>
    `).join('');
    
    // Set project HTML
    projectEl.innerHTML = `
      <h3>${project.title}</h3>
      <div class="project-cards">${cardsHTML}</div>
      <p class="project-description">${project.description}</p>
    `;
    
    projectsContainer.appendChild(projectEl);
    
    // Add staggered animation
    const cards = projectEl.querySelectorAll('.project-card');
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
    });
  });

  })
  .catch(error => console.error('Error loading projects:', error));


});