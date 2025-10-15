// Prevent duplicate initialization
if (typeof window.ComplicatedWiresModule === 'undefined') {

// Complicated Wires Logic
let wireProperties = {
    hasRed: false,
    hasBlue: false,
    hasStar: false,
    ledOn: false
};

// Initialize the Complicated Wires module
function initComplicatedWires() {
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
    
    // Initialize the module
    calculateOutcome();
}

// Auto-initialize when script loads (for modal system)
setTimeout(() => {
    if (document.querySelector('.tab-btn')) {
        initComplicatedWires();
    }
}, 100);

// Toggle property button
function toggleProperty(property) {
    wireProperties[property] = !wireProperties[property];
    
    const button = document.getElementById(property);
    if (wireProperties[property]) {
        button.classList.add('active');
    } else {
        button.classList.remove('active');
    }
    
    calculateOutcome();
}

// Reset all properties
function resetAll() {
    wireProperties = {
        hasRed: false,
        hasBlue: false,
        hasStar: false,
        ledOn: false
    };
    
    // Remove active class from all property buttons
    const propertyButtons = document.querySelectorAll('.property-btn');
    propertyButtons.forEach(btn => btn.classList.remove('active'));
    
    // Reset outcome display
    const outcomeResult = document.getElementById('outcomeResult');
    const outcomeExplanation = document.getElementById('outcomeExplanation');
    
    outcomeResult.textContent = 'Select wire properties above';
    outcomeResult.className = 'outcome-result';
    outcomeExplanation.textContent = '';
}

// Calculate outcome based on wire properties
function calculateOutcome() {
    const { hasRed, hasBlue, hasStar, ledOn } = wireProperties;
    let outcome;
    
    // Updated logic table based on corrected specifications
    // Note: "White" in the table means no red AND no blue (plain wire)
    const isWhite = !hasRed && !hasBlue;
    const isRedOnly = hasRed && !hasBlue;
    const isBlueOnly = !hasRed && hasBlue;
    const isRedAndBlue = hasRed && hasBlue;
    
    if (isWhite && !hasStar && !ledOn) outcome = "C";              // No Red, No Blue, No Star, LED Off
    else if (isWhite && hasStar && !ledOn) outcome = "C";          // No Red, No Blue, Star, LED Off
    else if (isRedOnly && !hasStar && !ledOn) outcome = "S";       // Red only, LED Off
    else if (isBlueOnly && !hasStar && !ledOn) outcome = "S";      // Blue only, LED Off
    else if (isRedAndBlue && !hasStar && !ledOn) outcome = "S";    // Red + Blue, LED Off
    else if (isRedAndBlue && !hasStar && ledOn) outcome = "S";     // Red + Blue, LED On
    else if (isRedAndBlue && hasStar && !ledOn) outcome = "P";     // Red + Blue + Star, LED Off - CORRECTED
    else if (isRedAndBlue && hasStar && ledOn) outcome = "D";      // Red + Blue + Star, LED On - CORRECTED
    else if (isRedOnly && hasStar && !ledOn) outcome = "C";        // Red only + Star, LED Off
    else if (isWhite && hasStar && ledOn) outcome = "B";           // White + Star, LED On
    else if (isRedOnly && !hasStar && ledOn) outcome = "B";        // Red only, LED On
    else if (isRedOnly && hasStar && ledOn) outcome = "B";         // Red only + Star, LED On
    else if (isBlueOnly && !hasStar && ledOn) outcome = "P";       // Blue only, LED On
    else if (isBlueOnly && hasStar && ledOn) outcome = "P";        // Blue only + Star, LED On
    else if (isWhite && !hasStar && ledOn) outcome = "D";          // Plain white (no color/star), LED On
    else if (isBlueOnly && hasStar && !ledOn) outcome = "D";       // Blue only + Star, LED Off
    else outcome = "C"; // Default fallback
    
    displayOutcome(outcome);
}

// Display the calculated outcome
function displayOutcome(outcome) {
    const outcomeResult = document.getElementById('outcomeResult');
    const outcomeExplanation = document.getElementById('outcomeExplanation');
    
    // Remove all outcome classes
    outcomeResult.className = 'outcome-result';
    
    switch (outcome) {
        case 'C':
            outcomeResult.textContent = '✂️ CUT THE WIRE';
            outcomeResult.classList.add('cut');
            outcomeExplanation.textContent = 'Always cut this wire';
            break;
            
        case 'D':
            outcomeResult.textContent = '❌ DON\'T CUT';
            outcomeResult.classList.add('dont-cut');
            outcomeExplanation.textContent = 'Never cut this wire';
            break;
            
        case 'S':
            outcomeResult.textContent = '🔢 CHECK SERIAL';
            outcomeResult.classList.add('conditional');
            outcomeExplanation.textContent = 'Cut if serial number\'s last digit is even';
            break;
            
        case 'P':
            outcomeResult.textContent = '🔌 CHECK PARALLEL PORT';
            outcomeResult.classList.add('conditional');
            outcomeExplanation.textContent = 'Cut if the bomb has a parallel port';
            break;
            
        case 'B':
            outcomeResult.textContent = '🔋 CHECK BATTERIES';
            outcomeResult.classList.add('conditional');
            outcomeExplanation.textContent = 'Cut if the bomb has 2 or more batteries';
            break;
            
        default:
            outcomeResult.textContent = 'Unknown combination';
            outcomeExplanation.textContent = '';
    }
}

// Mark as loaded to prevent duplicates
window.ComplicatedWiresModule = true;

// Initialize the module - merged with tab functionality above
// calculateOutcome() will be called when properties are toggled

}