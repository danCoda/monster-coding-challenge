const numberArea = document.querySelector("#numbers");
const numberZeroRow = document.querySelector("#zeroRow");
const operatorArea = document.querySelector("#operators");
const extraArea = document.querySelector("#extras");

const BUTTONS = {
    numbers: [7, 8, 9, 4, 5, 6, 1, 2, 3, 0, "."],
    operators: ["÷", "×", "−", "+", "="],
    extras: ["c", "±", "%"]
}
insertButtons();
applyFunctionality();

function insertButtons() {
    insertNumbers();
    insertOperators();
    insertExtras();

    function insertNumbers() {
        BUTTONS.numbers.forEach(b => {
            if ([0, "."].includes(b)) {
                const isZero = b === 0 ? "zero" : "";
                numberZeroRow.insertAdjacentHTML("beforeend", `
                    <div class="button number ${isZero}">${b}</div>
                `);
            } else {
                numberArea.insertAdjacentHTML("beforeend", `
                    <div class="button number">${b}</div>
                `);
            }

        });

    }

    function insertOperators() {
        BUTTONS.operators.forEach(b => {
            operatorArea.insertAdjacentHTML("beforeend", `
                <div class="button operator">${b}</div>
            `);
        });
    }

    function insertExtras() {
        BUTTONS.extras.forEach(b => {
            extraArea.insertAdjacentHTML("beforeend", `
                <div class="button extra">${b}</div>
            `);
        });
    }
}

function applyFunctionality() {

}

document.querySelector("#numbers");