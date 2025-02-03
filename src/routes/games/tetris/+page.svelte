<script lang="ts">
  import { onMount } from 'svelte';

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  onMount(() => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    // Initialize the game
    Init();
    Loop();
  });

  function Init() {
    Page.Initialize();
    Player.Initialize();
  }

  function Loop() {
    Page.Update();
    if (Player.IsAlive) {
      Player.Update();
    }
    window.requestAnimationFrame(Loop);
  }

  function DrawText(text: string, color: string, weight: string, alignment: CanvasTextAlign, size: number, left: number, top: number) {
    ctx.font = `${weight} ${size}px "Jura", sans-serif`;
    ctx.textAlign = alignment;
    ctx.fillStyle = color;
    ctx.fillText(text, left, top);
  }

  function ColorWithAlpha(color: string, alpha: number) {
    let retColor = 'rgba' + color.substring(3, color.length - 1);
    retColor += ',' + alpha + ')';
    return retColor;
  }
</script>

<canvas bind:this={canvas} width="220" height="400"></canvas>

<style>
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  body {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
    overflow-y: hidden;
    overscroll-behavior: contain;
    user-select: none;
  }
</style>
