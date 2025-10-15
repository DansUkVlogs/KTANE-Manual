// Prevent duplicate initialization
if (typeof window.PasswordModule === 'undefined') {

// Password Module Logic
const PASSWORD_WORDS = [
    'ABOUT', 'AFTER', 'AGAIN', 'BELOW', 'COULD',
    'EVERY', 'FIRST', 'FOUND', 'GREAT', 'HOUSE',
    'LARGE', 'LEARN', 'NEVER', 'OTHER', 'PLACE',
    'PLANT', 'POINT', 'RIGHT', 'SMALL', 'SOUND',
    'SPELL', 'STILL', 'STUDY', 'THEIR', 'THERE',
    'THESE', 'THING', 'THINK', 'THREE', 'WATER',
    'WHERE', 'WHICH', 'WORLD', 'WOULD', 'WRITE'
];

let currentInputs = ['', '', '', '', ''];

// Initialize the Password module
function initPasswordModule() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Remove active class from all tabs and panels
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding panel
            this.classList.add('active');
            const targetPanel = document.getElementById(targetTab);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
    
    // Initialize the solver
    updateMatches();
    updatePatternDisplay();
}

// Update matches when inputs change
function updateMatches() {
    // Get current input values
    currentInputs = [
        document.getElementById('pos1').value.toUpperCase().trim(),
        document.getElementById('pos2').value.toUpperCase().trim(),
        document.getElementById('pos3').value.toUpperCase().trim(),
        document.getElementById('pos4').value.toUpperCase().trim(),
        document.getElementById('pos5').value.toUpperCase().trim()
    ];
    
    // Find matching words
    const matches = findMatchingPasswords(currentInputs);
    
    // Update displays
    updatePatternDisplay(); // Update this first so it has access to matches
    updateMatchesDisplay(matches);
    updateMatchesCount(matches);
}

// Find passwords that match the current input criteria
function findMatchingPasswords(inputs) {
    return PASSWORD_WORDS.filter(word => {
        for (let i = 0; i < 5; i++) {
            const possibleLetters = inputs[i];
            const wordLetter = word[i];
            
            // If no letters entered for this position, skip check
            if (possibleLetters.length === 0) {
                continue;
            }
            
            // Check if the word's letter at this position is in the possible letters
            if (!possibleLetters.includes(wordLetter)) {
                return false;
            }
        }
        return true;
    });
}

// Update the matches display
function updateMatchesDisplay(matches) {
    const matchesList = document.getElementById('matchesList');
    
    if (matches.length === 0) {
        matchesList.innerHTML = '<div class="no-matches">No passwords match your current criteria. Try adjusting the letters.</div>';
    } else {
        const matchElements = matches.map(word => {
            const className = matches.length === 1 ? 'match-word single-match' : 'match-word';
            return `<div class="${className}" onclick="highlightWord('${word}')">${word}</div>`;
        }).join('');
        matchesList.innerHTML = matchElements;
    }
}

// Update the matches count display
function updateMatchesCount(matches) {
    const matchesCount = document.getElementById('matchesCount');
    
    if (matches.length === 0) {
        matchesCount.textContent = 'No matches found';
        matchesCount.className = 'matches-count';
    } else if (matches.length === 1) {
        matchesCount.textContent = `🎯 Found the password: ${matches[0]}`;
        matchesCount.className = 'matches-count found';
    } else {
        matchesCount.textContent = `${matches.length} possible passwords found - enter more letters to narrow down`;
        matchesCount.className = 'matches-count multiple';
    }
}

// Update the pattern visualization to show most likely password
function updatePatternDisplay() {
    const patternViz = document.getElementById('patternViz');
    const slots = patternViz.querySelectorAll('.pattern-slot');
    
    // Find matches to determine most likely password
    const matches = findMatchingPasswords(currentInputs);
    
    // Show the most likely password (first match if available)
    if (matches.length > 0) {
        const mostLikely = matches[0];
        for (let i = 0; i < 5; i++) {
            slots[i].textContent = mostLikely[i];
            slots[i].className = matches.length === 1 ? 'pattern-slot filled' : 'pattern-slot';
        }
    } else {
        // Show input constraints or underscores
        for (let i = 0; i < 5; i++) {
            const slot = slots[i];
            const input = currentInputs[i];
            
            if (input.length > 0) {
                slot.textContent = input.length > 3 ? input.substring(0, 3) + '...' : input;
                slot.className = 'pattern-slot';
            } else {
                slot.textContent = '_';
                slot.className = 'pattern-slot';
            }
        }
    }
}

// Highlight a specific word (called when clicking on a match)
function highlightWord(word) {
    // Visual feedback for clicked word
    const matchWords = document.querySelectorAll('.match-word');
    matchWords.forEach(elem => {
        if (elem.textContent === word) {
            elem.style.transform = 'scale(1.1)';
            setTimeout(() => {
                elem.style.transform = '';
            }, 300);
        }
    });
    
    // Show word in pattern display temporarily
    const patternViz = document.getElementById('patternViz');
    const slots = patternViz.querySelectorAll('.pattern-slot');
    
    // Temporarily show the word
    for (let i = 0; i < 5; i++) {
        slots[i].textContent = word[i];
        slots[i].className = 'pattern-slot filled';
        slots[i].style.backgroundColor = 'rgba(76, 201, 240, 0.3)';
    }
    
    // Revert after 2 seconds
    setTimeout(() => {
        updatePatternDisplay();
        slots.forEach(slot => {
            slot.style.backgroundColor = '';
        });
    }, 2000);
}

// Reset all inputs
function resetAll() {
    // Clear all input fields
    for (let i = 1; i <= 5; i++) {
        document.getElementById(`pos${i}`).value = '';
    }
    
    // Reset current inputs array
    currentInputs = ['', '', '', '', ''];
    
    // Update displays
    updateMatches();
}

// Auto-initialize when script loads (for modal system)
setTimeout(() => {
    if (document.querySelector('.tab-btn')) {
        initPasswordModule();
    }
}, 100);

// Mark as loaded to prevent duplicates
window.PasswordModule = true;

// Additional initialization for modal system
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.querySelector('.tab-btn')) {
            initPasswordModule();
        }
    });
} else {
    if (document.querySelector('.tab-btn')) {
        initPasswordModule();
    }
}

}