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
  button.addEventListener('click', () => controller(button.dataset.value));
})

const cleanOperationsArray = (array) => {
  for (let i = 0; i <= array.length - 1; i++) {
    array[i] = array[i].replaceAll(',', '');
  }

  return array;
}

let displayValue = [];

const clearScreen = () => {
  const inputDisplay = document.querySelector('.input');
  inputDisplay.value = '';

  const currentResultDisplay = document.querySelector('.current-answer');
  currentResultDisplay.textContent = 0;

  displayValue = [];
}

const getFinalAnswer = () => {
  const inputDisplay = document.querySelector('.input');

  const cleanArray = cleanOperationsArray(displayValue);
  inputDisplay.value = getCurrentAnswer(cleanArray);
  
  const currentResultDisplay = document.querySelector('.current-answer');
  currentResultDisplay.textContent = '';
}

const populateDisplay = () => {
  const inputDisplay = document.querySelector('.input');

  const tempArray = [];
  for (let i = 0; i <= displayValue.length - 1; i++) {
    if (i % 2 === 0) {
      const formattedDigit = formatDigits(displayValue[i]);
      tempArray.push(formattedDigit);
    } else {
      tempArray.push(displayValue[i]);
    }
  }

  inputDisplay.value = tempArray.join('');

  // only update if a number was typed
  // (by logic the array's length must be odd for it to end with a number)
  if (displayValue.length % 2 === 1) {
    const currentResultDisplay = document.querySelector('.current-answer');
    currentResultDisplay.textContent = getCurrentAnswer(displayValue);
  }
}

const controller = (input) => {
  // recieve an input (button clicked) and responds accordingly

  switch (input) {
    case 'AC':
      clearScreen();
      break;

    case 'undo':
      undo();
      break;

    case '=':
      getFinalAnswer();
      break;

    case '%':
      getPercentage();
      populateDisplay();
      break;

    case '+':
    case '-':
    case '*':
    case '/':
      displayValue.push(` ${input} `);
      populateDisplay();
      break;
    
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
    case '0':
      appendDigit(input);
      populateDisplay();
      break;
  }
}

const getPercentage = () => {
  const lastIndex = displayValue.length > 1 ? displayValue.length - 1 : 0;
  displayValue[lastIndex] = +displayValue[lastIndex] / 100;
}

const undo = () => {
  const joined = displayValue.join('');
  displayValue = joined.slice(0, joined.length - 1).split(' ');
}

const appendDigit = (digit) => {
  const lastIndex = displayValue.length - 1;

  if (displayValue.length === 0) {
    displayValue[0] = digit;
  } else if (displayValue.length % 2 === 0) {
    displayValue.push(digit);
  } else {
    displayValue[lastIndex] = displayValue[lastIndex] + digit;
  }
}

const getCurrentAnswer = (array, previousAnswer=0) => {
  if (array.length % 2 === 0 || array.length <= 1) return previousAnswer;
  const newArrayCopy = array.slice(3);

  // trim operator (array[1]) because by default it has trailing 
  // space for display purposes
  const answer = operate(+array[0], +array[2], array[1].trim());
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