// modes.js - estadísticas y control de turnos
window.gameLogic = {
    stats: {
        player1: { name: 'Jugador 1', moves: 0, score: 0 },
        player2: { name: 'Jugador 2', moves: 0, score: 0 },
        activePlayer: 'player1',
        totalMoves: 0,
        pairsFound: 0
    },
    
    start() {
        const p1Input = document.getElementById('input-p1');
        const p2Input = document.getElementById('input-p2');
        
        this.stats.player1.name = p1Input && p1Input.value.trim() !== '' ? p1Input.value : 'Jugador 1';
        this.stats.player2.name = p2Input && p2Input.value.trim() !== '' ? p2Input.value : 'Jugador 2';

        this.stats.player1.moves = 0;
        this.stats.player1.score = 0;
        this.stats.player2.moves = 0;
        this.stats.player2.score = 0;
        this.stats.activePlayer = 'player1';
        this.stats.totalMoves = 0;
        this.stats.pairsFound = 0;

        if (window.achievementManager) window.achievementManager.resetSession();

        const mode = window.gameState ? (window.gameState.currentMode || window.gameState.selectedMode) : 'single';
        
        this.updateHUDText();
        this.setActivePlayer('player1');

        if (window.gameTimer) window.gameTimer.reset();

        const gameHud = document.getElementById('game-hud');
        if (gameHud) gameHud.classList.remove('hidden');

        const exitBtn = document.getElementById('exit-button');
        if (exitBtn) exitBtn.classList.remove('hidden');

        const scoreHUD = document.getElementById('hud-score');
        const timerHUD = document.getElementById('hud-timer');
        if (scoreHUD && timerHUD) {
            if (mode === 'multiplayer') {
                scoreHUD.classList.remove('hidden');
                timerHUD.classList.add('hidden');
            } else if (mode === 'single' || mode === 'solitario') {
                scoreHUD.classList.add('hidden');
                timerHUD.classList.remove('hidden');
            } else {
                scoreHUD.classList.add('hidden');
                timerHUD.classList.add('hidden');
            }
        }
    },

    updateHUDText() {
        const mode = window.gameState ? (window.gameState.currentMode || window.gameState.selectedMode) : 'single';
        const hudPlayers = document.getElementById('hud-players');
        if (hudPlayers) {
            if (mode === 'multiplayer') {
                hudPlayers.textContent = 'Modo Versus';
            } else {
                hudPlayers.textContent = this.stats.player1.name;
            }
        }

        const p1El = document.getElementById('score-p1');
        const p2El = document.getElementById('score-p2');
        if(p1El) p1El.textContent = `${this.stats.player1.name}: ${this.stats.player1.score}`;
        if(p2El) p2El.textContent = `${this.stats.player2.name}: ${this.stats.player2.score}`;
        
        const movesEl = document.getElementById('moves-count');
        if(movesEl) movesEl.textContent = this.stats.totalMoves;
    },

    setActivePlayer(player) {
        this.stats.activePlayer = player;
        const p1El = document.getElementById('score-p1');
        const p2El = document.getElementById('score-p2');
        if(p1El && p2El) {
            if (player === 'player1') {
                p1El.classList.add('active-player');
                p2El.classList.remove('active-player');
            } else {
                p2El.classList.add('active-player');
                p1El.classList.remove('active-player');
            }
        }
    },

    handleFirstClick() {
        const mode = window.gameState ? (window.gameState.currentMode || window.gameState.selectedMode) : 'single';
        if (mode === 'single' || mode === 'solitario') {
            if (window.gameTimer) window.gameTimer.start();
        }
    },

    handleMatch() {
        const active = this.stats.activePlayer;
        this.stats[active].score++;
        this.stats.pairsFound++;
        
        this.updateHUDText();

        if (window.achievementManager) {
            window.achievementManager.checkMatch(this.stats.totalMoves, this.stats.pairsFound);
        }

        // Check if game ended
        if (this.stats.pairsFound === window.gameState.totalPairs) {
            if (window.gameTimer) window.gameTimer.stop();
            if (window.achievementManager) {
                const diff = window.gameState ? window.gameState.selectedDifficulty : 'easy';
                const time = window.gameTimer ? window.gameTimer.elapsed : 999;
                window.achievementManager.checkGameEnd(time, diff);
            }
            setTimeout(() => {
                this.showEndScreen();
            }, 800);
        }
    },

    handleMove(isMatch) {
        this.stats.totalMoves++;
        const active = this.stats.activePlayer;
        this.stats[active].moves++;
        
        this.updateHUDText();

        const mode = window.gameState ? (window.gameState.currentMode || window.gameState.selectedMode) : 'single';
        if (!isMatch) {
            if (window.achievementManager) window.achievementManager.checkMismatch();
        }
        
        if (mode === 'multiplayer') {
            if (!isMatch) {
                // Swap turns
                this.stats.activePlayer = active === 'player1' ? 'player2' : 'player1';
                this.setActivePlayer(this.stats.activePlayer);
            }
        }
    },

    showEndScreen() {
        const modal = document.createElement('div');
        modal.id = 'end-screen-modal';
        modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:10000;color:white;font-family:system-ui,sans-serif;';

        const mode = window.gameState ? (window.gameState.currentMode || window.gameState.selectedMode) : 'single';
        let resultText = `<h2 style="font-size:2.5rem;margin-bottom:1rem;color:#FF6204">¡Partida Finalizada!</h2><p style="font-size:1.2rem;margin-bottom:0.5rem;">Movimientos totales: ${this.stats.totalMoves}</p>`;
        
        if (mode === 'multiplayer') {
            const p1 = this.stats.player1;
            const p2 = this.stats.player2;
            resultText += `<p style="font-size:1.2rem;margin-bottom:0.5rem;">${p1.name}: ${p1.score} pares</p>`;
            resultText += `<p style="font-size:1.2rem;margin-bottom:1.5rem;">${p2.name}: ${p2.score} pares</p>`;
            
            if (p1.score > p2.score) {
                resultText += `<h3 style="font-size:2rem;color:#FF6204">¡Ganador: ${p1.name}!</h3>`;
            } else if (p2.score > p1.score) {
                resultText += `<h3 style="font-size:2rem;color:#FF6204">¡Ganador: ${p2.name}!</h3>`;
            } else {
                resultText += `<h3 style="font-size:2rem;color:#FF6204">¡Empate!</h3>`;
            }
        } else if (mode === 'single' || mode === 'solitario') {
            const timerEl = document.getElementById('timer-count');
            if (timerEl) resultText += `<p style="font-size:1.2rem;margin-bottom:1.5rem;">Tiempo: ${timerEl.textContent}</p>`;
        }

        const unlockedAchievements = window.achievementManager ? window.achievementManager.getUnlockedAchievements() : [];
        if (unlockedAchievements.length > 0) {
            resultText += `<div style="margin-top: 1rem; background: rgba(0,0,0,0.25); padding: 1rem; border-radius: 8px;">`;
            resultText += `<h4 style="color:#FF6204; margin-bottom: 0.5rem; font-size: 1.1rem;">Logros Desbloqueados en Sesión:</h4>`;
            resultText += `<ul style="list-style: none; padding: 0; margin: 0; text-align: left; display: inline-block;">`;
            unlockedAchievements.forEach(a => {
                resultText += `<li style="font-size: 0.95rem; margin-bottom: 0.3rem;">🏆 <strong>${a.title}</strong>: ${a.desc}</li>`;
            });
            resultText += `</ul></div>`;
        }

        modal.innerHTML = `
            <div style="background: #222; padding: 3rem; border-radius: 16px; text-align: center; max-width: 500px; width: 90%; border: 2px solid #555;">
                ${resultText}
                <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center;">
                    <button id="btn-replay" style="background:#FF6204; color:white; border:none; padding: 1rem 2rem; border-radius: 8px; cursor: pointer; font-size: 1.1rem; font-weight: bold;">Jugar de Nuevo</button>
                    <button id="btn-menu" style="background:#444; color:white; border:none; padding: 1rem 2rem; border-radius: 8px; cursor: pointer; font-size: 1.1rem; font-weight: bold;">Menú Principal</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('btn-replay').addEventListener('click', () => {
            document.body.removeChild(modal);
            const playBtn = document.getElementById('play-button');
            if(playBtn) playBtn.click();
        });

        document.getElementById('btn-menu').addEventListener('click', () => {
            document.body.removeChild(modal);
            window.location.reload(); 
        });
    }
};