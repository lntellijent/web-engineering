
/*
wichtige HTML-Elemente
 */
const subtn = document.querySelector("#subtn"); // "Submit"-Button
const txt = document.querySelector("#userInput"); // Textarea als Zahleninput
const helpcorrect = document.querySelector("#helpcorrectfield"); // Feld für Hilfestellung bei Fehlern oder Rückmeldung für die Korrektheit
const body = document.querySelector("body"); // body für Hintergrundmanipulation
const timer = document.querySelector("#timer");
const gameScreen = document.querySelector("#gameScreen");
const gameOverScreen = document.querySelector("#gameOverScreen");


/*
Zeitlogik

alle Werte in Millisekunden
 */
const initialRoundTime = 2 * 60 * 1000; // initiale Zeit pro Runde
const timeGainPerCorrectAnswer = 3 * 1000; // Zeitgewinn für richtige Aufgaben
const timePenaltyAtSkip = 10 * 1000; // Zeitverlust für das Überspringen einer Aufgabe

/*
Spielekonstanten
 */
const streakVisibleAfterXCorrect = 5; // nach 5 richtigen hintereinander wird dies gelobt


/*
Globale Arbeitsvariablen
 */
let popupvisible; // Interne Variable, die anzeigt, ob das gameselection sichtbar ist oder nicht.
let generatedTask; // Enthält die zu berechnende Aufgabe

let correctAnswers = 0;
let allGivenAnswers = 0;
let streak = 0; // Zähler der hintereinander korrekt gelösten Aufgaben

let timeRemaining = initialRoundTime;
let interval; // Für das Polling der Zeit zuständig

/*

------------------------------------- automatischer Spielstart ----------------------------------------------------

 */

// Falls kein Spielername eingetragen ist, redirecte auf die Anmeldeseite
if (!sessionStorage.getItem("playerName"))
    window.location.pathname = 'web-engineering/html/main.html';

newTask(); // Befüllung von "generatedTask"
changeBackgroundColor(""); // setzen des Standard-Hintergrundgradients
startTicker(); // Start des Timers


/*

------------------------------------- EventListener ----------------------------------------------------

 */
document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") { // Submit on Enter
        subtn.click(); // Button wird virtuell gedrückt
    }
});

document.addEventListener("click", ({target}) => {
    txt.focus(); // Fokussierung des Textfensters, sobald geklickt wird, um es immer im Fokus zu halten

    const button = target.closest('button');
    // Das Klickelement wird gespeichert, sofern es wirklich ein Button ist


    if (!button) return; // Falls kein button: Abbruch

    switch (button.id) {
        case 'subtn': // Eingabe und ihre Richtigkeit prüfen
            const text = txt.value.trim();
            const input = parseInt(text); // Inputkonvertierung zur Number um falsche Eingaben auszusortieren und schummeln vorzubeugen.

            if (input === generatedTask.missing || (generatedTask.blankIndex === 0 && text === generatedTask.missing)) { // Frage: Stimmt der Input mit dem fehlenden Wert überein?
                correctAnswer();
            } else if ((text !== "+" && text !== "-") && isNaN(input)) { // Input ist keine Nummer (parseInt returned "NaN")
                invalidAnswer();
            } else { // Input ist eine Nummer, aber erfüllt die Gleichung nicht
                wrongAnswer();
            }
            break;

        case 'restart': // Neustart des Spiels
            timeRemaining = initialRoundTime;
            correctAnswers = 0;
            allGivenAnswers = 0;
            startTicker();

            hide(); // Hilfestellung verbergen
            newTask(); // Neue Aufgabe erstellen
            changeBackgroundColor(""); // normaler Hintergrund
            gameScreen.classList.remove("hidden"); // GameScreen anzeigen
            gameOverScreen.classList.add("hidden"); // GameOverScreen verbergen
            break;

        case 'skipbtn': // Aufgabe überspringen
            newTask(); // Neue Aufgabe
            deductTime(); // Zeitstrafe
            changeBackgroundColor("incorrect"); // visueller Hinweis (rot)
            break;

        default:
            break;
    }
});

/*

------------------------------------- Aufgabenaktionen ----------------------------------------------------

 */

/**
 * Aktionen, falls die gegebene Antwort richtig ist.
 */
