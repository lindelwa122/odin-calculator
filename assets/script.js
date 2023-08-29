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

const cleanOperationsArray = (array) => {
  for (let i = 0; i <= array.length - 1; i++) {
    array[i] = array[i].replaceAll(',', '');
  }

  return array;
}

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

  if (splittedDisplayValue.length > 0 && splittedDisplayValue.length % 2 !== 0) {
    const currentResultDisplay = document.querySelector('.current-answer');
    currentResultDisplay.textContent = getCurrentAnswer(cleanOperationsArray(splittedDisplayValue));
  }
}

const getCurrentAnswer = (array, previousAnswer=0) => {
  if (array.length % 2 === 0 || array.length <= 1) return previousAnswer;
  const newArrayCopy = array.slice(3);
  const answer = operate(+array[0], +array[2], array[1]);
  newArrayCopy.unshift(answer);
  return getCurrentAnswer(newArrayCopy, answer);
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