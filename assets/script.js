const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

let numA;
let operator;
let numB;

const operate = (numA, numB, operator) => {
  switch (operator) {
    case '+':
      return add(numA, numB);

    case '-':
      return subtract(numA, numB);

    case '*':
      return multiply(numA, numB);

    case '/':
      return divide(numA, numB);
  }
};

const buttons = document.querySelectorAll('button');
buttons.forEach((button) => {
  button.addEventListener('click', () => populateDisplay(button.dataset.value));
})

let displayValue = '';
const populateDisplay = (value) => {
  const operators = ['+', '-', '*', '/'];

  if (operators.includes(value)) {
    displayValue += ` ${value} `;
  } else {
    displayValue += value;
  }

  const splittedDisplayValue = displayValue.split(' ');

  for (let i = 0; i <= splittedDisplayValue.length - 1; i++) {
    if (i % 2 === 0) {
      splittedDisplayValue[i] = formatDigits(splittedDisplayValue[i].replaceAll(',', ''));
    }
  }

  displayValue = splittedDisplayValue.join(' ');

  const input = document.querySelector('.input');
  input.value = displayValue;
}

const formatDigits = (digits) => {
  if (digits.length <= 3) return digits;

  const splittedDigits = [];

  for (let i = 0; i < Math.floor(digits.length / 3); i++) {
    const end = digits.length - (i*3);
    const start = end - 3;
    const temp = digits.slice(start, end);
    splittedDigits.unshift(temp);
  }

  if (digits.length % 3 !== 0 && digits.length > 3) {
    splittedDigits.unshift(digits.slice(0, digits.length % 3));
  }
  
  return splittedDigits.join();
} 