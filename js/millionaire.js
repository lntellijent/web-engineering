console.log("JS wurde geladen");
let timer = 0.0;
let interval;
let timeRemaining = 9990000;



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

const questions = [
    "Das ist Frage 1",
    "Das ist Frage 2",
    "Das ist Frage 3",
    "Das ist Frage 4",
    "Das ist Frage 5",
    "Das ist Frage 6",
    "Das ist Frage 7",
    "Das ist Frage 8",
    "Das ist Frage 9",
    "Das ist Frage 10",
];
/*-----------Allgemeine Funktionen----------*/

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max-min+1) + min);
}

/*-----------spezifische Funktionen----------*/

function loadQuestion() {
    question = questions[getRandomNumber(0,questions.length - 1)];
    document.querySelector("#frage").textContent = question; 
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
    timeRemaining = 4000000;
    hide("#gameoverScreen");
    startTicker()
    loadQuestion();
}

function hide(identifier) {
    document.querySelector(identifier).classList.add("hidden");
}

function show(identifier) {
    document.querySelector(identifier).classList.remove("hidden");
}


startGame()
