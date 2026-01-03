let currentInput = '0';
let previousInput = '';
let operator = null;

const currentOperandDisplay = document.getElementById('current-operand');
const previousOperandDisplay = document.getElementById('previous-operand');

// Sound effect (optional, kept simple for now)
// const clickSound = new Audio('click.mp3');

function updateDisplay() {
    currentOperandDisplay.innerText = currentInput;
    if (operator != null) {
        previousOperandDisplay.innerText = `${previousInput} ${operator}`;
    } else {
        previousOperandDisplay.innerText = '';
    }
}

function appendNumber(number) {
    // Prevent multiple decimals
    if (number === '.' && currentInput.includes('.')) return;
    
    // Replace 0 if it's the first char (unless we're appending .)
    if (currentInput === '0' && number !== '.') {
        currentInput = number;
    } else {
        // If we just finished a calculation and type a number, reset
        // BUT currentInput logic handles this if we implement strict "after calc" state
        // For simple logic:
        currentInput = currentInput.toString() + number.toString();
    }
    updateDisplay();
}

function appendOperator(op) {
    if (currentInput === '' && previousInput === '') return; // Nothing to operate on

    // If we have both, calculate first
    if (currentInput !== '' && previousInput !== '') {
        calculate();
    }

    // Set operator
    operator = op;
    
    // Move current to previous if current exists
    if (currentInput !== '') {
        previousInput = currentInput;
        currentInput = '';
    }
    
    updateDisplay();
}

function toggleSign() {
    if (currentInput === '0') return;
    currentInput = (parseFloat(currentInput) * -1).toString();
    updateDisplay();
}

function deleteNumber() {
    if (currentInput === '0') return;
    
    currentInput = currentInput.toString().slice(0, -1);
    
    if (currentInput === '') {
        currentInput = '0';
    }
    updateDisplay();
}

function clearDisplay() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    updateDisplay();
}

function calculate() {
    if (operator === null || currentInput === '') return;

    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                alert("Cannot divide by zero! 😱");
                clearDisplay();
                return;
            }
            result = prev / current;
            break;
        case '%':
            result = prev % current;
            break;
        default:
            return;
    }

    // Rounding to avoid long decimals (optional but good for UI)
    // result = Math.round(result * 100000) / 100000;

    currentInput = result;
    operator = null;
    previousInput = '';
    updateDisplay();
}

// Add keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;
    
    if (key >= '0' && key <= '9') appendNumber(key);
    if (key === '.') appendNumber('.');
    if (key === '=' || key === 'Enter') calculate();
    if (key === 'Backspace') deleteNumber();
    if (key === 'Escape') clearDisplay();
    if (key === '+' || key === '-' || key === '*' || key === '/') appendOperator(key);
    if (key === '%') appendOperator('%');
});
