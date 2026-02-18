window.onload = function () {

    console.log("DRAGON RPG LOADED");

    const canvas = document.getElementById("game");

    if (!canvas) {
        alert("Canvas not found! Check your HTML id.");
        return;
    }

    const ctx = canvas.getContext("2d");

    canvas.width = 960;
    canvas.height = 540;

    ctx.fillStyle = "green";
    ctx.fillRect(200, 200, 200, 200);

};
