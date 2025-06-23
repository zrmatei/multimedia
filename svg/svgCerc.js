let svg = document.getElementById("svg")
let cerc = document.getElementById("cerc")
svg.style.backgroundColor = "grey"
let x = parseFloat(cerc.getAttribute("cx"))
let y = parseFloat(cerc.getAttribute("cy"))
let raza = parseFloat(cerc.getAttribute("r"))
let speed = 5

//cercul e singurul in ambele (canvas si svg) unde scad raza
function moveSVGCircle() {
    x += speed

    if(x - raza > svg.clientWidth){
        x = -raza
    }

    cerc.setAttribute("cx", x)
}

function moveReverseCircle() {
    x -= speed

    if(x + raza < 0){
        x = svg.clientWidth
    }

    cerc.setAttribute("cx", x)
}

function moveDiagSVG() {
    x += speed
    y += speed

    if(x - raza > svg.clientWidth || x - raza > svg.clientWidth){
        x = -raza
        y = -raza
    }

    cerc.setAttribute("cx", x)
    cerc.setAttribute("cy", y)
}

setInterval(moveDiagSVG, 16)