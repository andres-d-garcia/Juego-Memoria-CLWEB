// hud.js - Actualización en pantalla de movimientos, tiempo y turnos
window.hud = {
  elements: {
    container: null,
    players: null,
    moves: null,
    timer: null,
    score: null,
    scoreP1: null,
    scoreP2: null,
    timerContainer: null,
    movesContainer: null
  },

  init() {
    this.elements.container = document.getElementById('game-hud');
    this.elements.players = document.getElementById('hud-players');
    this.elements.moves = document.getElementById('moves-count');
    this.elements.timer = document.getElementById('timer-count');
    this.elements.score = document.getElementById('hud-score');
    this.elements.scoreP1 = document.getElementById('score-p1');
    this.elements.scoreP2 = document.getElementById('score-p2');
    this.elements.timerContainer = document.getElementById('hud-timer');
    this.elements.movesContainer = document.getElementById('hud-moves');
  },

  setupMode(mode, p1Name = 'Jugador 1', p2Name = 'Jugador 2') {
    if (!this.elements.container) this.init();
    
    this.elements.container.classList.remove('hidden');
    
    if (mode === 'single') {
        this.elements.players.textContent = p1Name;
        this.elements.timerContainer.style.display = 'block';
        this.elements.score.style.display = 'none';
        this.elements.movesContainer.style.display = 'block';
    } else if (mode === 'multiplayer') {
        this.elements.players.textContent = `${p1Name} vs ${p2Name}`;
        this.elements.timerContainer.style.display = 'none';
        this.elements.score.style.display = 'block';
        this.elements.movesContainer.style.display = 'block';
        this.updateScore(0, 0);
        this.setActivePlayer('player1');
    } else if (mode === 'practice') {
        this.elements.players.textContent = p1Name;
        this.elements.timerContainer.style.display = 'none';
        this.elements.score.style.display = 'none';
        this.elements.movesContainer.style.display = 'block';
    }
    
    this.updateMoves(0);
    this.updateTime(0);
  },

  updateMoves(moves) {
    if (this.elements.moves) {
      this.elements.moves.textContent = moves;
    }
  },

  updateTime(seconds) {
    if (this.elements.timer) {
      const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
      const secs = (seconds % 60).toString().padStart(2, '0');
      this.elements.timer.textContent = `${mins}:${secs}`;
    }
  },

  updateScore(score1, score2) {
    if (this.elements.scoreP1 && this.elements.scoreP2) {
      this.elements.scoreP1.textContent = `J1: ${score1}`;
      this.elements.scoreP2.textContent = `J2: ${score2}`;
    }
  },

  setActivePlayer(activePlayer) {
     if (this.elements.scoreP1 && this.elements.scoreP2) {
        if (activePlayer === 'player1') {
            this.elements.scoreP1.classList.add('active-player');
            this.elements.scoreP2.classList.remove('active-player');
        } else {
            this.elements.scoreP2.classList.add('active-player');
            this.elements.scoreP1.classList.remove('active-player');
        }
     }
  },

  hide() {
     if (this.elements.container) {
         this.elements.container.classList.add('hidden');
     }
  }
};