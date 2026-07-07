function confirmName() {
    const username = document.getElementById("username").value;

    if (username.trim() === "") {
        document.querySelector("#showError").textContent = "Gebe einen gültigen Namen ein!"
        return;
    }

    localStorage.setItem("playerName", username);

    confirmReady(username)
    
}

function confirmReady(username) {
    document.getElementById("welcomeText").textContent =
        `Hallo ${username}, was willst du spielen?`;
    
        show("#popup")
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