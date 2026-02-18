// ===============================
// DRAGON EVOLUTION RPG - CORE
// ===============================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 1280;
canvas.height = 720;

// World Size (large for scrolling)
const WORLD_WIDTH = 5000;
const WORLD_HEIGHT = 5000;

// Camera
let camera = {
    x: 0,
    y: 0
};

// Basic Player Placeholder (we replace soon)
let player = {
    x: 2500,
    y: 2500,
    size: 40,
    speed: 4
};

let keys = {};

// ================= INPUT =================

document.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});

// ================= UPDATE =================

function update() {

    if (keys["w"]) player.y -= player.speed;
    if (keys["s"]) player.y += player.speed;
    if (keys["a"]) player.x -= player.speed;
    if (keys["d"]) player.x += player.speed;

    // Camera follows player
    camera.x = player.x - canvas.width / 2;
    camera.y = player.y - canvas.height / 2;
}

// ================= RENDER =================

function drawBackground() {
    ctx.fillStyle = "#0e1a12";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawWorldGrid() {
    const gridSize = 128;

    ctx.strokeStyle = "#1f3b2a";

    for (let x = 0; x < WORLD_WIDTH; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x - camera.x, -camera.y);
        ctx.lineTo(x - camera.x, WORLD_HEIGHT - camera.y);
        ctx.stroke();
    }

    for (let y = 0; y < WORLD_HEIGHT; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(-camera.x, y - camera.y);
        ctx.lineTo(WORLD_WIDTH - camera.x, y - camera.y);
        ctx.stroke();
    }
}

function drawPlayer() {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(
        player.x - camera.x,
        player.y - camera.y,
        player.size,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    drawWorldGrid();
    drawPlayer();
}

// ================= GAME LOOP =================

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

gameLoop();
