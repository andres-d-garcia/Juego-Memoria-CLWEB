// timer.js - control del temporizador del juego
window.temporizadorJuego = {
  intervalo: null,
  tiempoTranscurrido: 0,
  enEjecucion: false,

  iniciar() {
    if (this.enEjecucion) return;
    this.enEjecucion = true;
    this.intervalo = setInterval(() => {
      this.tiempoTranscurrido++;
      const elementoTemporizador = document.getElementById('timer-count');
      if (elementoTemporizador) {
        const minutos = Math.floor(this.tiempoTranscurrido / 60).toString().padStart(2, '0');
        const segundos = (this.tiempoTranscurrido % 60).toString().padStart(2, '0');
        elementoTemporizador.textContent = `${minutos}:${segundos}`;
      }
    }, 1000);
  },

  detener() {
    if (!this.enEjecucion) return;
    this.enEjecucion = false;
    clearInterval(this.intervalo);
    this.intervalo = null;
  },

  reiniciar() {
    this.detener();
    this.tiempoTranscurrido = 0;
    const elementoTemporizador = document.getElementById('timer-count');
    if (elementoTemporizador) {
      elementoTemporizador.textContent = "00:00";
    }
  }
};