window.gameState = window.gameState || {};
Object.assign(window.gameState, {
    selectedMode: null, // 'single', 'multiplayer', 'practice'
    selectedTheme: null, // 'z-fighters', 'dragon-balls', 'villains'
    selectedDifficulty: null, // 'easy', 'medium', 'hard'
    isConfigured: false
});