function correctAnswer() {
    newTask(); // Aufgabe erfolgreich gelöst - neue Aufgabe erstellen
    changeBackgroundColor("correct"); // Hintergrund auf grün ändern
    show(); // Status anzeigen
    addTime(); // Zeitbonus für eine korrekte Antwort

    correctAnswers++; // Eine korrekte Antwort mehr
    allGivenAnswers++; // Eine Antwort mehr
    streak++;

    if (streak >= streakVisibleAfterXCorrect) // Sofern genug Aufgaben hintereinander korrekt gelöst wurden, wird einem die Anzahl korrekter angezeigt.
        helpcorrect.innerHTML = `${streak} Korrekte Antworten. Klasse!`; // Ausgabe im DOM
    else
        helpcorrect.innerHTML = "Korrekt!"; // Ausgabe im DOM
}

/**
 * Aktionen, falls die gegebene Antwort falsch ist.
 */
function wrongAnswer() {
    changeBackgroundColor("incorrect"); // Roter Hintergrund
    help(); // Hilfestellung
    show(); // Statusmeldung anzeigen

    // + oder -, falls es + (oder -) nicht ist, wird aus Schnelligkeit das Zeichen entfernt
    if (generatedTask.blankIndex === 0) {
        txt.value = "";
    }

    allGivenAnswers++; // Eine Antwort ingesamt mehr gegebenen
}

/**
 * Aktionen, falls die gegebene Antwort ungültig ist.
 */
function invalidAnswer() {
    helpcorrect.innerHTML = "Eingabe ist keine gültige Nummer. Versuche erneut." // Statusausgabe
    show(); // Statusmeldung anzeigen
}

/**
 * Aktionen, falls die Zeit abgelaufen ist.
 */
function gameOver() {
    timer.innerText = `${correctAnswers}/${allGivenAnswers}`;
    clearInterval(interval); // Intervall wird gestoppt

    changeBackgroundColor("incorrect") // roter Hintergrund
    gameScreen.classList.add("hidden"); // Zahlen verbergen
    gameOverScreen.classList.remove("hidden"); // Game Over + Buttons einblenden

    saveZehneruebergangScore(correctAnswers, allGivenAnswers); // Rekord eintragen
}

/*

------------------------------------- Hilfestellung ----------------------------------------------------

 */

/**
 * Zeigt eine passende Hilfestellung zur derzeitigen Aufgabe an
 */
function help() {
    // isNaN-Check o.ä. redundant, da newTask keine Errors wirft.
    if (generatedTask.blankIndex !== 0) {
        helpcorrect.innerHTML = `Inkorrekt! Versuche erneut.<br>Hilfestellung:<br><br>` // Statusausgabe
    } else { // Keine Hilfestellung falls +/- Modus
        helpcorrect.innerHTML = `Inkorrekt! Versuche erneut.` // Statusausgabe
    }

    /*
        1. l+r=g
            (1.0 operation missing)
            1.1 l missing
                l=g-r
            1.2 r missing
                r=g-l
            1.3 g missing
                g=l+r

        2. l-r=g
            (2.0 operation missing)
            2.1 l missing
                l=g+r
            2.2 r missing
                r=l-g
            2.3 g missing
                g=l-r
     */


    switch (generatedTask.operation) {
        case 0:
            break;
        case "+": // Fall 1.x
            switch (generatedTask.blankIndex) {
                case 1: // leftOperand fehlt (Fall 1.1)
                    helpcorrect.innerHTML += `Berechne ${generatedTask.leftOperand}=${generatedTask.result}-${generatedTask.rightOperand}`;
                    break;
                case 2: // rightOperand fehlt (Fall 1.2)
                    helpcorrect.innerHTML += `Berechne ${generatedTask.rightOperand}=${generatedTask.result}-${generatedTask.leftOperand}`;
                    break;
                case 3: // result fehlt (Fall 1.3)
                    helpcorrect.innerHTML += `Berechne ${generatedTask.result}=${generatedTask.leftOperand}+${generatedTask.rightOperand}`;
                    break;
            }
            break;
        case "-": // Fall 2.x
            switch (generatedTask.blankIndex) {
                case 1: // leftOperand fehlt (Fall 2.1)
                    helpcorrect.innerHTML += `Berechne ${generatedTask.leftOperand}=${generatedTask.result}+${generatedTask.rightOperand}`;
                    break;
                case 2: // rightOperand fehlt (Fall 2.2)
                    helpcorrect.innerHTML += `Berechne ${generatedTask.rightOperand}=${generatedTask.leftOperand}-${generatedTask.result}`;
                    break;
                case 3: // result fehlt (Fall 2.3)
                    helpcorrect.innerHTML += `Berechne ${generatedTask.result}=${generatedTask.leftOperand}-${generatedTask.rightOperand}`;
                    break;
            }
            break;
    }

    helpcorrect.ariaLabel = helpcorrect.innerHTML; // Übernahme der Ausgabe für Screenreader
}

