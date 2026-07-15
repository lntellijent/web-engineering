

function initLoginPage() {

    const username = document.querySelector("#username");

    if (!username) {
        return;
    }

    const startButton = document.querySelector("#startButton");
    const welcomeTextField = document.querySelector("#welcomeText");
    const errorTextField = document.querySelector("#showError");

    document.querySelectorAll("button").forEach(button => {
        button.addEventListener("click", (event) => {
            switch (event.target.id) {
                case "startButton":
                    confirmName(username, errorTextField, welcomeTextField);
                    break;

                case "millionareButton":
                    navigatePages('millionare.html');
                    break;

                case "zehneruebergangButton":
                    navigatePages('html/zehneruebergang.html')
                    break;

                case "highscoreButton":
                    navigatePages('highscore.html')
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
        username.focus();

        document.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                startButton.click();
            }
        });

        // Sicherheitshalber ungewolltes Verhalten abfangen
        document.querySelector("#loginform")
            .addEventListener("submit", (event) => {
                event.preventDefault();
            });
    }
}

function confirmName(username, errorTextField, welcomeTextField) {
    const regex = /^[\p{L}\p{N}]{1,20}$/u;

    if (!regex.test(username.value.trim())) {
        errorTextField.textContent = "Gebe einen gültigen Namen ein!"
    } else {
        sessionStorage.setItem("playerName", username.value.trim());

        show("#gameselection");
        hide("#nameinput");

        showWelcomeMessage(welcomeTextField);
    }
}


function showWelcomeMessage(welcomeTextField) {
    welcomeTextField.textContent =
        `Hallo ${sessionStorage.getItem("playerName")}, was willst du spielen?`;
}

function navigatePages(page) {
    window.location.href = page;
}

function hide(identifier) {
    const element = document.querySelector(identifier);

    if (element) {
        element.classList.add("hidden");
    }
}

function show(identifier) {
    const element = document.querySelector(identifier);

    if (element) {
        element.classList.remove("hidden");
    }
}