// Keypad Modal JavaScript
(function() {
    console.log('Keypad modal script executing...');
    
    // Always try to initialize since modal content gets replaced
    setTimeout(() => {
        console.log('Attempting to initialize keypad...');
        initializeKeypad();
    }, 100);
})();

function initializeKeypad() {
    console.log('initializeKeypad called');
    
    // Tab switching functionality
    const keypadTabs = document.querySelectorAll('.keypad-tab');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    console.log('Found keypad tabs:', keypadTabs.length);
    console.log('Found tab panes:', tabPanes.length);
    
    keypadTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const action = this.dataset.action;
            
            // Remove active class from all tabs and panes
            keypadTabs.forEach(t => t.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding pane
            this.classList.add('active');
            const targetPane = document.querySelector(`[data-tab="${action}"]`);
            if (targetPane) {
                targetPane.classList.add('active');
            }
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });
    
    // Add keyboard navigation for tabs
    document.addEventListener('keydown', function(e) {
        // Number keys 1,2 to switch tabs
        if (['1', '2'].includes(e.key) && !e.ctrlKey && !e.altKey && !e.metaKey) {
            e.preventDefault();
            const tabIndex = parseInt(e.key) - 1;
            if (keypadTabs[tabIndex]) {
                keypadTabs[tabIndex].click();
            }
        }
    });
    
    // Initialize Automatic Solver
    initializeKeypadAutoSolver();
    
    // Initialize Reference Display - delay to ensure DOM is ready
    setTimeout(() => {
        initializeKeypadReference();
    }, 200);
}

// Keypad symbols and columns - KTANE official symbols
if (!window.keypadSymbols) {
    window.keypadSymbols = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ];
}

if (!window.keypadColumns) {
    window.keypadColumns = [
        [1, 2, 3, 4, 5, 6, 7],           // Column 1
        [8, 1, 7, 9, 10, 6, 11],        // Column 2  
        [12, 13, 9, 14, 15, 3, 10],     // Column 3
        [16, 17, 18, 5, 14, 11, 19],    // Column 4
        [20, 19, 18, 21, 17, 22, 23],   // Column 5
        [16, 8, 24, 25, 20, 26, 27]     // Column 6
    ];
}

