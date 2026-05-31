// En timer.js
let gameTimerInterval = null;  // Almacena el ID del setInterval para poder detenerlo con clearInterval()
let timeElapsedInSeconds = 0;  // Tiempo transcurrido acumulado
let isTimerRunning = false;    // Bandera para saber si ya arrancó (con la primera carta volteada)