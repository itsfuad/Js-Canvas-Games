<script lang="ts">
  import { onMount } from 'svelte';

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  let score = 0;
  let highscore = parseInt(localStorage.getItem('itf_hgs') || '0');
  let isGameOver = false;
  let jump = false;
  let paused = false;
  let deltatime: number;
  let currentTime: number;
  let lastTime = Date.now();
  let gravity = 3;
  let levels = 1;

  class OBJECT {
    canvas: HTMLCanvasElement;
    w: number;
    h: number;
    color: string;
    position: { x: number; y: number; x2: number; y2: number };
    speed: { x: number; y: number; x2: number; y2: number };

    constructor(canvas: HTMLCanvasElement) {
      this.canvas = canvas;
      this.w = 30;
      this.h = 30;
      this.color = 'yellow';
      this.position = { x: 0, y: 0, x2: 0, y2: 0 };
      this.speed = { x: 0, y: 0, x2: 0, y2: 0 };
    }

    update(deltatime: number) {
      if (!paused) {
        deltatime = deltatime / 10;
        if (!jump) {
          this.speed.y = gravity;
        } else {
          this.speed.y = -gravity * 1.7;
        }
        this.position.y += this.speed.y * deltatime;
        this.position.x += this.speed.x * deltatime;
      }
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.position.x, this.position.y, this.w, this.h);
      ctx.fillStyle = '#1b1b1b';
      ctx.fillRect(this.position.x + 15, this.position.y + 5, this.w / 10, this.h / 10);
      ctx.fillRect(this.position.x + 20, this.position.y + 5, this.w / 6, this.h / 8);
      ctx.fillStyle = 'white';
      ctx.fillRect(this.position.x - 5, this.position.y + 15, this.w / 5, this.h / 5);
      ctx.fillStyle = '#AAFFAE';
      ctx.fillRect(this.position.x + 2, this.position.y + 10, this.w / 2, this.h / 2);
    }

    colision() {
      if (this.position.y + this.h >= canvas.height || this.position.y <= 0) {
        this.position.y = canvas.height - this.h;
        gameOver();
      }
    }

    objectColision(target: Bar) {
      if (
        this.position.x < target.position.x + target.w &&
        this.position.x + this.w + 6 > target.position.x &&
        this.position.y < target.position.y + target.h &&
        this.position.y + this.h > target.position.y
      ) {
        gameOver();
      }
      if (
        this.position.x < target.position.x2 + target.w2 &&
        this.position.x + this.w > target.position.x2 &&
        this.position.y < target.position.y2 + target.h2 &&
        this.position.y + this.h > target.position.y2
      ) {
        gameOver();
      }
    }
  }

  class Bar extends OBJECT {
    w2: number;
    h2: number;
    color2: string;

    constructor(canvas: HTMLCanvasElement) {
      super(canvas);
      this.w2 = 30;
      this.h2 = 30;
      this.color2 = 'yellow';
    }

    update() {
      if (!paused) {
        score += 0.015;
        this.position.x -= this.speed.x + levels / 30;
        this.position.x2 -= this.speed.x2 + levels / 30;
      }
    }

    generate() {
      if (this.position.x + this.w <= 0) {
        levels++;
        this.h = Math.floor(Math.random() * canvas.width) + 50;
        this.position.x = this.canvas.width;
        this.position.y = 0;
        this.h2 = canvas.height - (this.h + 200);
        this.position.y2 = this.h + 200;
        this.position.x2 = this.canvas.width;
      }
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.position.x, this.position.y, this.w, this.h);
      ctx.fillStyle = this.color2;
      ctx.fillRect(this.position.x2, this.position.y2, this.w2, this.h2);
    }
  }

  function gameOver() {
    if (score > highscore) {
      highscore = score;
      localStorage.setItem('itf_hgs', Math.floor(highscore).toString());
    }
    levels = 1;
    isGameOver = true;
    document.getElementById('gameovermsg')?.classList.add('on');
  }

  function handleJump() {
    jump = true;
    setTimeout(() => {
      jump = false;
    }, 120);
  }

  let bird: OBJECT;
  let bar: Bar;

  function initScene() {
    isGameOver = false;
    score = 0;
    bird.color = 'lightyellow';
    bird.position.x = 40;
    bird.position.y = 200;
    bird.h = 20;
    bird.w = 20;

    bar.h = 200;
    bar.position.x = canvas.width;
    bar.speed.x = 3;
    bar.color = 'lightgreen';

    bar.speed.x2 = 3;
    bar.color2 = 'lightgreen';

    bar.h2 = canvas.height - (bar.h + 200);
    bar.position.y2 = bar.position.y + bar.h + 200;
    bar.position.x2 = canvas.width;
    lastTime = Date.now();
  }

  const cloud = new Image();
  cloud.src = 'src/cloud-small-small.png';
  const cloud2 = new Image();
  cloud2.src = 'src/cloud-small-small.png';

  let cx1 = canvas.width,
    cy1 = 0,
    cx2 = 0,
    cy2 = 0;

  function createCloud() {
    if (cx1 <= -cloud.width) {
      cx1 = canvas.width;
      cy1 = Math.floor(Math.random() * canvas.height / 2) + 20;
    }
    if (cx2 <= -cloud.width) {
      cx2 = canvas.width;
      cy2 = Math.floor(Math.random() * canvas.height / 2) + 20;
    }
    if (!paused) {
      cx1 -= 0.5;
      cx2 -= 0.9;
    }

    ctx.drawImage(cloud, cx1, cy1);
    ctx.drawImage(cloud2, cx2, cy2);
  }

  function gameLoop() {
    if (isGameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentTime = Date.now();
    deltatime = currentTime - lastTime;
    lastTime = currentTime;
    createCloud();
    bar.generate();
    bar.update(deltatime);
    bar.draw(ctx);

    bird.update(deltatime);
    bird.draw(ctx);
    bird.colision();
    bird.objectColision(bar);

    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + Math.floor(score).toString(), 10, 20);
    ctx.fillText('High Score: ' + Math.floor(highscore), 10, 40);

    requestAnimationFrame(gameLoop);
  }

  const play = () => {
    paused = false;
    initScene();
    gameLoop();
    document.getElementById('play')!.style.display = 'none';
    document.getElementById('gameovermsg')?.classList.remove('on');
  };

  onMount(() => {
    bird = new OBJECT(canvas);
    bar = new Bar(canvas);

    document.addEventListener('keydown', (e) => {
      if (isGameOver && e.key === 'Enter') {
        play();
      } else if (e.key === ' ') {
        handleJump();
      } else if (e.key === 'p' || e.key === 'P') {
        paused = !paused;
        document.querySelector('.pause')!.textContent = paused ? '▶️' : '⏸️';
      }
    });

    document.addEventListener('click', () => {
      handleJump();
    });

    document.querySelector('.pause')?.addEventListener('click', () => {
      paused = !paused;
      document.querySelector('.pause')!.textContent = paused ? '▶️' : '⏸️';
    });

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('sw-flappybird.js?v=3')
          .then((reg) => console.log('Service Worker Registered'))
          .catch((err) => console.log(`Service Worker: Error ${err}`));
      });
    }

    document.addEventListener('DOMContentLoaded', () => {
      paused = true;
      initScene();
      gameLoop();
    });
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
    background: #f5faff;
    color: black;
    font-family: Arial, Helvetica, sans-serif;
    overscroll-behavior: contain;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  #canvas {
    background-color: #88c2f6;
    background-image: url('src/images.png');
    background-blend-mode: normal;
    background-size: contain;
    background-repeat: no-repeat;
    background-position-y: bottom;
    border-radius: 10px;
    border: 2px solid #88c2f6;
  }
  .pause {
    position: fixed;
    color: black;
    font-size: 40px;
    padding: 10px;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 10px;
  }
  .pause:hover {
    cursor: pointer;
  }
  #play {
    font-size: 30px;
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
  #play:hover {
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

<main>
  <div class="pause">⏸️</div>
  <div id="play" on:click={play}>Tap to Play</div>
  <div id="gameovermsg">
    <div class="msg">Game Over</div>
    <div class="reload" on:click={play}>Restart</div>
  </div>
  <canvas id="canvas" bind:this={canvas} width="300" height="520"></canvas>
</main>
