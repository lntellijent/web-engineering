
const delay = (ms) => new Promise(
    resolve => setTimeout(resolve, ms)
);
const popupdelay = 3000 // in Millisekunden

let generatedTask;
newTask(); // Befüllung von "generatedTask"

const subtn = document.querySelector("#subtn"); // "Submit"-Button
const txt = document.querySelector("#userInput"); // Textarea als Zahleninput
const helpcorrect = document.querySelector("#helpcorrectfield"); // Feld für Hilfestellung bei Fehlern oder Rückmeldung für die Korrektheit

subtn.addEventListener("click", async event => {
    const input = parseInt(txt.value.trim()); // Inputkonvertierung nach
    if (typeof input === "number") { // Der Input muss eine Nummer sein
        if (input === generatedTask.missing) { // Frage: Stimmt der Input mit dem fehlenden Wert überein?
            newTask(); // Aufgabe erfolgreich gelöst - neue Aufgabe erstellen
            helpcorrect.innerHTML = "Korrekt!" // Ausgabe im DOM
            await popuphelpcorrect(popupdelay);
        } else  if(isNaN(input)) { // Input ist keine Nummer (parseInt returned "NaN")
            helpcorrect.innerHTML = "Eingabe ist keine gültige Nummer. Versuche erneut." // Statusausgabe
            await popuphelpcorrect(popupdelay);
        } else { // Input ist eine Nummer,
            helpcorrect.innerHTML = "Inkorrekt! Versuche erneut." // Statusausgabe
            await popuphelpcorrect(popupdelay);
            // #ToDo Hilfestellung
        }
    }
})

async function popuphelpcorrect(ms) {
    helpcorrect.classList.toggle("hidden"); // Hinweis wird sichtbar
    await delay(ms); // Dauer, für die der Hinweis zu sehen ist
    helpcorrect.classList.toggle("hidden"); // Hinweis wird versteckt
}

function manipulate(div, content) { // Füllt das übergebene div mit Inhalt
    const list = document.querySelector(div); // Lokalisierung des divs
    list.innerHTML += `<p>` + content + `</p>` // Inhalt des divs bearbeiten
}

function clear(div) { // Leert das übergebene div
    const list = document.querySelector(div); // Lokalisierung des divs
    list.innerHTML = ""; // Inhalt des divs bearbeiten
}

function createTask(negativeEnabled) {
    const operation = 0; // getRandomIntInclusive(0, 1); // Auswahl der Rechenoperation per (Pseudo-)Zufall
    let leftOperand, rightOperand, result // Variablen für die linke und rechte Zahl, sowie das Ergebnis
    switch (operation) {
        case 0: // +
            leftOperand = getRandomIntInclusive(1, 89)
            /*
            Linke Nummer:
            Minimum 1, da 0 + a = a (hinfällig)
            Maximum 89, da es die letzte Zahl ist, die einen Zehnerübergang haben kann
             */
            const minimumRightValue = 10 - (leftOperand % 10);
            /*
            Um einen Zehnerübergang zu erzeugen, müssen die Einerstellen beider Zahlen mindestens auf 10 addieren.
            Das wird durch das Subtrahieren der Einerstelle von 10 erreicht.
             */
            rightOperand = getRandomIntInclusive(1 + minimumRightValue, 100 - leftOperand)
            /*
            Rechte Nummer:
            Minimum oben berechnet
            Maximum sollte 100 nicht überschreiten, die maximale Zahl, die auf die Linke addiert werden darf,
             ist also die Subtraktion der linken Zahl von 100.
             */
            result = leftOperand + rightOperand
            break;
        case 1: // -
            // #ToDo Überarbeiten der Logik, sodass immer ein Zehnerübergang stattfindet und es einstellbar ist, ob das Ergebnis negativ werden kann oder nicht.
            leftOperand = getRandomIntInclusive(10, 100) // create the left number
            rightOperand = getRandomIntInclusive(10, 100 - leftOperand) // create the right number - limit it to 100
            result = leftOperand - rightOperand
            break;
    }

    const blank = 2; // getRandomIntInclusive(0, 2) // Auswahl der fehlenden Zahl (Index) via Zufall
    let missing; // Enthält den Wert der fehlenden Zahl
    switch (blank) {
        case 0: // linke Zahl fehlt
            missing = leftOperand; // Wert wird für das Ergebnis zwischengespeichert
            leftOperand = "?" // Wert wird mit einem Platzhalter besetzt
            break;
        case 1: // rechte Zahl fehlt
            missing = rightOperand; // Wert wird für das Ergebnis zwischengespeichert
            rightOperand = "?" // Wert wird mit einem Platzhalter besetzt
            break;
        case 2: // Ergebnis fehlt
            missing = result; // Wert wird für das Ergebnis zwischengespeichert
            result = "?" // Wert wird mit einem Platzhalter besetzt
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
}

function getRandomIntInclusive(min, max) { //
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}