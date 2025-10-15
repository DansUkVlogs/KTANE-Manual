// Simple Wires Modal JavaScript
(function() {
    console.log('Simple Wires modal loaded successfully!');
    
    // Wait a bit for DOM to be ready, then initialize
    setTimeout(initializeSimpleWires, 100);
})();

function initializeSimpleWires() {
    // Tab switching functionality
    const wireTabs = document.querySelectorAll('.wire-tab');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    wireTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const wireCount = this.dataset.wires;
            
            // Remove active class from all tabs and panes
            wireTabs.forEach(t => t.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding pane
            this.classList.add('active');
            document.querySelector(`[data-tab="${wireCount}"]`).classList.add('active');
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });
    
    // Add interactive features for rule items
    const ruleItems = document.querySelectorAll('.rule-item');
    const referenceItems = document.querySelectorAll('.reference-item');
    
    // Add click handlers to rule items for better interactivity
    ruleItems.forEach(item => {
        item.addEventListener('click', function() {
            // Add visual feedback when rule is selected
            const originalBg = this.style.background;
            const originalBorder = this.style.borderColor;
            
            this.style.background = 'rgba(46, 213, 115, 0.1)';
            this.style.borderColor = 'rgba(46, 213, 115, 0.6)';
            
            // Reset after a short time
            setTimeout(() => {
                this.style.background = originalBg;
                this.style.borderColor = originalBorder;
            }, 1500);
        });
    });
    
    // Add hover effects for wire color references
    referenceItems.forEach(item => {
        const wireColor = item.querySelector('.wire-color');
        const wireText = item.querySelector('span');
        
        item.addEventListener('mouseenter', function() {
            wireColor.style.transform = 'scale(1.2)';
            wireText.style.fontWeight = '700';
            wireText.style.color = '#ff4757';
        });
        
        item.addEventListener('mouseleave', function() {
            wireColor.style.transform = 'scale(1)';
            wireText.style.fontWeight = '500';
            wireText.style.color = '';
        });
    });
    
    // Add a subtle animation to the serial note
    const serialNote = document.querySelector('.serial-note');
    if (serialNote) {
        let pulseInterval = setInterval(() => {
            serialNote.style.boxShadow = '0 0 15px rgba(255, 196, 0, 0.4)';
            setTimeout(() => {
                serialNote.style.boxShadow = '';
            }, 1000);
        }, 3000);
        
        // Clear interval when modal is closed
        window.addEventListener('modalClosed', () => {
            clearInterval(pulseInterval);
        });
    }
    
    // Add keyboard navigation for tabs
    document.addEventListener('keydown', function(e) {
        // Number keys 3,4,5,6 to switch tabs
        if (['3', '4', '5', '6'].includes(e.key) && !e.ctrlKey && !e.altKey && !e.metaKey) {
            e.preventDefault();
            const targetTab = document.querySelector(`[data-wires="${e.key}"]`);
            if (targetTab) {
                targetTab.click();
            }
        }
        
        // Arrow keys for rule navigation
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            const activeRules = document.querySelectorAll('.tab-pane.active .rule-item');
            const activeRule = document.querySelector('.rule-item:focus') || activeRules[0];
            let currentIndex = Array.from(activeRules).indexOf(activeRule);
            
            if (e.key === 'ArrowDown') {
                currentIndex = (currentIndex + 1) % activeRules.length;
            } else {
                currentIndex = currentIndex === 0 ? activeRules.length - 1 : currentIndex - 1;
            }
            
            activeRules[currentIndex].focus();
            activeRules[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
    
    // Make rule items focusable and set initial focus
    const setRuleFocus = () => {
        const activeRules = document.querySelectorAll('.tab-pane.active .rule-item');
        activeRules.forEach((rule, index) => {
            rule.setAttribute('tabindex', '0');
            if (index === 0) {
                rule.focus();
            }
        });
    };
    
    // Set focus when tab changes
    wireTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            setTimeout(setRuleFocus, 100); // Delay to allow tab content to show
        });
    });
    
    // Set initial focus
    setRuleFocus();
    
    // Initialize Automatic Solver
    initializeAutoSolver();
}

