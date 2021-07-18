/*
    RULES OF THE GAME OF LIFE
        1. If a cell has 1 or 0 neighbors, it turns off
        2. If a cell has more than 4 neighbors it turns off
        3. If a cell has 2 or 3 neighbors it turns on
        4. If a cell has 3 neighbors it turns on
*/

const WIDTH = 900;
const HEIGHT = 900;
const NUM_CELLS = 25;


let BOARD;
const CELL_WIDTH = WIDTH / NUM_CELLS;
const CELL_HEIGHT = HEIGHT / NUM_CELLS;

function playPause() {
    if (isLooping()) {
        console.log('pausing')
        noLoop()
        document.getElementById('playPause').innerHTML = "play"
    } else {
        console.log('playing')
        loop()
        document.getElementById('playPause').innerHTML = "pause"
    }
}

function Cell(row, col) {
    this.row = row;
    this.col = col;
    this.x = row * CELL_WIDTH;
    this.y = col * CELL_WIDTH;
    this.isOn = false;

    this.show = () => {
        this.isOn ? fill(255, 255, 0) : fill(0)
        rect(this.x, this.y, CELL_WIDTH, CELL_HEIGHT)
    }
    
    this.turnOn = () => {
        this.isOn = true;
        BOARD.aliveCells.push(this)
    }

    this.turnOff = () => {
        this.isOn = false;
        BOARD.aliveCells.splice(BOARD.aliveCells.indexOf(this), 1)
    }

    return this;
}

function Board(size) {
    this.aliveCells = []
    this.matrix = [[]]
    this.init = () => {
        for (let i = 0; i < size; i++) {
            this.matrix.push([])
            for (let j = 0; j < size; j++) {
                let cell = new Cell(i, j)
                if (Math.random() >= .5) cell.turnOn();
                this.matrix[i].push(cell)
            }
        }
        this.matrix.pop();
    }


    this.show = () => {
        // for (let i = 0; i < this.matrix.length; i++) {
        //     for (let j = 0; j < this.matrix.length; j++) {
        //         this.matrix[i][j].show();
        //     }
        // }
        background(60)
        for(let cell of BOARD.aliveCells) {
            cell.show();
        }
    }

    this.getNumNeighbors = (row, col) => {
        let count = 0;
        // console.log(row, col)
        if (isInBounds(row + 1, col + 1) && BOARD.matrix[row + 1][col + 1].isOn) count++;
        if (isInBounds(row + 1, col) && BOARD.matrix[row + 1][col].isOn) count++;
        if (isInBounds(row + 1, col - 1) && BOARD.matrix[row + 1][col - 1].isOn) count++ ;// wrong
        if (isInBounds(row, col + 1) && BOARD.matrix[row][col + 1].isOn) count++;
        if (isInBounds(row, col - 1) && BOARD.matrix[row][col - 1].isOn) count++;
        if (isInBounds(row - 1, col + 1) && BOARD.matrix[row - 1][col + 1].isOn) count++;
        if (isInBounds(row - 1, col) && BOARD.matrix[row - 1][col].isOn) count++;
        if (isInBounds(row - 1, col - 1) && BOARD.matrix[row - 1][col - 1].isOn) count++;
        console.log(count)
        return count;
    }

    return this;
}

function isInBounds(row, col) {
    return (row >= 0 && row < NUM_CELLS) && (col >= 0 && col < NUM_CELLS)
}

function setup() {
    noLoop();
    frameRate(5)
    createCanvas(WIDTH, HEIGHT)
    BOARD = new Board(NUM_CELLS)
    BOARD.init();
}

function mousePressed() {
    let row = Math.floor(mouseX / CELL_WIDTH)
    let col = Math.floor(mouseY / CELL_WIDTH)
    if (!isInBounds(row, col)) return
    let cell = BOARD.matrix[row][col]
    cell.isOn ? cell.turnOff() : cell.turnOn();
    cell.show();
}


function draw() {
    BOARD.show()
    if (isLooping()) step();
}

function step() { // all cells must check neighbors before any are turned off
    console.log('step')
    let numNeighborsList = [];
    for (let cell of BOARD.aliveCells) {
        numNeighborsList.push(BOARD.getNumNeighbors(cell.row, cell.col));
    }

    console.log('num alive:', numNeighborsList.length)

    for (let i in BOARD.aliveCells) {
        let cell = BOARD.aliveCells[i]
        let numNeighbors = numNeighborsList[i]
        if (cell.isOn) {
            if (numNeighbors == 0 || numNeighbors == 1) cell.turnOff(); // 0 or 1 neighbors dies
            if (numNeighbors == 2 || numNeighbors == 3) cell.turnOn(); // 2 or 3 neighbors lives
            if (numNeighbors <= 4) cell.turnOff(); // 4 or more neighbors dies
        } else {
            if (numNeighbors == 3) cell.turnOn(); // dead cell with 3 neighbors comes alive
        }
    }


}