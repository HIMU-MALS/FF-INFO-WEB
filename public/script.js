class UltraFreeFire {
    constructor() {
        this.form = document.getElementById('searchForm');
        this.loadingEl = document.getElementById('loading');
        this.errorEl = document.getElementById('error');
        this.resultsEl = document.getElementById('results');
        this.errorText = document.getElementById('errorText');
        this.themeToggle = document.getElementById('themeToggle');
        this.qualityToggle = document.getElementById('qualityToggle');
        this.searchCountEl = document.getElementById('searchCount');
        this.performanceMonitor = document.getElementById('performanceMonitor');
        
        this.searchCount = parseInt(localStorage.getItem('searchCount') || '0');
        this.isHighQuality = localStorage.getItem('quality') !== 'low';
        this.fps = 0;
        this.frameCount = 0;
        this.lastTime = performance.now();
        
        this.init();
    }

    init() {
        this.updateSearchCount();
        this.bindEvents();
        this.initTheme();
        this.initQuality();
        this.initPerformanceMonitoring();
        this.initUltraAnimations();
        this.initParticleSystem();
        this.preloadAssets();
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.searchPlayer();
        });

        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        this.qualityToggle.addEventListener('click', () => {
            this.toggleQuality();
        });

        // Enhanced input validation
        const uidInput = document.getElementById('uid');
        uidInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
            this.addInputParticles(e.target);
        });

        // Ultra keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                uidInput.focus();
                this.addFocusEffect(uidInput);
            }
            if (e.ctrlKey && e.key === 'd') {
                e.preventDefault();
                this.toggleTheme();
            }
            if (e.ctrlKey && e.key === 'q') {
                e.preventDefault();
                this.toggleQuality();
            }
        });

        // Touch optimizations for mobile
        this.addTouchOptimizations();
    }

    initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.className = `${savedTheme}-theme`;
        this.updateThemeToggle(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Ultra smooth theme transition
        document.body.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        document.body.className = `${newTheme}-theme`;
        localStorage.setItem('theme', newTheme);
        this.updateThemeToggle(newTheme);
        
        // Add theme change particles
        this.addThemeChangeEffect();
        
        setTimeout(() => {
            document.body.style.transition = '';
        }, 500);
    }

    updateThemeToggle(theme) {
        const toggle = this.themeToggle.querySelector('.toggle-thumb');
        if (theme === 'dark') {
            toggle.style.transform = 'translateX(30px)';
        } else {
            toggle.style.transform = 'translateX(0)';
        }
    }

    initQuality() {
        this.updateQualitySettings();
    }

    toggleQuality() {
        this.isHighQuality = !this.isHighQuality;
        localStorage.setItem('quality', this.isHighQuality ? 'high' : 'low');
        this.updateQualitySettings();
        this.addQualityChangeEffect();
    }

    updateQualitySettings() {
        const qualityText = this.qualityToggle.querySelector('.quality-text');
        if (this.isHighQuality) {
            qualityText.textContent = 'Ultra';
            document.body.classList.add('ultra-quality');
            document.body.classList.remove('low-quality');
        } else {
            qualityText.textContent = 'Low';
            document.body.classList.add('low-quality');
            document.body.classList.remove('ultra-quality');
        }
    }

    initPerformanceMonitoring() {
        this.startFPSMonitoring();
        this.monitorMemoryUsage();
        this.measureLoadTime();
    }

    startFPSMonitoring() {
        const updateFPS = (currentTime) => {
            this.frameCount++;
            
            if (currentTime >= this.lastTime + 1000) {
                this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
                document.getElementById('fpsValue').textContent = this.fps;
                
                // Adjust quality based on FPS
                if (this.fps < 30 && this.isHighQuality) {
                    this.autoReduceQuality();
                }
                
                this.frameCount = 0;
                this.lastTime = currentTime;
            }
            
            requestAnimationFrame(updateFPS);
        };
        
        requestAnimationFrame(updateFPS);
    }

    monitorMemoryUsage() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
                document.getElementById('memoryUsage').textContent = `${usedMB}MB`;
            }, 2000);
        }
    }

    measureLoadTime() {
        window.addEventListener('load', () => {
            const loadTime = Math.round(performance.now());
            document.getElementById('loadTime').textContent = `${loadTime}ms`;
        });
    }

    autoReduceQuality() {
        if (this.isHighQuality) {
            this.isHighQuality = false;
            this.updateQualitySettings();
            this.showNotification('Quality reduced for better performance', 'info');
        }
    }

    initUltraAnimations() {
        // Enhanced intersection observer with better performance
        const observerOptions = {
            threshold: [0, 0.1, 0.5, 1],
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target, entry.intersectionRatio);
                }
            });
        }, observerOptions);

        // Observe all animatable elements
        document.querySelectorAll('.ultra-info-card, .stat-card, .feature-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(el);
        });
    }

    animateElement(element, ratio) {
        const delay = Array.from(element.parentNode.children).indexOf(element) * 100;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            this.addElementParticles(element);
        }, delay);
    }

    initParticleSystem() {
        if (!this.isHighQuality) return;

        this.createParticleSystem();
        this.createNeuralNetwork();
        this.createHeroParticles();
    }

    createParticleSystem() {
        const particleSystem = document.getElementById('particleSystem');
        const particleCount = window.innerWidth < 768 ? 30 : 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 1}px;
                height: ${Math.random() * 4 + 1}px;
                background: rgba(59, 130, 246, ${Math.random() * 0.5 + 0.2});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particleFloat ${Math.random() * 20 + 10}s infinite linear;
                animation-delay: ${Math.random() * 5}s;
            `;
            particleSystem.appendChild(particle);
        }

        // Add particle animation CSS
        this.addParticleCSS();
    }

    createNeuralNetwork() {
        const neuralNetwork = document.getElementById('neuralNetwork');
        const nodeCount = window.innerWidth < 768 ? 15 : 25;

        for (let i = 0; i < nodeCount; i++) {
            const node = document.createElement('div');
            node.className = 'neural-node';
            node.style.cssText = `
                position: absolute;
                width: 6px;
                height: 6px;
                background: rgba(0, 255, 136, 0.6);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: neuralPulse ${Math.random() * 3 + 2}s infinite ease-in-out;
                animation-delay: ${Math.random() * 2}s;
                box-shadow: 0 0 10px rgba(0, 255, 136, 0.4);
            `;
            neuralNetwork.appendChild(node);
        }
    }

    createHeroParticles() {
        const heroParticles = document.getElementById('heroParticles');
        const particleCount = window.innerWidth < 768 ? 20 : 40;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'hero-particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 3 + 1}px;
                height: ${Math.random() * 3 + 1}px;
                background: rgba(255, 107, 53, ${Math.random() * 0.6 + 0.2});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: heroParticleFloat ${Math.random() * 15 + 8}s infinite ease-in-out;
                animation-delay: ${Math.random() * 3}s;
            `;
            heroParticles.appendChild(particle);
        }
    }

    addParticleCSS() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes particleFloat {
                0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
            }
            
            @keyframes neuralPulse {
                0%, 100% { transform: scale(1); opacity: 0.6; }
                50% { transform: scale(1.5); opacity: 1; }
            }
            
            @keyframes heroParticleFloat {
                0%, 100% { transform: translateY(0px) translateX(0px); }
                25% { transform: translateY(-20px) translateX(10px); }
                50% { transform: translateY(-10px) translateX(-5px); }
                75% { transform: translateY(-30px) translateX(15px); }
            }
            
            .low-quality .particle,
            .low-quality .neural-node,
            .low-quality .hero-particle {
                display: none;
            }
        `;
        document.head.appendChild(style);
    }

    preloadAssets() {
        // Preload critical images and fonts
        const preloadLinks = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
            'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap'
        ];

        preloadLinks.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = href;
            document.head.appendChild(link);
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

        this.showUltraLoading();
        this.hideError();
        this.hideResults();

        try {
            const startTime = performance.now();
            const response = await fetch(`/api/player-info?uid=${uid}&region=${region}`);
            const data = await response.json();
            const loadTime = Math.round(performance.now() - startTime);

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch player information');
            }

            this.displayUltraResults(data);
            this.hideLoading();
            this.incrementSearchCount();
            this.showNotification(`Player data loaded in ${loadTime}ms`, 'success');

            // Ultra smooth scroll to results
            setTimeout(() => {
                this.resultsEl.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }, 200);

        } catch (error) {
            console.error('Error:', error);
            this.showError(error.message);
            this.hideLoading();
        }
    }

    displayUltraResults(data) {
        this.showResults();
        
        // Display images with ultra loading effects
        this.displayUltraImages(data.images);
        
        // Update stats with animations
        this.updateUltraStatsOverview(data);
        
        // Display info sections with staggered animations
        this.displayUltraInfoSections(data);
        
        // Trigger ultra result animations
        this.triggerUltraResultAnimations();
    }

    displayUltraImages(images) {
        const outfitImg = document.getElementById('outfitImage');
        const bannerImg = document.getElementById('bannerImage');
        
        // Add ultra loading effects
        this.addImageLoadingEffect(outfitImg);
        this.addImageLoadingEffect(bannerImg);
        
        outfitImg.src = images.outfitUrl;
        bannerImg.src = images.bannerUrl;
        
        outfitImg.onload = () => this.removeImageLoadingEffect(outfitImg);
        bannerImg.onload = () => this.removeImageLoadingEffect(bannerImg);
        
        outfitImg.onerror = () => this.handleImageError(outfitImg);
        bannerImg.onerror = () => this.handleImageError(bannerImg);
    }

    addImageLoadingEffect(img) {
        img.style.filter = 'blur(5px)';
        img.style.transform = 'scale(1.05)';
        img.style.transition = 'all 0.5s ease';
    }

    removeImageLoadingEffect(img) {
        img.style.filter = 'none';
        img.style.transform = 'scale(1)';
        this.addImageParticles(img);
    }

    handleImageError(img) {
        img.style.display = 'none';
        this.showNotification('Some images failed to load', 'warning');
    }

    updateUltraStatsOverview(data) {
        const stats = [
            { id: 'playerLevel', value: data.basic.level },
            { id: 'playerLikes', value: this.formatNumber(data.basic.likes) },
            { id: 'playerRank', value: this.formatNumber(data.battleStats.brRankPoints) },
            { id: 'creditScore', value: this.formatNumber(data.battleStats.creditScore) }
        ];

        stats.forEach((stat, index) => {
            setTimeout(() => {
                this.animateStatValue(stat.id, stat.value);
            }, index * 200);
        });
    }

    animateStatValue(elementId, finalValue) {
        const element = document.getElementById(elementId);
        const startValue = 0;
        const duration = 1000;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            
            if (typeof finalValue === 'string' && finalValue !== '-') {
                // For formatted numbers, animate the numeric part
                const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
                if (!isNaN(numericValue)) {
                    const currentValue = Math.round(startValue + (numericValue - startValue) * easeOutQuart);
                    element.textContent = this.formatNumber(currentValue);
                } else {
                    element.textContent = finalValue;
                }
            } else {
                element.textContent = finalValue || '-';
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.addStatParticles(element);
            }
        };

        requestAnimationFrame(animate);
    }

    displayUltraInfoSections(data) {
        const sections = [
            { id: 'basicInfo', data: this.getBasicInfoData(data) },
            { id: 'battleStats', data: this.getBattleStatsData(data) },
            { id: 'appearance', data: this.getAppearanceData(data) },
            { id: 'petInfo', data: this.getPetInfoData(data) },
            { id: 'guildInfo', data: this.getGuildInfoData(data) },
            { id: 'socialInfo', data: this.getSocialInfoData(data) },
            { id: 'weaponsInfo', data: this.getWeaponsInfoData(data) },
            { id: 'captainInfo', data: this.getCaptainInfoData(data) }
        ];

        sections.forEach((section, index) => {
            setTimeout(() => {
                this.displayUltraInfoSection(section.id, section.data);
            }, index * 150);
        });
    }

    getBasicInfoData(data) {
        return [
            { label: 'Nickname', value: data.basic.nickname, icon: 'fas fa-user' },
            { label: 'UID', value: data.basic.uid, icon: 'fas fa-hashtag' },
            { label: 'Level', value: data.basic.level, icon: 'fas fa-star' },
            { label: 'Experience', value: this.formatNumber(data.basic.exp), icon: 'fas fa-chart-line' },
            { label: 'Likes', value: this.formatNumber(data.basic.likes), icon: 'fas fa-heart' },
            { label: 'Region', value: data.basic.region, icon: 'fas fa-globe' },
            { label: 'Account Created', value: data.basic.accountCreated, icon: 'fas fa-calendar-plus' },
            { label: 'Last Login', value: data.basic.lastLogin, icon: 'fas fa-clock' },
            { label: 'Signature', value: data.basic.signature, icon: 'fas fa-quote-left' }
        ];
    }

    getBattleStatsData(data) {
        return [
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
        ];
    }

    getAppearanceData(data) {
        return [
            { label: 'Badge Count', value: data.appearance.badgeCount, icon: 'fas fa-badge' },
            { label: 'Badge ID', value: data.appearance.badgeId, icon: 'fas fa-id-badge' },
            { label: 'Banner ID', value: data.appearance.bannerId, icon: 'fas fa-flag' },
            { label: 'Avatar ID', value: data.appearance.avatarId, icon: 'fas fa-user-circle' },
            { label: 'Title ID', value: data.appearance.titleId, icon: 'fas fa-tag' }
        ];
    }

    getPetInfoData(data) {
        return [
            { label: 'Pet Name', value: data.pet.name, icon: 'fas fa-paw' },
            { label: 'Pet Level', value: data.pet.level, icon: 'fas fa-star' },
            { label: 'Pet Experience', value: this.formatNumber(data.pet.exp), icon: 'fas fa-chart-line' },
            { label: 'Selected Skill ID', value: data.pet.selectedSkillId, icon: 'fas fa-magic' },
            { label: 'Skin ID', value: data.pet.skinId, icon: 'fas fa-palette' }
        ];
    }

    getGuildInfoData(data) {
        return [
            { label: 'Guild Name', value: data.guild.name, icon: 'fas fa-users' },
            { label: 'Guild Level', value: data.guild.level, icon: 'fas fa-star' },
            { label: 'Capacity', value: data.guild.capacity, icon: 'fas fa-user-friends' },
            { label: 'Members', value: data.guild.members, icon: 'fas fa-user-plus' },
            { label: 'Guild ID', value: data.guild.guildId, icon: 'fas fa-hashtag' },
            { label: 'Owner UID', value: data.guild.ownerUid, icon: 'fas fa-crown' },
            { label: 'Owner Nickname', value: data.guild.ownerNickname, icon: 'fas fa-user-crown' },
            { label: 'Owner Level', value: data.guild.ownerLevel, icon: 'fas fa-star' },
            { label: 'Owner Likes', value: this.formatNumber(data.guild.ownerLikes), icon: 'fas fa-heart' }
        ];
    }

    getSocialInfoData(data) {
        return [
            { label: 'Gender', value: data.social.gender, icon: 'fas fa-venus-mars' },
            { label: 'Language', value: data.social.language, icon: 'fas fa-language' },
            { label: 'Mode Preference', value: data.social.modePrefer, icon: 'fas fa-gamepad' },
            { label: 'Rank Show', value: data.social.rankShow, icon: 'fas fa-eye' },
            { label: 'Time Active', value: data.social.timeActive, icon: 'fas fa-clock' }
        ];
    }

    getWeaponsInfoData(data) {
        return [
            { label: 'Weapon Skins', value: data.weapons.skins, icon: 'fas fa-crosshairs' }
        ];
    }

    getCaptainInfoData(data) {
        return [
            { label: 'Captain Nickname', value: data.captain.nickname, icon: 'fas fa-user-tie' },
            { label: 'Captain Level', value: data.captain.level, icon: 'fas fa-star' },
            { label: 'Captain Likes', value: this.formatNumber(data.captain.likes), icon: 'fas fa-heart' },
            { label: 'Captain BR Rank Points', value: this.formatNumber(data.captain.brRankPoints), icon: 'fas fa-trophy' },
            { label: 'Captain CS Rank Points', value: this.formatNumber(data.captain.csRankPoints), icon: 'fas fa-crosshairs' },
            { label: 'Captain Last Login', value: data.captain.lastLogin, icon: 'fas fa-clock' }
        ];
    }

    displayUltraInfoSection(sectionId, items) {
        const section = document.getElementById(sectionId);
        section.innerHTML = '';

        items.forEach((item, index) => {
            setTimeout(() => {
                const infoItem = document.createElement('div');
                infoItem.className = 'info-item';
                infoItem.style.opacity = '0';
                infoItem.style.transform = 'translateX(-20px)';
                infoItem.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                
                const label = document.createElement('span');
                label.className = 'info-label';
                label.innerHTML = `<i class="${item.icon || 'fas fa-info'}"></i> ${item.label}`;
                
                const value = document.createElement('span');
                value.className = 'info-value';
                value.textContent = item.value || '-';
                
                infoItem.appendChild(label);
                infoItem.appendChild(value);
                section.appendChild(infoItem);

                // Animate in
                requestAnimationFrame(() => {
                    infoItem.style.opacity = '1';
                    infoItem.style.transform = 'translateX(0)';
                });
            }, index * 50);
        });
    }

    triggerUltraResultAnimations() {
        const cards = document.querySelectorAll('.ultra-info-card, .stat-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                this.addCardParticles(card);
            }, index * 100);
        });
    }

    // Ultra effect methods
    addInputParticles(input) {
        if (!this.isHighQuality) return;
        
        const particles = input.parentNode.querySelector('.input-particles');
        if (particles) {
            this.createMiniParticles(particles, 5, 'rgba(59, 130, 246, 0.6)');
        }
    }

    addFocusEffect(element) {
        element.style.boxShadow = '0 0 30px rgba(59, 130, 246, 0.4)';
        setTimeout(() => {
            element.style.boxShadow = '';
        }, 1000);
    }

    addThemeChangeEffect() {
        if (!this.isHighQuality) return;
        
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
            pointer-events: none;
            z-index: 9999;
            animation: themeRipple 1s ease-out forwards;
        `;
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            document.body.removeChild(effect);
        }, 1000);
    }

    addQualityChangeEffect() {
        this.showNotification(
            `Graphics quality: ${this.isHighQuality ? 'Ultra' : 'Low'}`, 
            'info'
        );
    }

    addElementParticles(element) {
        if (!this.isHighQuality) return;
        
        const rect = element.getBoundingClientRect();
        this.createFloatingParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }

    addImageParticles(img) {
        if (!this.isHighQuality) return;
        
        const container = img.closest('.image-container');
        if (container) {
            this.createMiniParticles(container, 10, 'rgba(255, 107, 53, 0.6)');
        }
    }

    addStatParticles(element) {
        if (!this.isHighQuality) return;
        
        const card = element.closest('.stat-card');
        if (card) {
            const particles = card.querySelector('.stat-particles');
            if (particles) {
                this.createMiniParticles(particles, 8, 'rgba(0, 255, 136, 0.6)');
            }
        }
    }

    addCardParticles(card) {
        if (!this.isHighQuality) return;
        
        const glow = card.querySelector('.card-glow');
        if (glow) {
            setTimeout(() => {
                glow.style.opacity = '0.1';
                setTimeout(() => {
                    glow.style.opacity = '0';
                }, 2000);
            }, 500);
        }
    }

    

    createMiniParticles(container, count, color) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 3px;
                height: 3px;
                background: ${color};
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: miniParticleFloat 2s ease-out forwards;
                pointer-events: none;
            `;
            container.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 2000);
        }
    }

    createFloatingParticles(x, y) {
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: rgba(59, 130, 246, 0.8);
                border-radius: 50%;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                z-index: 9999;
                animation: floatingParticle 1.5s ease-out forwards;
            `;
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1500);
        }
    }

    addTouchOptimizations() {
        // Prevent zoom on double tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (event) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // Add touch feedback
        document.addEventListener('touchstart', (e) => {
            if (e.target.matches('button, .ultra-input, .ultra-select')) {
                e.target.style.transform = 'scale(0.98)';
            }
        });

        document.addEventListener('touchend', (e) => {
            if (e.target.matches('button, .ultra-input, .ultra-select')) {
                e.target.style.transform = '';
            }
        });
    }

    showUltraLoading() {
        this.loadingEl.classList.remove('hidden');
        
        // Animate progress bar
        const progressFill = document.querySelector('.progress-fill');
        const progressPercent = document.getElementById('progressPercent');
        const progressStatus = document.getElementById('progressStatus');
        
        const statuses = [
            'Initializing...',
            'Connecting to servers...',
            'Fetching player data...',
            'Processing statistics...',
            'Analyzing performance...',
            'Finalizing results...'
        ];
        
        let progress = 0;
        let statusIndex = 0;
        
        const updateProgress = () => {
            progress += Math.random() * 15 + 5;
            if (progress > 100) progress = 100;
            
            progressFill.style.width = `${progress}%`;
            progressPercent.textContent = `${Math.round(progress)}%`;
            
            if (statusIndex < statuses.length - 1 && progress > (statusIndex + 1) * 16) {
                statusIndex++;
                progressStatus.textContent = statuses[statusIndex];
            }
            
            if (progress < 100) {
                setTimeout(updateProgress, Math.random() * 200 + 100);
            }
        };
        
        updateProgress();
        
        // Add search button loading state
        const searchBtn = document.querySelector('.ultra-search-btn');
        searchBtn.style.opacity = '0.7';
        searchBtn.style.pointerEvents = 'none';
        searchBtn.querySelector('.btn-text').textContent = 'Analyzing...';
    }

    hideLoading() {
        this.loadingEl.classList.add('hidden');
        
        // Reset search button
        const searchBtn = document.querySelector('.ultra-search-btn');
        searchBtn.style.opacity = '1';
        searchBtn.style.pointerEvents = 'auto';
        searchBtn.querySelector('.btn-text').textContent = 'Analyze Player';
    }

    showError(message) {
        this.errorText.textContent = message;
        this.errorEl.classList.remove('hidden');
        
        // Add ultra shake animation
        this.errorEl.style.animation = 'ultraShake 0.6s ease-in-out';
        setTimeout(() => {
            this.errorEl.style.animation = '';
        }, 600);
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

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `ultra-notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--bg-glass);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border-primary);
            border-radius: var(--border-radius-xl);
            padding: 1rem 1.5rem;
            color: var(--text-primary);
            font-weight: 600;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            box-shadow: var(--shadow-lg);
        `;
        
        if (type === 'success') {
            notification.style.borderColor = 'var(--accent-success)';
        } else if (type === 'warning') {
            notification.style.borderColor = 'var(--accent-warning)';
        } else if (type === 'error') {
            notification.style.borderColor = 'var(--accent-error)';
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
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
}

// Add ultra animation CSS
const ultraStyle = document.createElement('style');
ultraStyle.textContent = `
    @keyframes ultraShake {
        0%, 100% { transform: translateX(0); }
        10% { transform: translateX(-10px); }
        20% { transform: translateX(10px); }
        30% { transform: translateX(-8px); }
        40% { transform: translateX(8px); }
        50% { transform: translateX(-6px); }
        60% { transform: translateX(6px); }
        70% { transform: translateX(-4px); }
        80% { transform: translateX(4px); }
        90% { transform: translateX(-2px); }
    }
    
    @keyframes themeRipple {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(4); opacity: 0; }
    }
    
    @keyframes miniParticleFloat {
        0% { transform: translateY(0) scale(1); opacity: 1; }
        100% { transform: translateY(-50px) scale(0); opacity: 0; }
    }
    
    @keyframes floatingParticle {
        0% { transform: translate(0, 0) scale(1); opacity: 1; }
        100% { 
            transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(0); 
            opacity: 0; 
        }
    }
    
    /* Ultra quality optimizations */
    .ultra-quality * {
        will-change: transform, opacity;
    }
    
    .low-quality .gradient-orbs,
    .low-quality .floating-shapes,
    .low-quality .neural-network {
        display: none;
    }
    
    .low-quality .ultra-background {
        background: var(--bg-primary);
    }
    
    /* Mobile optimizations */
    @media (max-width: 768px) {
        .particle-system,
        .neural-network,
        .hero-particles,
        .footer-particles {
            display: none;
        }
        
        .floating-shapes .shape:nth-child(n+4) {
            display: none;
        }
        
        .gradient-orbs .orb:nth-child(n+2) {
            display: none;
        }
    }
`;
document.head.appendChild(ultraStyle);

// Initialize the ultra application
document.addEventListener('DOMContentLoaded', () => {
    new UltraFreeFire();
    
    // Ultra console message
    console.log(`
    🔥 FreeFire Pro Ultra Edition - 120fps Performance
    
    Created by: Himu Mals
    Version: 3.0.0 Ultra
    Performance: 120fps optimized
    
    Ultra Keyboard Shortcuts:
    - Ctrl + K: Focus search input
    - Ctrl + D: Toggle dark mode
    - Ctrl + Q: Toggle graphics quality
    
    Experience the ultimate Free Fire analytics! 🚀
    `);
    
    // Simulate online users counter
    let onlineUsers = 1247;
    setInterval(() => {
        onlineUsers += Math.floor(Math.random() * 10) - 5;
        if (onlineUsers < 1000) onlineUsers = 1000;
        if (onlineUsers > 2000) onlineUsers = 2000;
        
        const onlineEl = document.getElementById('onlineUsers');
        if (onlineEl) {
            onlineEl.textContent = onlineUsers.toLocaleString();
        }
    }, 5000);
});