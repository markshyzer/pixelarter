let body = document.getElementsByTagName("body")[0]
let palate = document.getElementById('palate')
let toolbar = document.getElementById('toolbar')
let paintPots = document.getElementById('paintPots')

WIDTH = 20
HEIGHT = 20
TOOLS = ['draw', 'paint', 'fill', 'spray', 'toggleGrid', 'clear',  'resize', 'download']
// COLORS loaded from colorcodes.js
selected_color = 'black'
tool = 'draw'
grid = true

initCanvas()
TOOLS.forEach(createTool)
Object.keys(COLORS).forEach(createPaintPot)

paintPots.addEventListener('click', function(e){
    document.getElementById(selected_color).classList.remove('selected')
    selected_color = e.target.style.backgroundColor
    document.getElementById(selected_color).classList.add('selected')
})

toolbar.addEventListener('click', function(e){        
    if (e.target.id == 'clear'){
        if (confirm('Erase everything and start over?')){
            clearAll()
        }
    } else if (e.target.id == 'toggleGrid') {
        toggleGrid()
    } else if (e.target.id == 'resize') {
        resize()
    } else if (e.target.id == 'download') {
        download()  
    } else {
        document.getElementById(tool).classList.remove('selected')
        tool = e.target.id
        document.getElementById(tool).classList.add('selected')
    }
})

function initCanvas(){
    canvas = document.createElement('div')
    canvas.id = 'canvas'
    body.appendChild(canvas)
    if (HEIGHT >= WIDTH){
        canvas.style.width = 90*(WIDTH/HEIGHT) + 'vh'
        canvas.style.height = '90vh'
    } else {
        canvas.style.width = '60vw'
        canvas.style.height = 60/(WIDTH/HEIGHT) + 'vw'
    }
    pixel = document.createElement("div")
    pixel.className = "pixel"
    pixel.style.backgroundColor = 'white'
    pixel.style.width = String(100 / WIDTH) + '%'
    pixel.style.height = String(100 / HEIGHT) + '%'
    body.appendChild(canvas)
    addBlankSquares()
    addeventListenersToCanvas()
}

function addBlankSquares(){
    for (let row = 0; row < HEIGHT; row++){
        for (let col = 0; col <WIDTH; col++){
            pixel.id = row + ',' + col
            canvas.appendChild(pixel.cloneNode(true))
        }
    }
}

function createTool(t){
    let toolButton = document.createElement('div')
    toolButton.className = 'toolButton'
    toolButton.id = t
    toolButton.title = t
    toolbar.appendChild(toolButton)
}

function createPaintPot(color) {
    let paintColor = document.createElement("div")
    paintColor.className = 'paintPot'
    paintColor.title = color
    paintColor.id = color
    paintColor.style.backgroundColor = color
    paintPots.appendChild(paintColor)
}

function resize(){
    if (confirm('Resizing will clear the canvas. Continue?')){
        let input = prompt("Enter canvas width in pixels:")
        if (parseInt(input) && input > 0 && input < 150){
            WIDTH = parseInt(input)
        } else {
            alert("Width must be a number from 1 to 150")
            return
        }
        input = prompt("Enter canvas height in pixels:")
        if (parseInt(input) && input > 0 && input < 150){
            HEIGHT = parseInt(input)
        } else {
            alert("Height must be a number from 1 to 150")
            return
        }
    }
    clearAll()
}

function addeventListenersToCanvas(){
    canvas.addEventListener('click', function(e){
        id = e.target.id
        if (id !== 'canvas'){
            if (tool == 'fill'){
                fill(e.target.id, e.target.style.backgroundColor, selected_color)
            } else {
                startPainting(e)
            }
        }
    })
    canvas.addEventListener('mousedown', function(e){
        canvas.addEventListener('mouseenter', startPainting, true)
    })
    document.addEventListener('mouseup', stopPainting)
}

function clearAll(){
        canvas.remove()
        initCanvas()
}

// Fills all adjacent squares of the same colour recursively
function fill(centerId, blank, fillColor){
    let row = parse_id(centerId)[0]
    let col = parse_id(centerId)[1]
    if (row < 0 || row >= HEIGHT || col < 0 || col >= WIDTH ){
        return
    }
    let center = document.getElementById(centerId)
    if (center.style.backgroundColor == blank) {
        center.style.backgroundColor = fillColor
        fill(parse_id([row-1,col]), blank, fillColor)
        fill(parse_id([row+1,col]), blank, fillColor)
        fill(parse_id([row,col+1]), blank, fillColor)
        fill(parse_id([row,col-1]), blank, fillColor)
    } 
}

function startPainting(e){
    id = e.target.id
    if (id !== 'canvas'){
        if (tool == 'draw'){
            paint([id])
        } else if (tool == 'paint'){
            nozzle = thickBrush(id)
            paint(nozzle)
        } else if (tool == 'spray'){
            nozzle = sprayBrush(id)
            paint(nozzle)
        }
    }
}

// Returns a list of the selected square its neighbouring squares
function thickBrush(id){
    row = parse_id(id)[0]
    col = parse_id(id)[1]
    return [parse_id([row,col]), parse_id([row+1,col]), parse_id([row-1,col]), parse_id([row,col+1]), parse_id([row,col-1]) ]
}

// Randomly filters squares out of the thickBrush to create a spraypaint effect
function sprayBrush(id){
    brush = thickBrush(id)
    return brush.filter( x => !Math.floor(Math.random() * 6))
}

// takes an array of square ids and changes the colour of each one
function paint(squares){ 
    squares.forEach(function (i){
        document.getElementById(i).style.backgroundColor = selected_color
    })
}

function stopPainting(e){
    canvas.removeEventListener('mouseenter', startPainting, true)
}

async function download(){
    // Creates a 2D array of each square on the canvas
    let children = canvas.children;
    let array = []
    let arrayRow = [] 
    console.log(typeof children)
    for (let i = 0; i < children.length; i++) {
            let child = children[i];
            col = child.style.backgroundColor
            arrayRow.push(COLORS[col])
        if (i % WIDTH == WIDTH-1){
            array.push(arrayRow)
            arrayRow = [] 
        }    
    }  
    // Hits the backend API and downloads the resulting PNG file  
    await fetch('/download/', {
    method: 'post',
    body: JSON.stringify({'art': array}),
    headers: { "X-CSRFToken": CSRF_TOKEN }
  })
    .then( res => res.blob() )
    .then( blob => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = "pixelart.png";
        document.body.appendChild(a); // Firefox compatibility
        a.click();    
        a.remove();
    })
}

// Toggle visibility of grid on canvas
function toggleGrid(){
    let children = canvas.children;
    if (grid){
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            child.style.border = 'none'
        }
    } else {
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            child.style.border = 'thin dotted lightblue'
        }
    }
    grid = !grid
}

// Converts square ids from comma-separated strings to a 2-item list, or vice versa
function parse_id(id){
    if (typeof id == typeof 'string'){
        row = parseInt(id.split(',')[0])
        col = parseInt(id.split(',')[1])
        return [row, col]
    } else if (typeof id == typeof [1,2]){
        return id[0] + ',' + id[1]
    }
}

// Formats a list of 3 numbers into a string for CSS
function rgb(c){
    return `rgb(${c[0]},${c[1]},${c[2]})`
}