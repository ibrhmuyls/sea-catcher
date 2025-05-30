
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const hook = {
  x: canvas.width / 2,
  y: 0,
  speed: 8,
  width: 4,
  height: 20,
  dropSpeed: 10,
  isDropping: false,
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
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw hook
  ctx.fillStyle = "black";
  ctx.fillRect(hook.x, 0, hook.width, hook.y);
  ctx.fillRect(hook.x - 10, hook.y, 24, hook.height);

  // Draw objects
  for (const obj of objects) {
    ctx.fillStyle = obj.color;
    ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
  }

  // Draw score
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);
}

function update() {
  if (hook.isDropping) {
    hook.y += hook.dropSpeed;
    if (hook.y > canvas.height) {
      resetHook();
    }

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
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    hook.x -= hook.speed;
  } else if (e.key === "ArrowRight") {
    hook.x += hook.speed;
  } else if (e.key === " ") {
    if (!hook.isDropping) hook.isDropping = true;
  }
});

for (let i = 0; i < 5; i++) spawnItem();
gameLoop();
