window.onload = function () {

  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  const keys = {};

  document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
  document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

  const dragon = new Image();
  dragon.src = "assets/sprites/player/hatchling/dragon.png";

  let FRAME_WIDTH;
  let FRAME_HEIGHT;

  const COLUMNS = 4;
  const ROWS = 8;

  const FRAME_SPEED = 10;

  let frameIndex = 0;
  let frameCounter = 0;

  const player = {
    x: 0,
    y: 0,
    speed: 4,
    direction: "down",
    moving: false,
    scale: 0.5 // adjust size on screen
  };

  const camera = {
    x: 0,
    y: 0
  };

  dragon.onload = function () {

    FRAME_WIDTH = (dragon.width / COLUMNS);
    FRAME_HEIGHT = (dragon.height / ROWS);

    gameLoop();
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

    if (player.moving) {
      frameCounter++;
      if (frameCounter >= FRAME_SPEED) {
        frameCounter = 0;
        frameIndex = (frameIndex + 1) % COLUMNS;
      }
    } else {
      frameIndex = 0;
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

    const drawWidth = FRAME_WIDTH * player.scale;
    const drawHeight = FRAME_HEIGHT * player.scale;

    ctx.drawImage(
      dragon,
      frameIndex * FRAME_WIDTH,
      row * FRAME_HEIGHT,
      FRAME_WIDTH,
      FRAME_HEIGHT,
      screenX - drawWidth / 2,
      screenY - drawHeight / 2,
      drawWidth,
      drawHeight
    );
  }

  function gameLoop() {
    update();
    drawBackground();
    drawPlayer();
    requestAnimationFrame(gameLoop);
  }

};
