let timer = 0.0;
let interval;
let timeRemaining;
let stage = 0;
let correctAwnser;
let correctButton = 0;
const moneystage = [
    "0 €",
    "50 €",
    "100 €",
    "200 €",
    "500 €",
    "1.000 €",
    "2.000 €",
    "4.000 €",
    "16.000 €",
    "64.000 €",
    "500.000 €",
    "1.000.000 €"
];

let isJokerFiftyAvailable = true;
let isJokerCallAvailable = true;
let isJokerPublicAvailable = true;
let jokerAnswer;



/*-----------Allgemeine Funktionen----------*/


function startGame() {
    stage = 0;  //stage als zustandsstufe um aktuelles geld usw. zu berechnen
    timeRemaining = 40000;  // 40sek pro Aufgabe
    hide("#gameoverScreen");
    hide("#winningScreen")
    startTicker();
    resertJokers();
    startRound();
}

function hide(identifier) { //fügt die hide classe aus css einer id hinzu
    document.querySelector(identifier).classList.add("hidden");
}

function show(identifier) { //zeigt ein objekt wieder an
    document.querySelector(identifier).classList.remove("hidden");
}

function saveMillionaerScore(maxMoney) {

    //erstellt einen Eintrag der später im local storage gespeichert wird
    const entry = {
        name: sessionStorage.getItem("playerName"),
        maxMoney: maxMoney,
        date: new Date().toLocaleDateString("de-DE")
    };

    let highscores = 
        JSON.parse(localStorage.getItem("millionaerScores")) || []; //hohlt sich das array aus dem local storage, || [] falls noch kein eintrag soll array leer sein

    highscores.push(entry);  //neuer eintag wird ans ende angehängt

    localStorage.setItem(
        "millionaerScores",
        JSON.stringify(highscores)  //speichert den string im localstorage, da dieser nur strings speichern kann
    );
}

function getRandomNumber(min, max) {
    // Generiert eine zufällige Zahl zwischen min und max
    return Math.floor(Math.random() * (max-min+1) + min);
}

function getRandomBoolean(percent) {
    //gibt zu einem bestimmten prozentwert true oder false aus
    return Math.random() < percent;
}


/*-----------Ticker----------*/

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



/*-----------Runde----------*/

function startRound() {

    timeRemaining = 40000;
    if (stage <= 10) {
        stage +=1;
        generateQuestion(stage)
        updateMoney(stage)
    }
    else {
        winGame()
    }
} 

/*-----------Aufgabengenerierung----------*/


function generateQuestion(stage) {
    //Jegliche markierung der Boxen entfernen die durch die Joker entstehen
    for (let i = 1; i <= 4; i++) {
        document.querySelector("#awnserbox" + i).style.borderColor = "";
    }

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
        correctAwnser = task[3];
    }
}


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
    
    return [num1, num2, num3, num1 + num2 * num3]
}



function fillAwnsers(right) {
    let awk = getRandomNumber(1,4);
    correctButton = awk; /*für den 50:50 joker */
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

function checkAnswer(button) {
    let answer = button.innerText;

    if (Number(answer) === correctAwnser) {
        startRound();
    } else {
        gameOver();
    }
}

function updateMoney(stage) {
    document.querySelector("#moneyfield").textContent = moneystage[stage -1];
}


function winGame() {
    clearInterval(interval);  //sonst gefühlt 1000 highscore einträge
    show("#winningScreen");
    saveMillionaerScore("1.000.000 €");
}


function gameOver() {
    clearInterval(interval);  //sonst gefühlt 1000 highscore einträge
    show("#gameoverScreen");
    saveMillionaerScore(moneystage[stage -1]);
}

/*-----------Joker----------*/

function jokerCall() {
    if (isJokerCallAvailable) {

        if (getRandomBoolean(0.75)) { //gibt zu 75% true zurrück
            jokerAnswer = correctButton;
        } else {
            jokerAnswer = getRandomNumber(1, 4);
        }


        document.querySelector("#awnserbox" + correctButton).style.borderColor = "yellow";
        let answerText = document.querySelector("#awnserbox" + jokerAnswer).innerText;

        document.querySelector("#jokerCallText").innerText =
            'Oma sagt: "Ich glaube, die richtige Antwort ist ' + answerText + '."';

        show("#jokerCallScreen");

        hide("#jokerCall");
        isJokerCallAvailable = false;
    }
}

function closeJokerCall() {
    hide("#jokerCallScreen");
    document.querySelector("#awnserbox" + jokerAnswer).style.backgroundColor = "yellow";
}

function jokerFifty() {
    if (isJokerFiftyAvailable) {
        let secondButton;
        secondButton = getRandomNumber(1,4);
        if (secondButton === correctButton) {
            if (secondButton === 4) {
                secondButton -= 1;
            }
            else if (secondButton === 1) {
                secondButton += 1;
            }
        }
        

        document.querySelector("#awnserbox" + correctButton).style.borderColor = "yellow";
        document.querySelector("#awnserbox" + secondButton).style.borderColor = "yellow";

        isJokerFiftyAvailable = false;
        hide("#jokerFifty")
    }
}

function jokerPublic() {
    if (isJokerPublicAvailable) {

        let votes = [10, 10, 10, 10];  //definieren der 4 votes

        votes[correctButton - 1] = getRandomNumber(55, 80);  //Der richtige Button bekommt im Array einen wert von 55-80% 

        let remaining = 100 - votes[correctButton - 1];  //Übrige zu vergebende Prozent werden berechnet

        for (let i = 0; i < 4; i++) {      
            /* gibt den verbleibenden Antworten einen Wert 
            Dazu wird einfach der verbleibende Wert durch 3 geteilt 
            um realistische antworten zu generieren */
            if (i !== correctButton - 1) {
                let value = Math.floor(remaining / 3);
                votes[i] = value;
            }
        }

        document.querySelector("#awnserbox" + correctButton).style.borderColor = "yellow";

        votes[3] += 100 - (votes[0] + votes[1] + votes[2] + votes[3]); //fehlende % werden noch draufaddiert

        document.querySelector("#publicA").innerText = votes[0];
        document.querySelector("#publicB").innerText = votes[1];
        document.querySelector("#publicC").innerText = votes[2];
        document.querySelector("#publicD").innerText = votes[3];

        show("#jokerPublicScreen");

        isJokerPublicAvailable = false;
        hide("#jokerPublic");
    }
}


function resertJokers() {
    show("#jokerCall")
    show("#jokerPublic")
    show("#jokerFifty")
    isJokerCallAvailable = true;
    isJokerPublicAvailable = true;
    isJokerFiftyAvailable = true;
}






// Falls kein Spielername eingetragen ist, redirecte auf die Anmeldeseite
if (!sessionStorage.getItem("playerName"))
    window.location.pathname = 'web-engineering/html/main.html';

startGame()
