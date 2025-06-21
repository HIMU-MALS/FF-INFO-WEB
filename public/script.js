class FreeFire {
    constructor() {
        this.form = document.getElementById('searchForm');
        this.loadingEl = document.getElementById('loading');
        this.errorEl = document.getElementById('error');
        this.resultsEl = document.getElementById('results');
        this.errorText = document.getElementById('errorText');
        this.themeToggle = document.getElementById('themeToggle');
        this.searchCountEl = document.getElementById('searchCount');
        
        this.searchCount = parseInt(localStorage.getItem('searchCount') || '0');
        this.updateSearchCount();
        
        this.bindEvents();
        this.initTheme();
        this.initAnimations();
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.searchPlayer();
        });

        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Add input validation and formatting
        const uidInput = document.getElementById('uid');
        uidInput.addEventListener('input', (e) => {
            // Remove non-numeric characters
            e.target.value = e.target.value.replace(/\D/g, '');
        });

        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                uidInput.focus();
            }
        });
    }

    initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.className = `${savedTheme}-theme`;
        this.updateThemeToggle(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.body.className = `${newTheme}-theme`;
        localStorage.setItem('theme', newTheme);
        this.updateThemeToggle(newTheme);
        
        // Add smooth transition effect
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    updateThemeToggle(theme) {
        const toggle = this.themeToggle.querySelector('.toggle-thumb');
        if (theme === 'dark') {
            toggle.style.transform = 'translateX(30px)';
        } else {
            toggle.style.transform = 'translateX(0)';
        }
    }

    initAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.info-card, .stat-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    async searchPlayer() {
        const uid = document.getElementById('uid').value.trim();
        const region = document.getElementById('region').value;

        if (!uid) {
            this.showError('Please enter a valid UID');
            return;
        }

        if (uid.length < 8) {
            this.showError('UID must be at least 8 digits long');
            return;
        }

        this.showLoading();
        this.hideError();
        this.hideResults();

        try {
            const response = await fetch(`/api/player-info?uid=${uid}&region=${region}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch player information');
            }

            this.displayResults(data);
            this.hideLoading();
            this.incrementSearchCount();

            // Smooth scroll to results
            setTimeout(() => {
                this.resultsEl.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }, 100);

        } catch (error) {
            console.error('Error:', error);
            this.showError(error.message);
            this.hideLoading();
        }
    }

    displayResults(data) {
        this.showResults();
        
        // Display images with error handling
        this.displayImages(data.images);
        
        // Update stats overview
        this.updateStatsOverview(data);
        
        // Display detailed information sections
        this.displayInfoSection('basicInfo', [
            { label: 'Nickname', value: data.basic.nickname, icon: 'fas fa-user' },
            { label: 'UID', value: data.basic.uid, icon: 'fas fa-hashtag' },
            { label: 'Level', value: data.basic.level, icon: 'fas fa-star' },
            { label: 'Experience', value: this.formatNumber(data.basic.exp), icon: 'fas fa-chart-line' },
            { label: 'Likes', value: this.formatNumber(data.basic.likes), icon: 'fas fa-heart' },
            { label: 'Region', value: data.basic.region, icon: 'fas fa-globe' },
            { label: 'Account Created', value: data.basic.accountCreated, icon: 'fas fa-calendar-plus' },
            { label: 'Last Login', value: data.basic.lastLogin, icon: 'fas fa-clock' },
            { label: 'Signature', value: data.basic.signature, icon: 'fas fa-quote-left' }
        ]);

        this.displayInfoSection('battleStats', [
            { label: 'BR Rank Points', value: this.formatNumber(data.battleStats.brRankPoints), icon: 'fas fa-trophy' },
            { label: 'CS Rank Points', value: this.formatNumber(data.battleStats.csRankPoints), icon: 'fas fa-crosshairs' },
            { label: 'BP Level', value: data.battleStats.bpLevel, icon: 'fas fa-medal' },
            { label: 'CS Max Rank', value: data.battleStats.csMaxRank, icon: 'fas fa-crown' },
            { label: 'CS Rank', value: data.battleStats.csRank, icon: 'fas fa-award' },
            { label: 'Max Rank', value: data.battleStats.maxRank, icon: 'fas fa-star' },
            { label: 'Current Rank', value: data.battleStats.rank, icon: 'fas fa-ranking-star' },
            { label: 'Season ID', value: data.battleStats.seasonId, icon: 'fas fa-calendar' },
            { label: 'Release Version', value: data.battleStats.releaseVersion, icon: 'fas fa-code-branch' },
            { label: 'Diamond Cost', value: this.formatNumber(data.battleStats.diamondCost), icon: 'fas fa-gem' },
            { label: 'Credit Score', value: this.formatNumber(data.battleStats.creditScore), icon: 'fas fa-shield-alt' }
        ]);

        this.displayInfoSection('appearance', [
            { label: 'Badge Count', value: data.appearance.badgeCount, icon: 'fas fa-badge' },
            { label: 'Badge ID', value: data.appearance.badgeId, icon: 'fas fa-id-badge' },
            { label: 'Banner ID', value: data.appearance.bannerId, icon: 'fas fa-flag' },
            { label: 'Avatar ID', value: data.appearance.avatarId, icon: 'fas fa-user-circle' },
            { label: 'Title ID', value: data.appearance.titleId, icon: 'fas fa-tag' }
        ]);

        this.displayInfoSection('petInfo', [
            { label: 'Pet Name', value: data.pet.name, icon: 'fas fa-paw' },
            { label: 'Pet Level', value: data.pet.level, icon: 'fas fa-star' },
            { label: 'Pet Experience', value: this.formatNumber(data.pet.exp), icon: 'fas fa-chart-line' },
            { label: 'Selected Skill ID', value: data.pet.selectedSkillId, icon: 'fas fa-magic' },
            { label: 'Skin ID', value: data.pet.skinId, icon: 'fas fa-palette' }
        ]);

        this.displayInfoSection('guildInfo', [
            { label: 'Guild Name', value: data.guild.name, icon: 'fas fa-users' },
            { label: 'Guild Level', value: data.guild.level, icon: 'fas fa-star' },
            { label: 'Capacity', value: data.guild.capacity, icon: 'fas fa-user-friends' },
            { label: 'Members', value: data.guild.members, icon: 'fas fa-user-plus' },
            { label: 'Guild ID', value: data.guild.guildId, icon: 'fas fa-hashtag' },
            { label: 'Owner UID', value: data.guild.ownerUid, icon: 'fas fa-crown' },
            { label: 'Owner Nickname', value: data.guild.ownerNickname, icon: 'fas fa-user-crown' },
            { label: 'Owner Level', value: data.guild.ownerLevel, icon: 'fas fa-star' },
            { label: 'Owner Likes', value: this.formatNumber(data.guild.ownerLikes), icon: 'fas fa-heart' }
        ]);

        this.displayInfoSection('socialInfo', [
            { label: 'Gender', value: data.social.gender, icon: 'fas fa-venus-mars' },
            { label: 'Language', value: data.social.language, icon: 'fas fa-language' },
            { label: 'Mode Preference', value: data.social.modePrefer, icon: 'fas fa-gamepad' },
            { label: 'Rank Show', value: data.social.rankShow, icon: 'fas fa-eye' },
            { label: 'Time Active', value: data.social.timeActive, icon: 'fas fa-clock' }
        ]);

        this.displayInfoSection('weaponsInfo', [
            { label: 'Weapon Skins', value: data.weapons.skins, icon: 'fas fa-crosshairs' }
        ]);

        this.displayInfoSection('captainInfo', [
            { label: 'Captain Nickname', value: data.captain.nickname, icon: 'fas fa-user-tie' },
            { label: 'Captain Level', value: data.captain.level, icon: 'fas fa-star' },
            { label: 'Captain Likes', value: this.formatNumber(data.captain.likes), icon: 'fas fa-heart' },
            { label: 'Captain BR Rank Points', value: this.formatNumber(data.captain.brRankPoints), icon: 'fas fa-trophy' },
            { label: 'Captain CS Rank Points', value: this.formatNumber(data.captain.csRankPoints), icon: 'fas fa-crosshairs' },
            { label: 'Captain Last Login', value: data.captain.lastLogin, icon: 'fas fa-clock' }
        ]);

        // Trigger animations
        this.triggerResultAnimations();
    }

    displayImages(images) {
        const outfitImg = document.getElementById('outfitImage');
        const bannerImg = document.getElementById('bannerImage');
        
        // Add loading placeholder
        outfitImg.style.background = 'linear-gradient(45deg, #f0f0f0, #e0e0e0)';
        bannerImg.style.background = 'linear-gradient(45deg, #f0f0f0, #e0e0e0)';
        
        outfitImg.src = images.outfitUrl;
        bannerImg.src = images.bannerUrl;
        
        outfitImg.onerror = () => {
            outfitImg.style.display = 'none';
        };
        
        bannerImg.onerror = () => {
            bannerImg.style.display = 'none';
        };

        outfitImg.onload = () => {
            outfitImg.style.background = 'none';
        };

        bannerImg.onload = () => {
            bannerImg.style.background = 'none';
        };
    }

    updateStatsOverview(data) {
        document.getElementById('playerLevel').textContent = data.basic.level || '-';
        document.getElementById('playerLikes').textContent = this.formatNumber(data.basic.likes) || '-';
        document.getElementById('playerRank').textContent = this.formatNumber(data.battleStats.brRankPoints) || '-';
        document.getElementById('creditScore').textContent = this.formatNumber(data.battleStats.creditScore) || '-';
    }

    displayInfoSection(sectionId, items) {
        const section = document.getElementById(sectionId);
        section.innerHTML = '';

        items.forEach((item, index) => {
            const infoItem = document.createElement('div');
            infoItem.className = 'info-item';
            infoItem.style.animationDelay = `${index * 0.1}s`;
            
            const label = document.createElement('span');
            label.className = 'info-label';
            label.innerHTML = `<i class="${item.icon || 'fas fa-info'}"></i> ${item.label}`;
            
            const value = document.createElement('span');
            value.className = 'info-value';
            value.textContent = item.value || '-';
            
            infoItem.appendChild(label);
            infoItem.appendChild(value);
            section.appendChild(infoItem);
        });
    }

    triggerResultAnimations() {
        const cards = document.querySelectorAll('.info-card, .stat-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    formatNumber(num) {
        if (!num || num === '-') return '-';
        const number = parseInt(num);
        if (isNaN(number)) return num;
        
        if (number >= 1000000) {
            return (number / 1000000).toFixed(1) + 'M';
        } else if (number >= 1000) {
            return (number / 1000).toFixed(1) + 'K';
        }
        return number.toLocaleString();
    }

    incrementSearchCount() {
        this.searchCount++;
        localStorage.setItem('searchCount', this.searchCount.toString());
        this.updateSearchCount();
    }

    updateSearchCount() {
        this.searchCountEl.textContent = this.formatNumber(this.searchCount);
    }

    showLoading() {
        this.loadingEl.classList.remove('hidden');
        // Add loading animation to search button
        const searchBtn = document.querySelector('.search-btn');
        searchBtn.style.opacity = '0.7';
        searchBtn.style.pointerEvents = 'none';
    }

    hideLoading() {
        this.loadingEl.classList.add('hidden');
        // Reset search button
        const searchBtn = document.querySelector('.search-btn');
        searchBtn.style.opacity = '1';
        searchBtn.style.pointerEvents = 'auto';
    }

    showError(message) {
        this.errorText.textContent = message;
        this.errorEl.classList.remove('hidden');
        
        // Add shake animation
        this.errorEl.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            this.errorEl.style.animation = '';
        }, 500);
    }

    hideError() {
        this.errorEl.classList.add('hidden');
    }

    showResults() {
        this.resultsEl.classList.remove('hidden');
    }

    hideResults() {
        this.resultsEl.classList.add('hidden');
    }
}

// Add shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new FreeFire();
    
    // Add some easter eggs
    console.log(`
    🔥 FreeFire Pro - Advanced Player Analytics
    
    Created by: Himu Mals
    Version: 2.0.0
    
    Keyboard Shortcuts:
    - Ctrl + K: Focus search input
    - Ctrl + D: Toggle dark mode
    
    Enjoy exploring player statistics! 🎮
    `);
    
    // Add keyboard shortcut for theme toggle
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'd') {
            e.preventDefault();
            document.getElementById('themeToggle').click();
        }
    });
});