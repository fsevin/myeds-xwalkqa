const OPERATORS = {
  '+': (left, right) => left + right,
  '-': (left, right) => left - right,
  '×': (left, right) => left * right,
  '÷': (left, right) => (right === 0 ? null : left / right),
};

function formatResult(value) {
  if (!Number.isFinite(value)) return 'Error';
  return String(Number(value.toPrecision(12)));
}

export default function decorate(block) {
  const calculator = document.createElement('div');
  calculator.className = 'calculator-container';

  const display = document.createElement('output');
  display.className = 'calculator-display';
  display.setAttribute('aria-live', 'polite');
  display.setAttribute('aria-label', 'Calculator display');
  display.textContent = '0';

  const keys = document.createElement('div');
  keys.className = 'calculator-keys';

  const buttons = [
    { label: '7', value: '7', type: 'digit' },
    { label: '8', value: '8', type: 'digit' },
    { label: '9', value: '9', type: 'digit' },
    {
      label: '÷', value: '÷', type: 'operator', ariaLabel: 'Divide',
    },
    { label: '4', value: '4', type: 'digit' },
    { label: '5', value: '5', type: 'digit' },
    { label: '6', value: '6', type: 'digit' },
    {
      label: '×', value: '×', type: 'operator', ariaLabel: 'Multiply',
    },
    { label: '1', value: '1', type: 'digit' },
    { label: '2', value: '2', type: 'digit' },
    { label: '3', value: '3', type: 'digit' },
    {
      label: '-', value: '-', type: 'operator', ariaLabel: 'Subtract',
    },
    { label: '0', value: '0', type: 'digit' },
    {
      label: 'C', value: 'clear', type: 'clear', ariaLabel: 'Clear',
    },
    {
      label: '=', value: 'equals', type: 'equals', ariaLabel: 'Equals',
    },
    {
      label: '+', value: '+', type: 'operator', ariaLabel: 'Add',
    },
  ];

  let currentValue = '0';
  let previousValue = null;
  let pendingOperator = null;
  let waitingForOperand = false;

  const updateDisplay = () => {
    display.textContent = currentValue;
  };

  const clear = () => {
    currentValue = '0';
    previousValue = null;
    pendingOperator = null;
    waitingForOperand = false;
    updateDisplay();
  };

  const inputDigit = (digit) => {
    if (currentValue === 'Error' || waitingForOperand) {
      currentValue = digit;
      waitingForOperand = false;
    } else {
      currentValue = currentValue === '0' ? digit : `${currentValue}${digit}`;
    }
    updateDisplay();
  };

  const calculate = () => {
    if (pendingOperator === null || previousValue === null) return;

    const result = OPERATORS[pendingOperator](Number(previousValue), Number(currentValue));
    currentValue = result === null ? 'Error' : formatResult(result);
    previousValue = null;
    pendingOperator = null;
    waitingForOperand = true;
    updateDisplay();
  };

  const chooseOperator = (operator) => {
    if (currentValue === 'Error') {
      clear();
      return;
    }

    if (pendingOperator !== null && !waitingForOperand) calculate();
    previousValue = currentValue;
    pendingOperator = operator;
    waitingForOperand = true;
  };

  const handleInput = (value) => {
    if (/^\d$/.test(value)) inputDigit(value);
    else if (value === 'clear') clear();
    else if (value === 'equals') calculate();
    else chooseOperator(value);
  };

  buttons.forEach(({
    label, value, type, ariaLabel,
  }) => {
    const button = document.createElement('button');
    button.className = `calculator-key calculator-key-${type}`;
    button.type = 'button';
    button.textContent = label;
    button.setAttribute('aria-label', ariaLabel || label);
    button.addEventListener('click', () => handleInput(value));
    keys.append(button);
  });

  calculator.append(display, keys);
  block.replaceChildren(calculator);
}
