const gameState = {
    currentMode: 'solitario',    // 'solitario', 'pvp', 'libre'
    difficulty: 'facil',        // 'facil', 'intermedio', 'dificil'
    currentTheme: 'animales',    // El tema seleccionado
    boardDimensions: { rows: 4, cols: 4 }, // Se actualiza según la dificultad
    isBoardLocked: false,        // Bandera para bloquear clics durante el setTimeout de error
    totalPairs: 8,               // Cantidad de pares totales a encontrar (mitad del tablero)
    pairsFound: 0                // Contador de pares descubiertos hasta el momento
};