// Automatic Wire Solver Logic
function initializeAutoSolver() {
    const autoSolver = document.getElementById('autoSolver');
    if (!autoSolver) return;
    
    let currentWireCount = 0;
    let questionIndex = 0;
    let userAnswers = [];
    
    // Wire solving logic for each count
    const wireLogic = {
        3: [
            {
                question: "Are there any red wires?",
                answers: {
                    no: { result: "second wire", explanation: "No red wires found" },
                    yes: { nextQuestion: 1 }
                }
            },
            {
                question: "Is the last wire white?",
                answers: {
                    yes: { result: "last wire", explanation: "Last wire is white" },
                    no: { nextQuestion: 2 }
                }
            },
            {
                question: "Is there more than one blue wire?",
                answers: {
                    yes: { result: "last blue wire", explanation: "Multiple blue wires found" },
                    no: { result: "last wire", explanation: "Default case for 3 wires" }
                }
            }
        ],
        4: [
            {
                question: "Is there more than one red wire?",
                answers: {
                    yes: { nextQuestion: 1 },
                    no: { nextQuestion: 2 }
                }
            },
            {
                question: "Is the last digit of the serial number odd?",
                answers: {
                    yes: { result: "last red wire", explanation: "Multiple red wires + odd serial number" },
                    no: { nextQuestion: 2 }
                }
            },
            {
                question: "Is the last wire yellow?",
                answers: {
                    yes: { nextQuestion: 3 },
                    no: { nextQuestion: 4 }
                }
            },
            {
                question: "Are there no red wires?",
                answers: {
                    yes: { result: "first wire", explanation: "Last wire is yellow with no red wires" },
                    no: { nextQuestion: 4 }
                }
            },
            {
                question: "Is there exactly one blue wire?",
                answers: {
                    yes: { result: "first wire", explanation: "Exactly one blue wire found" },
                    no: { nextQuestion: 5 }
                }
            },
            {
                question: "Is there more than one yellow wire?",
                answers: {
                    yes: { result: "last wire", explanation: "Multiple yellow wires found" },
                    no: { result: "second wire", explanation: "Default case for 4 wires" }
                }
            }
        ],
        5: [
            {
                question: "Is the last wire black?",
                answers: {
                    yes: { nextQuestion: 1 },
                    no: { nextQuestion: 2 }
                }
            },
            {
                question: "Is the last digit of the serial number odd?",
                answers: {
                    yes: { result: "fourth wire", explanation: "Last wire is black + odd serial number" },
                    no: { nextQuestion: 2 }
                }
            },
            {
                question: "Is there exactly one red wire?",
                answers: {
                    yes: { nextQuestion: 3 },
                    no: { nextQuestion: 4 }
                }
            },
            {
                question: "Is there more than one yellow wire?",
                answers: {
                    yes: { result: "first wire", explanation: "One red wire + multiple yellow wires" },
                    no: { nextQuestion: 4 }
                }
            },
            {
                question: "Are there no black wires?",
                answers: {
                    yes: { result: "second wire", explanation: "No black wires found" },
                    no: { result: "first wire", explanation: "Default case for 5 wires" }
                }
            }
        ],
        6: [
            {
                question: "Are there no yellow wires?",
                answers: {
                    yes: { nextQuestion: 1 },
                    no: { nextQuestion: 2 }
                }
            },
            {
                question: "Is the last digit of the serial number odd?",
                answers: {
                    yes: { result: "third wire", explanation: "No yellow wires + odd serial number" },
                    no: { nextQuestion: 2 }
                }
            },
            {
                question: "Is there exactly one yellow wire?",
                answers: {
                    yes: { nextQuestion: 3 },
                    no: { nextQuestion: 4 }
                }
            },
            {
                question: "Is there more than one white wire?",
                answers: {
                    yes: { result: "fourth wire", explanation: "One yellow wire + multiple white wires" },
                    no: { nextQuestion: 4 }
                }
            },
            {
                question: "Are there no red wires?",
                answers: {
                    yes: { result: "last wire", explanation: "No red wires found" },
                    no: { result: "fourth wire", explanation: "Default case for 6 wires" }
                }
            }
        ]
    };
    
    // UI Elements
    const countButtons = document.querySelectorAll('.count-btn');
    const steps = {
        wirecount: document.getElementById('step-wirecount'),
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
    const wireAnswer = document.getElementById('wireAnswer');
    const resultExplanation = document.getElementById('resultExplanation');
    
    // Wire count selection
    countButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            currentWireCount = parseInt(this.dataset.count);
            userAnswers = [];
            questionIndex = 0;
            showQuestionsStep();
        });
    });
    
    // Answer buttons
    yesBtn.addEventListener('click', () => handleAnswer('yes'));
    noBtn.addEventListener('click', () => handleAnswer('no'));
    
    // Navigation buttons
    backBtn.addEventListener('click', goBack);
    backToQuestion.addEventListener('click', goBackToQuestions);
    restartBtn.addEventListener('click', restart);
    
    function showStep(stepName) {
        Object.values(steps).forEach(step => step.classList.remove('active'));
        steps[stepName].classList.add('active');
    }
    
    function showQuestionsStep() {
        showStep('questions');
        updateQuestion();
    }
    
    function updateQuestion() {
        const questions = wireLogic[currentWireCount];
        if (!questions || questionIndex >= questions.length) return;
        
        const currentQ = questions[questionIndex];
        questionTitle.textContent = `🔍 Question ${questionIndex + 1}`;
        questionText.textContent = currentQ.question;
        
        currentQuestionSpan.textContent = questionIndex + 1;
        totalQuestionsSpan.textContent = questions.length;
        
        const progress = ((questionIndex) / questions.length) * 100;
        progressFill.style.width = `${progress}%`;
    }
    
    function handleAnswer(answer) {
        const questions = wireLogic[currentWireCount];
        const currentQ = questions[questionIndex];
        const response = currentQ.answers[answer];
        
        userAnswers.push({ question: questionIndex, answer: answer });
        
        if (response.result) {
            // Show result
            showResult(response.result, response.explanation);
        } else if (response.nextQuestion !== undefined) {
            // Go to next question
            questionIndex = response.nextQuestion;
            updateQuestion();
        }
    }
    
    function showResult(wire, explanation) {
        wireAnswer.textContent = wire;
        resultExplanation.textContent = explanation;
        progressFill.style.width = '100%';
        showStep('result');
    }
    
    function goBack() {
        if (userAnswers.length === 0) {
            showStep('wirecount');
            return;
        }
        
        userAnswers.pop();
        if (userAnswers.length === 0) {
            questionIndex = 0;
        } else {
            const lastAnswer = userAnswers[userAnswers.length - 1];
            questionIndex = lastAnswer.question;
        }
        updateQuestion();
    }
    
    function goBackToQuestions() {
        showQuestionsStep();
    }
    
    function restart() {
        currentWireCount = 0;
        questionIndex = 0;
        userAnswers = [];
        showStep('wirecount');
    }
}