// achievements.js - Lógica de logros y notificaciones flotantes
const sessionAchievements = [
    { id: 'first_pair', title: 'Primer paso', unlocked: false, desc: 'Encontrar el primer par.' },
    { id: 'hot_streak', title: 'Racha caliente', unlocked: false, desc: '3 pares consecutivos sin fallar.' },
    { id: 'speedster', title: 'Velocista', unlocked: false, desc: 'Completar en Fácil en menos de 30 segundos.' },
    { id: 'no_hesitation', title: 'Sin titubeos', unlocked: false, desc: 'Encontrar un par en tu primer intento.' }
];

// Variables auxiliares para controlar las rachas
let consecutivePairsCount = 0; // Contador auxiliar para rastrear la "Racha caliente"

function notifyAchievement(achievement){
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: #FF6204; color: white; padding: 1rem; border-radius: 8px; z-index: 10000; box-shadow: 0 4px 12px rgba(0,0,0,0.5); transform: translateY(100px); opacity: 0; transition: transform 0.3s ease, opacity 0.3s ease; display: flex; flex-direction: column; gap: 0.25rem; font-family: system-ui, sans-serif;';
    
    toast.innerHTML = `
        <strong style="font-size: 1.1rem;">🏆 ¡Logro Desbloqueado!</strong>
        <span style="font-size: 1rem; font-weight: bold;">${achievement.title}</span>
        <span style="font-size: 0.85rem; opacity: 0.9;">${achievement.desc}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Animar entrada
    setTimeout(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
    }, 10);
    
    // Desaparecer después de 4 segundos
    setTimeout(() => {
        toast.style.transform = 'translateY(100px)';
        toast.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 4000);
}

window.achievementManager = {
    resetSession: function() {
        consecutivePairsCount = 0;
    },
    
    checkMatch: function(totalMoves, pairsFound) {
        consecutivePairsCount++;
        
        const firstPair = sessionAchievements.find(a => a.id === 'first_pair');
        if (!firstPair.unlocked && pairsFound === 1) {
            firstPair.unlocked = true;
            notifyAchievement(firstPair);
        }

        const noHesitation = sessionAchievements.find(a => a.id === 'no_hesitation');
        if (!noHesitation.unlocked && totalMoves === 1 && pairsFound === 1) {
            noHesitation.unlocked = true;
            notifyAchievement(noHesitation);
        }

        const hotStreak = sessionAchievements.find(a => a.id === 'hot_streak');
        if (!hotStreak.unlocked && consecutivePairsCount === 3) {
            hotStreak.unlocked = true;
            notifyAchievement(hotStreak);
        }
    },
    
    checkMismatch: function() {
        consecutivePairsCount = 0;
    },
    
    checkGameEnd: function(timeElapsed, difficulty) {
        const speedster = sessionAchievements.find(a => a.id === 'speedster');
        if (!speedster.unlocked && difficulty === 'easy' && timeElapsed < 30) {
            speedster.unlocked = true;
            notifyAchievement(speedster);
        }
    },

    getUnlockedAchievements: function() {
        return sessionAchievements.filter(a => a.unlocked);
    }
};
