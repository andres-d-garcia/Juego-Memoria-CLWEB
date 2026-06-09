// boardRenderer.js - Generación dinámica del tablero (Grid) con lógica de juego
function renderBoard(container, items, dimensions) {
  container.innerHTML = '';

  const grid = document.createElement('div');
  grid.className = 'board';
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = `repeat(${dimensions.cols}, minmax(0, 1fr))`;
  grid.style.gap = '0.75rem';

  // Estado local para la lógica de pares
  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;

  function resetSelection() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
  }

  items.forEach(value => {
    const cell = document.createElement('button');
    cell.className = 'card';
    cell.type = 'button';
    cell.dataset.value = value;

    // Estructura interna: un span para el valor (permite ocultarlo por CSS)
    const face = document.createElement('span');
    face.className = 'card-face';
    face.textContent = value;
    cell.appendChild(face);

    cell.addEventListener('click', () => {
      if (lockBoard) return;
      if (cell === firstCard) return;
      if (cell.classList.contains('matched')) return;

      cell.classList.add('active');

      if (!firstCard) {
        firstCard = cell;
        return;
      }

      secondCard = cell;
      lockBoard = true;

      const a = firstCard.dataset.value;
      const b = secondCard.dataset.value;

      if (a === b) {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        // keep them revealed
        resetSelection();
        return;
      }

      // No coinciden -> ocultar después de un delay
      setTimeout(() => {
        firstCard.classList.remove('active');
        secondCard.classList.remove('active');
        resetSelection();
      }, 800);
    });

    grid.appendChild(cell);
  });

  container.appendChild(grid);
}

window.renderBoard = renderBoard;
