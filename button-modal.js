// Button Modal JavaScript
(function() {
    console.log('Button modal loaded successfully!');
    
    // Wait a bit for DOM to be ready, then initialize
    setTimeout(initializeButton, 100);
})();

function initializeButton() {
    // Tab switching functionality
    const buttonTabs = document.querySelectorAll('.button-tab');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    buttonTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const action = this.dataset.action;
            
            // Remove active class from all tabs and panes
            buttonTabs.forEach(t => t.classList.remove('active'));
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
        // Number keys 1,2,3 to switch tabs
        if (['1', '2', '3'].includes(e.key) && !e.ctrlKey && !e.altKey && !e.metaKey) {
            e.preventDefault();
            const tabIndex = parseInt(e.key) - 1;
            if (buttonTabs[tabIndex]) {
                buttonTabs[tabIndex].click();
            }
        }
    });
    
    // Initialize Automatic Solver
    initializeButtonAutoSolver();
}

// Button Automatic Solver Logic
function initializeButtonAutoSolver() {
    const autoSolver = document.getElementById('autoSolver');
    if (!autoSolver) return;
    
    let currentButtonColor = '';
    let currentButtonText = '';
    let questionIndex = 0;
    let userAnswers = [];
    
    // Button solving logic based on KTANE manual rules - uses dropdown values
    function getButtonQuestions() {
        // Rule 1: Blue + Abort - immediate result
        if (currentButtonColor === 'blue' && currentButtonText === 'abort') {
            showResult("Hold the button", "Rule 1: Blue button with 'Abort' → Hold and check strip color");
            setTimeout(() => {
                isAskingStripColor = true;
                updateQuestion();
            }, 500);
            return [];
        }
        
        // Rule 5: Yellow button - immediate result
        if (currentButtonColor === 'yellow') {
            showResult("Hold the button", "Rule 5: Yellow button → Hold and check strip color");
            setTimeout(() => {
                isAskingStripColor = true;
                updateQuestion();
            }, 500);
            return [];
        }
        
        // Rule 6: Red + Hold - immediate result
        if (currentButtonColor === 'red' && currentButtonText === 'hold') {
            showResult("Press and immediately release", "Rule 6: Red button with 'Hold' → Press immediately");
            return [];
        }
        
        // Build questions step by step with fixed indices
        const questions = [];
        
        // Step 1: Add conditional questions first
        let questionIndex = 0;
        
        // Rule 2: More than 1 battery + Detonate
        if (currentButtonText === 'detonate') {
            questions[questionIndex] = {
                question: "Are there more than 1 battery on the bomb?",
                answers: {
                    yes: { 
                        result: "Press and immediately release", 
                        explanation: "Rule 2: More than 1 battery + 'Detonate' → Press immediately"
                    },
                    no: { nextQuestion: questionIndex + 1 }
                }
            };
            questionIndex++;
        }
        
        // Rule 3: White + lit CAR
        if (currentButtonColor === 'white') {
            questions[questionIndex] = {
                question: "Is there a lit CAR indicator on the bomb?",
                answers: {
                    yes: { 
                        result: "Hold the button", 
                        explanation: "Rule 3: White button + lit CAR indicator → Hold and check strip color",
                        holdRule: true
                    },
                    no: { nextQuestion: questionIndex + 1 }
                }
            };
            questionIndex++;
        }
        
        // Rule 4: More than 2 batteries + lit FRK (always add these)
        const batteryQuestionIndex = questionIndex;
        questions[questionIndex] = {
            question: "Are there more than 2 batteries on the bomb?",
            answers: {
                yes: { nextQuestion: batteryQuestionIndex + 1 },
                no: { 
                    result: "Hold the button", 
                    explanation: "Rule 7: None of the above conditions apply → Hold and check strip color",
                    holdRule: true
                }
            }
        };
        questionIndex++;
        
        questions[questionIndex] = {
            question: "Is there a lit FRK indicator on the bomb?",
            answers: {
                yes: { 
                    result: "Press and immediately release", 
                    explanation: "Rule 4: More than 2 batteries + lit FRK indicator → Press immediately"
                },
                no: { 
                    result: "Hold the button", 
                    explanation: "Rule 7: None of the above conditions apply → Hold and check strip color",
                    holdRule: true
                }
            }
        };
        
        return questions;
    }
    
    const stripColorQuestion = {
        question: "What color is the strip that lights up on the right side when you hold the button?",
        answers: {
            blue: { 
                result: "Release when the countdown timer has a <strong>4</strong> in any position", 
                explanation: "Blue strip → Release on any 4 (like 2:44, 1:04, 0:14, etc.)"
            },
            white: { 
                result: "Release when the countdown timer has a <strong>1</strong> in any position", 
                explanation: "White strip → Release on any 1 (like 2:11, 1:01, 0:31, etc.)"
            },
            yellow: { 
                result: "Release when the countdown timer has a <strong>5</strong> in any position", 
                explanation: "Yellow strip → Release on any 5 (like 2:25, 1:05, 0:15, etc.)"
            },
            other: { 
                result: "Release when the countdown timer has a <strong>1</strong> in any position", 
                explanation: "Any other color strip → Release on any 1 (like 2:11, 1:01, 0:31, etc.)"
            }
        }
    };
    
    // UI Elements
    const buttonColor = document.getElementById('buttonColor');
    const buttonText = document.getElementById('buttonText');
    const analyzeBtn = document.getElementById('analyzeBtn');
    
    const steps = {
        analysis: document.getElementById('step-analysis'),
        questions: document.getElementById('step-questions'),
        result: document.getElementById('step-result')
    };
    
    const questionTitle = document.getElementById('questionTitle');
    const questionText = document.getElementById('questionText');
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const backBtn = document.getElementById('backBtn');
    const backToQuestion = document.getElementById('backToQuestion');
    const restartBtn = document.getElementById('restartBtn');
    const currentQuestionSpan = document.getElementById('currentQuestion');
    const totalQuestionsSpan = document.getElementById('totalQuestions');
    const progressFill = document.getElementById('progressFill');
    const actionAnswer = document.getElementById('actionAnswer');
    const resultExplanation = document.getElementById('resultExplanation');
    
    // Form validation
    function validateForm() {
        const colorSelected = buttonColor && buttonColor.value !== '';
        const textSelected = buttonText && buttonText.value !== '';
        
        if (analyzeBtn) {
            analyzeBtn.disabled = !(colorSelected && textSelected);
        }
        
        return colorSelected && textSelected;
    }
    
    // Form change handlers
    if (buttonColor) {
        buttonColor.addEventListener('change', function() {
            currentButtonColor = this.value;
            validateForm();
        });
    }
    
    if (buttonText) {
        buttonText.addEventListener('change', function() {
            currentButtonText = this.value;
            validateForm();
        });
    }
    
    // Analyze button handler
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', function() {
            if (validateForm()) {
                questionIndex = 0;
                userAnswers = [];
                currentQuestions = getButtonQuestions();
                showQuestionsStep();
            }
        });
    }
    
    let currentQuestions = [];
    let isAskingStripColor = false;
    
    // Navigation buttons
    if (backBtn) backBtn.addEventListener('click', goBack);
    if (backToQuestion) backToQuestion.addEventListener('click', goBackToAnalysis);
    if (restartBtn) restartBtn.addEventListener('click', restart);
    
    function showStep(stepName) {
        Object.values(steps).forEach(step => {
            if (step) step.classList.remove('active');
        });
        if (steps[stepName]) {
            steps[stepName].classList.add('active');
        }
    }
    
    function showQuestionsStep() {
        showStep('questions');
        updateQuestion();
    }
    
    function updateQuestion() {
        let question;
        
        if (isAskingStripColor) {
            question = stripColorQuestion;
            if (questionTitle) {
                questionTitle.innerHTML = `
                    <div style="text-align: center; margin-bottom: 15px;">
                        <div style="background: linear-gradient(135deg, #ff4757, #ff6b7a); 
                                   color: white; 
                                   padding: 12px 20px; 
                                   border-radius: 25px; 
                                   font-family: 'Orbitron', monospace; 
                                   font-weight: 700; 
                                   font-size: 1.1rem; 
                                   text-transform: uppercase; 
                                   letter-spacing: 1px;
                                   box-shadow: 0 4px 15px rgba(255, 71, 87, 0.3);
                                   display: inline-block;
                                   animation: pulse 2s infinite;">
                            🔴 HOLD THE BUTTON
                        </div>
                    </div>
                    <div style="color: #70a1ff; font-size: 1rem; margin-top: 10px;">
                        🎨 Now select the strip color
                    </div>
                `;
            }
            if (questionText) questionText.textContent = question.question;
            
            // Update answer buttons for strip color selection
            if (yesBtn && noBtn) {
                yesBtn.textContent = "Blue";
                yesBtn.onclick = () => handleStripColor('blue');
                noBtn.textContent = "White";
                noBtn.onclick = () => handleStripColor('white');
            }
            
            // Add additional buttons for Yellow and Other
            addStripColorButtons();
        } else {
            question = currentQuestions[questionIndex];
            if (!question) return;
            
            if (questionTitle) questionTitle.textContent = `🔍 Question ${questionIndex + 1}`;
            if (questionText) questionText.textContent = question.question;
            
            // Reset answer buttons
            if (yesBtn && noBtn) {
                yesBtn.textContent = "Yes";
                yesBtn.onclick = () => handleAnswer('yes');
                noBtn.textContent = "No"; 
                noBtn.onclick = () => handleAnswer('no');
            }
            
            removeStripColorButtons();
        }
        
        if (currentQuestionSpan) currentQuestionSpan.textContent = questionIndex + 1;
        if (totalQuestionsSpan) totalQuestionsSpan.textContent = currentQuestions.length;
        
        const totalQuestions = isAskingStripColor ? currentQuestions.length + 1 : currentQuestions.length;
        const currentQ = isAskingStripColor ? currentQuestions.length + 1 : questionIndex + 1;
        const progress = ((currentQ - 1) / totalQuestions) * 100;
        if (progressFill) progressFill.style.width = `${progress}%`;
        
        // Show/hide back button
        if (backBtn) {
            backBtn.style.display = (questionIndex === 0 && !isAskingStripColor) ? 'none' : 'flex';
        }
    }
    
    function handleAnswer(answer) {
        const question = currentQuestions[questionIndex];
        if (!question) return;
        
        if (!question.answers) {
            console.error('Question missing answers property:', question);
            return;
        }
        
        userAnswers.push({ question: questionIndex, answer: answer });
        
        const answerData = question.answers[answer];
        if (!answerData) {
            console.error('Answer not found:', answer, 'in question:', question);
            return;
        }
        
        if (answerData.result) {
            // Check if this is a hold rule
            if (answerData.holdRule) {
                // Show strip color selection
                isAskingStripColor = true;
                updateQuestion();
            } else {
                // Show immediate result
                showResult(answerData.result, answerData.explanation);
            }
        } else if (answerData.nextQuestion !== undefined) {
            // Move to next question
            questionIndex = answerData.nextQuestion;
            updateQuestion();
        }
    }
    
    function handleStripColor(color) {
        const stripAnswer = stripColorQuestion.answers[color];
        if (stripAnswer) {
            showResult(stripAnswer.result, stripAnswer.explanation);
        }
    }
    
    function addStripColorButtons() {
        const questionButtons = document.querySelector('.question-buttons');
        if (!questionButtons) return;
        
        // Remove existing extra buttons
        removeStripColorButtons();
        
        // Create Yellow button
        const yellowBtn = document.createElement('button');
        yellowBtn.className = 'answer-btn strip-btn';
        yellowBtn.textContent = 'Yellow';
        yellowBtn.onclick = () => handleStripColor('yellow');
        
        // Create Other button
        const otherBtn = document.createElement('button');
        otherBtn.className = 'answer-btn strip-btn';
        otherBtn.textContent = 'Other Color';
        otherBtn.onclick = () => handleStripColor('other');
        
        questionButtons.appendChild(yellowBtn);
        questionButtons.appendChild(otherBtn);
    }
    
    function removeStripColorButtons() {
        const stripBtns = document.querySelectorAll('.strip-btn');
        stripBtns.forEach(btn => btn.remove());
    }
    
    function showResult(action, explanation) {
        if (actionAnswer) actionAnswer.innerHTML = action;
        if (resultExplanation) resultExplanation.textContent = explanation;
        if (progressFill) progressFill.style.width = '100%';
        showStep('result');
    }
    
    function goBack() {
        if (isAskingStripColor) {
            // Go back from strip color to last question
            isAskingStripColor = false;
            updateQuestion();
        } else if (questionIndex > 0) {
            // Remove the last answer and go back one question
            userAnswers.pop();
            questionIndex--;
            updateQuestion();
        } else {
            // Go back to analysis if we're at the first question
            showStep('analysis');
        }
    }
    
    function goBackToAnalysis() {
        showStep('analysis');
    }
    
    function restart() {
        currentButtonColor = '';
        currentButtonText = '';
        questionIndex = 0;
        userAnswers = [];
        currentQuestions = [];
        isAskingStripColor = false;
        
        if (buttonColor) buttonColor.value = '';
        if (buttonText) buttonText.value = '';
        removeStripColorButtons();
        validateForm();
        showStep('analysis');
    }
    
    // Initialize form validation
    validateForm();
}