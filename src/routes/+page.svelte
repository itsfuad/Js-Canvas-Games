<script lang="ts">
  // Import Svelte's `onMount` function
  import { onMount } from 'svelte';

  // Define a type for the game
  type Game = {
    name: string;
    path: string;
  };

  // Define an array of games
  let games: Game[] = [];

  // Populate the games array on component mount
  onMount(() => {
    games = [
      { name: 'Flappy Bird', path: '/games/flappybird' },
      { name: 'Snake', path: '/games/snake' },
      { name: 'Space Shooter', path: '/games/spaceshooter' },
      { name: 'Tetris', path: '/games/tetris' },
      { name: 'Tic Tac Toe', path: '/games/tictactoe' }
    ];
  });
</script>

<style>
  .game-list {
    list-style-type: none;
    padding: 0;
  }

  .game-item {
    margin: 10px 0;
  }

  .game-link {
    text-decoration: none;
    color: #0070f3;
  }

  .game-link:hover {
    text-decoration: underline;
  }
</style>

<main>
  <h1>Welcome to the Game Collection</h1>
  <ul class="game-list">
    {#each games as game}
      <li class="game-item">
        <a class="game-link" href={game.path}>{game.name}</a>
      </li>
    {/each}
  </ul>
</main>
