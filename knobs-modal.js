// Prevent duplicate initialization
if (typeof window.KnobsModule === 'undefined') {

class KnobsModule {
    constructor() {
        this.ledStates = new Array(12).fill(false); // 12 LEDs (0-11) in 2x6 grid
        this.patterns = {
            'UP': [
                // UP Pattern A: 001011 / 111101
                [false, false, true, false, true, true, true, true, true, true, false, true],
                // UP Pattern B: 101010 / 011011
                [true, false, true, false, true, false, false, true, true, false, true, true]
            ],
            'DOWN': [
                // DOWN Pattern A: 011001 / 111101
                [false, true, true, false, false, true, true, true, true, true, false, true],
                // DOWN Pattern B: 101010 / 010001
                [true, false, true, false, true, false, false, true, false, false, false, true]
            ],
            'LEFT': [
                // LEFT Pattern A: 000010 / 100111
                [false, false, false, false, true, false, true, false, false, true, true, true],
                // LEFT Pattern B: 000010 / 000110
                [false, false, false, false, true, false, false, false, false, true, true, false]
            ],
            'RIGHT': [
                // RIGHT Pattern A: 101111 / 111010
                [true, false, true, true, true, true, true, true, true, false, true, false],
                // RIGHT Pattern B: 101100 / 111010
                [true, false, true, true, false, false, true, true, true, false, true, false]
            ]
        };
        
        this.initializeModule();
    }

    initializeModule() {
        this.bindEvents();
        this.updateResult();
        console.log('Knobs module initialized');
    }

    bindEvents() {
        const leds = document.querySelectorAll('.led');
        leds.forEach((led, index) => {
            led.addEventListener('click', () => this.toggleLED(index));
        });
        
        // Add clear button functionality
        const clearButton = document.getElementById('clearLEDs');
        if (clearButton) {
            clearButton.addEventListener('click', () => this.reset());
        }
    }

    toggleLED(index) {
        this.ledStates[index] = !this.ledStates[index];
        const ledElement = document.querySelector(`[data-led="${index}"]`);
        
        if (this.ledStates[index]) {
            ledElement.classList.add('on');
        } else {
            ledElement.classList.remove('on');
        }
        
        this.updateResult();
    }

    patternsMatch(pattern1, pattern2) {
        if (pattern1.length !== pattern2.length) return false;
        return pattern1.every((led, index) => led === pattern2[index]);
    }

    updateResult() {
        const resultElement = document.getElementById('positionResult');
        const resultText = resultElement.querySelector('.result-text');
        
        // Check if current LED state matches any pattern
        for (const [position, patterns] of Object.entries(this.patterns)) {
            // Check each pattern for this position
            for (const pattern of patterns) {
                if (this.patternsMatch(this.ledStates, pattern)) {
                    resultText.textContent = `Position Found: Turn knob to ${position}`;
                    resultText.className = 'result-text found';
                    return;
                }
            }
        }
        
        // No match found
        const litCount = this.ledStates.filter(led => led).length;
        if (litCount === 0) {
            resultText.textContent = 'Select LEDs to determine knob position';
            resultText.className = 'result-text';
        } else {
            resultText.textContent = `No matching pattern found (${litCount} LEDs selected)`;
            resultText.className = 'result-text not-found';
        }
    }

    reset() {
        this.ledStates.fill(false);
        const leds = document.querySelectorAll('.led');
        leds.forEach(led => led.classList.remove('on'));
        this.updateResult();
    }
}

// Mark as loaded to prevent duplicates
window.KnobsModule = KnobsModule;

// Initialize the module
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new KnobsModule();
    });
} else {
    new KnobsModule();
}

}