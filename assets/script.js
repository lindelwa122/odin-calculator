const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

const appendDigit = (digit) => {
  const arrLength = displayValue.length;
  const lastIndex = arrLength - 1;

  if (arrLength === 0) {
    displayValue[0] = digit;
  } else if (arrLength % 2 === 0) {
    displayValue.push(digit);
  } else {
    displayValue[lastIndex] = displayValue[lastIndex] + digit;
  }
};

const cleanOperationsArray = (array) => {
  for (let i = 0; i <= array.length - 1; i++) {
    array[i] = array[i].replaceAll(",", "");
  }

  return array;
};

const clearScreen = () => {
  const inputDisplay = document.querySelector(".input");
  inputDisplay.value = "";

  const currentResultDisplay = document.querySelector(".current-answer");
  currentResultDisplay.textContent = 0;

  displayValue = [];
};

const controller = (input) => {
  // recieve an input (button clicked) and responds accordingly

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

const formatDigits = (digits) => {
  return (+digits).toLocaleString("en-US", { maximumFractionDigits: 5 });
};

const getCurrentAnswer = (array, previousAnswer = 0) => {
  if (array.length % 2 === 0 || array.length <= 1) {
    return previousAnswer;
  }

  const newArrayCopy = array.slice(3);

  // trim operator (array[1]) because by default it has trailing
  // space for display purposes
  const answer = operate(+array[0], +array[2], array[1].trim());
  newArrayCopy.unshift(answer);
  return getCurrentAnswer(newArrayCopy, answer);
};

const getFinalAnswer = () => {
  const inputDisplay = document.querySelector(".input");

  const cleanArray = cleanOperationsArray(displayValue);
  const answer = getCurrentAnswer(cleanArray);

  inputDisplay.value = formatDigits(answer.toString());

  displayValue = [answer.toString()];

  const currentResultDisplay = document.querySelector(".current-answer");
  currentResultDisplay.textContent = "";
};

const getPercentage = () => {
  const lastIndex = displayValue.length - 1;
  displayValue[lastIndex] = (+displayValue[lastIndex] / 100).toString();
};

const isFloat = (num) => !(+num % 2 === 0 || +num % 2 === 1);

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

const populateDisplay = () => {
  const inputDisplay = document.querySelector(".input");

  const tempArray = [];
  for (let i = 0; i <= displayValue.length - 1; i++) {
    if (i % 2 === 0 && displayValue[i] === '-') {
      tempArray.push(displayValue[i]);
    } else if (i % 2 === 0 && displayValue[i].endsWith(".")) {
      const formattedDigit = formatDigits(displayValue[i]);
      tempArray.push(formattedDigit + ".");
    } else if (i % 2 === 0) {
      const formattedDigit = formatDigits(displayValue[i]);
      tempArray.push(formattedDigit);
    } else {
      tempArray.push(displayValue[i]);
    }
  }

  inputDisplay.value = tempArray.join("");

  // only update if a number was typed
  // (by logic the array's length must be odd for it to end with a number)
  if (displayValue.length % 2 === 1) {
    const currentResultDisplay = document.querySelector(".current-answer");
    const answer = getCurrentAnswer(displayValue);
    currentResultDisplay.textContent = formatDigits(answer.toString());
  }
};

const validateOperations = (input) => {
  const operators = ["*", "/", "+", "-"];
  const arrLength = displayValue.length;

  if (input === "=" && arrLength % 2 === 0) {
    return false;
  }

  // prevent double '.' in a number
  if (input === "." && displayValue[arrLength - 1].includes(".")) {
    return false;
  }

  // operations [*, /, +, %] cannot be used as the first value
  if (
    arrLength === 0 &&
    (input === "*" || input === "/" || input === "+" || input === "%")
  ) {
    return false;
  }

  // operators cannot be used it the two preceding values were operators
  if (
    operators.includes(input) &&
    operators.includes(displayValue[arrLength - 1].trim()) &&
    operators.includes(displayValue[arrLength - 2].trim())
  ) {
    return false;
  }

  // operator '-' can not be used twice in a row
  if (
    input === "-" &&
    (displayValue[0] === "-" || displayValue[arrLength - 1] === "-")
  ) {
    return false;
  }

  // prevent '.' if no number has been typed
  if (input === "." && operators.includes(displayValue[arrLength - 1].trim())) {
    return false;
  }

  return true;
};

const undo = () => {
  const arrLength = displayValue.length;
  const lastElement = displayValue[arrLength - 1];

  if (arrLength % 2 === 0) {
    displayValue.splice(arrLength - 1, 1);
  } else if (lastElement.length === 1) {
    displayValue.pop();
  } else {
    displayValue[arrLength - 1] = lastElement.slice(0, lastElement.length - 1);
  }
};

let displayValue = [];

const buttons = document.querySelectorAll("button");
buttons.forEach((button) => {
  button.addEventListener("click", () => controller(button.dataset.value));
});

// Add an opacity transition
buttons.forEach((button) => {
  button.addEventListener("click", () => button.classList.add("clicked"));
});

buttons.forEach((button) => {
  button.addEventListener("transitionend", () => {
    button.classList.remove("clicked");
  });
});

// Change font-size of inputDisplay depending on 
// the number of characters displayed
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const inputDisplay = document.querySelector('.input');
    const displayLength = displayValue.join("").length;
    if (displayLength >= 24) {
      inputDisplay.style.fontSize = '8px';
    } else if (displayLength >= 18) {
      inputDisplay.style.fontSize = '12px';
    } else if (displayLength >= 12) {
      inputDisplay.style.fontSize = '16px';
    } else {
      inputDisplay.style.fontSize = '21px';
    }
  })
})