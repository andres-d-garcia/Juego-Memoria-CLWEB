// timer.js - control del temporizador del juego
window.gameTimer = {
  interval: null,
  elapsed: 0,
  running: false,

  start() {
    if (this.running) return;
    this.running = true;
    this.interval = setInterval(() => {
      this.elapsed++;
      const timerEl = document.getElementById('timer-count');
      if (timerEl) {
        const mins = Math.floor(this.elapsed / 60).toString().padStart(2, '0');
        const secs = (this.elapsed % 60).toString().padStart(2, '0');
        timerEl.textContent = `${mins}:${secs}`;
      }
    }, 1000);
  },

  stop() {
    if (!this.running) return;
    this.running = false;
    clearInterval(this.interval);
    this.interval = null;
  },

  reset() {
    this.stop();
    this.elapsed = 0;
    const timerEl = document.getElementById('timer-count');
    if (timerEl) {
      timerEl.textContent = "00:00";
    }
  }
};