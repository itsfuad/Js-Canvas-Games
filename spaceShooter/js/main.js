const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let x = Math.random()*canvas.width;
let y = Math.random()*canvas.height;

let size = 40;
let strech = size;
let radius = 20;


window.addEventListener("mousemove", (evt) => {
    x = evt.x;
    y = evt.y;
});

function draw(){
    ctx.lineWidth = 5;
    
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.arc(x,y-radius/2+5, radius, 0, Math.PI*2, false);
    ctx.stroke();
    ctx.closePath();
    ctx.strokeStyle = "hotpink";
    //ctx.strokeSize = 10;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x+size, y+size+strech);
    ctx.lineTo(x-size, y+size+strech);
    ctx.lineTo(x,y);
    ctx.lineTo(x+size, y+size+strech);
    ctx.stroke();
    ctx.closePath();
    
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.arc(x,y + size*4+15, radius, 0, Math.PI*2, false);
    ctx.stroke();
    ctx.closePath();
    
    ctx.strokeStyle = "hotpink";
    ctx.strokeRect(x - size, y + size*2+15, size*2, size*2);
}



function animation(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    draw();
    requestAnimationFrame(animation);
}
animation();
