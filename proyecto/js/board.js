const boardSizes = [16, 36, 64];
const boardSizeMap = {
  16: { rows: 4, cols: 4 },
  36: { rows: 6, cols: 6 },
  64: { rows: 8, cols: 8 }
};

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function createBoardItems(totalCards) {
  const pairCount = totalCards / 2;
  const items = [];
  for (let i = 1; i <= pairCount; i++) {
    items.push(i, i);
  }
  return shuffleArray(items);
}

let firstSelectedCard = null;
let secondSelectedCard = null;
let lockBoard = false;

function resetSelection() {
  firstSelectedCard = null;
  secondSelectedCard = null;
  lockBoard = false;
}

function handleCardClick(event) {
  const card = event.currentTarget;
  if (lockBoard) return;
  if (card === firstSelectedCard) return;
  if (card.classList.contains('matched')) return;

  card.classList.add('active');

  if (!firstSelectedCard) {
    firstSelectedCard = card;
    return;
  }

  secondSelectedCard = card;
  lockBoard = true;

  const firstValue = firstSelectedCard.dataset.value;
  const secondValue = secondSelectedCard.dataset.value;

  if (firstValue === secondValue) {
    firstSelectedCard.classList.add('matched');
    secondSelectedCard.classList.add('matched');
    resetSelection();
    return;
  }

  setTimeout(() => {
    firstSelectedCard.classList.remove('active');
    secondSelectedCard.classList.remove('active');
    resetSelection();
  }, 800);
}

function renderBoard(totalCards) {
  const board = document.querySelector('#juego');
  if (!board) return;
  board.innerHTML = '';
  resetSelection();

  const items = createBoardItems(totalCards);
  const dimensions = boardSizeMap[totalCards] || boardSizeMap[16];
  const grid = document.createElement('div');
  grid.className = 'board-grid';
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = `repeat(${dimensions.cols}, minmax(0, 1fr))`;
  grid.style.gap = '0.75rem';

  items.forEach(value => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'card';
    card.dataset.value = value;
    card.textContent = value;
    card.addEventListener('click', handleCardClick);
    grid.appendChild(card);
  });

  board.appendChild(grid);
}

function initBoardPage() {
  const sizeButtons = document.querySelectorAll('#opciones-tablero button');
  sizeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const totalCards = Number(button.dataset.size);
      if (!boardSizes.includes(totalCards)) return;

      sizeButtons.forEach(btn => btn.classList.toggle('selected', btn === button));
      renderBoard(totalCards);
    });
  });

  if (sizeButtons[0]) {
    sizeButtons[0].click();
  }
}

document.addEventListener('DOMContentLoaded', initBoardPage);
