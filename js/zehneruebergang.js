
const delay = (ms) => new Promise(
    resolve => setTimeout(resolve, ms)
);
const popupdelayshort = 3000 // in Millisekunden
const popupdelaylong = 10000 // in Millisekunden

let generatedTask;
let popupvisible;
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
            await popuphelpcorrect(popupdelayshort);
        } else  if(isNaN(input)) { // Input ist keine Nummer (parseInt returned "NaN")
            helpcorrect.innerHTML = "Eingabe ist keine gültige Nummer. Versuche erneut." // Statusausgabe
            await popuphelpcorrect(popupdelayshort);
        } else { // Input ist eine Nummer, aber erfüllt die Gleichung nicht
            help();
            await popuphelpcorrect(popupdelaylong);
        }
    }
})

function help() {
    helpcorrect.innerHTML = `Inkorrekt! Versuche erneut.<br>Hilfestellung:<br><br>` // Statusausgabe

    const w = (generatedTask.leftOperand - (generatedTask.leftOperand%10)) / 10
    const x = generatedTask.leftOperand%10
    const y = (generatedTask.rightOperand - (generatedTask.rightOperand%10)) / 10
    const z = generatedTask.rightOperand%10
    const positiveCarry = 10-x

    switch (generatedTask.operation) {
        case '+':
            helpcorrect.innerHTML += `Zehnerstelle: ${w}+${y}=${w+y} &rarr; ${(w+y)*10}<br>`
            helpcorrect.innerHTML += `Auffüllen: ${x}+${positiveCarry}=10 &rarr; ${z}-${positiveCarry}=${z-positiveCarry}<br>`
            helpcorrect.innerHTML += `Addieren: ${(w+y)*10}+10+${z-positiveCarry}=?`
            break;
        case '-':
            // #ToDo entsprechende Hilfestellungen auch für Subtraktion implementieren
            break;
    }
}

async function popuphelpcorrect(ms) {
    if(popupvisible !== true)
        helpcorrect.classList.toggle("hidden"); // Hinweis wird sichtbar
    popupvisible = true
    await delay(ms); // Dauer, für die der Hinweis zu sehen ist
    popupvisible = false
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
    let w, x, y, z; // Variablen für die linke und rechte Zahl, sowie das Ergebnis
    let leftOperand, rightOperand, result;
    switch (operation) {
        // #ToDo "Hard Mode" Bei denen nicht (0,100), sondern (-100, 100) betrachtet wird
        case 0: // +
            w = getRandomIntInclusive(0,8);
            x = getRandomIntInclusive(1,9);
            y = getRandomIntInclusive(0,8-w);
            z = getRandomIntInclusive(10-x,9);

            leftOperand = w*10+x;
            rightOperand = y*10+z;
            result = leftOperand + rightOperand // Berechnung des Ergebnisses zur Überprüfung
            break;
        case 1: // -
            // #ToDo Überarbeitung wie bei Addition
            leftOperand = getRandomIntInclusive(10, 100)
            /*
            linke Nummer:
            Minimum 10, da sonst kein Zehnerübergang stattfinden kann
            Maximum 100, da subtrahiert und nicht addiert wird
             */
            const minimumRightValueSub = (leftOperand % 10) + 1;
            /*
            Um einen Zehnerübergang zu erzeugen, muss das rechte Argument größer als die Einerstelle des linken Arguments sein.
             */
            rightOperand = getRandomIntInclusive(minimumRightValueSub, leftOperand - 1)
            /*
            rechte Nummer:
            Minimum 1, Subtraktion mit 0 ist hier trivial
            Maximum linke Nummer minus 1: Subtraktion von sich selbst ist hier trivial, Subtraktion mit größerem rechten Argument wird negativ
             */
            result = leftOperand - rightOperand // Berechnung des Ergebnisses zur Überprüfung
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