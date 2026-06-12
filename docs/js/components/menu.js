// menu.js - captura del formulario de inicio y validación
const mapaTamanosTablero = {
  16: { filas: 4, columnas: 4 },
  36: { filas: 6, columnas: 6 },
  64: { filas: 8, columnas: 8 }
};

function mezclarArreglo(arreglo) {
  return arreglo.sort(() => Math.random() - 0.5);
}

function crearElementosTablero(totalCartas, tema) {
  const pares = totalCartas / 2;
  const elementos = [];
  
  const itemsTema = (window.datosTemas && window.datosTemas[tema]) ? window.datosTemas[tema] : [];

  for (let i = 1; i <= pares; i++) {
    const valorItem = (i - 1 < itemsTema.length) ? itemsTema[i - 1] : i;
    elementos.push(valorItem, valorItem);
  }
  return mezclarArreglo(elementos);
}

function prepararTablero(totalCartas) {
  const contenedorTablero = document.querySelector('#board-container');
  if (!contenedorTablero) return;

  const tema = window.estadoJuego.temaSeleccionado || 'z-fighters';
  const elementos = crearElementosTablero(totalCartas, tema);
  const dimensiones = mapaTamanosTablero[totalCartas] || { filas: 4, columnas: 4 };
  window.estadoJuego.tamanoTableroSeleccionado = totalCartas;
  window.estadoJuego.dimensionesTablero = dimensiones;
  window.estadoJuego.paresTotales = totalCartas / 2;

  if (window.renderizarTablero) {
    window.renderizarTablero(contenedorTablero, elementos, dimensiones);
  }
}

document.addEventListener('DOMContentLoaded', () => {
      const botonesDificultad = document.querySelectorAll('#opciones-dificultad button');
      const botonesModo = document.querySelectorAll('.mode-btn');
      const botonesTema = document.querySelectorAll('#opciones-temas button');
      const botonJugar = document.querySelector('#play-button');
      const botonSalir = document.querySelector('#exit-button');
      const contenedorTablero = document.querySelector('#board-container');
      const seccionesMenu = [
        document.querySelector('#mainTitle'),
        document.querySelector('#Game-container')
      ];

      const tamanoTableroDificultad = {
        facil: 16,
        medio: 36,
        dificil: 64
      };

      const alternarActivo = (botones, botonActivo) => {
        botones.forEach(boton => {
          boton.classList.toggle('selected', boton === botonActivo);
        });
      };

      const establecerModoJuego = (activo) => {
        document.body.classList.toggle('game-active', activo);
        seccionesMenu.forEach(seccion => {
          if (seccion) {
            seccion.style.display = activo ? 'none' : 'block';
          }
        });
        if (botonJugar) botonJugar.classList.toggle('hidden', activo);
        if (botonSalir) botonSalir.classList.toggle('hidden', !activo);
        if (contenedorTablero) contenedorTablero.classList.toggle('active', activo);
      };

      let seccionesUI = [
        document.querySelector('#mainTitle'),
        document.querySelector('#Game-container'),
        document.querySelector('#game')
      ];

      [document.querySelector('#mainTitle'), document.querySelector('#Game-container')].forEach(seccion => {
        if (seccion) {
          seccion.style.display = 'block';
        }
      });
      if (document.querySelector('#game')) {
        document.querySelector('#game').style.display = 'flex';
      }

      botonesDificultad.forEach(boton => {
        boton.addEventListener('click', () => {
          const dificultadSeleccionada = boton.getAttribute('data-dificultad');
          window.estadoJuego.dificultadSeleccionada = dificultadSeleccionada;
          window.estadoJuego.estaConfigurado = true;
          alternarActivo(botonesDificultad, boton);
        });
      });

      botonesModo.forEach(boton => {
        boton.addEventListener('click', () => {
          const modoSeleccionado = boton.getAttribute('data-modo');
          window.estadoJuego.modoSeleccionado = modoSeleccionado;
          alternarActivo(botonesModo, boton);
        });
      });

      botonesTema.forEach(boton => {
        boton.addEventListener('click', () => {
          const temaSeleccionado = boton.getAttribute('data-theme') || boton.id;
          window.estadoJuego.temaSeleccionado = temaSeleccionado;
          alternarActivo(botonesTema, boton);
        });
      });

      if (botonJugar) {
        botonJugar.addEventListener('click', () => {
          const dificultadSeleccionada = window.estadoJuego.dificultadSeleccionada;
          if (!dificultadSeleccionada) {
            alert('Selecciona una dificultad antes de jugar.');
            return;
          }
          if (!window.estadoJuego.modoSeleccionado) {
            alert('Selecciona un modo de juego antes de jugar.');
            return;
          }
          const totalCartas = tamanoTableroDificultad[dificultadSeleccionada] || 16;
          prepararTablero(totalCartas);
          if (window.logicaJuego) window.logicaJuego.iniciar();
          establecerModoJuego(true);
        });
      }

      if (botonSalir) {
        botonSalir.addEventListener('click', () => {
          if (contenedorTablero) contenedorTablero.innerHTML = '';
          if (window.temporizadorJuego) window.temporizadorJuego.detener();
          
          const hudJuego = document.getElementById('game-hud');
          if (hudJuego) hudJuego.classList.add('hidden');
          
          establecerModoJuego(false);
        });
      }
});

const audio = document.getElementById("miAudio");
if (audio) {
    audio.volume = 0.15; 

    // Iniciar la música con la primera interacción del usuario
    document.body.addEventListener('click', function() {
        if (audio.paused) {
            audio.play().catch(error => console.log("Autoplay bloqueado por el navegador:", error));
        }
    }, { once: true });

    // Lógica del botón de mute
    const muteButton = document.getElementById("mute-button");
    if (muteButton) {
        muteButton.addEventListener('click', () => {
            audio.muted = !audio.muted;
            muteButton.textContent = audio.muted ? '🔇' : '🔊';
        });
    }
}
