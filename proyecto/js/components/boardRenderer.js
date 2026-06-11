// boardRenderer.js - Generación dinámica del tablero (Grid) con lógica de juego
function renderizarTablero(contenedor, elementos, dimensiones) {
  contenedor.innerHTML = '';

  const cuadricula = document.createElement('div');
  cuadricula.className = 'board';
  cuadricula.style.display = 'grid';
  cuadricula.style.gridTemplateColumns = `repeat(${dimensiones.columnas}, minmax(0, 1fr))`;
  cuadricula.style.gridTemplateRows = `repeat(${dimensiones.filas}, minmax(0, 1fr))`;

  // Reducir el espacio entre cartas en tableros grandes para que las cartas crezcan
  let tamanoEspacio = '0.75rem'; // Fácil (4x4)
  if (dimensiones.columnas >= 8) {
      tamanoEspacio = '0.3rem'; // Difícil (8x8)
      cuadricula.classList.add('board-hard');
  } else if (dimensiones.columnas >= 6) tamanoEspacio = '0.5rem'; // Medio (6x6)
  cuadricula.style.gap = tamanoEspacio;

  // Estado local para la lógica de pares
  let primeraCarta = null;
  let segundaCarta = null;
  let bloquearTablero = false;
  let esPrimerClic = true;

  function reiniciarSeleccion() {
    primeraCarta = null;
    segundaCarta = null;
    bloquearTablero = false;
  }

  elementos.forEach(valor => {
    const celda = document.createElement('button');
    celda.className = 'card';
    celda.type = 'button';
    celda.dataset.value = valor;

    // Verificamos si es una imagen basándonos en las extensiones de formato (acepta webp, gif, svg, jpg, etc.)
    const esImagen = typeof valor === 'string' && /\.(png|jpe?g|gif|webp|svg|bmp|avif)(\?.*)?$/i.test(valor);

    // Si el valor es una ruta de imagen, lo preparamos como variable CSS para usar de fondo
    if (esImagen) {
        celda.style.setProperty('--card-front-img', `url('${valor}')`);
    }

    // Estructura interna: un span para el valor (permite ocultarlo por CSS)
    const cara = document.createElement('span');
    cara.className = 'card-face';
    if (!esImagen) {
        cara.textContent = valor;
    }
    celda.appendChild(cara);

    celda.addEventListener('click', () => {
      if (bloquearTablero) return;
      if (celda === primeraCarta) return;
      if (celda.classList.contains('matched')) return;

      if (esPrimerClic) {
          esPrimerClic = false;
          if (window.logicaJuego) window.logicaJuego.manejarPrimerClic();
      }

      celda.classList.add('active');

      if (!primeraCarta) {
        primeraCarta = celda;
        return;
      }

      segundaCarta = celda;
      bloquearTablero = true;

      const a = primeraCarta.dataset.value;
      const b = segundaCarta.dataset.value;
      const esAcierto = (a === b);

      if (window.logicaJuego) {
          window.logicaJuego.manejarMovimiento(esAcierto);
      }

      if (esAcierto) {
        primeraCarta.classList.add('matched');
        segundaCarta.classList.add('matched');
        if (window.logicaJuego) window.logicaJuego.manejarAcierto();
        reiniciarSeleccion();
        return;
      }

      // No coinciden -> ocultar después de un delay
      setTimeout(() => {
        primeraCarta.classList.remove('active');
        segundaCarta.classList.remove('active');
        reiniciarSeleccion();
      }, 800);
    });

    cuadricula.appendChild(celda);
  });

  contenedor.appendChild(cuadricula);
}

window.renderizarTablero = renderizarTablero;
