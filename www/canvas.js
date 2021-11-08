import { Universe, Cell } from "wasm-game-of-life";
import { memory } from "wasm-game-of-life/wasm_game_of_life_bg";

export const CELL_SIZE = 5; // px
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";

const COLORS = [ALIVE_COLOR, "#2094f3", "#009485", "#ff9900", "#ff5724", "#4506cb" ]

let universeInstance = Universe.new(64,64);

export function universe() {
  return universeInstance;
}

export const drawGrid = (ctx) => {
  ctx.beginPath();
  ctx.strokeStyle = GRID_COLOR;


  const width = universe().width();
  const height = universe().height();
  // Vertical lines.
  for (let i = 0; i <= width; i++) {
    ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
    ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
  }

  // Horizontal lines.
  for (let j = 0; j <= height; j++) {
    ctx.moveTo(0,                           j * (CELL_SIZE + 1) + 1);
    ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
  }

  ctx.stroke();
};

const getIndex = (row, column) => {
  const width = universe().width();
  return row * width + column;
};

const randomColor = () => {
  const value = Math.random() * COLORS.length;
  return COLORS[Math.round(value)];
}

export const drawCells = (ctx) => { 
  const width = universe().width();
  const height = universe().height();

  const cellsPtr = universe().cells();
  const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

  ctx.beginPath();

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col);

      ctx.fillStyle = cells[idx] === Cell.Dead
        ? DEAD_COLOR
        : randomColor();

      ctx.fillRect(
        col * (CELL_SIZE + 1) + 1,
        row * (CELL_SIZE + 1) + 1,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }

  ctx.stroke();
};

export const reset = () => {
  universe().clean_grid();
}

export const resetUniverse = (width, height) => {
  universeInstance = Universe.new(width,height);
}