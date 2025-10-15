// Morse Code Module JavaScript
(function() {
    setTimeout(initMorseCodeModal, 100);
})();

function initMorseCodeModal() {
    // Tab functionality
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
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Elements
    const modeBtns = document.querySelectorAll('.mode-btn');
    const inputModePanels = document.querySelectorAll('.input-mode-panel');
    const morseButton = document.getElementById('morseButton');
    const dotButton = document.getElementById('dotButton');
    const dashButton = document.getElementById('dashButton');
    const spaceButton = document.getElementById('spaceButton');
    const resetButton = document.getElementById('resetButton');
    const morseSequence = document.getElementById('morseSequence');
    const letterSequence = document.getElementById('letterSequence');
    const matchesContainer = document.getElementById('matchesContainer');
    const frequencyDisplay = document.getElementById('frequencyDisplay');

    // Morse code definitions
    const morseAlphabet = {
        'A': '•–', 'B': '–•••', 'C': '–•–•', 'D': '–••', 'E': '•', 'F': '••–•',
        'G': '––•', 'H': '••••', 'I': '••', 'J': '•–––', 'K': '–•–', 'L': '•–••',
        'M': '––', 'N': '–•', 'O': '–––', 'P': '•––•', 'Q': '––•–', 'R': '•–•',
        'S': '•••', 'T': '–', 'U': '••–', 'V': '•••–', 'W': '•––', 'X': '–••–',
        'Y': '–•––', 'Z': '––••'
    };

    // Reverse lookup for morse to letter
    const letterFromMorse = {};
    Object.keys(morseAlphabet).forEach(letter => {
        letterFromMorse[morseAlphabet[letter]] = letter;
    });

    // Word list with frequencies
    const wordList = {
        'SHELL': '3.505 MHz',
        'HALLS': '3.515 MHz',
        'SLICK': '3.522 MHz',
        'TRICK': '3.532 MHz',
        'BOXES': '3.535 MHz',
        'LEAKS': '3.542 MHz',
        'STROBE': '3.545 MHz',
        'BISTRO': '3.552 MHz',
        'FLICK': '3.555 MHz',
        'BOMBS': '3.565 MHz',
        'BREAK': '3.572 MHz',
        'BRICK': '3.575 MHz',
        'STEAK': '3.582 MHz',
        'STING': '3.592 MHz',
        'VECTOR': '3.595 MHz',
        'BEATS': '3.600 MHz'
    };

    // Convert words to morse for pattern matching
    const wordsInMorse = {};
    Object.keys(wordList).forEach(word => {
        wordsInMorse[word] = word.split('').map(letter => morseAlphabet[letter]).join(' ');
    });

    // State
    let currentMode = 'single';
    let morseInput = [];
    let currentLetter = '';
    let pressStartTime = 0;
    let isPressed = false;

    // Mode switching
    modeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const mode = this.dataset.mode;
            
            // Update mode buttons
            modeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update mode panels
            inputModePanels.forEach(panel => panel.classList.remove('active'));
            document.getElementById(mode + '-mode').classList.add('active');
            
            currentMode = mode;
        });
    });

    // Single button mode - mouse/touch events
    if (morseButton) {
        morseButton.addEventListener('mousedown', handlePressStart);
        morseButton.addEventListener('mouseup', handlePressEnd);
        morseButton.addEventListener('mouseleave', handlePressEnd);
        morseButton.addEventListener('touchstart', handlePressStart, { passive: true });
        morseButton.addEventListener('touchend', handlePressEnd);
        
        // Prevent context menu on long press
        morseButton.addEventListener('contextmenu', e => e.preventDefault());
    }

    // Dual button mode
    if (dotButton) {
        dotButton.addEventListener('click', () => addMorseChar('•'));
    }
    if (dashButton) {
        dashButton.addEventListener('click', () => addMorseChar('–'));
    }

    // Control buttons
    if (spaceButton) {
        spaceButton.addEventListener('click', addLetterSeparator);
    }
    if (resetButton) {
        resetButton.addEventListener('click', resetInput);
    }

    function handlePressStart(e) {
        // Do not call preventDefault on passive event listeners
        // Only call preventDefault if not passive
        if (e.cancelable && (!e.passive)) {
            e.preventDefault();
        }
        if (isPressed) return;
        
        isPressed = true;
        pressStartTime = Date.now();
        morseButton.style.transform = 'translateY(0)';
    }

    function handlePressEnd(e) {
        e.preventDefault();
        if (!isPressed) return;
        
        isPressed = false;
        const pressDuration = Date.now() - pressStartTime;
        
        // Determine if it's a dot or dash based on duration
        const isDash = pressDuration >= 300; // 300ms threshold
        addMorseChar(isDash ? '–' : '•');
        
        morseButton.style.transform = '';
    }

    function addMorseChar(char) {
        currentLetter += char;
        updateDisplay();
        
        // Auto-add letter separator after a pause (simulated with delay)
        clearTimeout(window.letterTimeout);
        window.letterTimeout = setTimeout(() => {
            if (currentLetter) {
                addLetterSeparator();
            }
        }, 1000); // 1 second pause = new letter
    }

    function addLetterSeparator() {
        if (currentLetter) {
            morseInput.push(currentLetter);
            currentLetter = '';
            updateDisplay();
            findMatches();
            
            clearTimeout(window.letterTimeout);
        }
    }

    function resetInput() {
        morseInput = [];
        currentLetter = '';
        clearTimeout(window.letterTimeout);
        updateDisplay();
        clearMatches();
        clearFrequency();
    }

    function updateDisplay() {
        // Update morse sequence display
        const morseDisplay = [...morseInput];
        if (currentLetter) {
            morseDisplay.push(currentLetter + '_'); // Underscore indicates incomplete letter
        }
        
        if (morseDisplay.length === 0) {
            morseSequence.innerHTML = '<span class="sequence-prompt">Start tapping to input morse code...</span>';
        } else {
            morseSequence.innerHTML = morseDisplay.map(morse => 
                `<span class="morse-char">${morse}</span>`
            ).join(' ');
        }

        // Update letter sequence display
        const letters = morseInput.map(morse => letterFromMorse[morse] || '?').join('');
        
        if (letters.length === 0) {
            letterSequence.innerHTML = '<span class="sequence-prompt">Decoded letters will appear here...</span>';
        } else {
            letterSequence.innerHTML = letters.split('').map(letter => 
                `<span class="letter-char">${letter}</span>`
            ).join('');
        }
    }

    function findMatches() {
        const currentText = morseInput.map(morse => letterFromMorse[morse] || '?').join('');
        
        if (currentText.length < 2) {
            clearMatches();
            return;
        }

        const matches = [];
        
        // Check each word for matches
        Object.keys(wordList).forEach(word => {
            const confidence = calculateWordMatch(currentText, word);
            if (confidence > 0) {
                matches.push({
                    word: word,
                    frequency: wordList[word],
                    confidence: confidence,
                    isExact: confidence === 1.0
                });
            }
        });

        // Sort by confidence (highest first)
        matches.sort((a, b) => b.confidence - a.confidence);

        displayMatches(matches);
    }

    function calculateWordMatch(input, targetWord) {
        // Check for exact match
        if (input === targetWord) {
            return 1.0;
        }

        // Check for partial match (input is beginning of word)
        if (targetWord.startsWith(input)) {
            return 0.8;
        }

        // Check for circular match (word repeats, input might start mid-word)
        const doubleWord = targetWord + targetWord;
        for (let i = 1; i < targetWord.length; i++) {
            const rotated = doubleWord.substring(i, i + targetWord.length);
            if (rotated.startsWith(input)) {
                return 0.6;
            }
        }

        // Check if input contains the word (input might be longer than one word cycle)
        if (input.includes(targetWord)) {
            return 0.7;
        }

        // Check for subsequence match
        let j = 0;
        for (let i = 0; i < input.length && j < targetWord.length; i++) {
            if (input[i] === targetWord[j]) {
                j++;
            }
        }
        
        if (j === targetWord.length) {
            return 0.4; // All letters of target found in input (in order)
        }

        // Check for partial subsequence
        const ratio = j / targetWord.length;
        return ratio > 0.5 ? ratio * 0.3 : 0;
    }

    function displayMatches(matches) {
        if (matches.length === 0) {
            clearMatches();
            return;
        }

        const matchesHtml = matches.map(match => {
            const confidencePercent = Math.round(match.confidence * 100);
            const confidenceText = match.isExact ? 'EXACT MATCH' : `${confidencePercent}% match`;
            
            return `
                <div class="match-item ${match.isExact ? 'exact-match' : ''}">
                    <span class="match-word">${match.word}</span>
                    <span class="match-confidence">${confidenceText}</span>
                    <span class="match-frequency">${match.frequency}</span>
                </div>
            `;
        }).join('');

        matchesContainer.innerHTML = matchesHtml;

        // If we have an exact match, show the frequency
        const exactMatch = matches.find(match => match.isExact);
        if (exactMatch) {
            showFrequency(exactMatch.word, exactMatch.frequency);
        } else {
            clearFrequency();
        }
    }

    function clearMatches() {
        matchesContainer.innerHTML = '<div class="no-matches"><span>Input morse code to see possible word matches...</span></div>';
    }

    function showFrequency(word, frequency) {
        frequencyDisplay.innerHTML = `
            <div class="frequency-result">
                <div style="margin-bottom: 10px; font-size: 1.2rem; color: #dae1ff;">Word: ${word}</div>
                <div style="color: #4caf50;">📻 ${frequency}</div>
            </div>
        `;
    }

    function clearFrequency() {
        frequencyDisplay.innerHTML = '<div class="frequency-result"><span class="frequency-prompt">Complete a word match to see the frequency</span></div>';
    }

    // Initialize display
    updateDisplay();
    clearMatches();
    clearFrequency();

    // Handle cleanup when modal is closed
    window.addEventListener('modalClosed', function() {
        resetInput();
        clearTimeout(window.letterTimeout);
        
        // Reset to first tab
        tabBtns.forEach(btn => btn.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));
        if (tabBtns[0]) tabBtns[0].classList.add('active');
        if (tabPanels[0]) tabPanels[0].classList.add('active');
    });
}

// Mark as loaded to prevent duplicates
window.MorseCodeModule = true;

// Initialize when DOM is ready or when modal is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMorseCodeModal);
} else {
    initMorseCodeModal();
}

