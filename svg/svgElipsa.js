let svg = document.getElementById("svg")
let cerc = document.getElementById("elipsa")
svg.style.backgroundColor = "grey"
let x = parseFloat(cerc.getAttribute("cx"))
let y = parseFloat(cerc.getAttribute("cy"))
let rx = parseFloat(cerc.getAttribute("rx"))
let ry = parseFloat(cerc.getAttribute("ry"))
let speed = 5

//la fel ca la cerc, doar adaug atributele rx si ry (la cerc aveam doar o singura raza)
function moveElipsa() {
    x += speed

    if(x - rx > svg.clientWidth){
        x = -rx
    }

    cerc.setAttribute("cx", x)
}

function moveElipsaReverse() {
    x -= speed

    if(x + rx < 0){
        x = svg.clientWidth
    }

    cerc.setAttribute("cx", x)
}

function moveElipsaDiag() {
    x += speed
    y += speed

    if(x + rx > svg.clientWidth || y + ry > svg.clientHeight){
        x = -rx
        y = -ry
    }

    cerc.setAttribute("cx", x)
    cerc.setAttribute("cy", y)
}

setInterval(moveElipsaDiag, 16)