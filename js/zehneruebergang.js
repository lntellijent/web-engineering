
const delay = (ms) => new Promise(
    resolve => setTimeout(resolve, ms)
); // Methode zur kontrollierten Programmverzögerung, analog zu Thread.sleep() in Java

/*
Wertekonstanten
 */
const popupdelayshort = 6000 // in Millisekunden
const popupdelaylong = 60000 // in Millisekunden
const streakVisibleAfterXCorrect = 5;

/*
wichtige HTML-Elemente
 */
const subtn = document.querySelector("#subtn"); // "Submit"-Button
const txt = document.querySelector("#userInput"); // Textarea als Zahleninput
const helpcorrect = document.querySelector("#helpcorrectfield"); // Feld für Hilfestellung bei Fehlern oder Rückmeldung für die Korrektheit

/*
Globale Arbeitsvariablen
 */
let popupvisible; // Interne Variable, die anzeigt, ob das popup sichtbar ist oder nicht.
let streak = 0; // Zähler der hintereinander korrekt gelösten Aufgaben
let generatedTask; // Enthält die zu berechnende Aufgabe

newTask(); // Befüllung von "generatedTask"

subtn.addEventListener("click", async event => {
    const input = parseInt(txt.value.trim()); // Inputkonvertierung zur Number um falsche Eingaben auszusortieren und schummeln vorzubeugen.
    if (typeof input === "number") { // Der Input muss vom Typ Number sein
        if (input === generatedTask.missing) { // Frage: Stimmt der Input mit dem fehlenden Wert überein?
            newTask(); // Aufgabe erfolgreich gelöst - neue Aufgabe erstellen
            if (++streak > streakVisibleAfterXCorrect) // Sofern genug Aufgaben hintereinander korrekt gelöst wurden, wird einem die Anzahl korrekter angezeigt.
                helpcorrect.innerHTML = `${streak} Korrekte Antworten. Klasse!`; // Ausgabe im DOM
            else
                helpcorrect.innerHTML = "Korrekt!"; // Ausgabe im DOM
            await popuphelpcorrect(popupdelayshort); // popup für festgelegte Zeiten anzeigen
        } else if(isNaN(input)) { // Input ist keine Nummer (parseInt returned "NaN")
            helpcorrect.innerHTML = "Eingabe ist keine gültige Nummer. Versuche erneut." // Statusausgabe
            await popuphelpcorrect(popupdelayshort); // popup für festgelegte Zeiten anzeigen
        } else { // Input ist eine Nummer, aber erfüllt die Gleichung nicht
            help(); // Hilfestellung
            await popuphelpcorrect(popupdelaylong); // popup für festgelegte Zeiten anzeigen
            streak = 0; // Streak zurücksetzen, da die Antwort inkorrekt ist.
        }
    }
})

document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") { // Submit on Enter
        subtn.click(); // Button wird virtuell gedrückt
    }
});

document.addEventListener("click", () => {
    txt.focus(); // Fokussierung des Textfensters, sobald geklickt wird, um es immer im Fokus zu halten
});

/**
 * Zeigt eine passende Hilfestellung zur derzeitigen Aufgabe an
 */
