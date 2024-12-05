const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


let directionX = 0, directionY = 0;
let size = 20;
let positions = [];
let ax = 0, ay = 0;
let upTimeId;
let isGameOver = false;
let paused = false;
let speed = 300;
let highscore = parseInt(localStorage.getItem('hsc')) || 0;

let xDown = null;
let yDown = null;


function update() {
    if (!paused) {
        if (positions[positions.length - 1].x + size >= canvas.width && directionX == 20) {

            gameover();
        }
        else if (positions[positions.length - 1].y + size >= canvas.height && directionY == 20) {

            gameover();
        }
        else if (positions[positions.length - 1].x <= 0 && directionX == -20) {

            gameover();
        }
        else if (positions[positions.length - 1].y <= 0 && directionY == -20) {


            gameover();
        }
        else {

            if (directionX != 0 || directionY != 0) {
                positions.push({ x: positions[positions.length - 1].x, y: positions[positions.length - 1].y });
                positions.shift();

            }
            positions[positions.length - 1].x += directionX;
            positions[positions.length - 1].y += directionY;

        }
    }
}

function selfCollision() {
    for (let i = 0; i < positions.length; i++) {
        for (let j = 1; j < i; j++) {
            if (positions[i].x == positions[j].x
                && positions[i].y == positions[j].y) {

                console.log(positions[i].x, ' = ', positions[j].x, '\n', positions[i].y, ' = ', positions[j].y);

                gameover();
                return;
            }
        }
    }
}

function gameover() {

    isGameOver = true;

    document.getElementById('gameovermsg').classList.add('on');

    if (positions.length - 3 > highscore) {
        highscore = positions.length - 3;
        localStorage.setItem('hsc', highscore);
    }

}





function gen() {
    ax = Math.floor(Math.random() * canvas.width);
    ay = Math.floor(Math.random() * canvas.width);
    if (ax % 20 !== 0 || ay % 20 != 0) {
        gen();
    }
    else {
        positions.forEach(element => {

            if (element.x == ax && element.y == ay) {

                gen();
            }
        });
    }
}

function food() {
    ctx.fillStyle = '#ffb18f';
    positions.forEach(element => {

        if (element.x == ax && element.y == ay) {
            positions.unshift({ x: ax, y: ay });

            gen();
            if (speed <= 100) {
                speed = 100;
            } else {
                speed -= 20;
            }
        }
    });
    ctx.fillRect(ax, ay, 20, 20);
}

function draw() {
    for (let i = positions.length - 1; i >= 0; i--) {
        ctx.fillStyle = (i == positions.length - 1) ? '#39ffe5' : '#adf7ea';
        ctx.fillRect(positions[i].x, positions[i].y, 20, 20);
    }
}

function reset() {
    isGameOver = false;
    directionX = 0;
    directionY = 0;
    size = 20;
    positions = [{ x: 220, y: 240 }, { x: 200, y: 240 }, { x: 180, y: 240 }];
    ax = 0;
    ay = 0;
    speed = 300;
}

ctx.font = "16px Arial";
ctx.fillStyle = 'black';

function gameLoop() {
    if (isGameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    food();
    selfCollision();
    update();
    draw();
    ctx.fillStyle = 'black';
    ctx.fillText(`Score: ${positions.length - 3}`, 20, 20);
    ctx.fillText(`High Score: ${highscore}`, 20, 50);
    console.log(speed);
    setTimeout(gameLoop, speed);
}

document.addEventListener("keydown", (e) => {


    if (isGameOver && e.key == 'Enter') {
        play();
    }
    else if (e.key == 'p' || e.key == 'P') {
        paused = !paused;
        pausebtn.innerText = pausebtn.innerText == '⏸️' ? '▶️' : '⏸️';
    }


});


document.addEventListener('keydown', (evt) => {

    if (!paused) {
        switch (evt.key) {
            case 'ArrowLeft':
                directionX = directionX == 20 ? 20 : -20;
                directionY = 0;
                break;
            case 'ArrowRight':
                directionX = directionX == -20 ? -20 : 20;
                directionY = 0;
                break;
            case 'ArrowUp':
                directionX = 0;
                directionY = directionY == 20 ? 20 : -20;
                break;
            case 'ArrowDown':
                directionX = 0;
                directionY = directionY == -20 ? -20 : 20;
                break;
        }
    }
});

document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);


function getTouches(evt) {
    return evt.touches ||
        evt.originalEvent.touches;
}

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
};

// Function to reset touch coordinates
function resetTouchCoordinates() {
    xDown = null;
    yDown = null;
}

// Function to handle horizontal swipe
function handleHorizontalSwipe(xDiff) {
    if (xDiff > 0) {
        directionX = directionX === 20 ? 20 : -20;
        directionY = 0;
    } else {
        directionX = directionX === -20 ? -20 : 20;
        directionY = 0;
    }
}

// Function to handle vertical swipe
function handleVerticalSwipe(yDiff) {
    if (yDiff > 0) {
        directionX = 0;
        directionY = directionY === 20 ? 20 : -20;
    } else {
        directionX = 0;
        directionY = directionY === -20 ? -20 : 20;
    }
}

// Main function to handle touch move
function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }

    let xUp = evt.touches[0].clientX;
    let yUp = evt.touches[0].clientY;

    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;

    if (!paused) {
        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            handleHorizontalSwipe(xDiff);
        } else {
            handleVerticalSwipe(yDiff);
        }
    }

    resetTouchCoordinates();
}



const pausebtn = document.getElementsByClassName('pause')[0];

pausebtn.addEventListener('click', () => {
    paused = !paused;
    pausebtn.innerText = pausebtn.innerText == '⏸️' ? '▶️' : '⏸️';
});



const play = () => {

    reset();
    gen();

    gameLoop();
    document.getElementById('gameovermsg').classList.remove('on');
}

if ('serviceWorker' in navigator) {

    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('sw-snake.js?v=3')
            .then(reg => console.log("Service Worker Registered"))
            .catch(err => console.log(`Service Worker: Error ${err}`));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    play();
});
