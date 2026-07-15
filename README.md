# web-engineering-Projekt Nico Tribusser und Justin Hörz

Ein Mathe-Spiel für Grundschühler um das Kopfrechnen spielerisch zu üben.

## Enthaltene Modi:

# Zehnerübergang Trainer
Funktionen:
- Addition mit Zehnerübergang
- Subtraktion mit Zehnerübergang
- Zeitlimit
- Zeitbonus für richtige Antworten
- Zeitabzug bei falschen Aufgaben
- Hilfestellungen bei Fehlern
- Lokale Highscore-Speicherung

Es gibt ein Zeitlimit von 2min, Ziel ist es so viele Aufgaben wie möglich in dieser Zeit zu lösen, überspringen wird mit einem Zeitabzug bestraft


### Mathe-Millionär
Quizspiel nach dem Prinzip von „Wer wird Millionär?“.

Funktionen:
- Multiple-Choice-Fragen
- Vier Antwortmöglichkeiten
- Joker-System
- Speicherung des erreichten Geldbetrags

Es gibt eine Aufgabe und 4 Lösungsmöglichkeiten, Ziel ist es die 1.000.000€ zu erreichen. Man erreicht einen aufstieg zur nächsten stufe durch anklicken der richtigen Lösung. Eine falsche Antwort führt direkt zum Ende der Runde. Alle Joker sind einmal pro Spiel anwendbar, die schwierigkeit erhöht sich, desto höher die Stufe des Spielers ist.



## Spielstart

1. Projekt herunterladen oder klonen.
2. "main.html" im Browser öffnen

Alternativ kann ein lokaler Webserver verwendet werden

## Technologien 
- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Local Storage
- Session Storage 

## Highscores 
Alle Highscores werden lokal im Browser gespeichert. 

### Zehnerübergang Trainer 
Gespeicherte Daten: 
- Spielername
- Anzahl korrekter Antworten
- Anzahl gegebener Antworten
- Trefferquote
- Datum 

### Mathe-Millionär 
Gespeicherte Daten: 
- Spielername
- Höchster Geldbetrag
- Datum 

## Projektstruktur 

/
├── html/
|   ├── highscore.html
│   ├── main.html
│   ├── millionaire.html
│   └── zehneruebergang.html
├── html/
|   ├── zehneruebergang.css
│   ├── millionaer.css
│   ├── zehneruebergangMobile.css
│   ├── color.css
│   ├── highscores.css
│   └── main.css
├── js/
│   ├── zehneruebergang.js
│   ├── millionaer.js
│   ├── highscores.js
│   └── main.js
└── README.md


## Autoren

- Nico Tribusser
- Justin Hörz