import CustomCanvas from "./canvas";
import fps from "./fps";
import { memory } from "wasm-game-of-life/wasm_game_of_life_bg";


let animationId = null;

let customCanvas = new CustomCanvas("game-of-life-canvas");
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
  customCanvas.reset();
  customCanvas.drawCells();
})

const widthRange = document.getElementById("width-range");
widthRange.addEventListener("change", event => {
  const span = document.getElementById("width-value");
  span.innerText = event.target.value;

  pause();
  customCanvas.resetUniverse(event.target.value, customCanvas.getHeight());
  customCanvas.drawCells();
})

const heightRange = document.getElementById("height-range");
heightRange.addEventListener("change", event => {
  const span = document.getElementById("height-value");
  span.innerText = event.target.value;
  
  pause();
  customCanvas.resetUniverse(customCanvas.getWidth(), event.target.value);
  customCanvas.drawCells();
})

const cellSizeRange = document.getElementById("cell-size-range");
cellSizeRange.addEventListener("change", event => {
  const span = document.getElementById("cell-size-value");
  span.innerText = event.target.value;

  pause();
  customCanvas.setCellSize(parseInt(event.target.value));
  customCanvas.resizeCanvas();
  customCanvas.drawCells();
})

const resetRandomButton = document.getElementById("reset-random");
resetRandomButton.addEventListener("click", event => {
  pause();
  const width = customCanvas.getWidth();
  const height = customCanvas.getHeight();
  customCanvas.resetUniverse(width, height);
  customCanvas.drawCells();
})

const renderLoop = () => {
  //fps.render();
  customCanvas.getUniverse().tick();
  render();
};

const render = () => {
  customCanvas.drawGrid();
  customCanvas.drawCells();

  animationId = requestAnimationFrame(renderLoop);
}

let canvas = customCanvas.getCanvas();
let isDrawing = false;

canvas.addEventListener("mouseup" , _event => {
  isDrawing = false;
});

canvas.addEventListener("mousedown", _event => {
  isDrawing = true;
})

canvas.addEventListener("mousemove", event => {
  if(!isDrawing) {
    return;
  }
  const boundingRect = canvas.getBoundingClientRect();

  const scaleX = canvas.width / boundingRect.width;
  const scaleY = canvas.height / boundingRect.height;

  const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
  const canvasTop = (event.clientY - boundingRect.top) * scaleY;

  const row = Math.min(Math.floor(canvasTop / (customCanvas.getCellSize() + 1)), customCanvas.getHeight() - 1);
  const col = Math.min(Math.floor(canvasLeft / (customCanvas.getCellSize() + 1)), customCanvas.getWidth() - 1);

  customCanvas.toggleCell(row, col);

  customCanvas.drawGrid();
  customCanvas.drawCells();
});

render();
