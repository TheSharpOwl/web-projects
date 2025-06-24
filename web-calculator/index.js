let a = 0,
  b = 0; // a is the accumulator when doing more than 1 operation
let lastOperation = "";
let lastClickIsOp = false;

// x means it should be filled with a number
let calculatorShape = [
  ["AC", "+/-", "%", "/"],
  ["x", "x", "x", "*"],
  ["x", "x", "x", "-"],
  ["x", "x", "x", "+"],
  ["x", ".", "="],
];

const oneSideOperators = new Map([
  ["+/-", (x) => -x],
  ["%", (x) => x / 100],
]);
const twoSideOperators = new Map([
  ["/", (x, y) => x / y],
  ["+", (x, y) => x + y],
  ["-", (x, y) => x - y],
  ["*", (x, y) => x * y],
]);

function myToString(num) {
  absoluteStr = Math.abs(num).toString();
  if (num < 0) {
    absoluteStr = absoluteStr + "-"; // because the negative sign appears on the other side otherwise
  }

  return absoluteStr;
}

function enumerateCalculator(calculatorArray) {
  let currentNumber = 0;
  for (let i = calculatorArray.length - 1; i >= 0; i--) {
    for (let j = 0; j < calculatorArray[i].length; j++) {
      if (calculatorArray[i][j] === "x") {
        calculatorArray[i][j] = myToString(currentNumber);
        currentNumber++;
      }
    }
  }
}

function setScreenText(x) {
  let screenObj = document.getElementById("user-input-area");
  screenObj.value = x;
}

function getScreenText() {
  let screenObj = document.getElementById("user-input-area");
  return screenObj.value;
}

function getScreenValue() {
  console.log(parseFloat(getScreenText()));
  const screenText = getScreenText();
  let isNegative = screenText.substr(-1) === "-"; // last character because we put minus the opposite way for showing it correctly
  // cause parseFloat or Int don't convert the minus in the end of the string
  return parseFloat(getScreenText()) * (isNegative ? -1 : 1);
}

function allZeros(text) {
  return text.split("").every((char) => char === "0");
}

function setBtnEvent(btn) {
  btnType = btn.id;
  if (btnType == "num-btn") {
    btn.addEventListener("click", (event) => {
      if (lastClickIsOp) {
        setScreenText(""); // because if you clicked an op, it should only show the new clicked number
      }
      // will add empty for the first function if we apply the if before
      let screenText = getScreenText();
      setScreenText(
        (allZeros(screenText) ? "" : screenText) + event.target.textContent
      );
      lastClickIsOp = false;
    });
    return;
  }

  if (btn.innerText === "AC") {
    btn.addEventListener("click", (event) => {
      setScreenText("0"); // cause it will reset the value
      a = b = 0;
      lastOperation = "";
    });

    return;
  }

  // if the btn is a dot
  if (btn.innerText === ".") {
    btn.addEventListener("click", (event) => {
      let screenNumberStr = getScreenText();
      if(screenNumberStr.substr(-1) === "-") {
        // remove the minus, put a dot then return the minus
        screenNumberStr = screenNumberStr.slice(0,-1) + '.' + '-';
        console.log(`negative screen num now is ${screenNumberStr}`)
      }
      else {
        screenNumberStr += '.';
        console.log(`positive screen num now is ${screenNumberStr}`)
      }

      setScreenText(screenNumberStr);
    })
    return;
  }

  // if the button is one side operator
  if (oneSideOperators.has(btn.innerText)) {
    btn.addEventListener("click", (event) => {
      // last operation will be nothing cause the user clicked on a single operator which will apply to what exists
      lastOperation = "";
      lastClickIsOp = false;
      a = getScreenValue(); // get screen value
      let opFun = oneSideOperators.get(btn.innerText); // apply the single operator
      a = opFun(a);
      setScreenText(myToString(a));
    });
    return;
  }

  btn.addEventListener("click", (event) => {
    if (lastOperation === "=") {
      lastOperation = ""; // so that it does nothing practically unless it had an operation before
    }

    if (lastOperation.length > 0) {
      // not the first operation
      console.log("not the first operation");
      console.log(a);
      b = getScreenValue();
      let opFunc = twoSideOperators.get(lastOperation); // apply the last operation
      // apply the operation on a, b and store the result in a
      a = opFunc(a, b);
      // print the result
      setScreenText(myToString(a));
    } else {
      console.log("the first operation");
      a = getScreenValue();
    }
    lastClickIsOp = true;
    lastOperation = event.target.textContent;
  });
}

function createCalculatorView(calculatorArray) {
  let calculatorContainer = document.getElementById("calculator-container");
  for (let i = 0; i < calculatorArray.length; i++) {
    // create a div for the row
    let div = document.createElement("div");
    div.id = "calc-row";

    for (let j = 0; j < calculatorArray[i].length; j++) {
      let btn = document.createElement("button");
      let val = calculatorArray[i][j];
      btn.innerText = val;
      console.log(val + "\n");
      let convertedVal = parseFloat(val);
      btn.id = isNaN(convertedVal) ? "op-btn" : "num-btn";
      // TODO remove
      console.log(btn.id);
      setBtnEvent(btn);

      if (val === "0") {
        btn.classList.add("zero-btn");
      }

      div.appendChild(btn);
    }

    calculatorContainer.appendChild(div);
  }
}

enumerateCalculator(calculatorShape);
createCalculatorView(calculatorShape);
