const MOUSE_LEFT = 0; MOUSE_RIGHT = 2, KEY_DEL = 46;
var x1 = 0; y1 = 0, x2 = 0, y2 = 0;
var selected_shape = null;
var shape = "";
var op_list = [];
var moving_shape = null;
var offsetX = 0, offsetY = 0
var create_new_shape = false; // pt blocare posibilitate creare forme cand mut forma selectata
var draw_path = false;
var current_path = 0;
var path_points = [];
var counter_path_pressed = 0; // folosesc contor pt a nu mai crea 2 butoane (start/stop path)

var editor = document.getElementById("editor");
var line_selected = document.getElementById("line_selected");
var ellipse_selected = document.getElementById("ellipse_select");
var rectangle_selected = document.getElementById("rect_select");
var color = document.getElementById("shape_color");
var bg_color = document.getElementById("bg_color_btn")
var toggle = document.getElementById("toggle_path")

document.getElementById("line").onclick = () => { shape = "line"; };
document.getElementById("ellipse").onclick = () => { shape = "ellipse"; };
document.getElementById("rectangle").onclick = () => { shape = "rectangle"; };
document.getElementById("undo_btn").onclick = undoLast;
document.getElementById("export_svg_btn").onclick = () => {
    const content = editor.outerHTML; // continut svg
    const blob = new Blob([content], { type: "image/svg+xml" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "test.svg";
    link.click();
};
document.getElementById("export_png_btn").onclick = savePng;
window.onload = loadStorage;


function setLine(obj, x1, y1, x2, y2) {
    obj.setAttributeNS(null, "x1", x1);
    obj.setAttributeNS(null, "y1", y1);
    obj.setAttributeNS(null, "x2", x2);
    obj.setAttributeNS(null, "y2", y2);
}

function setEllipse(obj, x1, y1, x2, y2) {
    obj.setAttributeNS(null, "cx", (x1 + x2) / 2);
    obj.setAttributeNS(null, "cy", (y1 + y2) / 2);
    obj.setAttributeNS(null, "rx", Math.abs(x2 - x1) / 2);
    obj.setAttributeNS(null, "ry", Math.abs(y2 - y1) / 2);
}

function setRect(obj, x1, y1, x2, y2) {
    obj.setAttributeNS(null, "x", Math.min(x1, x2));
    obj.setAttributeNS(null, "y", Math.min(y1, y2));
    obj.setAttributeNS(null, "width", Math.abs(x2 - x1));
    obj.setAttributeNS(null, "height", Math.abs(y2 - y1));
}

// la apasare mouse
editor.onmousedown = function (e) {
    if (e.button === MOUSE_LEFT) {

        const target = e.target;
        if(target.tagName == "line" || target.tagName == "ellipse" || target.tagName == "rect"){
            moving_shape = target;

            switch(target.tagName){
                case "line":
                    offsetX = e.pageX - parseFloat(target.getAttribute("x1"));
                    offsetY = e.pageY - parseFloat(target.getAttribute("y1"));
                    break;
                case "ellipse":
                    offsetX = e.pageX - parseFloat(target.getAttribute("cx"));
                    offsetY = e.pageY - parseFloat(target.getAttribute("cy"));
                    break;
                case "rect":
                    offsetX = e.pageX - parseFloat(target.getAttribute("x"));
                    offsetY = e.pageY - parseFloat(target.getBoundingClientRect().top);
                    break;
            }
        }else{
            x1 = e.pageX - this.getBoundingClientRect().left;
            y1 = e.pageY - this.getBoundingClientRect().top;
            x2 = x1;
            y2 = y1;
            switch (shape) {
                case "line":
                    setLine(line_selected, x1, y1, x2, y2);
                    line_selected.style.display = "block";
                    break;
                case "ellipse":
                    setEllipse(ellipse_selected, x1, y1, x2, y2);
                    ellipse_selected.style.display = "block";
                    break;
                case "rectangle":
                    setRect(rectangle_selected, x1, y1, x2, y2);
                    rectangle_selected.style.display = "block";
                    break;
                
            }
        }
    }
};

// la miscare mouse
editor.onmousemove = function (e) {
    if(moving_shape){
        const mouseX = e.pageX - editor.getBoundingClientRect().left;
        const mouseY = e.pageY - editor.getBoundingClientRect().top;
        
        // actualizare pozitie forma pe baza poz mouse-ului
        switch (moving_shape.tagName) {
            case "line":
                const dx = mouseX - offsetX;
                const dy = mouseY - offsetY;
                const x2_offset = parseFloat(moving_shape.getAttribute("x2")) - parseFloat(moving_shape.getAttribute("x1"));
                const y2_offset = parseFloat(moving_shape.getAttribute("y2")) - parseFloat(moving_shape.getAttribute("y1"));
                moving_shape.setAttribute("x1", dx);
                moving_shape.setAttribute("y1", dy);
                moving_shape.setAttribute("x2", dx + x2_offset);
                moving_shape.setAttribute("y2", dy + y2_offset);
                break;
            case "ellipse":
                moving_shape.setAttribute("cx", mouseX - offsetX);
                moving_shape.setAttribute("cy", mouseY - offsetY);
                break;
            case "rect":
                moving_shape.setAttribute("x", mouseX - offsetX);
                moving_shape.setAttribute("y", mouseY - offsetY);
                break;
        }
    }else{
        x2 = e.pageX - this.getBoundingClientRect().left;
        y2 = e.pageY - this.getBoundingClientRect().top;
        switch (shape) {
            case "line":
                setLine(line_selected, x1, y1, x2, y2);
                break;
            case "ellipse":
                setEllipse(ellipse_selected, x1, y1, x2, y2);
                break;
            case "rectangle":
                setRect(rectangle_selected, x1, y1, x2, y2);
                break;
        }
        saveStorage();
    }
};

// la release mouse
editor.onmouseup = function (e) {
    if (e.button === MOUSE_LEFT) {

        // blochez posibilitatea de a mai crea forme in timp ce mut o forma
        if (moving_shape) {
            moving_shape = null; 
            return;
        }

        let new_shape = null;
        let shape_color = color.value;
        moving_shape = null;

        switch (shape) {
            case "line":
                line_selected.style.display = "none";
                new_shape = document.createElementNS("http://www.w3.org/2000/svg", "line");
                setLine(new_shape, x1, y1, x2, y2);
                new_shape.setAttribute("stroke", shape_color);
                new_shape.setAttribute("stroke-width", 2)
                break;
            case "ellipse":
                ellipse_selected.style.display = "none";
                new_shape = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
                setEllipse(new_shape, x1, y1, x2, y2);
                new_shape.setAttribute("fill", shape_color);
                break;
            case "rectangle":
                rectangle_selected.style.display = "none";
                new_shape = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                setRect(new_shape, x1, y1, x2, y2);
                new_shape.setAttribute("fill", shape_color);
                break;
        }
        if (new_shape) {
            editor.appendChild(new_shape);
            op_list.push({ type: "add", element: new_shape }); // salvez operatia in istoric
            new_shape.onmousedown = function (e) {
                if (e.button === MOUSE_RIGHT) {
                    selected_shape = new_shape;
                }
            };
        }

        create_new_shape = true; // pot sa creez alte forme daca nu apas pe una curenta
        saveStorage();
    }
};

document.onkeydown = function (e) {
    if (e.keyCode === KEY_DEL && selected_shape){
        op_list.push({ type: "delete", element: selected_shape }) // salvez elem sters in istoric
        selected_shape.remove();
        saveStorage();
    }
};

editor.oncontextmenu = function (e) {
    e.preventDefault();
};

function undoLast() {
    if (op_list.length > 0) {
        const last = op_list.pop();
        switch (last.type) {
            case "add":
                last.element.remove(); // sterg elem adaugat
                break;
            case "delete":
                editor.appendChild(last.element); // re-adaug elem sters
                break;
        }
    }else{
        alert("Empty operation list!")
    }
}

// schimb culoare svg
bg_color.onclick = () => {
    const color_picker = document.createElement("input");
    color_picker.type = "color";
    document.body.appendChild(color_picker);
    
    color_picker.addEventListener("input", (e) => {
        editor.style.backgroundColor = e.target.value;
    });
};

function savePng(){
    const canvas = document.createElement("canvas");
    canvas.width = 1600;
    canvas.height = 800;

    // conversie svg - canvas prin desen svg pe canvas
    const svg = new XMLSerializer().serializeToString(editor);
    let img = new Image();
    img.onload = function () {
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        // export canvas ca png
        let url = canvas.toDataURL("image/png");
        let link = document.createElement("a");
        link.href = url;
        link.download = "image.png";
        link.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svg);
}

toggle.onclick = () => {
    if(counter_path_pressed % 2 == 0){
        line.disabled = rectangle.disabled = ellipse.disabled = undo_btn.disabled = true;
        draw_path = true;
        current_path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        current_path.setAttribute("stroke", "black");
        current_path.setAttribute("stroke-width", 2);
        current_path.setAttribute("fill", "none");
        editor.appendChild(current_path);
    }else{
        line.disabled = rectangle.disabled = ellipse.disabled = undo_btn.disabled = false;
        draw_path = false;
    }
    counter_path_pressed++;
}

function updatePath() {
    const d = path_points.map((p,i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    current_path.setAttribute("d", d)
}

editor.onclick = function(e){
    if(draw_path === false)
        return;
    const x = e.pageX - editor.getBoundingClientRect().left;
    const y = e.pageY - editor.getBoundingClientRect().top;
    path_points.push({x,y});
    updatePath();
}

function saveStorage() {
    const svg_content = editor.innerHTML;
    const operations = op_list.map(op => ({
        type: op.type,
        element: op.element.outerHTML
    }));
    localStorage.setItem("drawing", JSON.stringify({ svg: svg_content, operations }));
}

function loadStorage() {
    const saved = localStorage.getItem("drawing");
    if (saved) {
        const data = JSON.parse(saved);
        editor.innerHTML = data.svg;

        // iterez lista de op si compar ce am in storage cu DOM-ul meu
        op_list = data.operations.map(op => {
            const old_element = Array.from(editor.children).find(el => el.outerHTML === op.element);

            // adaug evenimentele pe continutul comun
            if (old_element) {
                old_element.onmousedown = (e) => {
                    if (e.button === MOUSE_RIGHT) {
                        selected_shape = old_element;
                    }
                };
            }
            return { type: op.type, element: old_element };
        });
    }
}