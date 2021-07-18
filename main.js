/*
    RULES OF THE GAME OF LIFE
        1. If a cell has 1 or 0 neighbors, it turns off
        2. If a cell has more than 4 neighbors it turns off
        3. If a cell has 2 or 3 neighbors it turns on
        4. If a cell has 3 neighbors it turns on
*/

;
let BOARD;
const CELL_WIDTH = 25
const NUM_CELLS = 50

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

function Cell(x, y, isOn, row, col) {
    this.x = x;
    this.y = y;
    this.isOn = isOn
    this.row = row;
    this.col = col;

    this.show = () => {
        this.isOn ? fill(255, 255, 0) : fill(0)
        rect(this.x, this.y, CELL_WIDTH, CELL_WIDTH)
    }
    return this;
}

function Board(size) {
    this.matrix = [[]]
    this.init = () => {
        for (let i = 0; i < size; i++) {
            this.matrix.push([])
            for (let j = 0; j < size; j++) {
                this.matrix[i].push(new Cell(i * CELL_WIDTH, j * CELL_WIDTH, Math.random() >= .5, i, j))
            }
        }
        this.matrix.pop();
    }
    this.show = () => {
        for (let i = 0; i < this.matrix.length; i++) {
            for (let j = 0; j < this.matrix.length; j++) {
                if (this.matrix[i][j]) this.matrix[i][j].show();
            }
        }
    }

    this.getNumNeighbors = (row, col) => {
        let count = 0;
        // console.log(row, col)
        if (isInBounds(row + 1, col + 1) && BOARD.matrix[row + 1][col + 1].isOn) count++
        if (isInBounds(row + 1, col) && BOARD.matrix[row + 1][col].isOn) count++
        if (isInBounds(row + 1, col - 1) && BOARD.matrix[row + 1][col - 1].isOn) count++
        if (isInBounds(row, col + 1) && BOARD.matrix[row][col + 1].isOn) count++
        if (isInBounds(row, col - 1) && BOARD.matrix[row][col - 1].isOn) count++
        if (isInBounds(row - 1, col + 1) && BOARD.matrix[row - 1][col + 1].isOn) count++
        if (isInBounds(row - 1, col) && BOARD.matrix[row - 1][col].isOn) count++
        if (isInBounds(row - 1, col - 1) && BOARD.matrix[row - 1][col - 1].isOn) count++
        return count;
    }

    return this;
}

function isInBounds(row, col) {
    return (row >= 0 && row < NUM_CELLS) && (col >= 0 && col < NUM_CELLS)
}

function setup() {
    frameRate(5)
    createCanvas(600, 600)
    BOARD = new Board(NUM_CELLS)
    BOARD.init();
}

function mousePressed() {
    let row = Math.floor(mouseX / CELL_WIDTH)
    let col = Math.floor(mouseY / CELL_WIDTH)
    if(!isInBounds(row, col)) return
    BOARD.matrix[row][col].isOn = true;
    BOARD.matrix[row][col].show();
}

function draw() {
    BOARD.show()
    for (let i = 0; i < BOARD.matrix.length; i++) {
        for (let j = 0; j < BOARD.matrix.length; j++) {
            if (BOARD.matrix[i][j]) {
                numNeighbors = BOARD.getNumNeighbors(BOARD.matrix[i][j].row, BOARD.matrix[i][j].col)
                console.log(numNeighbors)
                if (BOARD.matrix[i][j].isOn) {
                    if (numNeighbors == 0 || numNeighbors == 1) BOARD.matrix[i][j].isOn = false; // 0 or 1 neighbors dies
                    if (numNeighbors == 2 || numNeighbors == 3) BOARD.matrix[i][j].isOn = true; // 2 or 3 neighbors lives
                    if (numNeighbors <= 4) BOARD.matrix[i][j].isOn = false; // 4 or more neighbors dies
                } else {
                    if (numNeighbors == 3) BOARD.matrix[i][j].isOn = true // dead cell with 3 neighbors comes alive
                }
            }
        }
    }
}