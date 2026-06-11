// achievements.js - Lógica de logros y notificaciones flotantes
const logrosSesion = [
    { id: 'primer_par', titulo: 'Primer paso', desbloqueado: false, descripcion: 'Encontrar el primer par.' },
    { id: 'racha_caliente', titulo: 'Racha caliente', desbloqueado: false, descripcion: '3 pares consecutivos sin fallar.' },
    { id: 'velocista', titulo: 'Velocista', desbloqueado: false, descripcion: 'Completar en Fácil en menos de 30 segundos.' },
    { id: 'sin_titubeos', titulo: 'Sin titubeos', desbloqueado: false, descripcion: 'Encontrar un par en tu primer intento.' }
];

// Variables auxiliares para controlar las rachas
let contadorParesConsecutivos = 0; // Contador auxiliar para rastrear la "Racha caliente"

function notificarLogro(logro){
    const notificacion = document.createElement('div');
    notificacion.className = 'toast';
    notificacion.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: #FF6204; color: white; padding: 1rem; border-radius: 8px; z-index: 10000; box-shadow: 0 4px 12px rgba(0,0,0,0.5); transform: translateY(100px); opacity: 0; transition: transform 0.3s ease, opacity 0.3s ease; display: flex; flex-direction: column; gap: 0.25rem; font-family: system-ui, sans-serif;';
    
    notificacion.innerHTML = `
        <strong style="font-size: 1.1rem;">🏆 ¡Logro Desbloqueado!</strong>
        <span style="font-size: 1rem; font-weight: bold;">${logro.titulo}</span>
        <span style="font-size: 0.85rem; opacity: 0.9;">${logro.descripcion}</span>
    `;
    
    document.body.appendChild(notificacion);
    
    // Animar entrada
    setTimeout(() => {
        notificacion.style.transform = 'translateY(0)';
        notificacion.style.opacity = '1';
    }, 10);
    
    // Desaparecer después de 4 segundos
    setTimeout(() => {
        notificacion.style.transform = 'translateY(100px)';
        notificacion.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(notificacion)) {
                document.body.removeChild(notificacion);
            }
        }, 300);
    }, 4000);
}

window.gestorLogros = {
    reiniciarSesion: function() {
        contadorParesConsecutivos = 0;
    },
    
    verificarAcierto: function(movimientosTotales, paresEncontrados) {
        contadorParesConsecutivos++;
        
        const primerPar = logrosSesion.find(a => a.id === 'primer_par');
        if (!primerPar.desbloqueado && paresEncontrados === 1) {
            primerPar.desbloqueado = true;
            notificarLogro(primerPar);
        }

        const sinTitubeos = logrosSesion.find(a => a.id === 'sin_titubeos');
        if (!sinTitubeos.desbloqueado && movimientosTotales === 1 && paresEncontrados === 1) {
            sinTitubeos.desbloqueado = true;
            notificarLogro(sinTitubeos);
        }

        const rachaCaliente = logrosSesion.find(a => a.id === 'racha_caliente');
        if (!rachaCaliente.desbloqueado && contadorParesConsecutivos === 3) {
            rachaCaliente.desbloqueado = true;
            notificarLogro(rachaCaliente);
        }
    },
    
    verificarFallo: function() {
        contadorParesConsecutivos = 0;
    },
    
    verificarFinJuego: function(tiempoTranscurrido, dificultad) {
        const velocista = logrosSesion.find(a => a.id === 'velocista');
        if (!velocista.desbloqueado && dificultad === 'facil' && tiempoTranscurrido < 30) {
            velocista.desbloqueado = true;
            notificarLogro(velocista);
        }
    },

    obtenerLogrosDesbloqueados: function() {
        return logrosSesion.filter(a => a.desbloqueado);
    }
};
