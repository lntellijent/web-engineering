console.log("JS wurde geladen");
let timer = 0.0;
let interval;
let timeRemaining = 9990000;
let stage = 0;
let correctAwnser;

const gewinne = [
    "0 €",
    "50 €",
    "100 €",
    "200 €",
    "500 €",
    "1.000 €",
    "2.000 €",
    "4.000 €",
    "8.000 €",
    "16.000 €",
    "32.000 €",
    "64.000 €",
    "125.000 €",
    "250.000 €",
    "500.000 €",
    "1.000.000 €"
];

/*-----------Allgemeine Funktionen----------*/

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max-min+1) + min);
}

/*-----------spezifische Funktionen----------*/


function AdditionTask(max) {
    let num1 = Math.floor(Math.random() * (max + 1));
    let num2 = Math.floor(Math.random() * (max - num1 + 1));
    let solution = num1 + num2;

    return [num1, num2, num1 + num2];
}

function SubtractionTask(max) {
    let num1 = getRandomNumber(1, max);
    let num2 = getRandomNumber(0, num1);

    return [num1, num2, num1 - num2];
}

function MultiplicationTask() {
    let num1 = getRandomNumber(1, 10);
    let num2 = getRandomNumber(1, 10);

    return [num1, num2, num1 * num2];
}

function DivisionTask() {
    let num2 = getRandomNumber(1, 10);
    let solution = getRandomNumber(1, 10);
    let num1 = num2 * solution;

    return [num1, num2, solution];
}

function masterTask() {
    let num1 = getRandomNumber(1, 5);
    let num2 = getRandomNumber(1,5);
    let num3 = getRandomNumber(2,10);
    
    return [num1, num2, num3, (num1 + num2) * num3]
}

function fillAwnsers(right) {
    let awk = getRandomNumber(1,4);
    if (awk == 1) {
        document.querySelector("#awnserbox1").innerText = right;
    }
    else {
        document.querySelector("#awnserbox1").innerText = Math.abs(getRandomNumber(1 , 20) + right);
    }
    if (awk == 2) {
        document.querySelector("#awnserbox2").innerText = right;
    }
    else {
        document.querySelector("#awnserbox2").innerText = Math.abs(getRandomNumber(1 , 20) + right);
    }
    if (awk == 3) {
        document.querySelector("#awnserbox3").innerText = right;
    }
    else {
        document.querySelector("#awnserbox3").innerText = Math.abs(getRandomNumber(1 , 20) + right);
    }
    if (awk == 4) {
        document.querySelector("#awnserbox4").innerText = right;
    }
    else {
        document.querySelector("#awnserbox4").innerText = Math.abs(getRandomNumber(1 , 20) - right);
    }
}

function checkButton1() {
    let answer1 = document.querySelector("#awnserbox1").innerText;

    if (Number(answer1) === correctAwnser) {
        updateStage();
    } else {
        gameOver();
    }
}
function checkButton2() {
    let answer2 = document.querySelector("#awnserbox2").innerText;

    if (Number(answer2) === correctAwnser) {
        updateStage();
    } else {
        gameOver();
    }
}
function checkButton3() {
    let answer3 = document.querySelector("#awnserbox3").innerText;

    if (Number(answer3) === correctAwnser) {
        updateStage();
    } else {
        gameOver();
    }
}
function checkButton4() {
    let answer4 = document.querySelector("#awnserbox4").innerText;

    if (Number(answer4) === correctAwnser) {
        updateStage();
    } else {
        gameOver();
    }
}

function generateQuestion(stage) {
    let selector = getRandomNumber(1,2)
    if (stage <= 2) {
        if (selector === 1) {
            let task = AdditionTask(20);
            document.querySelector("#frage").innerText = task[0] + "+" + task[1] + " = ?";
            fillAwnsers(task[2]);
            correctAwnser = task[2];
        }
        if (selector === 2) {
            let task = SubtractionTask(20);
            document.querySelector("#frage").innerText = task[0] + "-" + task[1] + " = ?";
            fillAwnsers(task[2])
            correctAwnser = task[2];
        }
    }
    else if (stage <= 5) {
        if (selector === 1) {
            let task = AdditionTask(100);
            document.querySelector("#frage").innerText = task[0] + "+" + task[1] + " = ?";
            fillAwnsers(task[2]);
            correctAwnser = task[2];
        }
        if (selector === 2) {
            let task = SubtractionTask(100);
            document.querySelector("#frage").innerText = task[0] + "-" + task[1] + " = ?";
            fillAwnsers(task[2])
            correctAwnser = task[2];
        }
    }
    else if (stage <= 10) {
        if (selector === 1) {
            let task = MultiplicationTask();
            document.querySelector("#frage").innerText = task[0] + "*" + task[1] + " = ?";
            fillAwnsers(task[2]);
            correctAwnser = task[2];
        }
        if (selector === 2) {
            let task = DivisionTask();
            document.querySelector("#frage").innerText = task[0] + ":" + task[1] + " = ?";
            fillAwnsers(task[2])
            correctAwnser = task[2];
        }
    }
    else if (stage === 11) {
        let task = masterTask();
        document.querySelector("#frage").innerText = task[0] + "+" + task[1] + "*" + task[2] + " = ?";
        fillAwnsers(task[3])
    }
}


function updateStage() {
    if (stage <= 10) {
        stage += 1;
        generateQuestion(stage)
    }
    else {
        winGame()
    }
}

function winGame() {
    /*Win Game div einblenden*/
}

function startRound() {
    generateQuestion(0);
} 


function startTicker() {
    clearInterval(interval)
    document.querySelector("#timer").innerText = `${timeRemaining / 1000}`;
    interval = setInterval(tick, 100);
}

function tick() {
    timeRemaining -= 100;
    lowerTimerEverySecond()
}

function lowerTimerEverySecond() {
    if (timeRemaining >= 0) {
        if (timeRemaining % 1000 === 0) document.querySelector("#timer").innerText = `${timeRemaining / 1000}`;
    }
    else {
        gameOver()
    }
    
}

function gameOver() {
    show("#gameoverScreen");
}

function startGame() {
    stage = 0;
    timeRemaining = 4000000;
    hide("#gameoverScreen");
    startTicker();
    startRound();
}

function hide(identifier) {
    document.querySelector(identifier).classList.add("hidden");
}

function show(identifier) {
    document.querySelector(identifier).classList.remove("hidden");
}


startGame()
