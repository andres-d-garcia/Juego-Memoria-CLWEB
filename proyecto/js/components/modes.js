// modes.js - estadísticas y control de turnos
window.logicaJuego = {
    estadisticas: {
        jugador1: { nombre: 'Jugador 1', movimientos: 0, puntaje: 0 },
        jugador2: { nombre: 'Jugador 2', movimientos: 0, puntaje: 0 },
        jugadorActivo: 'jugador1',
        movimientosTotales: 0,
        paresEncontrados: 0
    },
    
    iniciar() {
        const entradaJ1 = document.getElementById('input-p1');
        const entradaJ2 = document.getElementById('input-p2');
        
        this.estadisticas.jugador1.nombre = entradaJ1 && entradaJ1.value.trim() !== '' ? entradaJ1.value : 'Jugador 1';
        this.estadisticas.jugador2.nombre = entradaJ2 && entradaJ2.value.trim() !== '' ? entradaJ2.value : 'Jugador 2';

        this.estadisticas.jugador1.movimientos = 0;
        this.estadisticas.jugador1.puntaje = 0;
        this.estadisticas.jugador2.movimientos = 0;
        this.estadisticas.jugador2.puntaje = 0;
        this.estadisticas.jugadorActivo = 'jugador1';
        this.estadisticas.movimientosTotales = 0;
        this.estadisticas.paresEncontrados = 0;

        if (window.gestorLogros) window.gestorLogros.reiniciarSesion();

        const modo = window.estadoJuego ? (window.estadoJuego.modoActual || window.estadoJuego.modoSeleccionado) : 'solitario';
        
        this.actualizarTextoHUD();
        this.establecerJugadorActivo('jugador1');

        if (window.temporizadorJuego) window.temporizadorJuego.reiniciar();

        const hudJuego = document.getElementById('game-hud');
        if (hudJuego) hudJuego.classList.remove('hidden');

        const botonSalir = document.getElementById('exit-button');
        if (botonSalir) botonSalir.classList.remove('hidden');

        const hudPuntaje = document.getElementById('hud-score');
        const hudTemporizador = document.getElementById('hud-timer');
        if (hudPuntaje && hudTemporizador) {
            if (modo === 'multijugador') {
                hudPuntaje.classList.remove('hidden');
                hudTemporizador.classList.add('hidden');
            } else if (modo === 'solitario') {
                hudPuntaje.classList.add('hidden');
                hudTemporizador.classList.remove('hidden');
            } else {
                hudPuntaje.classList.add('hidden');
                hudTemporizador.classList.add('hidden');
            }
        }
    },

    actualizarTextoHUD() {
        const modo = window.estadoJuego ? (window.estadoJuego.modoActual || window.estadoJuego.modoSeleccionado) : 'solitario';
        const hudJugadores = document.getElementById('hud-players');
        if (hudJugadores) {
            if (modo === 'multijugador') {
                hudJugadores.textContent = 'Modo Versus';
            } else {
                hudJugadores.textContent = this.estadisticas.jugador1.nombre;
            }
        }

        const j1Elemento = document.getElementById('score-p1');
        const j2Elemento = document.getElementById('score-p2');
        if(j1Elemento) j1Elemento.textContent = `${this.estadisticas.jugador1.nombre}: ${this.estadisticas.jugador1.puntaje}`;
        if(j2Elemento) j2Elemento.textContent = `${this.estadisticas.jugador2.nombre}: ${this.estadisticas.jugador2.puntaje}`;
        
        const movimientosElemento = document.getElementById('moves-count');
        if(movimientosElemento) movimientosElemento.textContent = this.estadisticas.movimientosTotales;
    },

    establecerJugadorActivo(jugador) {
        this.estadisticas.jugadorActivo = jugador;
        const j1Elemento = document.getElementById('score-p1');
        const j2Elemento = document.getElementById('score-p2');
        if(j1Elemento && j2Elemento) {
            if (jugador === 'jugador1') {
                j1Elemento.classList.add('active-player');
                j2Elemento.classList.remove('active-player');
            } else {
                j2Elemento.classList.add('active-player');
                j1Elemento.classList.remove('active-player');
            }
        }
    },

    manejarPrimerClic() {
        const modo = window.estadoJuego ? (window.estadoJuego.modoActual || window.estadoJuego.modoSeleccionado) : 'solitario';
        if (modo === 'solitario') {
            if (window.temporizadorJuego) window.temporizadorJuego.iniciar();
        }
    },

    manejarAcierto() {
        const activo = this.estadisticas.jugadorActivo;
        this.estadisticas[activo].puntaje++;
        this.estadisticas.paresEncontrados++;
        
        this.actualizarTextoHUD();

        if (window.gestorLogros) {
            window.gestorLogros.verificarAcierto(this.estadisticas.movimientosTotales, this.estadisticas.paresEncontrados);
        }

        // Check if game ended
        if (this.estadisticas.paresEncontrados === window.estadoJuego.paresTotales) {
            if (window.temporizadorJuego) window.temporizadorJuego.detener();
            if (window.gestorLogros) {
                const dificultad = window.estadoJuego ? window.estadoJuego.dificultadSeleccionada : 'facil';
                const tiempo = window.temporizadorJuego ? window.temporizadorJuego.tiempoTranscurrido : 999;
                window.gestorLogros.verificarFinJuego(tiempo, dificultad);
            }
            setTimeout(() => {
                this.mostrarPantallaFin();
            }, 800);
        }
    },

    manejarMovimiento(esAcierto) {
        this.estadisticas.movimientosTotales++;
        const activo = this.estadisticas.jugadorActivo;
        this.estadisticas[activo].movimientos++;
        
        this.actualizarTextoHUD();

        const modo = window.estadoJuego ? (window.estadoJuego.modoActual || window.estadoJuego.modoSeleccionado) : 'solitario';
        if (!esAcierto) {
            if (window.gestorLogros) window.gestorLogros.verificarFallo();
        }
        
        if (modo === 'multijugador') {
            if (!esAcierto) {
                // Swap turns
                this.estadisticas.jugadorActivo = activo === 'jugador1' ? 'jugador2' : 'jugador1';
                this.establecerJugadorActivo(this.estadisticas.jugadorActivo);
            }
        }
    },

    mostrarPantallaFin() {
        const modal = document.createElement('div');
        modal.id = 'end-screen-modal';
        modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:10000;color:white;font-family:system-ui,sans-serif;';

        const modo = window.estadoJuego ? (window.estadoJuego.modoActual || window.estadoJuego.modoSeleccionado) : 'solitario';
        let textoResultado = `<h2 style="font-size:2.5rem;margin-bottom:1rem;color:#FF6204">¡Partida Finalizada!</h2><p style="font-size:1.2rem;margin-bottom:0.5rem;">Movimientos totales: ${this.estadisticas.movimientosTotales}</p>`;
        
        if (modo === 'multijugador') {
            const j1 = this.estadisticas.jugador1;
            const j2 = this.estadisticas.jugador2;
            textoResultado += `<p style="font-size:1.2rem;margin-bottom:0.5rem;">${j1.nombre}: ${j1.puntaje} pares</p>`;
            textoResultado += `<p style="font-size:1.2rem;margin-bottom:1.5rem;">${j2.nombre}: ${j2.puntaje} pares</p>`;
            
            if (j1.puntaje > j2.puntaje) {
                textoResultado += `<h3 style="font-size:2rem;color:#FF6204">¡Ganador: ${j1.nombre}!</h3>`;
            } else if (j2.puntaje > j1.puntaje) {
                textoResultado += `<h3 style="font-size:2rem;color:#FF6204">¡Ganador: ${j2.nombre}!</h3>`;
            } else {
                textoResultado += `<h3 style="font-size:2rem;color:#FF6204">¡Empate!</h3>`;
            }
        } else if (modo === 'solitario') {
            const elementoTemporizador = document.getElementById('timer-count');
            if (elementoTemporizador) textoResultado += `<p style="font-size:1.2rem;margin-bottom:1.5rem;">Tiempo: ${elementoTemporizador.textContent}</p>`;
        }

        const logrosDesbloqueados = window.gestorLogros ? window.gestorLogros.obtenerLogrosDesbloqueados() : [];
        if (logrosDesbloqueados.length > 0) {
            textoResultado += `<div style="margin-top: 1rem; background: rgba(0,0,0,0.25); padding: 1rem; border-radius: 8px;">`;
            textoResultado += `<h4 style="color:#FF6204; margin-bottom: 0.5rem; font-size: 1.1rem;">Logros Desbloqueados en Sesión:</h4>`;
            textoResultado += `<ul style="list-style: none; padding: 0; margin: 0; text-align: left; display: inline-block;">`;
            logrosDesbloqueados.forEach(a => {
                textoResultado += `<li style="font-size: 0.95rem; margin-bottom: 0.3rem;">🏆 <strong>${a.titulo}</strong>: ${a.descripcion}</li>`;
            });
            textoResultado += `</ul></div>`;
        }

        modal.innerHTML = `
            <div style="background: #222; padding: 3rem; border-radius: 16px; text-align: center; max-width: 500px; width: 90%; border: 2px solid #555;">
                ${textoResultado}
                <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center;">
                    <button id="btn-replay" style="background:#FF6204; color:white; border:none; padding: 1rem 2rem; border-radius: 8px; cursor: pointer; font-size: 1.1rem; font-weight: bold;">Jugar de Nuevo</button>
                    <button id="btn-menu" style="background:#444; color:white; border:none; padding: 1rem 2rem; border-radius: 8px; cursor: pointer; font-size: 1.1rem; font-weight: bold;">Menú Principal</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('btn-replay').addEventListener('click', () => {
            document.body.removeChild(modal);
            const botonJugar = document.getElementById('play-button');
            if(botonJugar) botonJugar.click();
        });

        document.getElementById('btn-menu').addEventListener('click', () => {
            document.body.removeChild(modal);
            window.location.reload(); 
        });
    }
};