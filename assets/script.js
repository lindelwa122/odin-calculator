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

let displayValue = [];

const clearScreen = () => {
  const inputDisplay = document.querySelector('.input');
  inputDisplay.value = '';

  const currentResultDisplay = document.querySelector('.current-answer');
  currentResultDisplay.textContent = 0;
}

const getFinalAnswer = (calcValues) => {
  const inputDisplay = document.querySelector('.input');

  const cleanArray = cleanOperationsArray(calcValues.split(' '));
  inputDisplay.value = getCurrentAnswer(cleanArray);
  
  const currentResultDisplay = document.querySelector('.current-answer');
  currentResultDisplay.textContent = '';
}


const controller = (input) => {
  // recieve an input (button clicked) and responds accordingly

  let lastIndex;

  switch (input) {
    case 'AC':
      clearScreen();
      break;

    case 'undo':
      const joined = displayValue.join('');
      displayValue = joined.slice(0, joined.length - 1).split(' ');
      break;

    case '=':
      getFinalAnswer(displayValue);
      break;

    case '%':
      lastIndex = displayValue.length - 1;
      displayValue[lastIndex] = +displayValue[lastIndex] / 100;
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
      lastIndex = displayValue.length - 1;
      displayValue[lastIndex] = displayValue[lastIndex] + input;
      populateDisplay();
      break;
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