// En modes.js o game.js
const playerStats = {
    player1: {
        name: '',             // Nombre capturado del formulario
        moves: 0,             // Contador de movimientos del Jugador 1
        score: 0              // Pares encontrados (crucial para el modo PvP)
    },
    player2: {
        name: '',             // Solo se usa si currentMode === 'pvp'
        moves: 0, 
        score: 0
    },
    activePlayer: 'player1'   // Controla a quién le toca el turno en el modo PvP
};