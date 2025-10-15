// Basic interactivity for the KTANE Manual
document.addEventListener('DOMContentLoaded', function() {
    const moduleCards = document.querySelectorAll('.module-card');
    
    // Modal system
    const modalOverlay = document.getElementById('modalOverlay');
    const modalContainer = document.getElementById('modalContainer');
    const modalContent = document.getElementById('modalContent');
    const modalClose = document.getElementById('modalClose');
    
    // Function to open modal with content
    async function openModal(moduleName) {
        try {
            // Show loading state
            modalContent.innerHTML = `
                <div class="modal-content loading">
                    <div class="modal-loading-spinner"></div>
                    <div class="modal-loading-text">Loading ${moduleName} module...</div>
                </div>
            `;
            
            // Show modal immediately with loading state
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            
            // Load the modal content
            const response = await fetch(`${moduleName}-modal.html`);
            if (!response.ok) {
                throw new Error(`Failed to load ${moduleName} module`);
            }
            
            const htmlContent = await response.text();
            modalContent.innerHTML = htmlContent;
            
            // Execute any scripts in the loaded content
            const scripts = modalContent.querySelectorAll('script');
            scripts.forEach(oldScript => {
                if (oldScript.src) {
                    // Remove any previous instance of this script
                    const scriptName = oldScript.src.split('/').pop().split('?')[0];
                    document.querySelectorAll(`script[src*="${scriptName}"]`).forEach(s => s.remove());
                    // Add new script with cache-busting
                    const newScript = document.createElement('script');
                    newScript.src = `${scriptName}?v=${Date.now()}`;
                    document.head.appendChild(newScript);
                } else {
                    const newScript = document.createElement('script');
                    newScript.textContent = oldScript.textContent;
                    document.head.appendChild(newScript);
                }
                oldScript.remove();
            });
            
        } catch (error) {
            console.error('Error loading modal:', error);
            modalContent.innerHTML = `
                <div class="modal-content loading">
                    <h2 style="color: #ff4757;">⚠️ Module Not Available</h2>
                    <p>The ${moduleName} module is not yet implemented.</p>
                    <p style="font-size: 0.9rem; opacity: 0.7;">This feature is coming soon!</p>
                </div>
            `;
        }
    }
    
    // Function to close modal
    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable background scrolling
        
        // Clear content after animation
        setTimeout(() => {
            modalContent.innerHTML = '';
            
            // Clean up any modal-specific scripts to prevent conflicts
            const modalScripts = document.querySelectorAll('script[src*="-modal.js"]');
            modalScripts.forEach(script => script.remove());
            
            // Dispatch custom event for modal-specific cleanup
            window.dispatchEvent(new CustomEvent('modalClosed'));
        }, 300);
    }
    
    // Needy Module System
    const needyOverlay = document.getElementById('needyOverlay');
    const needyContainer = document.getElementById('needyContainer');
    const needyContent = document.getElementById('needyContent');
    const needyTitle = document.getElementById('needyTitle');
    const needyClose = document.getElementById('needyClose');
    
    // Function to open needy module overlay
    async function openNeedyModule(moduleName, moduleTitle) {
        try {
            // Update title
            needyTitle.textContent = moduleTitle.toUpperCase();
            
            // Show loading state
            needyContent.innerHTML = `
                <div class="needy-loading">
                    <div class="needy-loading-text">Loading ${moduleTitle}...</div>
                </div>
            `;
            
            // Show needy overlay
            needyOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            
            // Load the needy module content
            const response = await fetch(`${moduleName}-modal.html`);
            if (!response.ok) {
                throw new Error(`Failed to load ${moduleName} module`);
            }
            
            const htmlContent = await response.text();
            needyContent.innerHTML = htmlContent;
            
            // Execute any scripts in the loaded content
            const scripts = needyContent.querySelectorAll('script');
            scripts.forEach(oldScript => {
                const newScript = document.createElement('script');
                if (oldScript.src) {
                    // Check if script is already loaded to prevent duplicates
                    const existingScript = document.querySelector(`script[src="${oldScript.src}"]`);
                    if (!existingScript) {
                        newScript.src = oldScript.src;
                        document.head.appendChild(newScript);
                    }
                } else {
                    newScript.textContent = oldScript.textContent;
                    document.head.appendChild(newScript);
                }
                oldScript.remove();
            });
            
        } catch (error) {
            console.error('Error loading needy module:', error);
            needyContent.innerHTML = `
                <div class="needy-error">
                    <h3>⚠️ Module Not Available</h3>
                    <p>The ${moduleTitle} module is not yet implemented.</p>
                    <p>This needy module will be available soon!</p>
                </div>
            `;
        }
    }
    
    // Function to close needy module
    function closeNeedyModule() {
        needyOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable background scrolling
        
        // Clean up content after animation
        setTimeout(() => {
            needyContent.innerHTML = '';
            
            // Clean up any needy-specific scripts to prevent conflicts
            const needyScripts = document.querySelectorAll('script[src*="-modal.js"]');
            needyScripts.forEach(script => {
                if (script.src.includes('venting-gas') || 
                    script.src.includes('knobs') || 
                    script.src.includes('capacitor-discharge')) {
                    script.remove();
                }
            });
            
            // Dispatch custom event for cleanup
            window.dispatchEvent(new CustomEvent('needyModuleClosed'));
        }, 300);
    }
    
    // Add click handlers to module cards
    moduleCards.forEach(card => {
        card.addEventListener('click', function() {
            const moduleName = this.dataset.module;
            
            // Add visual feedback
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Open modal
            openModal(moduleName);
        });
        
        // Add keyboard navigation
        card.setAttribute('tabindex', '0');
        card.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Close modal handlers
    modalClose.addEventListener('click', closeModal);
    
    // Needy module handlers
    needyClose.addEventListener('click', closeNeedyModule);
    
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    // Keyboard close (Escape key)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Add some entrance animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    moduleCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Create splash loading screen with centered bomb animation
    const createSplashScreen = () => {
        // Create splash overlay background
        const splashOverlay = document.createElement('div');
        splashOverlay.className = 'splash-overlay';
        document.body.appendChild(splashOverlay);
        
        // Create centered bomb
        const centerBomb = document.createElement('div');
        centerBomb.className = 'center-bomb';
        centerBomb.innerHTML = '💣';
        document.body.appendChild(centerBomb);
        
        // Remove both elements after animation completes
        setTimeout(() => {
            splashOverlay.remove();
            centerBomb.remove();
        }, 3000);
    };
    
    // Trigger splash screen
    createSplashScreen();
    
    // Add a timer sound effect simulation (visual only)
    const createTimerEffect = () => {
        const timerDisplay = document.createElement('div');
        timerDisplay.className = 'timer-display';
        timerDisplay.innerHTML = '05:00';
        timerDisplay.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 10px 20px;
            font-family: 'Orbitron', monospace;
            font-size: 1.2rem;
            border-radius: 5px;
            z-index: 1000;
            box-shadow: 0 4px 20px rgba(255, 0, 0, 0.3);
            display: none;
        `;
        document.body.appendChild(timerDisplay);
        
        // Show timer on hover over title (since bomb icon is no longer in header)
        const title = document.querySelector('.title');
        if (title) {
            title.addEventListener('mouseenter', () => {
                timerDisplay.style.display = 'block';
            });
            
            title.addEventListener('mouseleave', () => {
                timerDisplay.style.display = 'none';
            });
        }
    };
    
    createTimerEffect();
    
    // Needy Modules FAB functionality
    const needyFab = document.getElementById('needyFab');
    const needyMenu = document.getElementById('needyModulesMenu');
    let menuOpen = false;
    
    needyFab.addEventListener('click', function(e) {
        e.stopPropagation();
        menuOpen = !menuOpen;
        
        if (menuOpen) {
            needyMenu.classList.add('active');
            needyFab.style.transform = 'rotate(45deg)';
        } else {
            needyMenu.classList.remove('active');
            needyFab.style.transform = 'rotate(0deg)';
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!needyFab.contains(e.target) && !needyMenu.contains(e.target)) {
            needyMenu.classList.remove('active');
            needyFab.style.transform = 'rotate(0deg)';
            menuOpen = false;
        }
    });
    
    // Handle needy module clicks
    const needyModuleItems = document.querySelectorAll('.needy-module-item');
    needyModuleItems.forEach(item => {
        item.addEventListener('click', function() {
            const moduleName = this.dataset.module;
            const moduleTitle = this.querySelector('span').textContent;
            
            // Open needy module overlay
            openNeedyModule(moduleName, moduleTitle);
            
            // Close the needy menu
            needyMenu.classList.remove('active');
            needyFab.style.transform = 'rotate(0deg)';
            menuOpen = false;
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Add keyboard navigation for FAB
    needyFab.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });

    // Strike Counter System
    let currentStrikes = 0;
    const maxStrikes = 3;
    
    const addStrikeBtn = document.getElementById('addStrike');
    const removeStrikeBtn = document.getElementById('removeStrike');
    const strikeCount = document.getElementById('strikeCount');
    const strikeIndicators = document.getElementById('strikeIndicators');
    
    function updateStrikeDisplay() {
        strikeCount.textContent = currentStrikes;
        
        // Update strike dots
        const dots = strikeIndicators.querySelectorAll('.strike-dot');
        dots.forEach((dot, index) => {
            if (index < currentStrikes) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // Add danger styling at 2+ strikes
        if (currentStrikes >= 2) {
            strikeCount.classList.add('danger');
        } else {
            strikeCount.classList.remove('danger');
        }
        
        // Update button states
        removeStrikeBtn.disabled = currentStrikes === 0;
        addStrikeBtn.disabled = currentStrikes >= maxStrikes;
        
        // Show bomb explosion animation at 3 strikes
        if (currentStrikes >= maxStrikes) {
            setTimeout(() => {
                triggerBombExplosion();
            }, 500);
        }
    }
    
    function triggerBombExplosion() {
        // Create explosion overlay
        const explosionOverlay = document.createElement('div');
        explosionOverlay.className = 'explosion-overlay';
        explosionOverlay.innerHTML = `
            <div class="explosion-animation">
                <div class="bomb-icon">💣</div>
                <div class="explosion-flash"></div>
                <div class="explosion-particles">
                    <span>💥</span>
                    <span>🔥</span>
                    <span>💥</span>
                    <span>🔥</span>
                    <span>💥</span>
                    <span>🔥</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(explosionOverlay);
        
        // Trigger animation sequence
        setTimeout(() => {
            explosionOverlay.classList.add('active');
        }, 50);
        
        // Complete animation and show final state
        setTimeout(() => {
            explosionOverlay.remove();
            strikeCount.textContent = '3';
            
            // Find and add exploded class to strike container
            const strikeContainer = document.querySelector('.strike-counter-container');
            if (strikeContainer) {
                strikeContainer.classList.add('exploded');
            }
            
            // Show game over dialog with reset option
            showGameOverDialog();
        }, 3000);
    }
    
    function showGameOverDialog() {
        // Create game over overlay
        const gameOverOverlay = document.createElement('div');
        gameOverOverlay.className = 'game-over-overlay';
        gameOverOverlay.innerHTML = `
            <div class="game-over-dialog">
                <div class="game-over-icon">💥</div>
                <h2>BOMB EXPLODED!</h2>
                <p>You reached the maximum number of strikes.</p>
                <div class="game-over-buttons">
                    <button class="reset-btn" id="resetGame">🔄 Reset & Try Again</button>
                    <button class="continue-btn" id="continueAnyway">📋 Continue Anyway</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(gameOverOverlay);
        
        // Add event listeners to buttons
        document.getElementById('resetGame').addEventListener('click', () => {
            resetGameState();
            gameOverOverlay.remove();
        });
        
        document.getElementById('continueAnyway').addEventListener('click', () => {
            gameOverOverlay.remove();
        });
        
        // Show overlay
        setTimeout(() => {
            gameOverOverlay.classList.add('active');
        }, 100);
    }
    
    function resetGameState() {
        // Reset strike counter
        currentStrikes = 0;
        updateStrikeDisplay();
        
        // Remove exploded styling
        const strikeContainer = document.querySelector('.strike-counter-container');
        if (strikeContainer) {
            strikeContainer.classList.remove('exploded');
        }
        
        // Re-enable all interactive elements
        document.querySelectorAll('.module-card, .needy-fab, .strike-btn').forEach(el => {
            el.style.pointerEvents = '';
            el.style.opacity = '';
        });
    }
    
    // Add strike button
    addStrikeBtn.addEventListener('click', function() {
        if (currentStrikes < maxStrikes) {
            currentStrikes++;
            updateStrikeDisplay();
            
            // Visual feedback
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        }
    });
    
    // Remove strike button
    removeStrikeBtn.addEventListener('click', function() {
        if (currentStrikes > 0) {
            currentStrikes--;
            updateStrikeDisplay();
            
            // Visual feedback
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        }
    });
    
    // Keyboard shortcuts for strike counter
    document.addEventListener('keydown', function(e) {
        // Only work if no modal is open and not focused on input
        if (!document.querySelector('.modal-overlay.active') && 
            document.activeElement.tagName !== 'INPUT' && 
            document.activeElement.tagName !== 'TEXTAREA') {
            
            if (e.key === '+' || e.key === '=') {
                e.preventDefault();
                addStrikeBtn.click();
            } else if (e.key === '-' || e.key === '_') {
                e.preventDefault();
                removeStrikeBtn.click();
            }
        }
    });
    
    // Initialize strike display
    updateStrikeDisplay();

    // Main Serial Number System
    const mainSerial = document.getElementById('mainSerial');
    const mainLockBtn = document.getElementById('mainLockSerial');
    let mainSerialLocked = false;
    
    if (mainLockBtn && mainSerial) {
        mainLockBtn.addEventListener('click', function() {
            mainSerialLocked = !mainSerialLocked;
            
            if (mainSerialLocked) {
                mainLockBtn.textContent = '🔒';
                mainLockBtn.classList.add('locked');
                mainSerial.readOnly = true;
            } else {
                mainLockBtn.textContent = '🔓';
                mainLockBtn.classList.remove('locked');
                mainSerial.readOnly = false;
            }
            
            // Visual feedback
            mainLockBtn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                mainLockBtn.style.transform = '';
            }, 100);
        });
        
        // Auto-uppercase serial input
        mainSerial.addEventListener('input', function() {
            this.value = this.value.toUpperCase();
        });
    }
    
        // Module tile search/filter functionality
        var searchInput = document.getElementById('moduleSearch');
        if (searchInput) {
            function filterModules() {
                var val = searchInput.value.toLowerCase();
                moduleCards.forEach(function(card) {
                    var text = card.querySelector('h3').textContent.toLowerCase();
                    if (val === '' || text.indexOf(val) !== -1) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }
            searchInput.addEventListener('input', filterModules);
            searchInput.addEventListener('change', filterModules);
            // Also filter on search button click (if present)
            var searchBtn = document.querySelector('.search-btn');
            if (searchBtn) {
                searchBtn.addEventListener('click', filterModules);
            }
            // On mobile, ensure filter runs after virtual keyboard closes
            searchInput.addEventListener('blur', filterModules);
        }
});