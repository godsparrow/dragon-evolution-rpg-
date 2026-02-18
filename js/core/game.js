// ======================================
// DRAGON EVOLUTION RPG - PHASE 2
// ======================================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ==============================
// CANVAS SETUP
// ==============================

canvas.width = 1280;
canvas.height = 720;

// Center the canvas
canvas.style.position = "absolute";
canvas.style.left = "50%";
canvas.style.top = "50%";
canvas.style.transform = "translate(-50%, -50%)";
canvas.style.border = "2px solid #1a1a1a";
canvas.style.boxShadow = "0 0 40px rgba(0,0,0,0.8)";

// ==============================
// WORLD SETTINGS
// ==============================

const WORLD_WIDTH = 5000;
const WORLD_HEIGHT = 5000;

let camera = {
    x: 0,
    y: 0
};

let keys = {};

// ==============================
// PLAYER
// ==============================

let player = {
    x: WORLD_WIDTH / 2,
    y: WORLD_HEIGHT / 2,
    speed: 4
};

// ==============================
// INPUT
// ==============================

document.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});

// ==============================
// UPDATE
// ==============================

function update() {

    if (keys["w"]) player.y -= player.speed;
    if (keys["s"]) player.y += player.speed;
    if (keys["a"]) player.x -= player.speed;
    if (keys["d"]) player.x += player.speed;

    // Clamp inside world
    player.x = Math.max(0, Math.min(WORLD_WIDTH, player.x));
    player.y = Math.max(0, Math.min(WORLD_HEIGHT, player.y));

    // Camera follow
    camera.x = player.x - canvas.width / 2;
    camera.y = player.y - canvas.height / 2;
}

// ==============================
// BACKGROUND
// ==============================

function drawBackground() {

    // Deep forest base
    ctx.fillStyle = "#0b1a10";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Soft vignette
    let gradient = ctx.createRadialGradient(
        canvas.width/2,
        canvas.height/2,
        100,
        canvas.width/2,
        canvas.height/2,
        800
    );

    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(1, "rgba(0,0,0,0.6)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0,0,canvas.width,canvas.height);
}

// ==============================
// WORLD GRID (Temporary)
// ==============================

function drawWorldGrid() {

    const gridSize = 128;
    ctx.strokeStyle = "#163622";

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

// ==============================
// DRAGON RENDERING
// ==============================

function drawPlayer() {

    const px = player.x - camera.x;
    const py = player.y - camera.y;

    const time = Date.now() * 0.003;
    const breathe = Math.sin(time) * 2;

    // Tail
    ctx.fillStyle = "#2f5d2f";
    ctx.beginPath();
    ctx.ellipse(px - 50, py + 5, 30, 12, -0.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#1d3d1d";
    ctx.beginPath();
    ctx.ellipse(px - 55, py + 8, 25, 8, -0.5, 0, Math.PI * 2);
    ctx.fill();

    // Wings (back)
    ctx.fillStyle = "#3c7a3c";
    ctx.beginPath();
    ctx.moveTo(px - 20, py - 20);
    ctx.lineTo(px - 60, py - 60 + breathe);
    ctx.lineTo(px - 10, py - 50);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(px + 20, py - 20);
    ctx.lineTo(px + 60, py - 60 + breathe);
    ctx.lineTo(px + 10, py - 50);
    ctx.closePath();
    ctx.fill();

    // Body
    ctx.fillStyle = "#4caf50";
    ctx.beginPath();
    ctx.ellipse(px, py + breathe, 45, 35, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#357a38";
    ctx.beginPath();
    ctx.ellipse(px, py + 10 + breathe, 45, 25, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = "#4caf50";
    ctx.beginPath();
    ctx.ellipse(px + 35, py - 15 + breathe, 28, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Snout
    ctx.fillStyle = "#66bb6a";
    ctx.beginPath();
    ctx.ellipse(px + 55, py - 10 + breathe, 15, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(px + 40, py - 20 + breathe, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(px + 42, py - 20 + breathe, 3, 0, Math.PI * 2);
    ctx.fill();

    // Horns
    ctx.fillStyle = "#e0e0e0";
    ctx.beginPath();
    ctx.moveTo(px + 30, py - 30 + breathe);
    ctx.lineTo(px + 25, py - 50 + breathe);
    ctx.lineTo(px + 35, py - 35 + breathe);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(px + 45, py - 28 + breathe);
    ctx.lineTo(px + 50, py - 48 + breathe);
    ctx.lineTo(px + 40, py - 35 + breathe);
    ctx.fill();

    // Claws
    ctx.fillStyle = "#2f5d2f";
    ctx.beginPath();
    ctx.ellipse(px - 15, py + 30 + breathe, 15, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(px + 15, py + 30 + breathe, 15, 8, 0, 0, Math.PI * 2);
    ctx.fill();
}

// ==============================
// RENDER
// ==============================

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawWorldGrid();
    drawPlayer();
}

// ==============================
// GAME LOOP
// ==============================

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

gameLoop();
