
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let generatedTask;
newTask();

const subtn = document.querySelector("#subtn");
const txt = document.querySelector("#userInput");
const helpcorrect = document.querySelector("#helpcorrectfield");
console.log(txt);
subtn.addEventListener("click", async event => {
    const input = Number(txt.value.trim());
    if (typeof input === "number") {
        if (input === generatedTask.missing) {
            console.log("korrekt");
            newTask();
            helpcorrect.innerHTML = "Korrekt!"
            helpcorrect.classList.toggle("hidden");
            await delay(3000);
            helpcorrect.classList.toggle("hidden");
        } else {
            console.log("Inkorrekt")
            helpcorrect.innerHTML = "Inkorrekt! Versuche erneut"
            helpcorrect.classList.toggle("hidden");
        }
    } else {
        console.log("NaN");
    }
})

function manipulate(div, content) {
    const list = document.querySelector(div);
    list.innerHTML += `<p>` + content + `</p>`
}

function clear(div) {
    const list = document.querySelector(div);
    list.innerHTML = "";
}

function createTask(negativeEnabled) {
    const operation = 0; // getRandomIntInclusive(0, 1);
    let leftOperand, rightOperand, result
    switch (operation) {
        case 0: // +
            leftOperand = getRandomIntInclusive(1, 89) // create the left number
            const minimumRightValue = 10 - (leftOperand % 10);
            rightOperand = getRandomIntInclusive(1 + minimumRightValue, 100 - leftOperand) // create the right number - limit it to 100
            result = leftOperand + rightOperand
            break;
        case 1: // -
            // #ToDo Überarbeiten der Logik, sodass immer ein Zehnerübergang stattfindet und es einstellbar ist, ob das Ergebnis negativ werden kann oder nicht.
            leftOperand = getRandomIntInclusive(10, 100) // create the left number
            rightOperand = getRandomIntInclusive(10, 100 - leftOperand) // create the right number - limit it to 100
            result = leftOperand - rightOperand
            break;
    }

    const blank = 2; // getRandomIntInclusive(0, 2)
    let missing;
    switch (blank) {
        case 0:
            missing = leftOperand;
            leftOperand = "?"
            break;
        case 1:
            missing = rightOperand;
            rightOperand = "?"
            break;
        case 2:
            missing = result;
            result = "?"
            break;
    }

    return {
        leftOperand: leftOperand,
        operation: operation === 0 ? "+" : "-",
        rightOperand: rightOperand,
        relation: "=",
        result: result,
        blankIndex: blank,
        missing: missing
    };
}

function newTask() {
    generatedTask = createTask(false);

    clear("#leftOperand");
    clear("#operation");
    clear("#rightOperand");
    clear("#relation");
    clear("#result");

    manipulate("#leftOperand", generatedTask.leftOperand);
    manipulate("#operation", generatedTask.operation);
    manipulate("#rightOperand", generatedTask.rightOperand);
    manipulate("#relation", generatedTask.relation);
    manipulate("#result", generatedTask.result);
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}