/*

------------------------------------- DOM-Events ----------------------------------------------------

 */

/**
 * Zeigt das popupfeld im DOM
 */
function show() {
    if (popupvisible !== true)
        helpcorrect.classList.toggle("hidden"); // Hinweis wird sichtbar
    popupvisible = true
}

/**
 * Versteckt das popupfeld im DOM
 */
function hide() {
    if (popupvisible === true)
        helpcorrect.classList.toggle("hidden"); // Hinweis wird unsichtbar
    popupvisible = false
}

/**
 * Wechselt die Hintergrundfarbe basierend auf der Korrektheit der Aufgabe.
 * Wurde sie gelöst, wird der Hintergrund grün, falls nicht, wird er rot.
 * Standard in allen anderen Fällen ist neutrales weiß.
 * @param scenario String
 * - "korrekt" (grün)
 * - "inkorrekt" (rot)
 * - alles andere (weiß)
 */
function changeBackgroundColor(scenario) {
    /*
    Wechselt die Klasse basierend auf dem gesetzten Szenario.
    Mehr dazu in CSS
     */
    switch (scenario) {
        case "correct":
            body.className = "correct";
            break;
        case "incorrect":
            body.className = "incorrect";
            break;
        default:
            body.className = "standard";
            break;
    }
}

/**
 * Manipulation des angegebenen DIVs durch hinzufügen von Parapgraphen.
 * @param div das zu füllende DIVs
 * @param content der Inhalt mit dem das DIV gefüllt wird
 */
function manipulate(div, content) { // Füllt das übergebene div mit Inhalt
    const list = document.querySelector(div); // Lokalisierung des divs
    list.innerHTML += `<p>` + content + `</p>` // Inhalt des divs bearbeiten
}

/**
 * Leert das DIV von jeglichen Inhalten
 * @param div das zu leerende DIV
 */
function clear(div) { // Leert das übergebene div
    const list = document.querySelector(div); // Lokalisierung des divs
    list.innerHTML = ""; // Inhalt des divs bearbeiten (leeren)
}

/*

------------------------------------- Aufgabenerstellung ----------------------------------------------------

 */

function createTask() {
    let operation = getRandomIntInclusive(0, 1); // Auswahl der Rechenoperation per (Pseudo-)Zufall
    let w, x, y, z; // Variablen für die einzelnen Stellen; wichtig für die Generationslogik von Zehnerübergängen
    let leftOperand, rightOperand, result; // Variablen für die linke und rechte Zahl, sowie das Ergebnis

    switch (operation) {
        // #ToDo "Hard Mode" Bei denen nicht (0,100), sondern (-100, 100) betrachtet wird
        case 0: // +
            w = getRandomIntInclusive(0, 8); // Zehnerstelle des linken Operanden
            x = getRandomIntInclusive(1, 9); // Einerstelle des linken Operanden
            y = getRandomIntInclusive(0, 8 - w); // Zehnerstelle des rechten Operanden
            z = getRandomIntInclusive(10 - x, 9); // Einerstelle des rechten Operanden

            leftOperand = w * 10 + x; // Zusammensetzung des linken Operanden
            rightOperand = y * 10 + z; // Zusammensetzung des rechten Operanden
            result = leftOperand + rightOperand // Berechnung des Ergebnisses zur Überprüfung
            break;
        case 1: // -
            w = getRandomIntInclusive(1, 9); // Zehnerstelle des linken Operanden
            x = getRandomIntInclusive(0, 8); // Einerstelle des linken Operanden
            y = getRandomIntInclusive(0, w - 1); // Zehnerstelle des rechten Operanden
            z = getRandomIntInclusive(x + 1, 9); // Einerstelle des rechten Operanden

            leftOperand = w * 10 + x; // Zusammensetzung des linken Operanden
            rightOperand = y * 10 + z; // Zusammensetzung des rechten Operanden
            result = leftOperand - rightOperand // Berechnung des Ergebnisses zur Überprüfung
            break;
    }

    operation = operation === 0 ? "+" : "-";
    const blank =  getRandomIntInclusive(0, 3) // Auswahl der fehlenden Zahl (Index) via Zufall
    let missing; // Enthält den Wert der fehlenden Zahl
    switch (blank) {
        case 0: // Operator fehlt
            missing = operation;
            operation = "?";

            txt.placeholder = "+/-";
            txt.type = "text";
            txt.pattern = "\[+-\]";
            break;
        case 1: // linke Zahl fehlt
            missing = leftOperand; // Wert wird für das Ergebnis zwischengespeichert
            leftOperand = "?" // Wert wird mit einem Platzhalter besetzt
            break;
        case 2: // rechte Zahl fehlt
            missing = rightOperand; // Wert wird für das Ergebnis zwischengespeichert
            rightOperand = "?" // Wert wird mit einem Platzhalter besetzt
            break;
        case 3: // Ergebnis fehlt
            missing = result; // Wert wird für das Ergebnis zwischengespeichert
            result = "?" // Wert wird mit einem Platzhalter besetzt
            break;
    }

    if (blank !== 0) {
        txt.placeholder = "0-99";
        txt.type = "number";
        txt.pattern = "";
    }

    return {
        leftOperand: leftOperand,
        operation: operation,
        rightOperand: rightOperand,
        relation: "=",
        result: result,
        blankIndex: blank,
        missing: missing
    };
}

