window.onload = function () {

  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  const keys = {};

  document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
  document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

  const player = {
    x: 0,
    y: 0,
    size: 40,
    speed: 4,
    facing: 1 // 1 = right, -1 = left
  };

  const camera = {
    x: 0,
    y: 0
  };

  function update() {

    if (keys["w"]) player.y -= player.speed;
    if (keys["s"]) player.y += player.speed;
    if (keys["a"]) {
      player.x -= player.speed;
      player.facing = -1;
    }
    if (keys["d"]) {
      player.x += player.speed;
      player.facing = 1;
    }

    // center camera on player
    camera.x = player.x - canvas.width / 2;
    camera.y = player.y - canvas.height / 2;

  }

  function drawBackground() {

    ctx.fillStyle = "#0c1626";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const gridSize = 64;
    ctx.strokeStyle = "#162338";

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

  function drawPlayer() {

    const screenX = player.x - camera.x;
    const screenY = player.y - camera.y;
    const size = player.size;

    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.scale(player.facing, 1);

    // body
    ctx.fillStyle = "#3bd16f";
    ctx.fillRect(-size/2, -size/2, size, size * 0.7);

    // head
    ctx.fillStyle = "#2bb85c";
    ctx.fillRect(size/4, -size/2 - 10, size/2, size/2);

    // eye
    ctx.fillStyle = "black";
    ctx.fillRect(size/2, -size/2 - 5, 5, 5);

    // wing
    ctx.fillStyle = "#24994d";
    ctx.beginPath();
    ctx.moveTo(-size/2, -size/4);
    ctx.lineTo(-size, -size/2);
    ctx.lineTo(-size/2, size/4);
    ctx.fill();

    // tail
    ctx.fillStyle = "#2bb85c";
    ctx.beginPath();
    ctx.moveTo(-size/2, size/4);
    ctx.lineTo(-size, size/2);
    ctx.lineTo(-size/2, size/2);
    ctx.fill();

    ctx.restore();
  }

  function gameLoop() {
    update();
    drawBackground();
    drawPlayer();
    requestAnimationFrame(gameLoop);
  }

  gameLoop();
};
