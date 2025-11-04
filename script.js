const BOARD_WIDTH = 100;
const BOARD_HEIGHT = 50;
const BOARD_ELEMENTS = BOARD_HEIGHT * BOARD_WIDTH

function newBoard() { return Array.from({length: BOARD_ELEMENTS}).map(() => Math.random() < 0.5); }

function newCellElem(index) {
  const elem = document.createElement("div");
  elem.dataset.index = index;
  return elem;
}

function newVisualBoard() {
  return Array.from({length: BOARD_ELEMENTS}).map((_, i) => newCellElem(i));
}

const visualBoard = newVisualBoard()

const mainElem = document.getElementById("main");
mainElem.append(...visualBoard);
mainElem.addEventListener('click', (event) => {
  const index = parseInt(event.target.dataset.index);
  currentBoard[index] = !currentBoard[index];
  renderCell(currentBoard, visualBoard, index % BOARD_WIDTH, Math.floor(index / BOARD_WIDTH));
});

function getIndex(x, y) {
  if (x < 0) x += BOARD_WIDTH;
  if (x > BOARD_WIDTH) x -= BOARD_WIDTH
  if (y < 0) y += BOARD_HEIGHT;
  if (y > BOARD_HEIGHT) y -= BOARD_HEIGHT
  return y * BOARD_WIDTH + x;
}

function get(board, x, y) {
  return board[getIndex(x, y)];
}

function set(board, x, y, value) {
  board[getIndex(x, y)] = value;
}

function countNeighbors(board, x, y) {
  let count = 0;
  for (const dx of [-1, 0, 1]) {
    for (const dy of [-1, 0, 1]) {
      if (dx === 0 && dy === 0) continue;
      if (get(board, x + dx, y + dy)) {
        count++;
      }
    }
  }
  return count;
}

function deadOrAlive(state, count) {
  if (state) {  // alive
    if (count < 2) return false;
    if (count < 4) return true;
    return false;
  } else {  // dead
    return count === 3;
  }
}

function updateBoard(board) {
  const nextBoard = newBoard();
  for (let x = 0; x < BOARD_WIDTH; x++) {
    for (let y = 0; y < BOARD_HEIGHT; y++) {
     const count = countNeighbors(board, x, y);
     set(nextBoard, x, y, deadOrAlive(get(board, x, y), count));
    }
  }
    return nextBoard
}

let currentBoard = newBoard();

function renderCell(board, visualBoard, x, y) {
  let elem = get(visualBoard, x, y);
  elem.classList.toggle("alive", get(board, x,y));
}

function render(board, visualBoard) {
  for (let x = 0; x < BOARD_WIDTH; x++) {
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      renderCell(board, visualBoard, x, y)
    }
  }
}

async function gameLoop() {
    while (true) {
        currentBoard = updateBoard(currentBoard);
        render(currentBoard, visualBoard);
      await new Promise((resolve) => {setTimeout(resolve, 10_000)});
    }
}

gameLoop()
