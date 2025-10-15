// Prevent duplicate initialization
if (typeof window.WireSequencesModule === 'undefined') {

// Wire Sequences Logic
let wireCounts = {
    red: 0,
    blue: 0,
    black: 0
};

let wireHistory = [];

// Wire cutting rules based on occurrence
const WIRE_RULES = {
    red: [
        'C',           // 1st red
        'B',           // 2nd red
        'A',           // 3rd red
        'A or C',      // 4th red
        'B',           // 5th red
        'A or C',      // 6th red
        'A, B or C',   // 7th red
        'A or B',      // 8th red
        'B'            // 9th red
    ],
    blue: [
        'B',           // 1st blue
        'A or C',      // 2nd blue
        'B',           // 3rd blue
        'A',           // 4th blue
        'B',           // 5th blue
        'B or C',      // 6th blue
        'C',           // 7th blue
        'A or C',      // 8th blue
        'A'            // 9th blue
    ],
    black: [
        'A, B or C',   // 1st black
        'A or C',      // 2nd black
        'B',           // 3rd black
        'A or C',      // 4th black
        'B',           // 5th black
        'B or C',      // 6th black
        'A or B',      // 7th black
        'C',           // 8th black
        'C'            // 9th black
    ]
};

// Initialize the Wire Sequences module
function initWireSequences() {
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
    
    // Initialize display
    updateDisplay();
}

// Add a wire occurrence
function addWire(color) {
    if (wireCounts[color] < 9) { // Maximum 9 occurrences
        wireCounts[color]++;
        wireHistory.push(color);
        updateDisplay();
        showWireAction(color, wireCounts[color]);
    }
}

// Undo the last wire addition
function undoLastWire() {
    if (wireHistory.length > 0) {
        const lastColor = wireHistory.pop();
        wireCounts[lastColor]--;
        updateDisplay();
        
        // Show action for the next wire of this color
        if (wireCounts[lastColor] > 0) {
            showWireAction(lastColor, wireCounts[lastColor]);
        } else {
            clearAction();
        }
    }
}

// Reset all counters
function resetAll() {
    wireCounts = { red: 0, blue: 0, black: 0 };
    wireHistory = [];
    updateDisplay();
    clearAction();
}

// Update the display elements
function updateDisplay() {
    // Update occurrence counts
    document.getElementById('redCount').textContent = wireCounts.red;
    document.getElementById('blueCount').textContent = wireCounts.blue;
    document.getElementById('blackCount').textContent = wireCounts.black;
    
    // Update undo button
    const undoBtn = document.getElementById('undoBtn');
    undoBtn.disabled = wireHistory.length === 0;
    
    // Update history display
    updateHistoryDisplay();
}

// Update wire history display
function updateHistoryDisplay() {
    const historyList = document.getElementById('historyList');
    
    if (wireHistory.length === 0) {
        historyList.innerHTML = '<span class="empty-history">No wires added yet</span>';
    } else {
        const historyItems = wireHistory.map((color, index) => {
            const occurrenceNumber = wireHistory.slice(0, index + 1).filter(c => c === color).length;
            return `<span class="history-item ${color}">${color.charAt(0).toUpperCase() + color.slice(1)} #${occurrenceNumber}</span>`;
        }).join('');
        historyList.innerHTML = historyItems;
    }
}

// Show the cutting action for a specific wire
function showWireAction(color, occurrence) {
    const actionResult = document.getElementById('actionResult');
    const actionExplanation = document.getElementById('actionExplanation');
    
    if (occurrence <= WIRE_RULES[color].length) {
        const cutRule = WIRE_RULES[color][occurrence - 1];
        
        actionResult.textContent = `Cut ${color} wire #${occurrence} if connected to: ${cutRule}`;
        actionResult.className = 'action-result cut';
        
        actionExplanation.textContent = `This is the ${getOrdinal(occurrence)} ${color} wire you've encountered. Check which letter (A, B, or C) it connects to and cut only if it matches the rule above.`;
    } else {
        actionResult.textContent = `Maximum occurrences reached for ${color} wires`;
        actionResult.className = 'action-result info';
        actionExplanation.textContent = `You've reached the maximum of 9 occurrences for ${color} wires. No more rules are defined beyond the 9th occurrence.`;
    }
}

// Clear the action display
function clearAction() {
    const actionResult = document.getElementById('actionResult');
    const actionExplanation = document.getElementById('actionExplanation');
    
    actionResult.textContent = 'Click a wire color above to see cutting instructions';
    actionResult.className = 'action-result info';
    actionExplanation.textContent = '';
}

// Get ordinal number (1st, 2nd, 3rd, etc.)
function getOrdinal(number) {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const value = number % 100;
    return number + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]);
}

// Auto-initialize when script loads (for modal system)
setTimeout(() => {
    if (document.querySelector('.tab-btn')) {
        initWireSequences();
    }
}, 100);

// Mark as loaded to prevent duplicates
window.WireSequencesModule = true;

// Additional initialization for modal system
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.querySelector('.tab-btn')) {
            initWireSequences();
        }
    });
} else {
    if (document.querySelector('.tab-btn')) {
        initWireSequences();
    }
}

}