import { drawGrid, drawCells, universe, reset, resetUniverse, CELL_SIZE } from "./canvas";
import { memory } from "wasm-game-of-life/wasm_game_of_life_bg";


let animationId = null;
// Give the canvas room for all of our cells and a 1px border
// around each of them.
const canvas = document.getElementById("game-of-life-canvas");
const ctx = canvas.getContext('2d');

const resizeCanvas = () => {
  canvas.height = (CELL_SIZE + 1) * universe().height() + 1;
  canvas.width = (CELL_SIZE + 1) * universe().width() + 1;
}

const playPauseButton = document.getElementById("play-pause");
const play = () => {
  playPauseButton.textContent = "⏸";
  renderLoop();
};

const pause = () => {
  playPauseButton.textContent = "▶";
  cancelAnimationFrame(animationId);
  animationId = null;
};

const isPaused = () => {
  return animationId === null;
};

playPauseButton.addEventListener("click", event => {
  if (isPaused()) {
    play();
  } else {
    pause();
  }
});

const resetButton = document.getElementById("reset-null");
resetButton.addEventListener("click", event => {
  pause();
  reset();
  play();
  drawCells(ctx);
})

const widthRange = document.getElementById("width-range");
widthRange.addEventListener("change", event => {
  const span = document.getElementById("width-value");
  span.innerText = event.target.value;

  pause();
  resetUniverse(event.target.value, universe().height());
  resizeCanvas();
  play();
})

const heightRange = document.getElementById("height-range");
heightRange.addEventListener("change", event => {
  const span = document.getElementById("height-value");
  span.innerText = event.target.value;

  pause();
  resetUniverse(universe().width(), event.target.value);
  resizeCanvas();
  play();
})

const resetRandomButton = document.getElementById("reset-random");
resetRandomButton.addEventListener("click", event => {
  pause();
  const width = universe().width();
  const height = universe().height();
  resetUniverse(width, height);
  resizeCanvas();
  play();
})

const renderLoop = () => {
  universe().tick();
  render();
};

const render = () => {
  drawGrid(ctx);
  drawCells(ctx);

  animationId = requestAnimationFrame(renderLoop);
}

canvas.addEventListener("click", event => {
  const boundingRect = canvas.getBoundingClientRect();

  const scaleX = canvas.width / boundingRect.width;
  const scaleY = canvas.height / boundingRect.height;

  const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
  const canvasTop = (event.clientY - boundingRect.top) * scaleY;

  const row = Math.min(Math.floor(canvasTop / (CELL_SIZE + 1)), universe().height() - 1);
  const col = Math.min(Math.floor(canvasLeft / (CELL_SIZE + 1)), universe().width() - 1);

  universe().toggle_cell(row, col);

  drawGrid(ctx);
  drawCells(ctx);
});

resizeCanvas();
render();
