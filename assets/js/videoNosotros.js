document.addEventListener("DOMContentLoaded", function () {
    

    let button = document.getElementById("muteButton");
    let video = document.getElementById("video2");

    if (!button || !video) {
        console.error("no se encuentra los id");
        return;
    }

    console.log("se encontro el video y boton");

    button.addEventListener("click", function () {
        console.log("ingresa el click");

        video.muted = !video.muted;

        button.textContent = video.muted ? "🔇" : "🔊";
    });
});