import { Universe, Cell } from "wasm-game-of-life";
import { memory } from "wasm-game-of-life/wasm_game_of_life_bg.wasm";

const BACKGROUND_GRID = "#FFFFFF";
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#22222";

const COLORS = [ALIVE_COLOR, "#2094f3", "#009485", "#ff9900", "#ff5724", "#4506cb" ]

let universeInstance = Universe.new(64,64);

export default class CustomCanvas {
  constructor(canvasDomId) {
    this.cellSize = 5;
    this.canvas = document.getElementById(canvasDomId);
    this.ctx = this.canvas.getContext('2d');

    this.width = 64;
    this.height = 64;
    this.universe = Universe.new(this.width, this.height);

    this.darkBackground = false;
    this.deadColor = DEAD_COLOR;
    this.gridColor = GRID_COLOR;

    this.resizeCanvas();
  }

  isDarkBackground() {
    return this.darkBackground;
  }

  setDarkBackground(value) {
    this.darkBackground = value;

    if(value === true) {
      this.deadColor = "#2a2e37";
      this.gridColor =  "#000000"
    } else {
      this.deadColor = "#FFFFFF";
      this.gridColor = GRID_COLOR;
    }
  }

  getUniverse() {
    return this.universe;
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  getCellSize() {
    return this.cellSize;
  }

  setCellSize(cellSize) {
    this.cellSize = cellSize;
  }

  getIndex(row, column) {
    return row * this.width + column;
  }

  getCanvas() {
    return this.canvas;
  }

  randomColor() {
    const value = Math.random() * COLORS.length;
    return COLORS[Math.round(value)];
  }

  drawGrid() {
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.gridColor;

    const width = this.width;
    const height = this.height;
    // Vertical lines.
    for (let i = 0; i <= this.width; i++) {
      this.ctx.moveTo(i * (this.cellSize + 1) + 1, 0);
      this.ctx.lineTo(i * (this.cellSize + 1) + 1, (this.cellSize + 1) * this.height + 1);
    }

    // Horizontal lines.
    for (let j = 0; j <= this.height; j++) {
      this.ctx.moveTo(0,                           j * (this.cellSize + 1) + 1);
      this.ctx.lineTo((this.cellSize + 1) * this.width + 1, j * (this.cellSize + 1) + 1);
    }

    this.ctx.stroke();
  }

  drawCells() { 
    const cellsPtr = this.universe.cells();
    const cells = new Uint8Array(memory.buffer, cellsPtr, this.width * this.height);

    this.ctx.beginPath();
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const idx = this.getIndex(row, col);
        if (cells[idx] !== Cell.Alive) {
          continue;
        }

        this.ctx.fillStyle = this.randomColor();
        this.ctx.fillRect(
          col * (this.cellSize + 1) + 1,
          row * (this.cellSize + 1) + 1,
          this.cellSize,
          this.cellSize
        );
      }
    }

    // Dead cells.
    this.ctx.fillStyle = this.deadColor;
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const idx = this.getIndex(row, col);
        if (cells[idx] !== Cell.Dead) {
          continue;
        }

        this.ctx.fillRect(
          col * (this.cellSize + 1) + 1,
          row * (this.cellSize + 1) + 1,
          this.cellSize,
          this.cellSize
        );
      }
    }
    this.ctx.stroke();
  }

  toggleCell(row, col) {
    this.universe.toggle_cell(row, col);
  }

  resizeCanvas() {
    this.canvas.height = (this.cellSize + 1) * this.height + 1;
    this.canvas.width = (this.cellSize + 1) * this.width + 1;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  reset () {
    this.universe.clean_grid();
  }

  resetUniverse(width, height) {
    this.width = width;
    this.height = height;
    this.universe = Universe.new(this.width, this.height);
    this.resizeCanvas();
  }
}
