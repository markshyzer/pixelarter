let body = document.getElementsByTagName("body")[0]
// let canvas = document.getElementById('canvas')


let canvas = document.createElement('div')
canvas.id = 'canvas'
body.appendChild(canvas)

let palate = document.getElementById('palate')

SIZE = 35*35
LINE = Math.sqrt(SIZE)
COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'white', 'black', 'brown']
TOOLS = ['draw', 'fill', 'paint', 'clear', 'toggleGrid', 'spray', 'save', '', '', '']
console.log('Line size', LINE)
color = 'black'
tool = 'draw'
grid = true

COLORS = ['white', 'black', 'silver', 'gray', 'red', 'maroon', 'yellow', 'olive', 'lime', 'green', 'aqua', 'teal', 'blue', 'navy', 'magenta', 'purple']
COLORS = ['rebeccapurple', 'white', 'whitesmoke', 'gainsboro', 'lightgray', 'silver', 'darkgray', 'gray', 'dimgray', 'black', 'snow', 'mistyrose', 'lightcoral', 'indianred', 'rosybrown', 'red', 'firebrick', 'darkred', 'maroon', 'brown', 'seashell', 'linen', 'lightsalmon', 'darksalmon', 'coral', 'orangered', 'tomato', 'salmon', 'sienna', 'saddlebrown', 'oldlace', 'antiquewhite', 'bisque', 'peachpuff', 'burlywood', 'tan', 'sandybrown', 'darkorange', 'chocolate', 'peru', 'floralwhite', 'papayawhip', 'blanchedalmond', 'moccasin', 'wheat', 'navajowhite', 'gold', 'orange', 'goldenrod', 'darkgoldenrod', 'lightyellow', 'cornsilk', 'beige', 'lightgoldenrodyellow', 'lemonchiffon', 'yellow', 'khaki', 'palegoldenrod', 'darkkhaki', 'olive', 'ivory', 'honeydew', 'lightgreen', 'palegreen', 'chartreuse', 'lawngreen', 'greenyellow', 'yellowgreen', 'olivedrab', 'darkolivegreen', 'mintcream', 'mediumspringgreen', 'springgreen', 'lime', 'limegreen', 'darkseagreen', 'forestgreen', 'green', 'darkgreen', 'lightcyan', 'paleturquoise', 'aquamarine', 'aqua', 'turquoise', 'mediumturquoise', 'mediumaquamarine', 'mediumseagreen', 'seagreen', 'azure', 'powderblue', 'lightblue', 'darkturquoise', 'lightseagreen', 'cadetblue', 'darkcyan', 'teal', 'darkslategray', 'aliceblue', 'lightsteelblue', 'lightskyblue', 'skyblue', 'deepskyblue', 'royalblue', 'cornflowerblue', 'dodgerblue', 'steelblue', 'ghostwhite', 'lavender', 'blue', 'mediumblue', 'darkblue', 'navy', 'midnightblue', 'lightslategray', 'slategray', 'thistle', 'mediumorchid', 'darkorchid', 'blueviolet', 'mediumpurple', 'mediumslateblue', 'slateblue', 'darkslateblue', 'plum', 'violet', 'orchid', 'magenta', 'darkmagenta', 'purple', 'darkviolet', 'indigo', 'lavenderblush', 'pink', 'lightpink', 'palevioletred', 'hotpink', 'deeppink', 'mediumvioletred', 'crimson']

console.log(COLORS.length)

initCanvas()
TOOLS.forEach(createTool)
COLORS.forEach(createPaintPot)

function initCanvas(){
    pixel = document.createElement("div")
    pixel.className = "pixel"
    pixel.style.width = "10%"
    pixel.style.backgroundColor = 'white'
    // console.log(String(100 / Math.sqrt(SIZE)) + '%')
    pixel.style.width = String(100 / Math.sqrt(SIZE)) + '%'
    pixel.style.height = String(100 / Math.sqrt(SIZE)) + '%'
    pixel.id = 'x'
    makeBlankSquares()
    addeventListenersToCanvas()
}


