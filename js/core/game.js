window.onload = function () {

  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  const player = {
    x: 480,
    y: 270,
    size: 40,
    speed: 4
  };

  const keys = {};

  document.addEventListener("keydown", function (e) {
    keys[e.key] = true;
  });

  document.addEventListener("keyup", function (e) {
    keys[e.key] = false;
  });

  function update() {

    if (keys["w"]) player.y -= player.speed;
    if (keys["s"]) player.y += player.speed;
    if (keys["a"]) player.x -= player.speed;
    if (keys["d"]) player.x += player.speed;

  }

  function draw() {

    ctx.fillStyle = "#0c1626";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#3bd16f";
    ctx.fillRect(
      player.x - player.size / 2,
      player.y - player.size / 2,
      player.size,
      player.size
    );

  }

  function gameloop() {
    update();
    draw();
    requestAnimationFrame(gameloop);
  }

  gameloop();

};
