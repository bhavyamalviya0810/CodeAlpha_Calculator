const display = document.getElementById('display');

let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetDisplay = false;

function updateDisplay() {
  const formatted = currentInput.length > 14
    ? parseFloat(currentInput).toExponential(6)
    : currentInput;
  display.textContent = formatted;
}

function appendNumber(num) {
  if (shouldResetDisplay) {
    currentInput = '';
    shouldResetDisplay = false;
  }
  if (currentInput === '0' && num !== '.') {
    currentInput = num;
  } else {
    currentInput += num;
  }
}

function appendDecimal() {
  if (shouldResetDisplay) {
    currentInput = '0';
    shouldResetDisplay = false;
  }
  if (!currentInput.includes('.')) {
    currentInput += '.';
  }
}

function chooseOperator(op) {
  if (operator && !shouldResetDisplay) {
    calculate();
  }
  previousInput = currentInput;
  operator = op;
  shouldResetDisplay = true;
}

function calculate() {
  if (operator === null || shouldResetDisplay) return;

  const prev = parseFloat(previousInput);
  const curr = parseFloat(currentInput);

  if (isNaN(prev) || isNaN(curr)) {
    currentInput = 'Error';
    operator = null;
    previousInput = '';
    shouldResetDisplay = true;
    updateDisplay();
    return;
  }

  let result;
  switch (operator) {
    case '+':
      result = prev + curr;
      break;
    case '-':
      result = prev - curr;
      break;
    case '×':
      result = prev * curr;
      break;
    case '÷':
      if (curr === 0) {
        currentInput = 'Error';
        operator = null;
        previousInput = '';
        shouldResetDisplay = true;
        updateDisplay();
        return;
      }
      result = prev / curr;
      break;
    default:
      return;
  }

  currentInput = String(result);
  operator = null;
  previousInput = '';
  shouldResetDisplay = true;
}

function clearAll() {
  currentInput = '0';
  previousInput = '';
  operator = null;
  shouldResetDisplay = false;
}

function backspace() {
  if (shouldResetDisplay) return;
  if (currentInput.length === 1 || (currentInput.length === 2 && currentInput.startsWith('-'))) {
    currentInput = '0';
  } else {
    currentInput = currentInput.slice(0, -1);
  }
}

document.querySelector('.buttons').addEventListener('click', (e) => {
  const btn = e.target.closest('.btn');
  if (!btn) return;

  const action = btn.dataset.action;

  switch (action) {
    case 'number':
      appendNumber(btn.dataset.value);
      break;
    case 'decimal':
      appendDecimal();
      break;
    case 'operator':
      chooseOperator(btn.dataset.value);
      break;
    case 'equals':
      calculate();
      break;
    case 'clear':
      clearAll();
      break;
    case 'backspace':
      backspace();
      break;
  }

  updateDisplay();
});

document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') {
    e.preventDefault();
    appendNumber(e.key);
    updateDisplay();
  } else if (e.key === '.') {
    e.preventDefault();
    appendDecimal();
    updateDisplay();
  } else if (e.key === '+') {
    e.preventDefault();
    chooseOperator('+');
    updateDisplay();
  } else if (e.key === '-') {
    e.preventDefault();
    chooseOperator('-');
    updateDisplay();
  } else if (e.key === '*') {
    e.preventDefault();
    chooseOperator('×');
    updateDisplay();
  } else if (e.key === '/') {
    e.preventDefault();
    chooseOperator('÷');
    updateDisplay();
  } else if (e.key === 'Enter' || e.key === '=') {
    e.preventDefault();
    calculate();
    updateDisplay();
  } else if (e.key === 'Backspace') {
    e.preventDefault();
    backspace();
    updateDisplay();
  } else if (e.key === 'Escape') {
    e.preventDefault();
    clearAll();
    updateDisplay();
  }
});
