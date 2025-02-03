<script lang="ts">
  import { onMount } from 'svelte';

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  let directionX = 0, directionY = 0;
  let size = 20;
  let positions: { x: number, y: number }[] = [];
  let ax = 0, ay = 0;
  let isGameOver = false;
  let paused = false;
  let speed = 300;
  let highscore = parseInt(localStorage.getItem('hsc') || '0');

  let xDown: number | null = null;
  let yDown: number | null = null;

  function update() {
    if (!paused) {
      if (positions[positions.length - 1].x + size >= canvas.width && directionX == 20) {
        gameover();
      } else if (positions[positions.length - 1].y + size >= canvas.height && directionY == 20) {
        gameover();
      } else if (positions[positions.length - 1].x <= 0 && directionX == -20) {
        gameover();
      } else if (positions[positions.length - 1].y <= 0 && directionY == -20) {
        gameover();
      } else {
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
        if (positions[i].x == positions[j].x && positions[i].y == positions[j].y) {
          gameover();
          return;
        }
      }
    }
  }

  function gameover() {
    isGameOver = true;
    document.getElementById('gameovermsg')?.classList.add('on');
    if (positions.length - 3 > highscore) {
      highscore = positions.length - 3;
      localStorage.setItem('hsc', highscore.toString());
    }
  }

  function gen() {
    ax = Math.floor(Math.random() * canvas.width);
    ay = Math.floor(Math.random() * canvas.width);
    if (ax % 20 !== 0 || ay % 20 != 0) {
      gen();
    } else {
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
    setTimeout(gameLoop, speed);
  }

  function handleTouchStart(evt: TouchEvent) {
    const firstTouch = evt.touches[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
  }

  function handleTouchMove(evt: TouchEvent) {
    if (!xDown || !yDown) {
      return;
    }

    let xUp = evt.touches[0].clientX;
    let yUp = evt.touches[0].clientY;

    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;

    if (!paused) {
      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
          directionX = directionX === 20 ? 20 : -20;
          directionY = 0;
        } else {
          directionX = directionX === -20 ? -20 : 20;
          directionY = 0;
        }
      } else {
        if (yDiff > 0) {
          directionX = 0;
          directionY = directionY === 20 ? 20 : -20;
        } else {
          directionX = 0;
          directionY = directionY === -20 ? -20 : 20;
        }
      }
    }

    xDown = null;
    yDown = null;
  }

  function play() {
    reset();
    gen();
    gameLoop();
    document.getElementById('gameovermsg')?.classList.remove('on');
  }

  onMount(() => {
    canvas = document.getElementById('canvas') as HTMLCanvasElement;
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    document.addEventListener('keydown', (e) => {
      if (isGameOver && e.key == 'Enter') {
        play();
      } else if (e.key == 'p' || e.key == 'P') {
        paused = !paused;
        document.getElementsByClassName('pause')[0].innerHTML = paused ? '▶️' : '⏸️';
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

    document.getElementsByClassName('pause')[0].addEventListener('click', () => {
      paused = !paused;
      document.getElementsByClassName('pause')[0].innerHTML = paused ? '▶️' : '⏸️';
    });

    play();
  });
</script>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    position: fixed;
    display: flex;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
    background: #f3fbfb;
    color: black;
    font-family: Arial, Helvetica, sans-serif;
    overscroll-behavior: contain;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  #canvas {
    background-color: #e9fcf6;
    border: 10px solid #c8f5e0;
    border-radius: 10px;
    font-family: Arial, Helvetica, sans-serif;
  }
  .pause {
    position: fixed;
    color: black;
    padding: 10px;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 10px;
    font-size: 40px;
  }
  .pause:hover {
    cursor: pointer;
  }
  #gameovermsg {
    display: none;
  }
  #gameovermsg.on {
    position: fixed;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
    border-radius: 10px;
    color: rgb(0, 0, 0);
    background: rgba(255, 255, 255, 0.8);
  }
  #gameovermsg .msg {
    font-size: 50px;
  }
  #gameovermsg .msg:hover {
    cursor: default;
  }
  #gameovermsg .reload:hover {
    cursor: pointer;
  }
</style>

<div class="pause">⏸️</div>
<div id="gameovermsg">
  <div class="msg">Game Over</div>
  <div class="reload" on:click={play}>Restart</div>
</div>
<canvas id="canvas" height="520" width="340"></canvas>
