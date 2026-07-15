const routes = {
    "/": "/html/main.html",
    "/zehneruebergang": "html/zehneruebergang.html",
};


async function loadPage(page) {
    const response = await fetch(page);
    const html = await response.text();

    document.getElementById("content").innerHTML = html;

    switch (page) {
        case "html/main.html":
            initLoginPage();
            break;
        case "html/zehneruebergang.html":
            initializeZehneruebergang();
            break;
    }
}


async function navigate(path) {
    const page = routes[path];

    if (!page) {
        return;
    }

    history.pushState({}, "", path);
    await loadPage(page);
}

window.navigate = navigate;


document.addEventListener("DOMContentLoaded", () => {
    loadPage("html/main.html")
});
