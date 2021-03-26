const numberArea = document.querySelector("#numbers");
const scientificArea = document.querySelector("#scientificInput");
const numberZeroRow = document.querySelector("#zeroRow");
const operatorArea = document.querySelector("#operators");
const extraArea = document.querySelector("#extras");
const display = document.querySelector("#display");

const BUTTONS = {
    numbers: [7, 8, 9, 4, 5, 6, 1, 2, 3, 0, "."],
    operators: ["÷", "×", "−", "+", "="],
    extras: ["C", "±", "%"],
    scientific: ["(", ")", "mc", "m+", "mr", "2nd", "x2", "x3", "xy", "ex", "10x", "(", ")", "mc", "m+", "mr", "2nd", "x2", "x3", "xy", "ex", "10x", "(", ")", "mc", "m+", "mr"]
}
insertButtons();

function insertButtons() {
    insertNumbers();
    insertOperators();
    insertExtras();
    insertScientific();

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

    function insertScientific() {
        BUTTONS.scientific.forEach(b => {
            scientificArea.insertAdjacentHTML("beforeend", `
                <div class="button extra scientific">${b}</div>
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
            if (currentInputs[1]) {
                // An operator is selected. Deal with second number. 
                addDecimalPointInIndex(2);
                updateDisplayWithIndex(2);

            } else {
                // Deal with first number. 
                addDecimalPointInIndex(0);
                updateDisplayWithIndex(0);

            }

            function addDecimalPointInIndex(i) {
                if (currentInputs[i]) {
                    if (!currentInputs[i].includes(".")) addDigitAtIndex(i, key);
                } else {
                    addDigitAtIndex(i, 0);
                    addDigitAtIndex(i, key);
                }
            }
        }

        if (key === "=") {
            if (!currentInputs.length) return;

            if (currentInputs[2]) {
                try {
                    updateDisplay(getCurrentTotal());
                } catch (e) {
                    display.innerHTML = e;
                }
            } else {
                updateDisplayWithIndex(0);
            }
            //currentInputs[2] ? updateDisplay(getCurrentTotal()) : updateDisplayWithIndex(0);
            resetCalculatorMemory();
        }

        if (key === "C") {
            resetCalculatorMemory();
            updateDisplay();
        }

        if (key === "±") {
            if (currentInputs[1]) {
                // An operator is selected. Deal with second number. 
                makePositveOrNegativeAtIndex(2);
                updateDisplayWithIndex(2);
            } else {
                // Deal with first number. 
                makePositveOrNegativeAtIndex(0);
                updateDisplayWithIndex(0);
            }

            function makePositveOrNegativeAtIndex(i) {
                if (currentInputs[i]) {
                    if (!currentInputs[i].includes("-")) {
                        currentInputs[i] = "-" + currentInputs[i];
                    } else {
                        currentInputs[i] = currentInputs[i].replace("-", "");
                    }
                } else {
                    currentInputs[i] = "-";
                }
            }
        }

        if (key === "%") {
            if (currentInputs[1]) {
                addDigitAtIndex(2, key);
                updateDisplayWithIndex(2);
            } else {

                addDigitAtIndex(0, key);
                updateDisplayWithIndex(0);
            }
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
    let num1, num2, total;

    try {
        [num1, num2] = getValues();
        [num1, num2].forEach(n => {
            // Todo: Work out the percentages.
        })
    } catch (e) {
        throw e;
    }


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

    function getValues() {
        let valueIndexes = [0, 2];
        let num1, num2;
        valueIndexes.forEach(i => {
            // If the input starts with "%" or "-%", is invalid. 
            if (currentInputs[i].charAt(0) === "%" || currentInputs[i].charAt(0) === "-" && currentInputs[i].charAt(1) === "%") {
                throw "Error in the input";
            } else {
                if (i === 0) {
                    num1 = currentInputs[i];
                } else {
                    num2 = currentInputs[i];
                }
            }
        });

        return [num1, num2];
    }
}

function addDigitAtIndex(i, key) {
    if (!currentInputs[i]) currentInputs[i] = "";
    currentInputs[i] += key;
}

function updateDisplayWithIndex(i) {
    console.log("hello: ", currentInputs[i].toLocaleString());
    display.innerHTML = currentInputs[i].toLocaleString();
    display.setAttribute("data-value", currentInputs[i]);
}

function updateDisplay(number) {
    console.log("Value: ", number);
    if (!isNaN(number)) { // If it's a number, including 0:
        display.innerHTML = number.toLocaleString();
        display.setAttribute("data-value", number.toLocaleString());
    } else {
        display.innerHTML = "";
        display.removeAttribute("data-value");
    }

}

document.querySelector("#numbers");