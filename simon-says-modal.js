// Simon Says Modal JavaScript
(function() {
    'use strict';
    
    // Prevent multiple initializations
    if (window.simonSaysModalInitialized) {
        console.log('Simon Says modal already initialized');
        return;
    }
    
    console.log('Initializing Simon Says modal...');
    
    // Simon Says color mapping tables - Updated with new logic
    const COLOR_MAPPINGS = {
        vowel: {
            0: { red: 'blue', blue: 'red', green: 'yellow', yellow: 'green' },
            1: { red: 'yellow', blue: 'green', green: 'blue', yellow: 'red' },
            2: { red: 'green', blue: 'red', green: 'yellow', yellow: 'blue' }
        },
        noVowel: {
            0: { red: 'blue', blue: 'yellow', green: 'green', yellow: 'red' },
            1: { red: 'red', blue: 'blue', green: 'yellow', yellow: 'green' },
            2: { red: 'yellow', blue: 'green', green: 'blue', yellow: 'red' }
        }
    };
    
    // State variables
    let flashSequence = [];
    let pressSequence = [];
    let serialLocked = false;
    
    // Initialize when DOM is ready
    function initializeSimonSays() {
        setupEventListeners();
        syncStrikeCounters();
        window.simonSaysModalInitialized = true;
        console.log('Simon Says modal initialized successfully');
    }
    
    function setupEventListeners() {
        // Use main serial input from sidebar
        const calcSerial = document.getElementById('calcSerial');
        const mainSerial = document.getElementById('mainSerial');
        
        // Sync calc serial with main serial
        if (mainSerial && calcSerial) {
            calcSerial.value = mainSerial.value;
            
            // Listen for changes to main serial
            const observer = new MutationObserver(() => {
                calcSerial.value = mainSerial.value;
                calculateAllPresses();
            });
            
            observer.observe(mainSerial, { attributes: true, attributeFilter: ['value'] });
            
            mainSerial.addEventListener('input', () => {
                calcSerial.value = mainSerial.value;
                calculateAllPresses();
            });
        }
        
        // Color buttons
        const colorButtons = document.querySelectorAll('.simon-color');
        colorButtons.forEach(button => {
            button.addEventListener('click', () => addFlashColor(button.dataset.color));
        });
        
        // Flat strike counter
        const flatAddBtn = document.getElementById('flatAddStrike');
        const flatRemoveBtn = document.getElementById('flatRemoveStrike');
        
        if (flatAddBtn) flatAddBtn.addEventListener('click', () => adjustStrikes(1));
        if (flatRemoveBtn) flatRemoveBtn.addEventListener('click', () => adjustStrikes(-1));
        
        // Clear all button
        const clearAllBtn = document.getElementById('clearAll');
        if (clearAllBtn) clearAllBtn.addEventListener('click', clearAll);
    }
    
    // Serial functions now reference main sidebar serial
    function getSerialValue() {
        const mainSerial = document.getElementById('mainSerial');
        return mainSerial ? mainSerial.value : '';
    }
    
    function addFlashColor(color) {
        flashSequence.push(color);
        updateFlashDisplay();
        calculateNextPress();
        
        // Visual feedback
        const button = document.querySelector(`.simon-color[data-color="${color}"]`);
        if (button) {
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
        }
    }
    
    function syncStrikeCounters() {
        // Get current strikes from main counter
        const mainStrikeCount = document.getElementById('strikeCount');
        const flatStrikeCount = document.getElementById('flatStrikeCount');
        
        if (mainStrikeCount && flatStrikeCount) {
            const currentStrikes = parseInt(mainStrikeCount.textContent) || 0;
            flatStrikeCount.textContent = currentStrikes;
            updateFlatStrikeButtons(currentStrikes);
        }
    }
    
    function adjustStrikes(delta) {
        // Sync with main strike counter
        const mainAddBtn = document.getElementById('addStrike');
        const mainRemoveBtn = document.getElementById('removeStrike');
        
        if (delta > 0 && mainAddBtn) {
            mainAddBtn.click();
        } else if (delta < 0 && mainRemoveBtn) {
            mainRemoveBtn.click();
        }
        
        // Update display after a short delay
        setTimeout(() => {
            syncStrikeCounters();
            calculateAllPresses();
        }, 100);
    }
    
    function updateFlatStrikeButtons(strikes) {
        const flatAddBtn = document.getElementById('flatAddStrike');
        const flatRemoveBtn = document.getElementById('flatRemoveStrike');
        
        if (flatAddBtn) flatAddBtn.disabled = strikes >= 3;
        if (flatRemoveBtn) flatRemoveBtn.disabled = strikes <= 0;
    }
    
    function hasVowelInSerial() {
        const serial = getSerialValue().toUpperCase();
        return /[AEIOU]/.test(serial);
    }
    
    function getCurrentStrikes() {
        const flatStrikeCount = document.getElementById('flatStrikeCount');
        return parseInt(flatStrikeCount.textContent) || 0;
    }
    
    function calculateNextPress() {
        if (flashSequence.length === 0) return;
        
        const lastFlash = flashSequence[flashSequence.length - 1];
        const strikes = Math.min(getCurrentStrikes(), 2); // Cap at 2 for mapping
        const hasVowel = hasVowelInSerial();
        
        const mappingTable = hasVowel ? COLOR_MAPPINGS.vowel : COLOR_MAPPINGS.noVowel;
        const nextPress = mappingTable[strikes][lastFlash];
        
        pressSequence.push(nextPress);
        updatePressDisplay();
    }
    
    function calculateAllPresses() {
        // Recalculate all presses based on current strikes and serial
        pressSequence = [];
        
        flashSequence.forEach(flashColor => {
            const strikes = Math.min(getCurrentStrikes(), 2);
            const hasVowel = hasVowelInSerial();
            const mappingTable = hasVowel ? COLOR_MAPPINGS.vowel : COLOR_MAPPINGS.noVowel;
            const nextPress = mappingTable[strikes][flashColor];
            pressSequence.push(nextPress);
        });
        
        updatePressDisplay();
    }
    
    function updateFlashDisplay() {
        const flashSequenceEl = document.getElementById('flashSequence');
        if (!flashSequenceEl) return;
        
        const colorEmojis = { red: '🔴', blue: '🔵', yellow: '🟡', green: '🟢' };
        if (flashSequence.length === 0) {
            flashSequenceEl.innerHTML = '<span class="empty-flash">No flashes yet</span>';
        } else {
            flashSequenceEl.innerHTML = flashSequence.map((color, index) => 
                `<div class="flash-item ${color}"><span class="seq-num">${index + 1}</span><span class="color-emoji">${colorEmojis[color] || ''}</span></div>`
            ).join('');
        }
    }
    
    function updatePressDisplay() {
        const pressSequenceEl = document.getElementById('pressSequence');
        if (!pressSequenceEl) return;
        
        const colorEmojis = { red: '🔴', blue: '🔵', yellow: '🟡', green: '🟢' };
        if (pressSequence.length === 0) {
            pressSequenceEl.innerHTML = '<span class="empty-press">Press colors above to see what to press</span>';
        } else {
            pressSequenceEl.innerHTML = pressSequence.map((color, index) => 
                `<div class="press-item ${color}"><span class="seq-num">${index + 1}</span><span class="color-emoji">${colorEmojis[color] || ''}</span></div>`
            ).join('');
        }
    }
    
    function clearAll() {
        flashSequence = [];
        pressSequence = [];
        updateFlashDisplay();
        updatePressDisplay();
        
        // Update calc serial to match main serial
        const calcSerial = document.getElementById('calcSerial');
        if (calcSerial) {
            calcSerial.value = getSerialValue();
        }
        
        console.log('All cleared');
    }
    
    // Listen for strike counter changes from main page
    const observer = new MutationObserver(() => {
        syncStrikeCounters();
        calculateAllPresses();
    });
    
    // Observe the main strike counter for changes
    const mainStrikeCount = document.getElementById('strikeCount');
    if (mainStrikeCount) {
        observer.observe(mainStrikeCount, { childList: true, subtree: true });
    }
    
    // Initialize when the script loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSimonSays);
    } else {
        initializeSimonSays();
    }
    
})();