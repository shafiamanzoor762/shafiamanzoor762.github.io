// Enhanced Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    const body = document.body;
    
    // Toggle mobile menu
    navbarToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navbarMenu.classList.toggle('active');
        body.classList.toggle('no-scroll');
        
        // Toggle aria-expanded for accessibility
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
    });
    
    // Close menu when clicking on nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navbarToggle.classList.remove('active');
            navbarMenu.classList.remove('active');
            body.classList.remove('no-scroll');
            navbarToggle.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navbarMenu.contains(e.target) && !navbarToggle.contains(e.target)) {
            navbarToggle.classList.remove('active');
            navbarMenu.classList.remove('active');
            body.classList.remove('no-scroll');
            navbarToggle.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Make skills section horizontally scrollable on mobile
    const skillsContainer = document.querySelector('.skills-scroll-container');
    if (skillsContainer) {
        let isDown = false;
        let startX;
        let scrollLeft;
        
        skillsContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - skillsContainer.offsetLeft;
            scrollLeft = skillsContainer.scrollLeft;
        });
        
        skillsContainer.addEventListener('mouseleave', () => {
            isDown = false;
        });
        
        skillsContainer.addEventListener('mouseup', () => {
            isDown = false;
        });
        
        skillsContainer.addEventListener('mousemove', (e) => {
            if(!isDown) return;
            e.preventDefault();
            const x = e.pageX - skillsContainer.offsetLeft;
            const walk = (x - startX) * 2;
            skillsContainer.scrollLeft = scrollLeft - walk;
        });
        
        // Touch events for mobile
        skillsContainer.addEventListener('touchstart', (e) => {
            isDown = true;
            startX = e.touches[0].pageX - skillsContainer.offsetLeft;
            scrollLeft = skillsContainer.scrollLeft;
        });
        
        skillsContainer.addEventListener('touchend', () => {
            isDown = false;
        });
        
        skillsContainer.addEventListener('touchmove', (e) => {
            if(!isDown) return;
            e.preventDefault();
            const x = e.touches[0].pageX - skillsContainer.offsetLeft;
            const walk = (x - startX) * 2;
            skillsContainer.scrollLeft = scrollLeft - walk;
        });
    }
});

// Fetch GitHub Profile Data
async function fetchGitHubProfile(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    const data = await response.json();
    
    // Update profile card
    document.querySelector('.github-name').textContent = data.name || username;
    document.querySelector('.github-username').textContent = `@${data.login}`;
    document.getElementById('repos').textContent = data.public_repos;
    document.getElementById('followers').textContent = data.followers;
    document.getElementById('following').textContent = data.following;
    
    // Update avatar if not already set
    const avatar = document.querySelector('.github-avatar');
    if (!avatar.src.includes('github.com')) {
      avatar.src = data.avatar_url;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching GitHub profile:', error);
  }
}

// Fetch GitHub Repositories
async function fetchGitHubRepos(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&direction=desc`);
    const repos = await response.json();
    
    const repoGrid = document.querySelector('.repo-grid');
    repoGrid.innerHTML = ''; // Clear existing content
    
    // Display first 6 repositories
    repos.slice(0, 6).forEach(repo => {
      const repoCard = document.createElement('div');
      repoCard.className = 'repo-card';
      repoCard.innerHTML = `
        <h4 class="repo-name">
          <a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a>
        </h4>
        <p class="repo-description">${repo.description || 'No description provided'}</p>
        <div class="repo-meta">
          <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
          <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
          <span><i class="fas fa-circle" style="color: ${repo.language ? '#7F55B1' : '#ccc'}"></i> ${repo.language || 'Unknown'}</span>
        </div>
      `;
      repoGrid.appendChild(repoCard);
    });
    
    return repos;
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
  }
}

// Initialize GitHub Cards
document.addEventListener('DOMContentLoaded', () => {
  const githubUsername = 'your-github-username'; // Replace with your username
  
  // Load GitHub data
  fetchGitHubProfile(githubUsername);
  fetchGitHubRepos(githubUsername);
  
  // If using GitHub Cards widget
  if (typeof GitHubCard !== 'undefined') {
    GitHubCard.widget(document.querySelectorAll('.github-card'));
  }
});