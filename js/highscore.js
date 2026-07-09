const playerName = localStorage.getItem("playerName");

function showHighscores() {
    const highscores =
    JSON.parse(localStorage.getItem("zehneruebergangScores")) || []; // elemente laden


    const table =
            document.getElementById("zehnerTable");

        highscores.forEach((player, index) => {

            const row = table.insertRow();

            row.insertCell().textContent = index + 1;
            row.insertCell().textContent = player.name;
            row.insertCell().textContent = player.correctAnswers;
            row.insertCell().textContent = player.date;

        });
}

function saveZehneruebergangScore(correctAnswers) {

    const entry = {
        name: localStorage.getItem("playerName"),
        correctAnswers: correctAnswers,
        date: new Date().toLocaleDateString("de-DE")
    };

    let highscores =
        JSON.parse(localStorage.getItem("zehneruebergangScores")) || [];

    highscores.push(entry);

    highscores.sort((a, b) => a.correctAnswers - b.correctAnswers);

    localStorage.setItem(
        "zehneruebergangScores",
        JSON.stringify(highscores)
    );
}

function saveMillionaerScore(maxMoney) {

    const entry = {
        name: localStorage.getItem("playerName"),
        maxMoney: maxMoney,
        date: new Date().toLocaleDateString("de-DE")
    };

    let highscores =
        JSON.parse(localStorage.getItem("millionaerScores")) || [];

    highscores.push(entry);

    localStorage.setItem(
        "millionaerScores",
        JSON.stringify(highscores)
    );
}