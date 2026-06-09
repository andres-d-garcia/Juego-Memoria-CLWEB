// Usar el `gameState` global si ya fue definido por `core/state.js`
window.gameState = window.gameState || {};
Object.assign(window.gameState, {
    currentMode: 'single',       // 'single', 'multiplayer', 'practice'
    difficulty: 'facil',        // 'facil', 'intermedio', 'dificil'
    currentTheme: 'animales',    // El tema seleccionado
    boardDimensions: { rows: 4, cols: 4 }, // Se actualiza según la dificultad
    isBoardLocked: false,        // Bandera para bloquear clics durante el setTimeout de error
    totalPairs: 8,               // Cantidad de pares totales a encontrar (mitad del tablero)
    pairsFound: 0                // Contador de pares descubiertos hasta el momento
});

document.addEventListener('DOMContentLoaded', () => {
    const modeButtons = document.querySelectorAll('.mode-btn');
    const p2Input = document.getElementById('input-p2');

    modeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const selectedMode = e.target.getAttribute('data-mode');
            window.gameState.currentMode = selectedMode;
            
            if (selectedMode === 'multiplayer') {
                if (p2Input) p2Input.classList.remove('hidden');
            } else {
                if (p2Input) p2Input.classList.add('hidden');
            }
        });
    });
});