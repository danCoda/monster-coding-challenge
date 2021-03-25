const numberArea = document.querySelector("#numbers");
const numberZeroRow = document.querySelector("#zeroRow");
const operatorArea = document.querySelector("#operators");
const extraArea = document.querySelector("#extras");
const display = document.querySelector("#display");

const BUTTONS = {
    numbers: [7, 8, 9, 4, 5, 6, 1, 2, 3, 0, "."],
    operators: ["÷", "×", "−", "+", "="],
    extras: ["C", "±", "%"]
}
insertButtons();

function insertButtons() {
    insertNumbers();
    insertOperators();
    insertExtras();

    function insertNumbers() {
        BUTTONS.numbers.forEach(b => {
            if ([0, "."].includes(b)) {
                const isZero = b === 0 ? "zero" : "";
                numberZeroRow.insertAdjacentHTML("beforeend", `
                    <div class="button number ${isZero}" onclick="processInput('${b}')">${b}</div>
                `);
            } else {
                numberArea.insertAdjacentHTML("beforeend", `
                    <div class="button number" onclick="processInput('${b}')">${b}</div>
                `);
            }
        });

    }

    function insertOperators() {
        BUTTONS.operators.forEach(b => {
            operatorArea.insertAdjacentHTML("beforeend", `
                <div class="button operator" onclick="processInput('${b}')">${b}</div>
            `);
        });
    }

    function insertExtras() {
        BUTTONS.extras.forEach(b => {
            extraArea.insertAdjacentHTML("beforeend", `
                <div class="button extra" onclick="processInput('${b}')">${b}</div>
            `);
        });
    }
}

let inputRecord = [];
let currentTotal;
let currentInputs = [];

function processInput(key) {

    if (isNaN(key)) {
        if (["÷", "×", "−", "+"].includes(key)) {
            if (currentInputs[2]) {

                currentInputs[0] = String(getCurrentTotal());
                currentInputs[1] = key;
                currentInputs[2] = "";

                updateDisplayWithIndex(0);
            } else {
                let currentDisplay = display.getAttribute("data-value");
                console.log("Currently: ", currentDisplay);

                if (currentDisplay) {
                    currentInputs[0] = currentDisplay;    
                    currentInputs[1] = key;
                } else if (currentInputs[1]) {
                    currentInputs[1] = key;
                }
            }
        }

        if (key === ".") {
            if (currentInputs[2]) {
                addDigitAtIndex(2, key);
            } else if (currentInputs[1]) {
                addDigitAtIndex(1, key);
            } else {
                // index 0 is empty; add 0 and ".".
                addDigitAtIndex(0, "0");
                addDigitAtIndex(0, key);
            }
        }

        if (key === "=") {
            if (!currentInputs.length) return;
            if (currentInputs[2]) {
                updateDisplay(getCurrentTotal());
            } else {
                updateDisplayWithIndex(0);

            }
            resetCalculatorMemory();
        }

        if (key === "C") {
            resetCalculatorMemory();
            updateDisplay();
        }

    } else { // Is a number.
        if (currentInputs[1]) {
            addDigitAtIndex(2, key);
            updateDisplayWithIndex(2);
        } else {
            addDigitAtIndex(0, key);
            updateDisplayWithIndex(0);
        }

    }
    console.warn("currentInputs", currentInputs);

}

function resetCalculatorMemory() {
    currentInputs = [];
}

function getCurrentTotal() {
    let num1 = +currentInputs[0];
    let num2 = +currentInputs[2];
    let total;

    switch (currentInputs[1]) {
        case "÷":
            total = num1 / num2;
            break;
        case "×":
            total = num1 * num2;
            break;
        case "−":
            total = num1 - num2;
            break;
        case "+":
            total = num1 + num2;
            break;
    }
    console.log(total, num1, num2, currentInputs);
    return total;
}

function addDigitAtIndex(i, key) {
    if (!currentInputs[i]) {
        currentInputs[i] = key;
    } else {
        currentInputs[i] += key;
    }
}

function updateDisplayWithIndex(i) {
    display.innerHTML = currentInputs[i].toLocaleString();
    display.setAttribute("data-value", currentInputs[i]);

}

function updateDisplay(value) {
    if(value) {
        display.innerHTML = value.toLocaleString();
        display.setAttribute("data-value", value.toLocaleString());
    } else {
        display.innerHTML = "";
        display.removeAttribute("data-value");
    }

}

document.querySelector("#numbers");