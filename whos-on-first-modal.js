// Collapsible dropdowns for Manual Reference
function initializeDropdowns() {
    var dropdowns = document.querySelectorAll('.collapsible-dropdown .dropdown-toggle');
    dropdowns.forEach(function (toggle) {
        toggle.addEventListener('click', function () {
            var content = this.nextElementSibling;
            var isOpen = content.classList.contains('open');
            // Collapse all dropdowns on mobile for better UX
            if (window.innerWidth <= 600) {
                document.querySelectorAll('.collapsible-dropdown .dropdown-content').forEach(function (el) {
                    el.classList.remove('open');
                });
                document.querySelectorAll('.collapsible-dropdown .dropdown-toggle').forEach(function (el) {
                    el.classList.remove('open');
                });
            }
            if (isOpen) {
                content.classList.remove('open');
                this.classList.remove('open');
            } else {
                content.classList.add('open');
                this.classList.add('open');
            }
        });
    });
}

// 6 Button Screen Module JavaScript
// (Removed duplicate stub)
// Prevent duplicate initialization
// 6 Button Screen Module JavaScript
function initWhosOnFirstModal() {
    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    // Event delegation for tab switching
    const tabsContainer = document.querySelector('.tabs');
    tabsContainer.addEventListener('click', function(e) {
        const btn = e.target.closest('.tab-btn');
        if (!btn) return;
        const targetTab = btn.dataset.tab;
        console.log('Tab clicked:', targetTab);

        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(targetTab).classList.add('active');

        if (targetTab === 'manual') {
            initializeDropdowns();
        }
    });
        // When modal is reopened, re-initialize dropdowns and tab visibility
        window.addEventListener('modalOpened', function() {
            // Ensure only the first tab is active
            tabBtns.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            if (tabBtns[0]) tabBtns[0].classList.add('active');
            if (tabPanels[0]) tabPanels[0].classList.add('active');
            // Reset dropdowns
            document.querySelectorAll('.collapsible-dropdown .dropdown-content').forEach(function (el) {
                el.classList.remove('open');
            });
            document.querySelectorAll('.collapsible-dropdown .dropdown-toggle').forEach(function (el) {
                el.classList.remove('open');
            });
            // Re-initialize dropdown listeners
            initializeDropdowns();
        });

    // Input elements
    const displayText = document.getElementById('displayText');
    const blankDisplay = document.getElementById('blankDisplay');
    const buttonInputs = document.querySelectorAll('.button-input');
    const positionDisplay = document.getElementById('positionDisplay');
    const solutionDisplay = document.getElementById('solutionDisplay');
    const calculationSteps = document.getElementById('calculationSteps');

    // Display text to position mapping
    const displayMapping = {
        "YES": { position: 3, name: "MIDDLE LEFT" },           // 1st column 2nd row
        "FIRST": { position: 2, name: "TOP RIGHT" },           // 2nd column 1st row
        "DISPLAY": { position: 6, name: "BOTTOM RIGHT" },      // 2nd column 3rd row
        "OKAY": { position: 2, name: "TOP RIGHT" },            // 2nd column 1st row
        "SAYS": { position: 6, name: "BOTTOM RIGHT" },         // 2nd column 3rd row
        "NOTHING": { position: 3, name: "MIDDLE LEFT" },       // 1st column 2nd row
        "": { position: 5, name: "BOTTOM LEFT" },              // Blank screen - 1st column 3rd row
        "BLANK": { position: 4, name: "MIDDLE RIGHT" },        // 2nd column 2nd row
        "NO": { position: 6, name: "BOTTOM RIGHT" },           // 2nd column 3rd row
        "LED": { position: 3, name: "MIDDLE LEFT" },           // 1st column 2nd row
        "LEAD": { position: 6, name: "BOTTOM RIGHT" },         // 2nd column 3rd row
        "READ": { position: 4, name: "MIDDLE RIGHT" },         // 2nd column 2nd row
        "RED": { position: 4, name: "MIDDLE RIGHT" },          // 2nd column 2nd row
        "REED": { position: 5, name: "BOTTOM LEFT" },          // 1st column 3rd row
        "LEED": { position: 5, name: "BOTTOM LEFT" },          // 1st column 3rd row
        "HOLD ON": { position: 6, name: "BOTTOM RIGHT" },      // 2nd column 3rd row
        "YOU": { position: 4, name: "MIDDLE RIGHT" },          // 2nd column 2nd row
        "YOU ARE": { position: 6, name: "BOTTOM RIGHT" },      // 2nd column 3rd row
        "YOUR": { position: 4, name: "MIDDLE RIGHT" },         // 2nd column 2nd row
        "YOU'RE": { position: 4, name: "MIDDLE RIGHT" },       // 2nd column 2nd row
        "UR": { position: 1, name: "TOP LEFT" },               // 1st column 1st row
        "THERE": { position: 6, name: "BOTTOM RIGHT" },        // 2nd column 3rd row
        "THEY'RE": { position: 5, name: "BOTTOM LEFT" },       // 1st column 3rd row
        "THEIR": { position: 4, name: "MIDDLE RIGHT" },        // 2nd column 2nd row
        "THEY ARE": { position: 3, name: "MIDDLE LEFT" },      // 1st column 2nd row
        "SEE": { position: 6, name: "BOTTOM RIGHT" },          // 2nd column 3rd row
        "C": { position: 2, name: "TOP RIGHT" },               // 2nd column 1st row
        "CEE": { position: 6, name: "BOTTOM RIGHT" }           // 2nd column 3rd row
    };

    // Word lists for each button label - find first word in list that matches a button
    const wordLists = {
        "READY": ["YES", "OKAY", "WHAT", "MIDDLE", "LEFT", "PRESS", "RIGHT", "BLANK", "READY", "NO", "FIRST", "UHHH", "NOTHING", "WAIT"],
        "FIRST": ["LEFT", "OKAY", "YES", "MIDDLE", "NO", "RIGHT", "NOTHING", "UHHH", "WAIT", "READY", "BLANK", "WHAT", "PRESS", "FIRST"],
        "NO": ["BLANK", "UHHH", "WAIT", "FIRST", "WHAT", "READY", "RIGHT", "YES", "NOTHING", "LEFT", "PRESS", "OKAY", "NO", "MIDDLE"],
        "BLANK": ["WAIT", "RIGHT", "OKAY", "MIDDLE", "BLANK", "PRESS", "READY", "NOTHING", "NO", "WHAT", "LEFT", "UHHH", "YES", "FIRST"],
        "NOTHING": ["UHHH", "RIGHT", "OKAY", "MIDDLE", "YES", "BLANK", "NO", "PRESS", "LEFT", "WHAT", "WAIT", "FIRST", "NOTHING", "READY"],
        "YES": ["OKAY", "RIGHT", "UHHH", "MIDDLE", "FIRST", "WHAT", "PRESS", "READY", "NOTHING", "YES", "LEFT", "BLANK", "NO", "WAIT"],
        "WHAT": ["UHHH", "WHAT", "LEFT", "NOTHING", "READY", "BLANK", "MIDDLE", "NO", "OKAY", "FIRST", "WAIT", "YES", "PRESS", "RIGHT"],
        "UHHH": ["READY", "NOTHING", "LEFT", "WHAT", "OKAY", "YES", "RIGHT", "NO", "PRESS", "BLANK", "UHHH", "MIDDLE", "WAIT", "FIRST"],
        "LEFT": ["RIGHT", "LEFT", "FIRST", "NO", "MIDDLE", "YES", "BLANK", "WHAT", "UHHH", "WAIT", "PRESS", "READY", "OKAY", "NOTHING"],
        "RIGHT": ["YES", "NOTHING", "READY", "PRESS", "NO", "WAIT", "WHAT", "RIGHT", "MIDDLE", "LEFT", "UHHH", "BLANK", "OKAY", "FIRST"],
        "MIDDLE": ["BLANK", "READY", "OKAY", "WHAT", "NOTHING", "PRESS", "NO", "WAIT", "LEFT", "MIDDLE", "RIGHT", "FIRST", "UHHH", "YES"],
        "OKAY": ["MIDDLE", "NO", "FIRST", "YES", "UHHH", "NOTHING", "WAIT", "OKAY", "LEFT", "READY", "BLANK", "PRESS", "WHAT", "RIGHT"],
        "WAIT": ["UHHH", "NO", "BLANK", "OKAY", "YES", "LEFT", "FIRST", "PRESS", "WHAT", "WAIT", "NOTHING", "READY", "RIGHT", "MIDDLE"],
        "PRESS": ["RIGHT", "MIDDLE", "YES", "READY", "PRESS", "OKAY", "NOTHING", "UHHH", "BLANK", "LEFT", "FIRST", "WHAT", "NO", "WAIT"],
        "YOU": ["SURE", "YOU ARE", "YOUR", "YOU'RE", "NEXT", "UH HUH", "UR", "HOLD", "WHAT?", "YOU", "UH UH", "LIKE", "DONE", "U"],
        "YOU ARE": ["YOUR", "NEXT", "LIKE", "UH HUH", "WHAT?", "DONE", "UH UH", "HOLD", "YOU", "U", "YOU'RE", "SURE", "UR", "YOU ARE"],
        "YOUR": ["UH UH", "YOU ARE", "UH HUH", "YOUR", "NEXT", "UR", "SURE", "U", "YOU'RE", "YOU", "WHAT?", "HOLD", "LIKE", "DONE"],
        "YOU'RE": ["YOU", "YOU'RE", "UR", "NEXT", "UH UH", "YOU ARE", "U", "YOUR", "WHAT?", "UH HUH", "SURE", "DONE", "LIKE", "HOLD"],
        "UR": ["DONE", "U", "UR", "UH HUH", "WHAT?", "SURE", "YOUR", "HOLD", "YOU'RE", "LIKE", "NEXT", "UH UH", "YOU ARE", "YOU"],
        "U": ["UH HUH", "SURE", "NEXT", "WHAT?", "YOU'RE", "UR", "UH UH", "DONE", "U", "YOU", "LIKE", "HOLD", "YOU ARE", "YOUR"],
        "UH HUH": ["UH HUH", "YOUR", "YOU ARE", "YOU", "DONE", "HOLD", "UH UH", "NEXT", "SURE", "LIKE", "YOU'RE", "UR", "U", "WHAT?"],
        "UH UH": ["UR", "U", "YOU ARE", "YOU'RE", "NEXT", "UH UH", "DONE", "YOU", "UH HUH", "LIKE", "YOUR", "SURE", "HOLD", "WHAT?"],
        "WHAT?": ["YOU", "HOLD", "YOU'RE", "YOUR", "U", "DONE", "UH UH", "LIKE", "YOU ARE", "UH HUH", "UR", "NEXT", "WHAT?", "SURE"],
        "DONE": ["SURE", "UH HUH", "NEXT", "WHAT?", "YOUR", "UR", "YOU'RE", "HOLD", "LIKE", "YOU", "U", "YOU ARE", "UH UH", "DONE"],
        "NEXT": ["WHAT?", "UH HUH", "UH UH", "YOUR", "HOLD", "SURE", "NEXT", "LIKE", "DONE", "YOU ARE", "UR", "YOU'RE", "U", "YOU"],
        "HOLD": ["YOU ARE", "U", "DONE", "UH UH", "YOU", "UR", "SURE", "WHAT?", "YOU'RE", "NEXT", "HOLD", "UH HUH", "YOUR", "LIKE"],
        "SURE": ["YOU ARE", "DONE", "LIKE", "YOU'RE", "YOU", "HOLD", "UH HUH", "UR", "SURE", "U", "WHAT?", "NEXT", "YOUR", "UH UH"],
        "LIKE": ["YOU'RE", "NEXT", "U", "UR", "HOLD", "DONE", "UH UH", "WHAT?", "UH HUH", "YOU", "LIKE", "SURE", "YOU ARE", "YOUR"]
    };

    // Position names mapping
    const positionNames = {
        1: "TOP LEFT",
        2: "TOP RIGHT", 
        3: "MIDDLE LEFT",
        4: "MIDDLE RIGHT",
        5: "BOTTOM LEFT",
        6: "BOTTOM RIGHT"
    };

    // Auto-uppercase display text
    if (displayText) {
        displayText.addEventListener('input', function() {
            this.value = this.value.toUpperCase();
            // Clear blank checkbox if user types something
            if (blankDisplay && this.value.trim()) {
                blankDisplay.checked = false;
            }
            updateSolution();
        });
    }

    // Handle blank display checkbox
    if (blankDisplay) {
        blankDisplay.addEventListener('change', function() {
            if (this.checked && displayText) {
                // Clear the text input when blank is checked
                displayText.value = '';
            }
            updateSolution();
        });
    }

    // Auto-uppercase button inputs
    if (buttonInputs.length > 0) {
        buttonInputs.forEach(input => {
            input.addEventListener('input', function() {
                this.value = this.value.toUpperCase();
                updateSolution();
            });
        });
    }

    function updateSolution() {
        // Check if display is blank (checkbox checked or empty input)
        const isBlankDisplay = blankDisplay && blankDisplay.checked;
        const display = isBlankDisplay ? "" : displayText.value.trim().toUpperCase();
        
        const buttons = Array.from(buttonInputs).map(input => ({
            position: parseInt(input.dataset.position),
            text: input.value.trim().toUpperCase(),
            name: positionNames[parseInt(input.dataset.position)]
        }));

        // Clear previous results
        calculationSteps.innerHTML = '';
        
        // Handle blank display case
        if (isBlankDisplay) {
            // Blank display should go to BOTTOM LEFT
            const targetPosition = findPositionFromDisplay("");
            positionDisplay.innerHTML = '<span class="position-text">Check BOTTOM LEFT (Blank Display)</span>';
            addCalculationStep("1️⃣", "Display is blank → Check BOTTOM LEFT", "info");
            
            // Continue with solution logic
            proceedWithSolution(targetPosition, buttons);
            return;
        }
        
        if (!display) {
            positionDisplay.innerHTML = '<span class="position-text">Enter display text or check blank display</span>';
            solutionDisplay.innerHTML = '<div class="solution-text">Enter display text and button labels to see the solution</div>';
            return;
        }

        // Step 1: Find position based on display text
        const targetPosition = findPositionFromDisplay(display);
        
        if (!targetPosition) {
            positionDisplay.innerHTML = '<span class="position-text" style="color: #ff6b6b;">Unknown display text</span>';
            solutionDisplay.innerHTML = '<div class="solution-text" style="color: #ff6b6b;">Display text not recognized</div>';
            addCalculationStep("❌", "Display text not found in reference table", "error");
            return;
        }

        // Update position display
        positionDisplay.innerHTML = `<span class="position-text">Check ${targetPosition.name}</span>`;
        addCalculationStep("1️⃣", `Display "${display}" → Check ${targetPosition.name}`, "info");

        // Continue with solution
        proceedWithSolution(targetPosition, buttons);
    }
    
    function proceedWithSolution(targetPosition, buttons) {
        // Step 2: Get the button at that position
        const targetButton = buttons.find(btn => btn.position === targetPosition.position);
        
        if (!targetButton || !targetButton.text) {
            solutionDisplay.innerHTML = '<div class="solution-text" style="color: #ff6b6b;">Enter button label for ' + targetPosition.name + '</div>';
            addCalculationStep("2️⃣", `Need button label for ${targetPosition.name}`, "warning");
            return;
        }

        addCalculationStep("2️⃣", `Button at ${targetPosition.name}: "${targetButton.text}"`, "info");

        // Step 3: Find which button to press based on word list
        const buttonToPress = findButtonToPress(targetButton.text, buttons);
        
        if (!buttonToPress) {
            solutionDisplay.innerHTML = '<div class="solution-text" style="color: #ff6b6b;">No matching word found in list</div>';
            addCalculationStep("3️⃣", `"${targetButton.text}" not found in word list or no buttons match the list`, "error");
            return;
        }

        // Show solution
        solutionDisplay.innerHTML = `
            <div class="solution-text">Press ${buttonToPress.name}</div>
            <div class="solution-button">Button: "${buttonToPress.text}"</div>
        `;
        
        addCalculationStep("3️⃣", `Using "${targetButton.text}" word list → First match: "${buttonToPress.matchedWord}" → Press "${buttonToPress.text}"`, "success");
        addCalculationStep("✅", `SOLUTION: Press ${buttonToPress.name} button ("${buttonToPress.text}")`, "success");
    }

    function findPositionFromDisplay(display) {
        // Handle blank/empty display
        if (!display || display.trim() === "") {
            return displayMapping[""];
        }
        
        // Look up the display text in our mapping (convert to uppercase and trim)
        const cleanDisplay = display.trim().toUpperCase();
        const mapping = displayMapping[cleanDisplay];
        
        if (mapping) {
            return {
                position: mapping.position,
                name: mapping.name,
                listName: mapping.name // Will be used for word list lookup
            };
        }
        
        return null; // Display text not found
    }

    function findButtonToPress(targetWord, buttons) {
        // Get the word list for the target word
        const wordList = wordLists[targetWord.toUpperCase()];
        
        if (!wordList) {
            return null; // Target word not found in word lists
        }
        
        // Find the first word in the list that matches any button on the module
        for (const word of wordList) {
            const matchingButton = buttons.find(btn => 
                btn.text && btn.text.toUpperCase() === word.toUpperCase()
            );
            
            if (matchingButton) {
                return {
                    position: matchingButton.position,
                    text: matchingButton.text,
                    name: matchingButton.name,
                    matchedWord: word
                };
            }
        }
        
        return null; // No matching words found
    }

    function addCalculationStep(icon, text, type = "info") {
        const step = document.createElement('div');
        step.className = `step step-${type}`;
        
        const iconSpan = document.createElement('span');
        iconSpan.className = 'step-number';
        iconSpan.textContent = icon;
        
        const textSpan = document.createElement('span');
        textSpan.className = type === "success" ? 'step-highlight' : '';
        textSpan.textContent = text;
        
        step.appendChild(iconSpan);
        step.appendChild(textSpan);
        calculationSteps.appendChild(step);
    }

    // Initialize manual reference tab
    function initializeManualReference() {
        populateDisplayTable();
        populateWordLists();
    }

    function populateDisplayTable() {
        const table = document.querySelector('.display-table');
        
        // Create rows for each display mapping
        const mappings = [
            ["YES", "MIDDLE LEFT"],
            ["FIRST", "TOP RIGHT"], 
            ["DISPLAY", "BOTTOM RIGHT"],
            ["OKAY", "TOP RIGHT"],
            ["SAYS", "BOTTOM RIGHT"],
            ["NOTHING", "MIDDLE LEFT"],
            ["(Blank)", "BOTTOM LEFT"],
            ["BLANK", "MIDDLE RIGHT"],
            ["NO", "BOTTOM RIGHT"],
            ["LED", "MIDDLE LEFT"],
            ["LEAD", "BOTTOM RIGHT"],
            ["READ", "MIDDLE RIGHT"],
            ["RED", "MIDDLE RIGHT"],
            ["REED", "BOTTOM LEFT"],
            ["LEED", "BOTTOM LEFT"],
            ["HOLD ON", "BOTTOM RIGHT"],
            ["YOU", "MIDDLE RIGHT"],
            ["YOU ARE", "BOTTOM RIGHT"],
            ["YOUR", "MIDDLE RIGHT"],
            ["YOU'RE", "MIDDLE RIGHT"],
            ["UR", "TOP LEFT"],
            ["THERE", "BOTTOM RIGHT"],
            ["THEY'RE", "BOTTOM LEFT"],
            ["THEIR", "MIDDLE RIGHT"],
            ["THEY ARE", "MIDDLE LEFT"],
            ["SEE", "BOTTOM RIGHT"],
            ["C", "TOP RIGHT"],
            ["CEE", "BOTTOM RIGHT"]
        ];
        
        mappings.forEach(([display, position]) => {
            const row = document.createElement('div');
            row.className = 'table-row';
            row.innerHTML = `
                <div class="table-cell">${display}</div>
                <div class="table-cell">${position}</div>
            `;
            table.appendChild(row);
        });
    }

    function populateWordLists() {
        const container = document.querySelector('.word-lists');
        
        // Create word list displays for each button label
        const wordListKeys = Object.keys(wordLists);
        
        wordListKeys.forEach(key => {
            const wordList = document.createElement('div');
            wordList.className = 'word-list';
            
            const words = wordLists[key].map(word => `<li>${word}</li>`).join('');
            
            wordList.innerHTML = `
                <h5>"${key}"</h5>
                <ul>${words}</ul>
            `;
            
            container.appendChild(wordList);
        });
    }

    // Initialize the manual reference
    initializeManualReference();

    // Handle cleanup when modal is closed
    window.addEventListener('modalClosed', function() {
        // Reset all inputs
        if (displayText) displayText.value = '';
        if (blankDisplay) blankDisplay.checked = false;
        buttonInputs.forEach(input => input.value = '');
        if (positionDisplay) positionDisplay.innerHTML = '<span class="position-text">Position will appear here</span>';
        if (solutionDisplay) solutionDisplay.innerHTML = '<div class="solution-text">Enter display text and button labels to see the solution</div>';
        if (calculationSteps) calculationSteps.innerHTML = '';

        // Reset to first tab
        tabBtns.forEach(btn => btn.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));
        if (tabBtns[0]) tabBtns[0].classList.add('active');
        if (tabPanels[0]) tabPanels[0].classList.add('active');

        // Reset dropdowns
        document.querySelectorAll('.collapsible-dropdown .dropdown-content').forEach(function (el) {
            el.classList.remove('open');
        });
        document.querySelectorAll('.collapsible-dropdown .dropdown-toggle').forEach(function (el) {
            el.classList.remove('open');
        });
    });
}

// Mark as loaded to prevent duplicates
// Always run initialization when script loads (like other modals)
setTimeout(initWhosOnFirstModal, 100);