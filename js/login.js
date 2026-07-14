const username = document.querySelector("#username");
const startButton = document.querySelector("#startButton");
const welcomeTextField = document.querySelector("#welcomeText");
const errorTextField = document.querySelector("#showError");

document.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", (event) => {
        switch (event.target.id) {
            case "startButton":
                confirmName();
                break;

            case "millionareButton":
                startGame('millionare.html');
                break;

            case "zehneruebergangButton":
                startGame('zehneruebergang.html')
                break;

            case "highscoreButton":
                startGame('highscore.html')
                break;

            default:
                console.log("Unbekannter Button");
        }
    });
});

if (sessionStorage.getItem("playerName")) {
    show("#gameselection")
    hide("#nameinput")
    showWelcomeMessage()
} else {
    show("#nameinput")
    hide("#gameselection")
    
    document.addEventListener("click", () => {
        username.focus();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            startButton.click();
        }
    });
    username.focus();
}

function confirmName() {
    const regex = /^[\p{L}\p{N}]{1,20}$/u;

    if (!regex.test(username.value.trim())) {
        errorTextField.textContent = "Gebe einen gültigen Namen ein!"
        return;
    }

    sessionStorage.setItem("playerName", username.value.trim());

    show("#gameselection")
    hide("#nameinput")

    showWelcomeMessage()
}


function showWelcomeMessage() {
    welcomeTextField.textContent =
        `Hallo ${sessionStorage.getItem("playerName")}, was willst du spielen?`;
}

function startGame(page) {
    window.location.href = page;
}

function hide(identifier) {
    document.querySelector(identifier).classList.add("hidden");
}

function show(identifier) {
    document.querySelector(identifier).classList.remove("hidden");
}