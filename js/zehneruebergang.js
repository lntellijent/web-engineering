

let generatedTask = createTask();

manipulate("#leftOperand", generatedTask.leftOperand);
manipulate("#operation", generatedTask.operation);
manipulate("#rightOperand", generatedTask.rightOperand);
manipulate("#relation", generatedTask.relation);
manipulate("#result", generatedTask.result);
// console.log(generatedTask.missing);

const subtn = document.querySelector("#subtn");
const txt = document.querySelector("#userInput");
subtn.addEventListener("click", event => {
    const input = Number(txt.value.trim());
    if (typeof input === "number") {
        if (input === generatedTask.missing) {
            console.log("korrekt");

            generatedTask = createTask();

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
// console.log(generatedTask.missing);
        } else {
            console.log("Inkorrekt")
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

function createTask() {
    const operation = getRandomIntInclusive(0, 1);
    let leftOperand, rightOperand, result
    switch (operation) {
        case 0: // +
            leftOperand = getRandomIntInclusive(1, 89) // create the left number
            rightOperand = getRandomIntInclusive(1, 100 - leftOperand) // create the right number - limit it to 100
            result = leftOperand + rightOperand
            break;
        case 1: // -
            leftOperand = getRandomIntInclusive(10, 100) // create the left number
            rightOperand = getRandomIntInclusive(10, 100 - leftOperand) // create the right number - limit it to 100
            result = leftOperand - rightOperand
            break;
    }

    const blank = getRandomIntInclusive(0, 2)
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

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}