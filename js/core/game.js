window.onload = function () {

  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  const keys = {};

  document.addEventListener("keydown", e => keys[e.key] = true);
  document.addEventListener("keyup", e => keys[e.key] = false);

  // world position
  const player = {
    x: 0,
    y: 0,
    size: 40,
    speed: 4
  };

  const camera = {
    x: 0,
    y: 0
  };

  function update() {

    if (keys["w"]) player.y -= player.speed;
    if (keys["s"]) player.y += player.speed;
    if (keys["a"]) player.x -= player.speed;
    if (keys["d"]) player.x += player.speed;

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

    ctx.fillStyle = "#3bd16f";

    ctx.fillRect(
      player.x - camera.x - player.size / 2,
      player.y - camera.y - player.size / 2,
      player.size,
      player.size
    );

  }

  function gameloop() {
    update();
    drawBackground();
    drawPlayer();
    requestAnimationFrame(gameloop);
  }

  gameloop();

};