// Keypad Automatic Solver Logic
function initializeKeypadAutoSolver() {
    console.log('initializeKeypadAutoSolver called');
    let selectedSymbols = [];
    
    // UI Elements
    const symbolGrid = document.getElementById('symbolGrid');
    const selectedDisplay = document.getElementById('selectedDisplay');
    const selectedCount = document.getElementById('selectedCount');
    const solveBtn = document.getElementById('solveBtn');
    
    console.log('symbolGrid found:', !!symbolGrid);
    console.log('selectedDisplay found:', !!selectedDisplay);
    console.log('selectedCount found:', !!selectedCount);
    console.log('solveBtn found:', !!solveBtn);
    
    const steps = {
        selection: document.getElementById('step-selection'),
        result: document.getElementById('step-result')
    };
    
    const pressSequence = document.getElementById('pressSequence');
    const resultExplanation = document.getElementById('resultExplanation');
    const backToSelection = document.getElementById('backToSelection');
    const restartKeypad = document.getElementById('restartKeypad');
    
    // Create symbol grid
    function createSymbolGrid() {
        console.log('createSymbolGrid called, symbolGrid exists:', !!symbolGrid);
        if (!symbolGrid) return;
        
        symbolGrid.innerHTML = '';
        console.log('Creating symbol grid with', window.keypadSymbols.length, 'symbols');
        
        // Get possible symbols based on current selection
        const possibleSymbols = getPossibleSymbols();
        
        window.keypadSymbols.forEach((symbol, index) => {
            const button = document.createElement('button');
            button.className = 'symbol-button';
            
            // Dim impossible symbols
            if (selectedSymbols.length > 0 && !possibleSymbols.includes(symbol) && !selectedSymbols.includes(symbol)) {
                button.classList.add('dimmed');
            }
            
            const img = document.createElement('img');
            img.src = `keypad_icons/${symbol}.png`;
            img.alt = `Symbol ${symbol}`;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain';
            
            button.appendChild(img);
            button.dataset.symbol = symbol;
            button.addEventListener('click', () => toggleSymbol(symbol, button));
            symbolGrid.appendChild(button);
        });
    }
    
    function getPossibleSymbols() {
        if (selectedSymbols.length === 0) return window.keypadSymbols;
        
        // Find columns that contain all currently selected symbols
        const validColumns = window.keypadColumns.filter(column => 
            selectedSymbols.every(symbol => column.includes(symbol))
        );
        
        // Return all symbols from valid columns
        const possibleSymbols = new Set();
        validColumns.forEach(column => {
            column.forEach(symbol => possibleSymbols.add(symbol));
        });
        
        return Array.from(possibleSymbols);
    }
    
    createSymbolGrid();
    
    function toggleSymbol(symbol, button) {
        if (selectedSymbols.includes(symbol)) {
            // Remove symbol
            selectedSymbols = selectedSymbols.filter(s => s !== symbol);
        } else if (selectedSymbols.length < 4) {
            // Add symbol
            selectedSymbols.push(symbol);
        }
        
        updateSelectedDisplay();
        updateSolveButton();
        createSymbolGrid(); // Recreate grid with new filtering
    }
    
    function updateSelectedDisplay() {
        if (!selectedDisplay || !selectedCount) return;
        
        selectedCount.textContent = selectedSymbols.length;
        
        // Clear display
        selectedDisplay.innerHTML = '';
        
        // Add selected symbols
        for (let i = 0; i < 4; i++) {
            if (i < selectedSymbols.length) {
                const slot = document.createElement('div');
                slot.className = 'selected-slot';
                
                const img = document.createElement('img');
                img.src = `keypad_icons/${selectedSymbols[i]}.png`;
                img.alt = `Symbol ${selectedSymbols[i]}`;
                img.style.width = '80%';
                img.style.height = '80%';
                img.style.objectFit = 'contain';
                
                slot.appendChild(img);
                selectedDisplay.appendChild(slot);
            } else {
                const slot = document.createElement('div');
                slot.className = 'empty-slot';
                slot.textContent = 'Click symbols above';
                selectedDisplay.appendChild(slot);
            }
        }
    }
    
    function updateSolveButton() {
        if (!solveBtn) return;
        solveBtn.disabled = selectedSymbols.length !== 4;
    }
    

    
    // Solve button handler
    if (solveBtn) {
        solveBtn.addEventListener('click', function() {
            if (selectedSymbols.length === 4) {
                const solution = solveKeypad(selectedSymbols);
                showSolution(solution);
            }
        });
    }
    
    function solveKeypad(symbols) {
        // Find the column that contains all 4 symbols
        for (let columnIndex = 0; columnIndex < window.keypadColumns.length; columnIndex++) {
            const column = window.keypadColumns[columnIndex];
            const hasAllSymbols = symbols.every(symbol => column.includes(symbol));
            
            if (hasAllSymbols) {
                // Sort symbols by their order in the column
                const sortedSymbols = symbols.sort((a, b) => {
                    return column.indexOf(a) - column.indexOf(b);
                });
                
                return {
                    sequence: sortedSymbols,
                    columnIndex: columnIndex + 1,
                    column: column
                };
            }
        }
        
        return null; // No solution found (shouldn't happen in valid KTANE)
    }
    
    function showSolution(solution) {
        if (!solution) {
            alert('No valid solution found. Please check your selected symbols.');
            return;
        }
        
        // Display the press sequence
        if (pressSequence) {
            pressSequence.innerHTML = '';
            solution.sequence.forEach((symbol, index) => {
                const step = document.createElement('div');
                step.className = 'press-step';
                
                const number = document.createElement('div');
                number.className = 'press-number';
                number.textContent = index + 1;
                
                const symbolDiv = document.createElement('div');
                symbolDiv.className = 'press-symbol';
                
                const img = document.createElement('img');
                img.src = `keypad_icons/${symbol}.png`;
                img.alt = `Symbol ${symbol}`;
                img.style.width = '80%';
                img.style.height = '80%';
                img.style.objectFit = 'contain';
                
                symbolDiv.appendChild(img);
                
                step.appendChild(number);
                step.appendChild(symbolDiv);
                pressSequence.appendChild(step);
            });
        }
        
        // Display explanation
        if (resultExplanation) {
            resultExplanation.innerHTML = `
                <strong>Solution found in Column ${solution.columnIndex}!</strong><br>
                Press the symbols in the order shown above.
                <br><br>
                <em>This column contains all 4 of your selected symbols in the correct order.</em>
            `;
        }
        
        showStep('result');
    }
    
    function showStep(stepName) {
        Object.values(steps).forEach(step => {
            if (step) step.classList.remove('active');
        });
        if (steps[stepName]) {
            steps[stepName].classList.add('active');
        }
    }
    
    // Navigation buttons
    if (backToSelection) {
        backToSelection.addEventListener('click', () => showStep('selection'));
    }
    
    if (restartKeypad) {
        restartKeypad.addEventListener('click', function() {
            selectedSymbols = [];
            updateSelectedDisplay();
            updateSolveButton();
            createSymbolGrid(); // Recreate grid without filtering
            showStep('selection');
        });
    }
    
    // Initialize display
    updateSelectedDisplay();
    updateSolveButton();
}

// Keypad Reference Display
function initializeKeypadReference() {
    const columnsGrid = document.getElementById('columnsGrid');
    
    if (!columnsGrid) return;
    
    window.keypadColumns.forEach((column, index) => {
        const card = document.createElement('div');
        card.className = 'column-card';
        
        const header = document.createElement('div');
        header.className = 'column-header';
        header.textContent = `Column ${index + 1}`;
        
        const symbols = document.createElement('div');
        symbols.className = 'column-symbols';
        
        column.forEach(symbol => {
            const item = document.createElement('div');
            item.className = 'symbol-item';
            
            const img = document.createElement('img');
            img.src = `keypad_icons/${symbol}.png`;
            img.alt = `Symbol ${symbol}`;
            img.style.width = '80%';
            img.style.height = '80%';
            img.style.objectFit = 'contain';
            
            item.appendChild(img);
            symbols.appendChild(item);
        });
        
        card.appendChild(header);
        card.appendChild(symbols);
        columnsGrid.appendChild(card);
    });
}