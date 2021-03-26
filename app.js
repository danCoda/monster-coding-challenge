/*==============================================================
    Monster Technical Interview - Programming Exercise.

    name: Daniel Son.
    date: 26.03.2021.

================================================================*/

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
    scientific: ["(", ")", "mc", "m+", "mr", "2nd", "x2", "x3", "xy", "ex", "10x", "(", ")", "mc", "m+", "mr", "2nd", "x2", "x3", "xy", "ex", "10x", "(", ")", "mc", "m+", "mr", "mc", "m+", "mr"]
}

// Max length is 3. 
// First and third elements are for numbers. 
// Second is the operator.
let currentInputs = [];

insertButtons();

function insertButtons() {
    insertNumbers();
    insertOperators();
    insertExtraButtons(); // Extras: "C", "+-", "%".
    insertScientific(); // Scientific buttons.

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

    function insertExtraButtons() {
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

function processInput(key) {
    if (isNaN(key)) {
        processNonNumberInput();
    } else {
        processNumberInput();
    }

    function processNonNumberInput() {
        if (["÷", "×", "−", "+"].includes(key)) {
            processOperatorInputs();
        } else {
            switch (key) {
                case ".":
                    processDotInput();
                    break;
                case "=":
                    processFinalCalculation();
                    break;
                case "C":
                    // Reset calculator.
                    resetCalculatorMemory();
                    updateDisplay();
                    break;
                case "±":
                    processPlusMinusInput();
                    break;
                case "%":
                    processPercentageInput();
                    break;
            }
        }      

        function processFinalCalculation() {
            if (!currentInputs.length) return;

            if (numberExistsAtIndex(2)) {
                try {
                    updateDisplay(getCurrentTotal());
                } catch (e) {
                    display.innerHTML = e;
                }
            } else {
                updateDisplayWithIndex(0);
            }
            resetCalculatorMemory();
        }

        function processPlusMinusInput() {
            if (numberExistsAtIndex(1)) {
                // An operator is selected. Deal with second number. 
                makePositveOrNegativeAtIndex(2);
                updateDisplayWithIndex(2);
            } else {
                // Deal with first number. 
                makePositveOrNegativeAtIndex(0);
                updateDisplayWithIndex(0);
            }

            function makePositveOrNegativeAtIndex(i) {
                if (numberExistsAtIndex(i)) {
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

        function processPercentageInput() {
            if (numberExistsAtIndex(1)) {
                addDigitAtIndex(2, key);
                updateDisplayWithIndex(2);
            } else {
                addDigitAtIndex(0, key);
                updateDisplayWithIndex(0);
            }
        }

        function processDotInput() {
            if (numberExistsAtIndex(1)) {
                // An operator is selected. Deal with second number. 
                addDecimalPointInIndex(2);
                updateDisplayWithIndex(2);

            } else {
                // Deal with first number. 
                addDecimalPointInIndex(0);
                updateDisplayWithIndex(0);

            }

            function addDecimalPointInIndex(i) {
                if (numberExistsAtIndex(i)) {
                    if (!currentInputs[i].includes(".")) addDigitAtIndex(i, key);
                } else {
                    addDigitAtIndex(i, 0);
                    addDigitAtIndex(i, key);
                }
            }
        }

        function processOperatorInputs() {
            if (numberExistsAtIndex(2)) {
                // Set index 0 to the total, 1 to the operator, and empty 2.                
                currentInputs[0] = String(getCurrentTotal());
                currentInputs[1] = key;
                currentInputs[2] = "";
                updateDisplayWithIndex(0);
            } else {
                let currentDisplay = display.getAttribute("data-value");

                if (currentDisplay) {
                    currentInputs[0] = currentDisplay;
                    currentInputs[1] = key;
                } else if (currentInputs[1]) {
                    currentInputs[1] = key;
                }
            }
        }
    }

    function processNumberInput() {
        if (currentInputs[1]) {
            addDigitAtIndex(2, key);
            updateDisplayWithIndex(2);
        } else {
            addDigitAtIndex(0, key);
            updateDisplayWithIndex(0);
        }
    }
}

function resetCalculatorMemory() {
    currentInputs = [];
}

function numberExistsAtIndex(i) {
    return currentInputs[i];
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

    total = getTotal();
       
    return total;

    function getTotal() {
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
    }

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
    display.innerHTML = currentInputs[i].toLocaleString();
    display.setAttribute("data-value", currentInputs[i]);
}

function updateDisplay(number) {
    if (!isNaN(number)) { // If it's a number, including 0:
        display.innerHTML = number.toLocaleString();
        display.setAttribute("data-value", number.toLocaleString());
    } else {
        display.innerHTML = "";
        display.removeAttribute("data-value");
    }

}

document.querySelector("#numbers");