// menu.js - captura del formulario de inicio y validación
const boardSizeMap = {
  16: { rows: 4, cols: 4 },
  36: { rows: 6, cols: 6 },
  64: { rows: 8, cols: 8 }
};

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function createBoardItems(totalCards, theme) {
  const pairCount = totalCards / 2;
  const items = [];
  
  const themeItems = (window.themes && window.themes[theme]) ? window.themes[theme] : [];

  for (let i = 1; i <= pairCount; i++) {
    const itemValue = (i - 1 < themeItems.length) ? themeItems[i - 1] : i;
    items.push(itemValue, itemValue);
  }
  return shuffleArray(items);
}

function renderGameBoard(totalCards) {
  const boardContainer = document.querySelector('#board-container');
  if (!boardContainer) return;

  const theme = window.gameState.selectedTheme || 'z-fighters';
  const items = createBoardItems(totalCards, theme);
  const dimensions = boardSizeMap[totalCards] || { rows: 4, cols: 4 };
  gameState.selectedBoardSize = totalCards;
  gameState.boardDimensions = dimensions;
  gameState.totalPairs = totalCards / 2;

  if (window.renderBoard) {
    window.renderBoard(boardContainer, items, dimensions);
  }
}

document.addEventListener('DOMContentLoaded', () => {
      const diffButtons = document.querySelectorAll('#opciones-dificultad button');
      const modeButtons = document.querySelectorAll('.mode-btn');
      const themeButtons = document.querySelectorAll('#opciones-temas button');
      const playButton = document.querySelector('#play-button');
      const exitButton = document.querySelector('#exit-button');
      const boardContainer = document.querySelector('#board-container');
      const menuSections = [
        document.querySelector('#mainTitle'),
        document.querySelector('#Game-container')
      ];

      const difficultyBoardSize = {
        easy: 16,
        medium: 36,
        hard: 64
      };

      const toggleActive = (buttons, activeButton) => {
        buttons.forEach(btn => {
          btn.classList.toggle('selected', btn === activeButton);
        });
      };

      const setGameMode = (active) => {
        document.body.classList.toggle('game-active', active);
        menuSections.forEach(section => {
          if (section) {
            section.style.display = active ? 'none' : 'block';
          }
        });
        playButton.classList.toggle('hidden', active);
        exitButton.classList.toggle('hidden', !active);
        boardContainer.classList.toggle('active', active);
      };

      uiSections = [
        document.querySelector('#mainTitle'),
        document.querySelector('#Game-container'),
        document.querySelector('#game')
      ];

      [document.querySelector('#mainTitle'), document.querySelector('#Game-container')].forEach(section => {
        if (section) {
          section.style.display = 'block';
        }
      });
      if (document.querySelector('#game')) {
        document.querySelector('#game').style.display = 'flex';
      }

      diffButtons.forEach(button => {
        button.addEventListener('click', () => {
          const selectedDifficulty = button.getAttribute('data-difficulty'); // 'easy', 'medium', 'hard'
          gameState.selectedDifficulty = selectedDifficulty;
          gameState.isConfigured = true;
          toggleActive(diffButtons, button);
          console.log('Dificultad seleccionada:', selectedDifficulty);
        });
      });

      modeButtons.forEach(button => {
        button.addEventListener('click', () => {
          const selectedMode = button.getAttribute('data-mode'); // 'single', 'multiplayer', 'practice'
          gameState.selectedMode = selectedMode;
          toggleActive(modeButtons, button);
          console.log('Modo seleccionado:', selectedMode);
        });
      });

      themeButtons.forEach(button => {
        button.addEventListener('click', () => {
          const selectedTheme = button.getAttribute('data-theme') || button.id; // fallback to id if needed
          gameState.selectedTheme = selectedTheme;
          toggleActive(themeButtons, button);
          console.log('Tema seleccionado:', selectedTheme);
        });
      });

      if (playButton) {
        playButton.addEventListener('click', () => {
          const selectedDifficulty = gameState.selectedDifficulty;
          if (!selectedDifficulty) {
            alert('Selecciona una dificultad antes de jugar.');
            return;
          }
          if (!gameState.selectedMode) {
            alert('Selecciona un modo de juego antes de jugar.');
            return;
          }
          const totalCards = difficultyBoardSize[selectedDifficulty] || 16;
          renderGameBoard(totalCards);
          if (window.gameLogic) window.gameLogic.start();
          setGameMode(true);
        });
      }

      if (exitButton) {
        exitButton.addEventListener('click', () => {
          boardContainer.innerHTML = '';
          if (window.gameTimer) window.gameTimer.stop();
          
          const gameHud = document.getElementById('game-hud');
          if (gameHud) gameHud.classList.add('hidden');
          
          setGameMode(false);
        });
      }
});
