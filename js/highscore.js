const playerName = sessionStorage.getItem("playerName");

function parseMoney(value) {
    // "1.000 €" -> 1000, "500.000 €" -> 500000
    return Number(
        value
            .replace(/[^0-9,.-]/g, "") // alles außer Zahlen, Punkt, Komma entfernen
            .replace(/\./g, "")        // Tausenderpunkte entfernen
            .replace(",", ".")         // falls Komma als Dezimaltrenner vorkommt
    );
}

function showMillionaerHighscores() {

    const highscores =
        JSON.parse(localStorage.getItem("millionaerScores")) || [];

    // absteigend nach maxMoney sortieren (höchster Gewinn zuerst)
    highscores.sort((a, b) => parseMoney(b.maxMoney) - parseMoney(a.maxMoney));

    const table = document.getElementById("millionaerTable");

    highscores.forEach((player, index) => {

        const row = table.insertRow();

        row.insertCell().textContent = index + 1;
        row.insertCell().textContent = player.name;
        row.insertCell().textContent = player.maxMoney;
        row.insertCell().textContent = player.date;

    });

}

showMillionaerHighscores();