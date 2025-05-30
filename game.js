
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const hook = {
  x: canvas.width / 2,
  y: 0,
  width: 4,
  height: 20,
  angle: 0,
  radius: 80,
  isSwinging: true,
  isDropping: false,
  dropSpeed: 10,
};

const items = [
  { name: "SP1 Box", value: 30, color: "pink" },
  { name: "Pink Crab", value: 50, color: "#ff66cc" },
  { name: "Blue Crab", value: 40, color: "#3399ff" },
  { name: "Succinct Hat", value: 25, color: "#9999ff" },
  { name: "Trash", value: -10, color: "gray" },
];

let objects = [];
let score = 0;
let gameTime = 60;
let gameInterval, spawnInterval, timerInterval;

function spawnItem() {
  const item = items[Math.floor(Math.random() * items.length)];
  objects.push({
    ...item,
    x: Math.random() * (canvas.width - 30),
    y: 480 + Math.random() * 100,
    width: 30,
    height: 30,
  });
}

function resetHook() {
  hook.y = 0;
  hook.isDropping = false;
  hook.isSwinging = true;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Hook swinging or dropping
  let hx = hook.x;
  let hy = hook.y;
  if (hook.isSwinging && !hook.isDropping) {
    hook.angle += 0.05;
    hx = canvas.width / 2 + Math.sin(hook.angle) * hook.radius;
    hook.x = hx;
  } else if (hook.isDropping) {
    hook.y += hook.dropSpeed;
    if (hook.y > canvas.height) resetHook();
  }

  // Draw line and hook
  ctx.fillStyle = "black";
  ctx.fillRect(hx, 0, hook.width, hook.y);
  ctx.fillRect(hx - 10, hook.y, 24, hook.height);

  // Draw objects
  for (const obj of objects) {
    ctx.fillStyle = obj.color;
    ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
  }

  // Score
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);
}

function update() {
  if (hook.isDropping) {
    for (const obj of objects) {
      if (
        hook.x < obj.x + obj.width &&
        hook.x + hook.width > obj.x &&
        hook.y + hook.height > obj.y &&
        hook.y < obj.y + obj.height
      ) {
        score += obj.value;
        objects.splice(objects.indexOf(obj), 1);
        resetHook();
        break;
      }
    }
  }
}

function gameLoop() {
  update();
  draw();
  gameInterval = requestAnimationFrame(gameLoop);
}

function updateTimer() {
  gameTime--;
  document.getElementById("timer").textContent = `Time: ${gameTime}`;
  if (gameTime <= 0) endGame();
}

function endGame() {
  cancelAnimationFrame(gameInterval);
  clearInterval(spawnInterval);
  clearInterval(timerInterval);
  document.getElementById("finalScore").textContent = score;
  document.getElementById("gameOver").style.display = "block";
}

function restartGame() {
  score = 0;
  gameTime = 60;
  hook.y = 0;
  hook.isDropping = false;
  hook.isSwinging = true;
  objects = [];
  document.getElementById("gameOver").style.display = "none";
  document.getElementById("timer").textContent = `Time: 60`;
  for (let i = 0; i < 5; i++) spawnItem();
  timerInterval = setInterval(updateTimer, 1000);
  spawnInterval = setInterval(() => spawnItem(), 3000);
  gameLoop();
}

document.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    if (!hook.isDropping) {
      hook.isSwinging = false;
      hook.isDropping = true;
    }
  }
});

restartGame();
