const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

ctx.font = '16px Arial';

let x = 0, y = 0;
let score = 0, highscore = localStorage.getItem('hit_hsc')||0;
let timeT = 60;
let over = false;
let free = true;
let arr = 0;
const doge = new Image();
doge.src = 'src/images/doge.png';


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const drawDoge = () => {
    x = Math.floor(Math.random()*(canvas.width - 55));
    y = Math.floor(Math.random()*(canvas.height - 47) + 50);
    ctx.drawImage(doge, 0, arr, 55, 47, x, y, 55, 47);
    
   // ctx.drawImage(doge, 0, 0);
}

canvas.addEventListener('touchstart', async (evt) => {
    let tx = getTouches(evt)[0].clientX;
    let ty = getTouches(evt)[0].clientY;
    
    if ((tx >= x && tx <= x + 55)
    && (ty >= y && ty <= y + 47)){
  //  ctx.clearRect(0,0,canvas.width, canvas.height);
      if (free){
          arr = 88;
      ctx.drawImage(doge, 0, arr, 55, 47, x, y, 55, 47);
      score++;
      free = false;
      await sleep(300);
      free = true;
      arr = 0;
      }
    
    }
});
function getTouches(evt) {
    return evt.touches || // browser API
        evt.originalEvent.touches; // jQuery
}

async function timer(){
    if(timeT <= 0){
        gameover();
    }
    else{
        timeT--;
        await sleep(1000);
    }
    //requestAnimationFrame(timer);
    timer();
}
function gameover(){
    if (score >= highscore){
        localStorage.setItem("hit_hsc", score);
    }
    over=true;
}

//drawDoge();
const gameLoop = async () => {
  if(!over){
       
    
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.textAlign = "start";
    ctx.fillStyle = 'black';
    ctx.fillText(`Score: ${score}`, 10, 20);
    ctx.fillText(`High Score: ${highscore}`, 10, 40);
    ctx.textAlign = "end";
    ctx.fillText(`Time remaining: ${timeT} seconds`, canvas.width - 10, 30);
    drawDoge();
    await sleep(500);
    //timer();
   requestAnimationFrame(gameLoop);
  }
    
}
timer();
gameLoop();