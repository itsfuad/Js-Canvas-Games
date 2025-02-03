<script lang="ts">
  import { onMount } from 'svelte';

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  let x = Math.random() * window.innerWidth;
  let y = Math.random() * window.innerHeight;

  const size = 40;
  const strech = size;
  const radius = 20;

  function draw() {
    ctx.lineWidth = 5;

    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.arc(x, y - radius / 2 + 5, radius, 0, Math.PI * 2, false);
    ctx.stroke();
    ctx.closePath();
    ctx.strokeStyle = 'hotpink';

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + size, y + size + strech);
    ctx.lineTo(x - size, y + size + strech);
    ctx.lineTo(x, y);
    ctx.lineTo(x + size, y + size + strech);
    ctx.stroke();
    ctx.closePath();

    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.arc(x, y + size * 4 + 15, radius, 0, Math.PI * 2, false);
    ctx.stroke();
    ctx.closePath();

    ctx.strokeStyle = 'hotpink';
    ctx.strokeRect(x - size, y + size * 2 + 15, size * 2, size * 2);
  }

  function animation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
    requestAnimationFrame(animation);
  }

  onMount(() => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    window.addEventListener('mousemove', (evt) => {
      x = evt.clientX;
      y = evt.clientY;
    });

    animation();
  });
</script>

<canvas bind:this={canvas}></canvas>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    overflow: hidden;
    cursor: none;
  }

  canvas {
    background-color: #111521;
  }
</style>
