// Verificar si hay un mejor tiempo de reacción almacenado en el almacenamiento local
let bestReactionTime = localStorage.getItem('bestReactionTime');
if (!bestReactionTime) {
    bestReactionTime = Infinity; // Si no hay ningún tiempo almacenado, establecerlo en Infinity
} else {
    bestReactionTime = parseFloat(bestReactionTime); // Convertir el tiempo almacenado a un número flotante
}

// Resto del código

let greenLightTime;
let reactionTime;
let lightTimeout;
let spaceKeyPressed = false; // Variable de control

const trafficLight = document.getElementById('traffic-light');
const luzUno = trafficLight.children[0];
const luzDos = trafficLight.children[1];
const luzTres = trafficLight.children[2];
const luzCuatro = trafficLight.children[3];
const luzCinco = trafficLight.children[4];
const reactionTimeDisplay = document.getElementById('reaction-time');
const messageDisplay = document.getElementById('message');

function apagarLuces() {
    luzUno.classList.add('off');
    luzDos.classList.add('off');
    luzTres.classList.add('off');
    luzCuatro.classList.add('off');
    luzCinco.classList.add('off');
}

function encenderLuces() {
    luzUno.classList.remove('off');
    luzDos.classList.remove('off');
    luzTres.classList.remove('off');
    luzCuatro.classList.remove('off');
    luzCinco.classList.remove('off');
}

function startTrafficLight() {
    apagarLuces();

    // Encendemos las luces una por una
    setTimeout(() => luzUno.classList.remove('off'), 1000);
    setTimeout(() => luzDos.classList.remove('off'), 2000);
    setTimeout(() => luzTres.classList.remove('off'), 3000);
    setTimeout(() => luzCuatro.classList.remove('off'), 4000);
    setTimeout(() => luzCinco.classList.remove('off'), 5000);

    // Establecemos un temporizador para apagar las luces aleatoriamente
    esperarUnsegundo = setTimeout(() => {
        esperarTiempoRandom = setTimeout(() => {
            if (spaceKeyPressed) return;
            apagarLuces();
            greenLightTime = new Date().getTime();
        }, Math.random() * 2000);
    }, 6000);
}

function measureReaction(event) {
    if ((event.code === 'Space' || event.type === 'touchstart') && greenLightTime == undefined) {
        reactionTimeDisplay.textContent = `SALIDA FALSA`;
        reactionTimeDisplay.classList.add('salidaFalsa');
        encenderLuces();
        messageDisplay.textContent = 'Presiona F5 para reiniciar';
        spaceKeyPressed = true; 
    } else if ((event.code === 'Space' || event.type === 'touchstart') && greenLightTime) {
        reactionTime = (new Date().getTime()) - greenLightTime;
        reactionTimeDisplay.textContent = `Tiempo de reacción: ${reactionTime} ms`;

        // Actualizar el mejor tiempo de reacción si es necesario
        if (reactionTime < bestReactionTime) {
            bestReactionTime = reactionTime;
            messageDisplay.textContent = `¡Nuevo mejor tiempo! ${bestReactionTime} ms`;

            // Guardar el nuevo mejor tiempo en el almacenamiento local
            localStorage.setItem('bestReactionTime', bestReactionTime);
        } else {
            messageDisplay.textContent = 'Presiona F5 para reiniciar';
        }

        document.removeEventListener('keydown', measureReaction);
        document.removeEventListener('touchstart', measureReaction);
        clearTimeout(lightTimeout);
    }
}

document.addEventListener('keydown', measureReaction);
document.addEventListener('touchstart', measureReaction);

startTrafficLight();

document.addEventListener("mousemove", function(event) {
    var mouseX = event.clientX;
    var mouseY = event.clientY;
    var offsetX = (mouseX - window.innerWidth / 2) / 100; 
    var offsetY = (mouseY - window.innerHeight / 2) / 100; 
    document.body.style.backgroundPosition = `${50 + offsetX}% ${50 + offsetY}%`;
});

window.onload = function() {
    const messageDisplay = document.getElementById('message');
    if (bestReactionTime !== Infinity) {
        messageDisplay.textContent = `Mejor tiempo: ${bestReactionTime} ms |\n Presiona F5 para reiniciar`;
    } else {
        messageDisplay.textContent = 'Presiona espacio cuando la luz se ponga verde.';
    }
};
