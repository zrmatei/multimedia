let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")
let x = 0
let y = 0
let width = 200
let height = 200 
const speed = 5


canvas.style.backgroundColor = "grey"

function draw(x, y){
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientWidth)
    ctx.fillStyle = "blue"
    ctx.fillRect(x, y, width, height) //dimensiunile formei desenate
}

//deplasare spre dreapta cu repozitionare la dr cand ies in afara
function move() {
    x += speed;

    if(x > canvas.clientWidth){
        x = -width;
    }
    draw(x,y)
}

//deplasare spre st cu repoztionare la dr cand ies in afara
function moveReverse() {
    x -= speed

    if(x + width < 0){
        x = canvas.clientWidth
    }
    draw(x,y)
}

//miscare pe verticala cu repozitionare sus (idem ca sus, doar ca schimb x in y)
function moveVertical() {
    y += speed

    if(y > canvas.clientHeight){
        y = -height
    }
    
    draw(x, y)
}

function moveDiagonal() {
    x += speed
    y += speed

    if(x > canvas.clientWidth || y > canvas.clientHeight){
        x = -width //puteam sa pun 0, dar nu e la fel de fluida animatia
        y = -height
    }

    draw(x, y)
}
setInterval(moveDiagonal, 16)