// Add squares
function makeBlankSquares(){
    for (let i = 0; i < SIZE; i++){
        // console.log(i)
        pixel.id = i
        canvas.appendChild(pixel.cloneNode(true))

    }
}


function createTool(t){
    toolButton = document.createElement('div')
    toolButton.className = 'toolButton'
    toolButton.id = t
    toolButton.title = t
    palate.appendChild(toolButton)
}

function createPaintPot(color) {
    paintColor = document.createElement("div")
    paintColor.className = 'paintPot'
    paintColor.title = color
    paintColor.id = color
    paintColor.style.backgroundColor = color
    palate.appendChild(paintColor)
}

palate.addEventListener('click', function(e){
    // console.log(e.target.classList[0])
    if (e.target.classList[0] == 'paintPot'){
        // console.log(e.target.id)
        document.getElementById(color).classList.remove('selected')
        color = e.target.id
        document.getElementById(color).classList.add('selected')
    } else {
        if (e.target.id == 'clear'){
            clearAll()
        } else if (e.target.id == 'toggleGrid') {
            toggleGrid()
        } else if (e.target.id == 'save') {
            save()
        } else {
            document.getElementById(tool).classList.remove('selected')
            tool = e.target.id
            document.getElementById(tool).classList.add('selected')
        }
    }
})


function paint(squares){ // takes an array of ids and changes the colour of each one
    squares.forEach(function (i){
        document.getElementById(i).style.backgroundColor = color
    })
}
function addeventListenersToCanvas(){
    canvas.addEventListener('click', function(e){
        id = e.target.id
        console.log('clicked', id)
        if (id !== 'canvas'){
        if (tool == 'fill'){
            fill(e)
        } else {
            //    paint(id)
            document.getElementById(id).style.backgroundColor = color
        }
        }
    })

    canvas.addEventListener('mouseup', stopPainting)
    canvas.addEventListener('mousedown', function(e){
        id = e.target.id
        console.log('Mouse Down!', id)
        

        canvas.addEventListener('mouseenter', startPainting, true)
    })
}

function clearAll(){
    let r = confirm('Erase everything and start over?')
    if (r === true){
        console.log('erase')

        canvas.remove()
        canvas = document.createElement('div')
        canvas.id = 'canvas'
        body.appendChild(canvas)
        // makeBlankSquares()
        init()
        // readd event listeners
    }
    return
}

function fill(e){
    console.log('filling', e.target.id)

    flower2(e.target.id, e.target.style.backgroundColor, color)    
}

function addColor(c){
    console.log('COLOR', c)

    n = c.slice(1, 4)
    console.log(typeof n, n, 'is the number')
    num = parseInt(n, 10)
    console.log('Number:', num)
    return '#' + String(num +1)
}

function flower2(centerId, blank, fillColor){
    if (centerId < 0 || centerId >= SIZE){
        return
    }
    let center = document.getElementById(centerId)
    if (center.style.backgroundColor == blank) {
        center.style.backgroundColor = fillColor
        flower2(parseInt(centerId)-1, blank, fillColor) //left
        flower2(parseInt(centerId)+1, blank, fillColor) // right
        flower2(parseInt(centerId)+LINE, blank, fillColor) // down
        flower2(parseInt(centerId)-LINE, blank, fillColor) // up


    } 
}


function startPainting(e){
    // console.log('PAINTING', e.target.id)
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
    // p = document.getElementById(id)
    // p.style.backgroundColor = color
    // console.log(p)
    }
    // console.log('PAINTED', e.target.id)
}

function thickBrush(id){
    num = parseInt(id)
    return [num, num+1, num-1, num+LINE, num-LINE]
}

function sprayBrush(id){
    brush = thickBrush(id)
    return brush.filter( x => !Math.floor(Math.random() * 6))
}

function stopPainting(e){
    console.log('STOP')
    isMouseUp = false
    canvas.removeEventListener('mouseenter', startPainting, true)
}

function save(){
    let children = canvas.children;
    let array = []
    for (let i = 0; i < children.length; i++) {
        let child = children[i];
        array.push(child.style.backgroundColor)
    }
    console.log(array)
}

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
    console.log('toggled grid')
}