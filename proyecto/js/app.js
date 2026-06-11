// Usar el `estadoJuego` global si ya fue definido por `core/state.js`
window.estadoJuego = window.estadoJuego || {};
Object.assign(window.estadoJuego, {
    modoActual: 'solitario',       // 'solitario', 'multijugador', 'practica'
    dificultad: 'facil',        // 'facil', 'intermedio', 'dificil'
    temaActual: 'animales',    // El tema seleccionado
    dimensionesTablero: { filas: 4, columnas: 4 }, // Se actualiza según la dificultad
    tableroBloqueado: false,        // Bandera para bloquear clics durante el setTimeout de error
    paresTotales: 8,               // Cantidad de pares totales a encontrar (mitad del tablero)
    paresEncontrados: 0                // Contador de pares descubiertos hasta el momento
});

document.addEventListener('DOMContentLoaded', () => {
    const botonesModo = document.querySelectorAll('.mode-btn');
    const entradaJ2 = document.getElementById('input-p2');

    botonesModo.forEach(boton => {
        boton.addEventListener('click', (evento) => {
            const modoSeleccionado = evento.target.getAttribute('data-modo');
            window.estadoJuego.modoActual = modoSeleccionado;
            
            if (modoSeleccionado === 'multijugador') {
                if (entradaJ2) entradaJ2.classList.remove('hidden');
            } else {
                if (entradaJ2) entradaJ2.classList.add('hidden');
            }
        });
    });
});