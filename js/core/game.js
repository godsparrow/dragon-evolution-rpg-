window.onload = function () {

  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  const keys = {};

  document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
  document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

  // ===== SPRITE LOAD =====
  const dragon = new Image();
  dragon.src = "assets/sprites/player/hatchling/dragon.png";

  const FRAME_SIZE = 64;
  const FRAMES_PER_ANIMATION = 4;
  const FRAME_SPEED = 10; // lower = faster animation

  let frameIndex = 0;
  let frameCounter = 0;

  const player = {
    x: 0,
    y: 0,
    speed: 4,
    direction: "down",
    moving: false
  };

  const camera = {
    x: 0,
    y: 0
  };

  function update() {

    player.moving = false;

    if (keys["w"]) {
      player.y -= player.speed;
      player.direction = "up";
      player.moving = true;
    }
    if (keys["s"]) {
      player.y += player.speed;
      player.direction = "down";
      player.moving = true;
    }
    if (keys["a"]) {
      player.x -= player.speed;
      player.direction = "left";
      player.moving = true;
    }
    if (keys["d"]) {
      player.x += player.speed;
      player.direction = "right";
      player.moving = true;
    }

    camera.x = player.x - canvas.width / 2;
    camera.y = player.y - canvas.height / 2;

    // animation timing
    if (player.moving) {
      frameCounter++;
      if (frameCounter >= FRAME_SPEED) {
        frameCounter = 0;
        frameIndex++;
        if (frameIndex >= FRAMES_PER_ANIMATION) {
          frameIndex = 0;
        }
      }
    } else {
      frameIndex = 0; // idle = first frame
    }

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

  function getRow() {

    // row layout:
    // 0 down idle
    // 1 down walk
    // 2 left idle
    // 3 left walk
    // 4 right idle
    // 5 right walk
    // 6 up idle
    // 7 up walk

    switch (player.direction) {
      case "down": return player.moving ? 1 : 0;
      case "left": return player.moving ? 3 : 2;
      case "right": return player.moving ? 5 : 4;
      case "up": return player.moving ? 7 : 6;
    }
  }

  function drawPlayer() {

    const screenX = player.x - camera.x;
    const screenY = player.y - camera.y;

    const row = getRow();

    ctx.drawImage(
      dragon,
      frameIndex * FRAME_SIZE,
      row * FRAME_SIZE,
      FRAME_SIZE,
      FRAME_SIZE,
      screenX - FRAME_SIZE / 2,
      screenY - FRAME_SIZE / 2,
      FRAME_SIZE,
      FRAME_SIZE
    );

  }

  function gameLoop() {
    update();
    drawBackground();
    drawPlayer();
    requestAnimationFrame(gameLoop);
  }

  dragon.onload = function () {
    gameLoop();
  };

};
