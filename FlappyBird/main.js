const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.font =  "16px Arial";

let score = 0, highscore = parseInt(window.localStorage.getItem('itf_hgs')) || 0;

let isGameOver = false;
let jump = false;
let paused = false;
let deltatime, currentTime, lastTime = Date.now();
let gravity = 3;
let levels = 1;
let frame;
//let jumpSound = new Audio("src/jump.wav");
//let levelUpsound = new Audio("src/levelup.wav");
//let bgsound = new Audio("src/bg.wav");

class object {
    constructor(canvas){
        this.canvas = canvas;
        this.w = 30;
        this.h = 30;
        this.color = 'yellow'; 
        this.position = {x: 0, y: 0, x2: 0, y2: 0};
        this.speed = {x: 0, y: 0, x2: 0, y2: 0};
    }
    update(deltatime){
        //console.log("Update");
        if (!paused){
            deltatime = deltatime / 10;
            if (jump == false) { //console.log(deltatime);
                this.speed.y = gravity;
            }
            else {
                this.speed.y = -gravity * 1.7;
            }
            this.position.y += this.speed.y * deltatime;
            this.position.x += this.speed.x * deltatime;
        }
    }
    draw(ctx){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.w, this.h);
          ctx.fillStyle = '#1b1b1b';
          
        ctx.fillRect(this.position.x + 15, this.position.y + 5, this.w/10, this.h/10);
         ctx.fillRect(this.position.x + 20, this.position.y + 5, this.w/6, this.h/8);
         ctx.fillStyle = 'white';
         ctx.fillRect(this.position.x - 5, this.position.y + 15, this.w/5, this.h/5);
         ctx.fillStyle = '#AAFFAE';
          ctx.fillRect(this.position.x + 2, this.position.y + 10, this.w/2, this.h/2);
    }
    colision(){
        if(this.position.y + this.h >= canvas.height
            || this.position.y <= 0){
            //console.log("colision");
            this.position.y = canvas.height - this.h;
           // alert('colision');
            gameOver();
        }
    }
    objectColision(target){
        //console.log("Hello");
        ////console.log(this.position.x);
        ////console.log(target.position.x);
        if((this.position.x) < (target.position.x + target.w)
        && (this.position.x+this.w + 6) > target.position.x
        && (this.position.y) < (target.position.y + target.h)
        && (this.position.y+this.h) > target.position.y){
            
           // alert('objcoli1');
            gameOver();
        }
        if((this.position.x) < (target.position.x2 + target.w2)
        && (this.position.x+this.w) > target.position.x2
        && (this.position.y) < (target.position.y2 + target.h2)
        && (this.position.y+this.h) > target.position.y2){
         //  alert('objcoli2');
            gameOver();
        }
    }
}

class Bar extends object{
    constructor(canvas){
        super(canvas);
        this.w2 = 30;
        this.h2 = 30;
        this.color2 = 'yellow'; 
    }
    update(){
        if(!paused){
            
            score += 0.015;
            
            this.position.x -= this.speed.x + levels / 30;
            this.position.x2 -= this.speed.x2 + levels / 30;
        }
    }
    generate(){
        //console.log(pos);
        if(this.position.x+this.w <= 0){
            //levelUpsound.play();
            levels++;
            this.h = Math.floor(Math.random()* canvas.width) + 50;
            this.position.x = this.canvas.width;
            this.position.y = 0;
            this.h2 = canvas.height - (this.h + 200);
            this.position.y2 = this.h + 200;
            this.position.x2 = this.canvas.width;
        }
    }
    draw(ctx){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.w, this.h);
        ctx.fillStyle = this.color2;
        ctx.fillRect(this.position.x2, this.position.y2, this.w2, this.h2);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const gameOver = () => {
    //console.log("GameOver");
    if (score > highscore){ 
        highscore = score;
        window.localStorage.setItem("itf_hgs", Math.floor(highscore).toString());
    }
    levels = 1;
   // alert('h');
    isGameOver = true;
    
    document.getElementById('gameovermsg').classList.add('on');

}

document.addEventListener("keydown", async (e) => {
    //console.log("Jumped");

    if (isGameOver == true && e.key == 'Enter'){
        play();
    }
    else if (e.key == ' '){
        jump = true;
        await sleep(120);
        jump = false;
    }
    else if(e.key == 'p' || e.key == 'P'){
          paused = !paused;
          pausebtn.innerText = pausebtn.innerText == '⏸️' ? '▶️' : '⏸️';
    }
    //console.log("Normal");
   // jumpSound.play();
});

document.addEventListener("click", async () => {
    //console.log("Jumped");
    jump = true;
    await sleep(120);
    jump = false;
    //console.log("Normal");
   // jumpSound.play();
});

let bird, bar;
bird = new object(canvas);
bar = new Bar(canvas);

function initScene(){
    //console.log("Init");
    isGameOver = false;
    score = 0;
    bird.color = "lightyellow";
    bird.position.x = 40;
    bird.position.y = 200;
    bird.h = 20;
    bird.w = 20;

    bar.h = 200;
    bar.position.x = canvas.width;
    bar.speed.x = 3;
    bar.color = "lightgreen";

    
    bar.speed.x2 = 3;
    bar.color2 = "lightgreen";

    bar.h2 = canvas.height - (bar.h + 200);
    bar.position.y2 = bar.position.y + bar.h + 200;
    bar.position.x2 = canvas.width;
    lastTime = Date.now();

}

const cloud = new Image();
cloud.src = 'src/cloud-small-small.png';
const cloud2 = new Image();
cloud2.src = 'src/cloud-small-small.png';

let cx1 = canvas.width, cy1 = 0, cx2 = 0, cy2 = 0; 
const createCloud = () => {
    if (cx1 <= -cloud.width) {
        cx1 = canvas.width
        cy1 = Math.floor(Math.random()*canvas.height/2)+20;
    }
    if (cx2 <= -cloud.width) {
        cx2 = canvas.width
        cy2 = Math.floor(Math.random()*canvas.height/2)+20;
    }
    if (!paused){
        cx1 -= 0.5;
        cx2 -= 0.9;
    }
  
    ctx.drawImage(cloud, cx1, cy1);
    ctx.drawImage(cloud2, cx2, cy2);
}

const gameLoop = () => {
    if (isGameOver) return;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
    
    ctx.fillStyle = "black";
    ctx.fillText("Score: "+Math.floor(score).toString(), 10, 20);
    ctx.fillText("High Score: "+Math.floor(highscore), 10, 40);
    //console.log("GameLoop");
    frame = requestAnimationFrame(gameLoop);
}

const pausebtn = document.getElementsByClassName('pause')[0];

pausebtn.addEventListener('click',()=>{
    paused = !paused;
    pausebtn.innerText = pausebtn.innerText == '⏸️'? '▶️':'⏸️';
});
//bgsound.play();

const playbtn = document.getElementById('play');

const play = ()=>{
    //console.log("Play");
    cancelAnimationFrame(frame);
    paused = false;
    initScene();
    gameLoop();
    playbtn.style.display = 'none';
    document.getElementById('gameovermsg').classList.remove('on');
}

if ('serviceWorker' in navigator){
    
    window.addEventListener('load', () => {
        navigator.serviceWorker
        .register('sw-flappybird.js?v=3')
        .then(reg => console.log("Service Worker Registered"))
        .catch(err => console.log(`Service Worker: Error ${err}`));
    });
}

document.addEventListener('DOMContentLoaded', (event) => {
    paused = true;
    initScene();
    gameLoop();
});
