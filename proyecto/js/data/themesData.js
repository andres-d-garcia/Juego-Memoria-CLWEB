// themesData.js - catálogo de emojis, iconos y paletas
window.themes = {
  // Generamos rutas del 1 al 32 (suficientes para el tablero de 8x8)
  'z-fighters': Array.from({length: 32}, (_, i) => `assets/cartas/z-fighters/${i + 1}.png`),
  'dragon-balls': Array.from({length: 32}, (_, i) => `assets/cartas/dragon-balls/${i + 1}.png`),
  'villains': Array.from({length: 32}, (_, i) => `assets/cartas/villains/${i + 1}.jpeg`)
};
