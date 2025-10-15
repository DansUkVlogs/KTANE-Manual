// Memory Module JavaScript
(function() {
    setTimeout(initMemoryModal, 100);
})();

function initMemoryModal() {
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

    // Input elements
    const displayButtons = document.querySelectorAll('.display-btn');
    const ruleSection = document.getElementById('ruleSection');
    const ruleDisplay = document.getElementById('ruleDisplay');
    const buttonActionSection = document.getElementById('buttonActionSection');
    const buttonLabel = document.getElementById('buttonLabel');
    const buttonPosition = document.getElementById('buttonPosition');
    const inputHelp = document.getElementById('inputHelp');
    const currentStageNum = document.getElementById('currentStageNum');
    const stageIndicators = document.querySelectorAll('.stage-indicator');
    const nextBtn = document.getElementById('nextStage');
    const resetBtn = document.getElementById('resetStages');

    // Memory tracking
    let currentStage = 1;
    let selectedDisplayNumber = null;
    let currentRule = null;
    let stageMemory = {
        1: { position: null, label: null },
        2: { position: null, label: null },
        3: { position: null, label: null },
        4: { position: null, label: null },
        5: { position: null, label: null }
    };

    // Stage rules - what to do based on display number
    const stageRules = {
        1: {
            1: { type: 'position', value: 2 },
            2: { type: 'position', value: 2 },
            3: { type: 'position', value: 3 },
            4: { type: 'position', value: 4 }
        },
        2: {
            1: { type: 'label', value: '4' },
            2: { type: 'memory_position', stage: 1 },
            3: { type: 'position', value: 1 },
            4: { type: 'memory_position', stage: 1 }
        },
        3: {
            1: { type: 'memory_label', stage: 2 },
            2: { type: 'memory_label', stage: 1 },
            3: { type: 'position', value: 3 },
            4: { type: 'label', value: '4' }
        },
        4: {
            1: { type: 'memory_position', stage: 1 },
            2: { type: 'position', value: 1 },
            3: { type: 'memory_position', stage: 2 },
            4: { type: 'memory_position', stage: 2 }
        },
        5: {
            1: { type: 'memory_label', stage: 1 },
            2: { type: 'memory_label', stage: 2 },
            3: { type: 'memory_label', stage: 4 },
            4: { type: 'memory_label', stage: 3 }
        }
    };

    // Initialize
    updateStageDisplay();

    // Event listeners
    displayButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove selection from all buttons
            displayButtons.forEach(b => b.classList.remove('selected'));
            
            // Select this button
            this.classList.add('selected');
            selectedDisplayNumber = parseInt(this.dataset.number);
            
            // Show rule and prepare action inputs
            showRuleAndPrepareInputs();
        });
    });

    if (buttonLabel) {
        buttonLabel.addEventListener('input', function() {
            this.value = this.value.toUpperCase();
            checkIfReadyToAdvance();
        });
    }

    if (buttonPosition) {
        buttonPosition.addEventListener('input', function() {
            checkIfReadyToAdvance();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', advanceToNextStage);
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', resetToStageOne);
    }

    function updateStageDisplay() {
        // Check if elements still exist (modal might be closed)
        if (!currentStageNum || !stageIndicators.length) return;
        
        if (currentStageNum) {
            currentStageNum.textContent = currentStage;
        }
        
        // Update stage indicators
        stageIndicators.forEach(indicator => {
            const stage = parseInt(indicator.dataset.stage);
            indicator.classList.remove('active', 'completed');
            
            if (stage === currentStage) {
                indicator.classList.add('active');
            } else if (stage < currentStage) {
                indicator.classList.add('completed');
            }
        });

        // Update memory display
        updateMemoryDisplay();
        
        // Reset inputs for new stage
        selectedDisplayNumber = null;
        currentRule = null;
        displayButtons.forEach(btn => btn.classList.remove('selected'));
        if (buttonLabel) {
            buttonLabel.value = '';
            buttonLabel.removeAttribute('readonly');
        }
        if (buttonPosition) {
            buttonPosition.value = '';
            buttonPosition.removeAttribute('readonly');
        }
        
        // Hide sections until display number is entered
        if (ruleSection) ruleSection.style.display = 'none';
        if (buttonActionSection) buttonActionSection.style.display = 'none';
        if (nextBtn) nextBtn.disabled = true;
    }

    function showRuleAndPrepareInputs() {
        if (!selectedDisplayNumber || selectedDisplayNumber < 1 || selectedDisplayNumber > 4) {
            if (ruleSection) ruleSection.style.display = 'none';
            if (buttonActionSection) buttonActionSection.style.display = 'none';
            return;
        }
        
        const display = selectedDisplayNumber;
        currentRule = stageRules[currentStage][display];
        if (!currentRule) return;

        // Show rule section
        if (ruleSection) ruleSection.style.display = 'block';
        if (buttonActionSection) buttonActionSection.style.display = 'block';

        let ruleText = '';
        let helpText = '';

        // Clear previous inputs
        if (buttonLabel) buttonLabel.value = '';
        if (buttonPosition) buttonPosition.value = '';
        
        // Remove readonly attributes
        if (buttonLabel) buttonLabel.removeAttribute('readonly');
        if (buttonPosition) buttonPosition.removeAttribute('readonly');

        // Determine what the rule says to do and pre-fill known values
        switch (currentRule.type) {
            case 'position':
                ruleText = `Press the button in position ${currentRule.value}`;
                helpText = `Position is ${currentRule.value}. Enter the label of that button.`;
                if (buttonPosition) {
                    buttonPosition.value = currentRule.value;
                    buttonPosition.setAttribute('readonly', true);
                }
                break;
                
            case 'label':
                ruleText = `Press the button labeled "${currentRule.value}"`;
                helpText = `Label is "${currentRule.value}". Enter the position of that button.`;
                if (buttonLabel) {
                    buttonLabel.value = currentRule.value;
                    buttonLabel.setAttribute('readonly', true);
                }
                break;
                
            case 'memory_position':
                const memoryPos = stageMemory[currentRule.stage].position;
                if (!memoryPos) {
                    ruleText = `❌ Need memory from Stage ${currentRule.stage} (position)`;
                    helpText = `You haven't completed Stage ${currentRule.stage} yet.`;
                } else {
                    ruleText = `Press the button in position ${memoryPos} (same as Stage ${currentRule.stage})`;
                    helpText = `Position is ${memoryPos} (from Stage ${currentRule.stage}). Enter the label of that button.`;
                    if (buttonPosition) {
                        buttonPosition.value = memoryPos;
                        buttonPosition.setAttribute('readonly', true);
                    }
                }
                break;
                
            case 'memory_label':
                const memoryLbl = stageMemory[currentRule.stage].label;
                if (!memoryLbl) {
                    ruleText = `❌ Need memory from Stage ${currentRule.stage} (label)`;
                    helpText = `You haven't completed Stage ${currentRule.stage} yet.`;
                } else {
                    ruleText = `Press the button labeled "${memoryLbl}" (same as Stage ${currentRule.stage})`;
                    helpText = `Label is "${memoryLbl}" (from Stage ${currentRule.stage}). Enter the position of that button.`;
                    if (buttonLabel) {
                        buttonLabel.value = memoryLbl;
                        buttonLabel.setAttribute('readonly', true);
                    }
                }
                break;
        }

        // Update the display
        if (ruleDisplay) {
            ruleDisplay.innerHTML = `<div class="rule-text">${ruleText}</div>`;
        }
        if (inputHelp) {
            inputHelp.textContent = helpText;
        }
        
        // Check if we can advance to next stage
        checkIfReadyToAdvance();
    }

    function checkIfReadyToAdvance() {
        const positionFilled = buttonPosition && buttonPosition.value.trim() !== '';
        const labelFilled = buttonLabel && buttonLabel.value.trim() !== '';
        
        if (positionFilled && labelFilled && nextBtn) {
            nextBtn.disabled = false;
        } else if (nextBtn) {
            nextBtn.disabled = true;
        }
    }

    function advanceToNextStage() {
        // Save current stage to memory
        const position = parseInt(buttonPosition.value);
        const label = buttonLabel.value.trim().toUpperCase();
        
        if (!position || !label || position < 1 || position > 4) {
            return; // Should not happen due to validation, but safety check
        }
        
        // Store in memory bank
        stageMemory[currentStage] = { position: position, label: label };
        
        // Update memory display
        updateMemoryDisplay();
        
        // Move to next stage
        if (currentStage < 5) {
            currentStage++;
            updateStageDisplay();
            
            // Clear inputs for next stage
            selectedDisplayNumber = null;
            currentRule = null;
            displayButtons.forEach(btn => btn.classList.remove('selected'));
            if (buttonLabel) buttonLabel.value = '';
            if (buttonPosition) buttonPosition.value = '';
            if (buttonLabel) buttonLabel.removeAttribute('readonly');
            if (buttonPosition) buttonPosition.removeAttribute('readonly');
            
            // Hide sections
            if (ruleSection) ruleSection.style.display = 'none';
            if (buttonActionSection) buttonActionSection.style.display = 'none';
            if (nextBtn) nextBtn.disabled = true;
        } else {
            // Completed all stages!
            if (ruleDisplay) {
                ruleDisplay.innerHTML = '<div class="rule-text">🎉 All stages complete! Memory module solved!</div>';
            }
            if (nextBtn) nextBtn.disabled = true;
        }
    }

    function updateMemoryDisplay() {
        for (let stage = 1; stage <= 5; stage++) {
            const memoryStage = document.getElementById(`memory-stage-${stage}`);
            if (!memoryStage) return; // Exit if modal is closed and elements don't exist
            
            const positionSpan = memoryStage.querySelector('.memory-position');
            const labelSpan = memoryStage.querySelector('.memory-label');
            
            if (!positionSpan || !labelSpan) return; // Exit if child elements don't exist
            
            if (stageMemory[stage].position && stageMemory[stage].label) {
                positionSpan.textContent = stageMemory[stage].position;
                labelSpan.textContent = stageMemory[stage].label;
                memoryStage.classList.add('filled');
            } else {
                positionSpan.textContent = '-';
                labelSpan.textContent = '-';
                memoryStage.classList.remove('filled');
            }
        }
    }

    function resetToStageOne() {
        currentStage = 1;
        selectedDisplayNumber = null;
        currentRule = null;
        stageMemory = {
            1: { position: null, label: null },
            2: { position: null, label: null },
            3: { position: null, label: null },
            4: { position: null, label: null },
            5: { position: null, label: null }
        };
        if (nextBtn) nextBtn.disabled = true;
        updateStageDisplay();
    }

    // Handle cleanup when modal is closed
    window.addEventListener('modalClosed', function() {
        // Reset everything
        resetToStageOne();
        
        // Reset to first tab
        tabBtns.forEach(btn => btn.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));
        if (tabBtns[0]) tabBtns[0].classList.add('active');
        if (tabPanels[0]) tabPanels[0].classList.add('active');
    });
}

// Mark as loaded to prevent duplicates
window.MemoryModule = true;

// Initialize when DOM is ready or when modal is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMemoryModal);
} else {
    initMemoryModal();
}

