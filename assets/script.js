const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

let numA;
let operator;
let numB;

const operate = (numA, numB, operator) => {
  switch (operator) {
    case "+":
      return add(numA, numB);

    case "-":
      return subtract(numA, numB);

    case "*":
      return multiply(numA, numB);

    case "/":
      return divide(numA, numB);
  }
};

const buttons = document.querySelectorAll("button");
buttons.forEach((button) => {
  button.addEventListener("click", () => controller(button.dataset.value));
});

const cleanOperationsArray = (array) => {
  for (let i = 0; i <= array.length - 1; i++) {
    array[i] = array[i].replaceAll(",", "");
  }

  return array;
};

let displayValue = [];

const clearScreen = () => {
  const inputDisplay = document.querySelector(".input");
  inputDisplay.value = "";

  const currentResultDisplay = document.querySelector(".current-answer");
  currentResultDisplay.textContent = 0;

  displayValue = [];
};

const isFloat = (num) => {
  return !(+num % 2 === 0 || +num % 2 === 1);
}

const getFinalAnswer = () => {
  const inputDisplay = document.querySelector(".input");

  const cleanArray = cleanOperationsArray(displayValue);
  const answer = getCurrentAnswer(cleanArray);

  inputDisplay.value = formatDigits(answer.toString());

  displayValue = [answer.toString()];

  const currentResultDisplay = document.querySelector(".current-answer");
  currentResultDisplay.textContent = "";
};

const populateDisplay = () => {
  const inputDisplay = document.querySelector(".input");

  const tempArray = [];
  for (let i = 0; i <= displayValue.length - 1; i++) {
    if (i % 2 === 0) {
      if (displayValue[i].includes('.')) {
        tempArray.push(displayValue[i]);
      } else {
        const formattedDigit = formatDigits(displayValue[i]);
        tempArray.push(formattedDigit);
      }
    } else {
      tempArray.push(displayValue[i]);
    }
  }

  inputDisplay.value = tempArray.join("");

  // only update if a number was typed
  // (by logic the array's length must be odd for it to end with a number)
  if (displayValue.length % 2 === 1) {
    const currentResultDisplay = document.querySelector(".current-answer");
    const answer = getCurrentAnswer(displayValue)
    currentResultDisplay.textContent = formatDigits(answer.toString());
  }
};

const validateOperations = (input) => {
  const operators = ["*", "/", "+", "-"];
  const arrLength = displayValue.length;

  if (input === '=' && arrLength % 2 === 0) return;

  // prevent double '.' in a number
  if (input === '.' && displayValue[arrLength - 1].includes('.')) return false;

  // operations [*, /, +, %] cannot be used as the first value
  if (arrLength === 0 && (input === "*" || input === "/" || input === "+" || input === '%'))
    return false;

  // operators cannot be used it the two preceding values were operators
  if (operators.includes(input) && operators.includes(displayValue[arrLength - 1].trim()) && operators.includes(displayValue[arrLength - 2].trim())) return false;

  // operator '-' can not be used twice in a row
  if (input === "-" && (displayValue[0] === "-" || displayValue[arrLength - 1] === "-"))
    return false;

  // prevent '.' if no number has been typed
  if (input === '.' && operators.includes(displayValue[arrLength - 1].trim())) return false;


  return true;
};

const controller = (input) => {
  // recieve an input (button clicked) and responds accordingly

  debugger;
  const isValid = validateOperations(input);
  if (!isValid) return;

  switch (input) {
    case "AC":
      clearScreen();
      break;

    case "undo":
      undo();
      populateDisplay();
      break;

    case "=":
      getFinalAnswer();
      break;

    case "%":
      getPercentage();
      populateDisplay();
      break;

    case "-":
      if (displayValue.length % 2 === 0) {
        displayValue.push(input);
        populateDisplay();
        break;
      }
    case "+":
    case "*":
    case "/":
      if (displayValue.length % 2 === 0) {
        displayValue[displayValue.length - 1] = ` ${input} `;
      } else {
        displayValue.push(` ${input} `);
      }
      populateDisplay();
      break;

    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
    case "0":
      appendDigit(input);
      populateDisplay();
      break;

    case ".":
      displayValue[displayValue.length - 1] += input;
      populateDisplay();
      break;
  }
};

const getPercentage = () => {
  const lastIndex = displayValue.length - 1;
  displayValue[lastIndex] = (+displayValue[lastIndex] / 100).toString();
};

const undo = () => {
  const arrLength = displayValue.length;
  const lastElement = 5;

  if (arrLength % 2 === 0) {
    displayValue.splice(arrLength - 1, 1);
  } else if (displayValue[arrLength - 1].length === 1) {
      displayValue.pop();
  } else {
    const lastElement = displayValue[arrLength - 1];
    displayValue[arrLength - 1] = lastElement.slice(0, lastElement.length - 1);
  }
};

const appendDigit = (digit) => {
  const lastIndex = displayValue.length - 1;

  if (displayValue.length === 0) {
    displayValue[0] = digit;
  } else if (displayValue.length % 2 === 0) {
    displayValue.push(digit);
  } else {
    displayValue[lastIndex] = displayValue[lastIndex] + digit;
  }
};

const getCurrentAnswer = (array, previousAnswer = 0) => {
  if (array.length % 2 === 0 || array.length <= 1) return previousAnswer;
  const newArrayCopy = array.slice(3);

  // trim operator (array[1]) because by default it has trailing
  // space for display purposes
  const answer = operate(+array[0], +array[2], array[1].trim());
  newArrayCopy.unshift(answer);
  return getCurrentAnswer(newArrayCopy, answer);
};

const formatDigits = (digits) => {
  if (digits.length <= 3) return digits;

  if (isFloat(digits)) {
    return Math.fround(+digits).toPrecision(5);
  }

  let isNegative = false;
  if (digits[0] === "-") {
    isNegative = true;
    digits = digits.slice(1);
  }

  const splittedDigits = [];

  for (let i = 0; i < Math.floor(digits.length / 3); i++) {
    const end = digits.length - i * 3;
    const start = end - 3;
    const temp = digits.slice(start, end);
    splittedDigits.unshift(temp);
  }

  if (digits.length % 3 !== 0 && digits.length > 3) {
    splittedDigits.unshift(digits.slice(0, digits.length % 3));
  }

  if (isNegative) {
    return "-" + splittedDigits.join();
  }

  return splittedDigits.join();
};