function help() {
    // isNaN-Check o.ä. redundant, da newTask keine Errors wirft.
    helpcorrect.innerHTML = `Inkorrekt! Versuche erneut.<br>Hilfestellung:<br><br>` // Statusausgabe

    const w = (generatedTask.leftOperand - (generatedTask.leftOperand%10)) / 10 // Zehnerstelle des linken Operanden
    const x = generatedTask.leftOperand%10 // Einerstelle des linken Operanden
    const y = (generatedTask.rightOperand - (generatedTask.rightOperand%10)) / 10 // Zehnerstelle des rechten Operanden
    const z = generatedTask.rightOperand%10 // Einerstelle des rechten Operanden

    switch (generatedTask.operation) { // Teilung der Operation
        case '+': // Addition
            const positiveCarry = 10-x // Wert, der den linken Operanden auf den nächsthöheren Zehner bringt
            helpcorrect.innerHTML += `Zehnerstelle: ${w}+${y}=${w+y} &rarr; ${(w+y)*10}<br>` // Berechnung der Zehnerstelle
            helpcorrect.innerHTML += `Auffüllen: ${x}+${positiveCarry}=10 &rarr; ${z}-${positiveCarry}=${z-positiveCarry}<br>` // Auffüllen + Berechnung der Einerstelle
            helpcorrect.innerHTML += `Addieren: ${(w+y)*10}+10+${z-positiveCarry}=?` // Kombination von Zehner- und Einerstelle
            break;
        case '-': // Subtraktion
            helpcorrect.innerHTML += `Zehnerstelle: ${w}-${y}=${w-y} &rarr; ${(w-y)*10}<br>` // Berechnung der Zehnerstelle
            helpcorrect.innerHTML += `10 Borgen: ${(w-y)*10}-10=${(w-y-1)*10}, 10+${x}=${x+10}&rarr; ${x+10}-${z}=${x-z+10}<br>` // Zehner borgen, Zehnerstelle anpassen + Einerstelle berechnen
            helpcorrect.innerHTML += `Subtrahieren: ${(w-y-1)*10}+${x-z+10}=?` // Kombination von Zehner- und Einerstelle
            break;
    }
}

/**
 * Zeigt für eine bestimmte Zeit lang das popupfeld im DOM
 * @param ms Wartet x Millisekunden
 * @returns {Promise<void>}
 */
async function popuphelpcorrect(ms) {
    if(popupvisible !== true)
        helpcorrect.classList.toggle("hidden"); // Hinweis wird sichtbar
    popupvisible = true
    await delay(ms); // Dauer, für die der Hinweis zu sehen ist
    popupvisible = false
    helpcorrect.classList.toggle("hidden"); // Hinweis wird versteckt
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

function createTask() {
    const operation = getRandomIntInclusive(0, 1); // Auswahl der Rechenoperation per (Pseudo-)Zufall
    let w, x, y, z; // Variablen für die einzelnen Stellen; wichtig für die Generationslogik von Zehnerübergängen
    let leftOperand, rightOperand, result; // Variablen für die linke und rechte Zahl, sowie das Ergebnis
    switch (operation) {
        // #ToDo "Hard Mode" Bei denen nicht (0,100), sondern (-100, 100) betrachtet wird
        case 0: // +
            w = getRandomIntInclusive(0,8); // Zehnerstelle des linken Operanden
            x = getRandomIntInclusive(1,9); // Einerstelle des linken Operanden
            y = getRandomIntInclusive(0,8-w); // Zehnerstelle des rechten Operanden
            z = getRandomIntInclusive(10-x,9); // Einerstelle des rechten Operanden

            leftOperand = w*10+x; // Zusammensetzung des linken Operanden
            rightOperand = y*10+z; // Zusammensetzung des rechten Operanden
            result = leftOperand + rightOperand // Berechnung des Ergebnisses zur Überprüfung
            break;
        case 1: // -
            w = getRandomIntInclusive(1,9); // Zehnerstelle des linken Operanden
            x = getRandomIntInclusive(0,8); // Einerstelle des linken Operanden
            y = getRandomIntInclusive(0,w-1); // Zehnerstelle des rechten Operanden
            z = getRandomIntInclusive(x+1,9); // Einerstelle des rechten Operanden

            leftOperand = w*10+x; // Zusammensetzung des linken Operanden
            rightOperand = y*10+z; // Zusammensetzung des rechten Operanden
            result = leftOperand - rightOperand // Berechnung des Ergebnisses zur Überprüfung
            break;
    }

    const blank = getRandomIntInclusive(0, 2) // Auswahl der fehlenden Zahl (Index) via Zufall
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

    console.log(generatedTask);
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