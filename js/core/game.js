window.onload = function () {

    console.log("DRAGON RPG ENGINE STARTED");

    const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");

    canvas.width = 960;
    canvas.height = 540;

    // ======================
    // INPUT
    // ======================
    let keys = {};
    document.addEventListener("keydown", e => keys[e.key] = true);
    document.addEventListener("keyup", e => keys[e.key] = false);

    // ======================
    // CAMERA
    // ======================
    const camera = { x: 0, y: 0 };

    // ======================
    // PLAYER (BABY DRAGON)
    // ======================
    const player = {
        x: 0,
        y: 0,
        speed: 3,
        size: 40,
        shootCooldown: 0
    };

    // ======================
    // ENEMIES
    // ======================
    const enemies = [];
    function spawnEnemy(x, y) {
        enemies.push({
            x,
            y,
            size: 40,
            hp: 40
        });
    }

    for (let i = 0; i < 6; i++) {
        spawnEnemy(Math.random() * 1200 - 600, Math.random() * 1200 - 600);
    }

    // ======================
    // PROJECTILES
    // ======================
    const projectiles = [];

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
        const len = Math.hypot(dx, dy);

        projectiles.push({
            x: player.x,
            y: player.y,
            vx: (dx / len) * 6,
            vy: (dy / len) * 6,
            size: 6
        });

        player.shootCooldown = 25;
    }

    // ======================
    // UPDATE
    // ======================
    function update() {

        if (keys["w"]) player.y -= player.speed;
        if (keys["s"]) player.y += player.speed;
        if (keys["a"]) player.x -= player.speed;
        if (keys["d"]) player.x += player.speed;

        camera.x = player.x - canvas.width / 2;
        camera.y = player.y - canvas.height / 2;

        if (player.shootCooldown > 0) player.shootCooldown--;
        autoShoot();

        projectiles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
        });

        // Collision
        projectiles.forEach(p => {
            enemies.forEach(e => {
                const dx = e.x - p.x;
                const dy = e.y - p.y;
                if (Math.hypot(dx, dy) < 25) {
                    e.hp -= 10;
                    p.hit = true;
                }
            });
        });

        // Remove hit projectiles
        for (let i = projectiles.length - 1; i >= 0; i--) {
            if (projectiles[i].hit) {
                projectiles.splice(i, 1);
            }
        }

        // Remove dead enemies
        for (let i = enemies.length - 1; i >= 0; i--) {
            if (enemies[i].hp <= 0) {
                enemies.splice(i, 1);
            }
        }
    }

    // ======================
    // DRAW BACKGROUND
    // ======================
    function drawBackground() {
        ctx.fillStyle = "#0c1626";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const grid = 64;
        ctx.strokeStyle = "#162338";

        for (let x = -camera.x % grid; x < canvas.width; x += grid) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }

        for (let y = -camera.y % grid; y < canvas.height; y += grid) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }

    // ======================
    // DRAW DRAGON
    // ======================
    function drawPlayer() {
        ctx.save();
        ctx.translate(player.x - camera.x, player.y - camera.y);

        ctx.fillStyle = "#3bd16f";
        ctx.fillRect(-20, -20, 40, 40);

        ctx.fillStyle = "#2fa85a";
        ctx.fillRect(-30, -10, 10, 20);
        ctx.fillRect(20, -10, 10, 20);

        ctx.fillStyle = "white";
        ctx.fillRect(-8, -6, 6, 6);
        ctx.fillRect(2, -6, 6, 6);

        ctx.fillStyle = "black";
        ctx.fillRect(-6, -4, 3, 3);
        ctx.fillRect(4, -4, 3, 3);

        ctx.restore();
    }

    // ======================
    // DRAW ENEMIES
    // ======================
    function drawEnemies() {
        enemies.forEach(e => {
            ctx.save();
            ctx.translate(e.x - camera.x, e.y - camera.y);

            ctx.fillStyle = "#8b1e1e";
            ctx.fillRect(-20, -20, 40, 40);

            ctx.fillStyle = "#d62828";
            ctx.fillRect(-12, -12, 24, 24);

            ctx.restore();
        });
    }

    // ======================
    // DRAW PROJECTILES
    // ======================
    function drawProjectiles() {
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

    // ======================
    // GAME LOOP
    // ======================
    function gameLoop() {
        update();
        drawBackground();
        drawPlayer();
        drawEnemies();
        drawProjectiles();
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
};
