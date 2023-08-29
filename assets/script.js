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
