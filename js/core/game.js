// ===== DRAGON HATCHLING RPG - CORE =====
console.log("DRAGON RPG LOADED");

// ===== CANVAS SETUP =====
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 960;
canvas.height = 540;

// ===== GAME STATE =====
let camera = { x: 0, y: 0 };

let keys = {};

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// ===== PLAYER (BABY DRAGON) =====
const player = {
    x: 0,
    y: 0,
    size: 64,
    speed: 3,
    hp: 100,
    maxHp: 100,
    shootCooldown: 0
};

// ===== ENEMIES =====
let enemies = [];

function spawnEnemy(x, y) {
    enemies.push({
        x,
        y,
        size: 60,
        hp: 40,
        maxHp: 40
    });
}

// Spawn some enemies
for (let i = 0; i < 6; i++) {
    spawnEnemy(Math.random() * 1200 - 600, Math.random() * 1200 - 600);
}

// ===== PROJECTILES =====
let projectiles = [];

// ===== BACKGROUND GRID =====
function drawBackground() {
    ctx.fillStyle = "#0c1626";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const gridSize = 64;

    ctx.strokeStyle = "#162338";
    ctx.lineWidth = 1;

    for (let x = -camera.x % gridSize; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    for (let y = -camera.y % gridSize; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// ===== DRAW DRAGON =====
function drawDragon(x, y) {
    ctx.save();
    ctx.translate(x, y);

    // Body
    ctx.fillStyle = "#3bd16f";
    ctx.fillRect(-20, -20, 40, 40);

    // Wings
    ctx.fillStyle = "#2a9d58";
    ctx.fillRect(-35, -15, 15, 30);
    ctx.fillRect(20, -15, 15, 30);

    // Eyes
    ctx.fillStyle = "white";
    ctx.fillRect(-10, -8, 8, 8);
    ctx.fillRect(2, -8, 8, 8);

    ctx.fillStyle = "black";
    ctx.fillRect(-8, -6, 4, 4);
    ctx.fillRect(4, -6, 4, 4);

    ctx.restore();
}

// ===== DRAW MONSTER =====
function drawMonster(enemy) {
    ctx.save();
    ctx.translate(enemy.x - camera.x, enemy.y - camera.y);

    ctx.fillStyle = "#8b1e1e";
    ctx.fillRect(-25, -25, 50, 50);

    ctx.fillStyle = "#d62828";
    ctx.fillRect(-15, -15, 30, 30);

    ctx.restore();
}

// ===== AUTO AIM =====
function autoShoot() {
    if (player.shootCooldown > 0) return;

    if (enemies.length === 0) return;

    let closest = null;
    let closestDist = Infinity;

    enemies.forEach(e => {
        const dx = e.x - player.x;
        const dy = e.y - player.y;
        const dist = Math.hypot(dx, dy);

        if (dist < closestDist) {
            closestDist = dist;
            closest = e;
        }
    });

    if (!closest) return;

    const dx = closest.x - player.x;
    const dy = closest.y - player.y;
    const length = Math.hypot(dx, dy);

    projectiles.push({
        x: player.x,
        y: player.y,
        vx: (dx / length) * 6,
        vy: (dy / length) * 6,
        size: 8
    });

    player.shootCooldown = 30;
}

// ===== UPDATE =====
function update() {

    // Movement
    if (keys["w"]) player.y -= player.speed;
    if (keys["s"]) player.y += player.speed;
    if (keys["a"]) player.x -= player.speed;
    if (keys["d"]) player.x += player.speed;

    camera.x = player.x - canvas.width / 2;
    camera.y = player.y - canvas.height / 2;

    // Shooting
    if (player.shootCooldown > 0) player.shootCooldown--;
    autoShoot();

    // Update projectiles
    projectiles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
    });

    // Projectile collisions
    projectiles.forEach(p => {
        enemies.forEach(e => {
            const dx = e.x - p.x;
            const dy = e.y - p.y;
            if (Math.hypot(dx, dy) < 30) {
                e.hp -= 10;
                p.hit = true;
            }
        });
    });

    projectiles = projectiles.filter(p => !p.hit);

    enemies = enemies.filter(e => e.hp > 0);
}

// ===== DRAW =====
function draw() {
    drawBackground();

    drawDragon(
        player.x - camera.x,
        player.y - camera.y
    );

    enemies.forEach(drawMonster);

    // Projectiles
    ctx.fillStyle = "#ffd166";
    projectiles.forEach(p => {
        ctx.beginPath();
        ctx.arc(
            p.x - camera.x,
            p.y - camera.y,
            p.size,
            0,
            Math.PI * 2
        );
        ctx.fill();
    });
}

// ===== GAME LOOP =====
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
