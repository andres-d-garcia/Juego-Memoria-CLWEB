// En achievements.js
const sessionAchievements = [
    { id: 'first_pair', title: 'Primer paso', unlocked: false }, // Encontrar el primer par
    { id: 'hot_streak', title: 'Racha caliente', unlocked: false }, // 3 pares consecutivos
    { id: 'speedster', title: 'Velocista', unlocked: false }, // Fácil en < 30s
    { id: 'no_hesitation', title: 'Sin titubeos', unlocked: false } // Par en movimientos #1 y #2
];

// Variables auxiliares para controlar las rachas
let consecutivePairsCount = 0; // Contador auxiliar para rastrear la "Racha caliente"