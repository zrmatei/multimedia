let canvas = document.getElementById("canvas")
canvas.style.backgroundColor = "black"
let ctx = canvas.getContext("2d")
let x = 0
let y = 60
let raza = 60
const speed = 5

//OBS: Singurul lucru in plus la cerc/elipsa (daca folosesc svg) e ca la miscari trebuie sa scad raza
// ex: x - raza > canvas.clientWidth, NU x > canvas.clientWidth simplu

function drawCircle(x, y) {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
    ctx.beginPath() //pt a porni desenarea
    ctx.arc(x, y, raza, 0, 2 * Math.PI) //setez cercul
    ctx.fillStyle = "red" //astea 2 sunt pentru setarea culorii + umplerea cu acea culoare
    ctx.fill()
}

function moveCircleNormal() {
    x += speed

    if(x - raza > canvas.clientWidth){
        x = -raza
    }

    drawCircle(x, y)
}


function moveCircleDiag() {
    x += speed
    y += speed

    //cercul a iesit din canvas (tinand cont de raza)
    if(x - raza > canvas.clientWidth || y - raza > canvas.clientHeight){
        x = -raza
        y = -raza
    }

    drawCircle(x, y)
}

setInterval(moveCircleNormal, 16)