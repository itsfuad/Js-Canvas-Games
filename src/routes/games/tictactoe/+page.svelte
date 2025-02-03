<script lang="ts">
  import { onMount } from 'svelte';

  let cells: HTMLElement[] = [];
  let message: HTMLElement;
  let text: HTMLElement;
  let close: HTMLElement;
  let hint: HTMLElement;
  let button = Math.round(Math.random());
  let turn = button ? '😘' : '💙';
  let pc_turn = button ? '💙' : '😘';
  let played_tiles = 0;

  onMount(() => {
    cells = Array.from(document.getElementsByClassName('cell')) as HTMLElement[];
    message = document.getElementsByClassName('message')[0] as HTMLElement;
    text = document.getElementsByClassName('text')[0] as HTMLElement;
    close = document.getElementsByClassName('close')[0] as HTMLElement;
    hint = document.getElementsByClassName('hint')[0] as HTMLElement;

    hint.innerText += turn;

    if (!button) {
      computer();
    }

    cells.forEach(cell => {
      cell.addEventListener('click', () => {
        if (cell.innerText != '💙' && cell.innerText != '😘') {
          cell.style.color = button ? '#ff6969' : 'skyblue';
          cell.innerText = turn;
          played_tiles++;
          who(win());
          computer();
        }
      });
    });

    close.addEventListener('click', () => {
      reset();
    });
  });

  function who(state: number) {
    if (state == 1) {
      if (turn == '💙') {
        text.innerText = "You won";
      } else {
        text.innerText = "Computer won";
      }
      message.classList.add('active');
    } else if (state == 2) {
      if (turn == '😘') {
        text.innerText = "You won";
      } else {
        text.innerText = "Computer won";
      }
      message.classList.add('active');
    } else if (state == 3) {
      text.innerText = "Tie";
      message.classList.add('active');
      return;
    }
  }

  function computer() {
    let pc_pos = Math.floor(Math.random() * 8);

    if (played_tiles >= 9) {
      who(win() ? 0 : 3);
    } else if (cells[pc_pos].innerText != '💙' && cells[pc_pos].innerText != '😘') {
      cells[pc_pos].innerText = pc_turn;
      cells[pc_pos].style.color = !button ? '#ff6969' : 'skyblue';
      played_tiles++;
      who(win());
    } else {
      computer();
    }
  }

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  function checkWin(player: string) {
    return winningCombinations.some(combination => {
      return combination.every(index => cells[index].innerText === player);
    });
  }

  function win() {
    if (checkWin('💙')) {
      return 1;
    } else if (checkWin('😘')) {
      return 2;
    }
    return 0;
  }

  function reset() {
    cells.forEach(cell => {
      cell.innerText = '';
    });
    played_tiles = 0;
    button = Math.round(Math.random());
    turn = button ? '😘' : '💙';
    pc_turn = button ? '💙' : '😘';
    hint.innerText = `Your Symbol is ${turn}`;
    message.classList.remove('active');
  }
</script>

<style>
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  body {
    position: absolute;
    display: flex;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
    background: #23262e;
    font-family: Arial, Helvetica, sans-serif;
    overscroll-behavior: contain;
    user-select: none;
    z-index: 1;
  }

  .title {
    position: fixed;
    top: 30px;
    font-size: 40px;
    z-index: 10;
    color: white;
  }

  .hint {
    position: fixed;
    top: 80px;
    font-size: 30px;
    z-index: 10;
    color: white;
  }

  #canvas {
    position: absolute;
    min-height: max-content;
    min-width: max-content;
    background-color: #EBEBEB;
    display: grid;
    justify-content: center;
    align-items: center;
    grid-gap: 2px;
    grid-template-columns: repeat(3, 1fr);
    font-size: 80px;
    z-index: 2;
    overflow: hidden;
  }

  #canvas .cell {
    font-family: 'Courier New', Courier, monospace;
    position: relative;
    transition: 300ms;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 120px;
    width: 120px;
    background: #23262e;
  }

  #canvas .cell:hover {
    cursor: pointer;
  }

  .message {
    z-index: 10;
    position: absolute;
    background-color: rgba(255, 255, 255, 0.8);
    color: black;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;
    border-radius: 3px;
    transition: 300ms;
    transform: scale(0) rotate(0);
  }

  .message .text {
    position: relative;
    font-size: 40px;
  }

  .message .close {
    position: relative;
    padding: 5px;
    background-color: black;
    color: white;
    border-radius: 3px;
    transition: 300ms;
    font-size: 30px;
  }

  .message .close:hover {
    cursor: pointer;
    background: brown;
  }

  .message.active {
    transform: scale(1) rotate(360deg);
  }
</style>

<div class="title">Tic-Tac-Toe</div>
<div class="hint">Your Symbol is&nbsp;</div>
<div class="message">
  <div class="text">You</div>
  <div class="close">Ok</div>
</div>
<div id="canvas">
  <div class="cell" id="cell-1"></div>
  <div class="cell" id="cell-2"></div>
  <div class="cell" id="cell-3"></div>
  <div class="cell" id="cell-4"></div>
  <div class="cell" id="cell-5"></div>
  <div class="cell" id="cell-6"></div>
  <div class="cell" id="cell-7"></div>
  <div class="cell" id="cell-8"></div>
  <div class="cell" id="cell-9"></div>
</div>
