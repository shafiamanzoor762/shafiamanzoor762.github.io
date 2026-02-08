// ===== GitHub Cards Integration - Enhanced =====

const GitHubCards = {
    // Configuration
    config: {
        username: 'shafiamanzoor762',
        cacheDuration: 3600000, // 1 hour
        apiTimeout: 10000, // 10 seconds
        retryAttempts: 3
    },

    // Cache system
    cache: new Map(),

    // Initialize GitHub cards
    async init() {
        console.log('🚀 Initializing GitHub Cards...');
        
        try {
            await this.loadUserProfile();
            await this.loadUserRepos();
            await this.loadUserStats();
            this.renderAllCards();
            
            console.log('✅ GitHub Cards initialized successfully');
        } catch (error) {
            console.error('❌ GitHub Cards initialization failed:', error);
            this.showError();
        }
    },

    // Load user profile
    async loadUserProfile() {
        const cacheKey = 'github_profile';
        const cached = this.getCached(cacheKey);
        
        if (cached) {
            console.log('📁 Using cached GitHub profile');
            this.userProfile = cached;
            return;
        }

        console.log('🌐 Fetching GitHub profile...');
        
        try {
            const response = await this.fetchWithTimeout(
                `https://api.github.com/users/${this.config.username}`,
                {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }

            const data = await response.json();
            this.userProfile = data;
            this.setCached(cacheKey, data);
            
            console.log('✅ GitHub profile loaded:', data.login);
        } catch (error) {
            console.error('❌ Error loading GitHub profile:', error);
            throw error;
        }
    },

    // Load user repositories
    async loadUserRepos() {
        const cacheKey = 'github_repos';
        const cached = this.getCached(cacheKey);
        
        if (cached) {
            console.log('📁 Using cached GitHub repos');
            this.userRepos = cached;
            return;
        }

        console.log('🌐 Fetching GitHub repositories...');
        
        try {
            const response = await this.fetchWithTimeout(
                `https://api.github.com/users/${this.config.username}/repos`,
                {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }

            const data = await response.json();
            this.userRepos = data
                .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
                .slice(0, 6);
            
            this.setCached(cacheKey, this.userRepos);
            
            console.log('✅ GitHub repos loaded:', this.userRepos.length);
        } catch (error) {
            console.error('❌ Error loading GitHub repos:', error);
            throw error;
        }
    },

    // Load user statistics
    async loadUserStats() {
        console.log('📊 Loading GitHub statistics...');
        
        // Use GitHub Readme Stats as fallback
        this.stats = {
            topLanguages: `https://github-readme-stats.vercel.app/api/top-langs?username=${this.config.username}&locale=en&hide_title=false&layout=compact&card_width=320&langs_count=5&theme=dark&hide_border=true&order=2`,
            streakStats: `https://github-readme-streak-stats.herokuapp.com/?user=${this.config.username}&theme=dark&hide_border=true`,
            profileStats: `https://github-readme-stats.vercel.app/api?username=${this.config.username}&show_icons=true&theme=dark&hide_border=true`
        };
    },

    // Render all GitHub cards
    renderAllCards() {
        this.renderProfileCard();
        this.renderReposCards();
        this.renderStatsCards();
        this.attachEventListeners();
    },

    // Render profile card
    renderProfileCard() {
        const container = document.querySelector('.github-profile-card');
        if (!container || !this.userProfile) return;

        const html = `
            <div class="github-profile glass-card">
                <div class="profile-header">
                    <img src="${this.userProfile.avatar_url}" alt="${this.userProfile.name || this.userProfile.login}" class="profile-avatar">
                    <div class="profile-info">
                        <h3 class="profile-name">${this.userProfile.name || this.userProfile.login}</h3>
                        <p class="profile-username">@${this.userProfile.login}</p>
                    </div>
                </div>
                <div class="profile-bio">
                    <p>${this.userProfile.bio || 'Full-Stack Developer passionate about creating amazing web experiences.'}</p>
                </div>
                <div class="profile-stats">
                    <div class="stat">
                        <span class="stat-number">${this.userProfile.public_repos}</span>
                        <span class="stat-label">Repos</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">${this.userProfile.followers}</span>
                        <span class="stat-label">Followers</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">${this.userProfile.following}</span>
                        <span class="stat-label">Following</span>
                    </div>
                </div>
                <a href="${this.userProfile.html_url}" target="_blank" rel="noopener" class="profile-link">
                    <i class="fab fa-github"></i>
                    View GitHub Profile
                </a>
            </div>
        `;

        container.innerHTML = html;
    },

    // Render repository cards
    renderReposCards() {
        const container = document.querySelector('.github-repos-cards');
        if (!container || !this.userRepos) return;

        container.innerHTML = this.userRepos.map((repo, index) => `
            <div class="github-repo-card glass-card animate-on-scroll" style="animation-delay: ${index * 0.1}s">
                <div class="repo-header">
                    <h4 class="repo-title">
                        <a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a>
                        ${repo.fork ? '<span class="repo-fork">Fork</span>' : ''}
                    </h4>
                    ${repo.topics && repo.topics.length > 0 ? `
                        <div class="repo-topics">
                            ${repo.topics.slice(0, 3).map(topic => `
                                <span class="repo-topic">${topic}</span>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
                <p class="repo-description">${repo.description || 'No description available'}</p>
                <div class="repo-footer">
                    <div class="repo-language">
                        <span class="language-dot" style="background-color: ${this.getLanguageColor(repo.language)}"></span>
                        <span class="language-name">${repo.language || 'Unknown'}</span>
                    </div>
                    <div class="repo-stats">
                        <span class="repo-stat">
                            <i class="fas fa-star"></i>
                            ${this.formatNumber(repo.stargazers_count)}
                        </span>
                        <span class="repo-stat">
                            <i class="fas fa-code-branch"></i>
                            ${this.formatNumber(repo.forks_count)}
                        </span>
                    </div>
                </div>
                <div class="repo-updated">
                    Updated ${this.timeSince(new Date(repo.updated_at))}
                </div>
            </div>
        `).join('');
    },

    // Render statistics cards
    renderStatsCards() {
        const container = document.querySelector('.github-stats-cards');
        if (!container || !this.stats) return;

        container.innerHTML = `
            <div class="github-stats-grid">
                <div class="stats-card glass-card">
                    <h4>Top Languages</h4>
                    <img src="${this.stats.topLanguages}" alt="Top Languages" class="stats-image" loading="lazy">
                </div>
                <div class="stats-card glass-card">
                    <h4>GitHub Streak</h4>
                    <img src="${this.stats.streakStats}" alt="GitHub Streak" class="stats-image" loading="lazy">
                </div>
                <div class="stats-card glass-card">
                    <h4>Profile Stats</h4>
                    <img src="${this.stats.profileStats}" alt="GitHub Stats" class="stats-image" loading="lazy">
                </div>
            </div>
        `;
    },

    // Attach event listeners
    attachEventListeners() {
        // Add hover effects to repo cards
        document.querySelectorAll('.github-repo-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });

        // Add click tracking
        document.querySelectorAll('a[href*="github.com"]').forEach(link => {
            link.addEventListener('click', () => {
                console.log(`🌐 GitHub link clicked: ${link.href}`);
            });
        });
    },

    // Helper: Fetch with timeout
    async fetchWithTimeout(url, options = {}) {
        const { timeout = this.config.apiTimeout } = options;
        
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            
            clearTimeout(id);
            return response;
        } catch (error) {
            clearTimeout(id);
            throw error;
        }
    },

    // Helper: Get cached data
    getCached(key) {
        const item = this.cache.get(key);
        
        if (!item) return null;
        
        const now = Date.now();
        if (now - item.timestamp > this.config.cacheDuration) {
            this.cache.delete(key);
            return null;
        }
        
        return item.data;
    },

    // Helper: Set cached data
    setCached(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    },

    // Helper: Get language color
    getLanguageColor(language) {
        const colors = {
            'Python': '#3572A5',
            'JavaScript': '#F1E05A',
            'TypeScript': '#2B7A0B',
            'Java': '#b07219',
            'C#': '#239120',
            'Swift': '#FA7343',
            'Kotlin': '#7F52FF',
            'Go': '#00ADD8',
            'Rust': '#CE422B',
            'Ruby': '#CC342D',
            'PHP': '#777BB4',
            'C++': '#00599C',
            'C': '#A8B9CC',
            'HTML': '#E34C26',
            'CSS': '#563D7C',
            'SQL': '#336791',
            'Dart': '#00B4AB',
            'Shell': '#89E051',
            'Objective-C': '#438EFF',
            'PowerShell': '#012456',
            'SCSS': '#C6538C',
            'Less': '#1D365D',
            'Markdown': '#083FA1'
        };
        
        return colors[language] || '#858585';
    },

    // Helper: Format number
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num;
    },

    // Helper: Time since
    timeSince(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        
        let interval = seconds / 31536000;
        if (interval > 1) {
            return Math.floor(interval) + ' years ago';
        }
        
        interval = seconds / 2592000;
        if (interval > 1) {
            return Math.floor(interval) + ' months ago';
        }
        
        interval = seconds / 86400;
        if (interval > 1) {
            return Math.floor(interval) + ' days ago';
        }
        
        interval = seconds / 3600;
        if (interval > 1) {
            return Math.floor(interval) + ' hours ago';
        }
        
        interval = seconds / 60;
        if (interval > 1) {
            return Math.floor(interval) + ' minutes ago';
        }
        
        return Math.floor(seconds) + ' seconds ago';
    },

    // Show error state
    showError() {
        const containers = [
            '.github-profile-card',
            '.github-repos-cards',
            '.github-stats-cards'
        ];
        
        containers.forEach(selector => {
            const container = document.querySelector(selector);
            if (container) {
                container.innerHTML = `
                    <div class="github-error glass-card">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Unable to load GitHub data</p>
                        <small>Please check your connection and try again</small>
                        <button class="retry-btn" onclick="GitHubCards.init()">
                            <i class="fas fa-redo"></i>
                            Retry
                        </button>
                    </div>
                `;
            }
        });
    },

    // Clear cache
    clearCache() {
        this.cache.clear();
        console.log('🗑️ GitHub cache cleared');
    },

    // Refresh data
    async refresh() {
        console.log('🔄 Refreshing GitHub data...');
        this.clearCache();
        await this.init();
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if GitHub integration is needed
    const hasGitHubElements =
        document.querySelector('.github-profile-card') ||
        document.querySelector('.github-repos-cards') ||
        document.querySelector('.github-stats-cards');
    
    if (hasGitHubElements) {
        GitHubCards.init().catch(console.error);
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GitHubCards;
}

// Global access
window.GitHubCards = GitHubCards;

// Rate limiting helper
function checkGitHubRateLimit() {
    fetch('https://api.github.com/rate_limit')
        .then(response => response.json())
        .then(data => {
            const remaining = data.resources.core.remaining;
            const limit = data.resources.core.limit;
            const resetTime = new Date(data.resources.core.reset * 1000);
            
            console.log(`GitHub API Rate Limit: ${remaining}/${limit}`);
            console.log(`Resets at: ${resetTime.toLocaleTimeString()}`);
            
            if (remaining < 10) {
                console.warn('⚠️ GitHub API rate limit running low');
            }
        })
        .catch(console.error);
}

// Periodically check rate limit
setInterval(checkGitHubRateLimit, 300000); // Every 5 minutes

// Initial rate limit check
setTimeout(checkGitHubRateLimit, 5000);
