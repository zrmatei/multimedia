let svg = document.getElementById("svg")
let rect = document.getElementById("patrat")
svg.style.backgroundColor = "blue"
//iau valorile initiale ale lui x, y, w, h
let x = parseFloat(rect.getAttribute("x"))
let y = parseFloat(rect.getAttribute("y"))
let width = parseFloat(rect.getAttribute("width"))
let height = parseFloat(rect.getAttribute("height"))
const speed = 5

//Functiile sunt la fel si pentru svg, doar ca nu mai trebuie sa scriu codul ce deseneaza forma
function moveSVG() {
    x += speed

    if(x > svg.clientWidth){
        x = -width
    }

    rect.setAttribute("x", x) //actualizez valoarea lui x
}

// adun width-ul sau height-ul (in functie de caz) doar la reverse
function moveSvgReverse() {
    x -= speed

    if(x + width < 0){
        x = svg.clientWidth
    }

    rect.setAttribute("x",x)
}

function moveDiag() {
    x += speed
    y += speed

    if(x > svg.clientWidth || y > svg.clientHeight){
        x = -width
        y = -height
    }

    rect.setAttribute("x",x)
    rect.setAttribute("y",y)
}

setInterval(moveDiag, 16)