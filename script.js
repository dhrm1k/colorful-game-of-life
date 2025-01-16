const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Smaller cells for more subtle effect
const cellSize = 8;
const cols = Math.floor(canvas.width / cellSize);
const rows = Math.floor(canvas.height / cellSize);
let mouseX = 0;
let mouseY = 0;

let grid = new Array(cols);
for (let i = 0; i < cols; i++) {
  grid[i] = new Array(rows);
  for (let j = 0; j < rows; j++) {
    grid[i][j] = Math.random() > 0.95; // variable inital pop 5% 4
  }
}

canvas.addEventListener('mousemove', (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});

function countNeighbors(grid, x, y) {
  let sum = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let col = (x + i + cols) % cols;
      let row = (y + j + rows) % rows;
      sum += grid[col][row] ? 1 : 0;
    }
  }
  sum -= grid[x][y] ? 1 : 0;
  return sum;
}

function update() {
  let next = new Array(cols);
  for (let i = 0; i < cols; i++) {
    next[i] = new Array(rows);
    for (let j = 0; j < rows; j++) {
      let state = grid[i][j];
      let neighbors = countNeighbors(grid, i, j);

      if (state && (neighbors < 2 || neighbors > 3)) {
        next[i][j] = false;
      } else if (!state && neighbors === 3) {
        next[i][j] = true;
      } else {
        next[i][j] = state;
      }

      let dx = i * cellSize - mouseX;
      let dy = j * cellSize - mouseY;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 10) { // variable radius
        next[i][j] = true;
      }
    }
  }
  grid = next;
}

function draw() {
  ctx.fillStyle = 'rgba(18, 18, 18, 0.3)'; // Darker background with slower fade
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j]) {
        let x = i * cellSize;
        let y = j * cellSize;
        
        let dx = x - mouseX;
        let dy = y - mouseY;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        // More subtle colors based on distance
        let hue = (distance % 360);
        let opacity = Math.max(0.15, 0.4 - distance / 400); // Fade out with distance
        ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${opacity})`;
        
        // Square pixels
        ctx.fillRect(x, y, cellSize - 1, cellSize - 1);
      }
    }
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
