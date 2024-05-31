// Obtener el mejor tiempo de reacción almacenado en el almacenamiento local o establecerlo en Infinity si no hay ninguno
let bestReactionTime = parseFloat(localStorage.getItem('bestReactionTime')) || Infinity;

// Elementos DOM
const trafficLight = document.getElementById('traffic-light');
const reactionTimeDisplay = document.getElementById('reaction-time');
const messageDisplay = document.getElementById('message');

// Función para encender todas las luces
function encenderLuces() {
    trafficLight.querySelectorAll('.light').forEach(light => light.classList.remove('off'));
}

// Función para apagar todas las luces
function apagarLuces() {
    trafficLight.querySelectorAll('.light').forEach(light => light.classList.add('off'));
}

// Función para iniciar el semáforo
function startTrafficLight() {
    apagarLuces();

    // Encender las luces una por una
    let delay = 1000;
    trafficLight.querySelectorAll('.light').forEach(light => {
        setTimeout(() => light.classList.remove('off'), delay);
        delay += 1000;
    });

    // Apagar las luces aleatoriamente después de un tiempo
    setTimeout(() => {
        if (!spaceKeyPressed) {
            apagarLuces();
            greenLightTime = new Date().getTime();
        }
    }, 6000);
}

// Función para medir la reacción
function measureReaction(event) {
    if ((event.code === 'Space' || event.type === 'touchstart') && greenLightTime === undefined) {
        reactionTimeDisplay.textContent = 'SALIDA FALSA';
        reactionTimeDisplay.classList.add('salidaFalsa');
        encenderLuces();
        messageDisplay.textContent = 'Presiona F5 para reiniciar';
        spaceKeyPressed = true;
    } else if ((event.code === 'Space' || event.type === 'touchstart') && greenLightTime) {
        reactionTime = new Date().getTime() - greenLightTime;
        reactionTimeDisplay.textContent = `Tiempo de reacción: ${reactionTime} ms`;

        // Actualizar el mejor tiempo de reacción si es necesario
        if (reactionTime < bestReactionTime) {
            bestReactionTime = reactionTime;
            messageDisplay.textContent = `¡Nuevo mejor tiempo! ${bestReactionTime} ms`;
            localStorage.setItem('bestReactionTime', bestReactionTime);
        } else {
            messageDisplay.textContent = 'Presiona F5 para reiniciar';
        }

        // Desactivar los eventos de teclado y táctiles
        document.removeEventListener('keydown', measureReaction);
        document.removeEventListener('touchstart', measureReaction);
        clearTimeout(lightTimeout);
    }
}

// Evento para medir la reacción con teclado
document.addEventListener('keydown', measureReaction);

// Evento para medir la reacción con pantalla táctil
document.addEventListener('touchstart', measureReaction);

// Iniciar el semáforo
startTrafficLight();

// Evento para el movimiento del ratón
document.addEventListener('mousemove', function(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const offsetX = (mouseX - window.innerWidth / 2) / 100; 
    const offsetY = (mouseY - window.innerHeight / 2) / 100; 
    document.body.style.backgroundPosition = `${50 + offsetX}% ${50 + offsetY}%`;
});

// Función que se ejecuta cuando se carga la página
window.onload = function() {
    if (bestReactionTime !== Infinity) {
        messageDisplay.innerHTML = `Mejor tiempo: ${bestReactionTime} ms <br> Presiona F5 para reiniciar`;
    } else {
        messageDisplay.textContent = 'Presiona espacio cuando la luz se ponga verde.';
    }
};