/**
 * Erstellung einer Mathegleichung (Addition oder Subtraktion) mit einem garantierten Zehnerübergang
 */
function newTask() {
    generatedTask = createTask(false); // Erstellung der neuen Aufgabe
    txt.value = "";

    /*
    Entfernen des Inhalts der Gleichung
     */
    clear("#leftOperand");
    clear("#operation");
    clear("#rightOperand");
    clear("#relation");
    clear("#result");

    /*
    Befüllung der Elemente mit den berechneten Werten
     */
    manipulate("#leftOperand", generatedTask.leftOperand);
    manipulate("#operation", generatedTask.operation);
    manipulate("#rightOperand", generatedTask.rightOperand);
    manipulate("#relation", generatedTask.relation);
    manipulate("#result", generatedTask.result);

    /*
    Leider lesen Screenreader weder "?", noch "-" oder "+" explizit vor.
    Daher erfolgt das manuelle ersetzen, wo nötig.
     */
    txt.ariaLabel = `${generatedTask.leftOperand === "?" ? "x" : generatedTask.leftOperand}`;
    switch (generatedTask.operation) {
        case "+":
            txt.ariaLabel += `Plus`;
            break;
        case "-":
            txt.ariaLabel += `Minus`;
            break;
        case "?":
            txt.ariaLabel += `x`;
            break;
    }

    txt.ariaLabel += `${generatedTask.rightOperand === "?" ? "x" : generatedTask.rightOperand}`;
    txt.ariaLabel += `${generatedTask.relation}`;
    txt.ariaLabel += `${generatedTask.result === "?" ? "x" : generatedTask.result}`;

    // console.log(generatedTask);
    // Debug-Zwecke
}

/**
 * Erstellung von Zufallszahlen
 * @param min Mindestgröße der Zufallszahl
 * @param max Maximalgröße der Zufallszahl
 * @returns {number} Zufallszahl zwischen min und max
 */
function getRandomIntInclusive(min, max) { //
    min = Math.ceil(min); // Minimum auf eine Ganze Zahl abrunden
    max = Math.floor(max); // Maximum auf eine Ganze Zahl aufrunden
    return Math.floor(Math.random() * (max - min + 1)) + min; // Berechnung der Zufallszahl
}

/*

------------------------------------- Zeitlogik ----------------------------------------------------

 */

/**
 * Start des Timers
 */
function startTicker() {
    clearInterval(interval); // Intervall wird gestoppt
    interval = setInterval(() => {
        timeRemaining -= 100;
        updateTimer();
    }, 100);
    updateTimer();
}

function addTime() {
    timeRemaining += timeGainPerCorrectAnswer;
    updateTimer();
}

function deductTime() {
    timeRemaining -= timePenaltyAtSkip;
    updateTimer();
}

function updateTimer() {
    if (timeRemaining >= 0) {
        timer.innerText = `${Math.floor(timeRemaining / 1000)} - ${correctAnswers}/${allGivenAnswers}`;
    } else { // Game Over!
        gameOver();
    }
}

/*

------------------------------------- Highscore ----------------------------------------------------

 */

function saveZehneruebergangScore(correctAnswers, givenAwnsers) {

    const entry = {
        name: sessionStorage.getItem("playerName"),
        correctAnswers: correctAnswers,
        givenAwnsers: givenAwnsers,
        score: givenAwnsers > 0
            ? (correctAnswers / givenAwnsers * 100).toFixed(1) + "%"
            : "0%",
        date: new Date().toLocaleDateString("de-DE")
    };

    let highscores =
        JSON.parse(localStorage.getItem("zehneruebergangScores")) || [];

    highscores.push(entry);

    localStorage.setItem(
        "zehneruebergangScores",
        JSON.stringify(highscores)
    );

}