/** 
 * TODO:
 * Implement Node, Head, snakeMover, rotateSnake
 * Let snakeMover implement whether the snake dies
 * Implement a score system
 * Restart option
 * Make modules for everything
 */

class Node {

    constructor(mydiv, column, row) {
        mydiv.style.gridColumn = column;
        mydiv.style.gridRow = row;
        this.mydiv = mydiv;
        this.column = column;
        this.row = row;
    }

    move(column, row) {
        this.column = column;
        this.row = row;
        this.mydiv.style.gridColumn = column;
        this.mydiv.style.gridRow = row;
    }

    setRotate(degrees) {
        this.mydiv.style.rotate = `${degrees}deg`;
    }

    getLocation() {
        return [this.column, this.row];
    }
}

class Head extends Node {
    body = [];
    oldpos = []; 

    constructor(mydiv, column, row) {
        super(mydiv, column, row);
    }

    init(node1, node2) {
        this.oldpos = [4, 2];
        this.addNode(node1);
        this.oldpos = [3, 2];
        this.addNode(node2);
    }

    addNode(node) {
        let node1 = new Node(node, this.oldpos[0], this.oldpos[1]);
        this.body.push(node1);
    }

    move(column, row) {
        let oldpos = [this.column, this.row];
        let newpos = [column, row];
        super.move(newpos[0], newpos[1]);

        for(let i = 0; i < this.body.length; i++) {
            let node = this.body[i];
            newpos = oldpos;
            oldpos = [node.column, node.row];
            node.move(newpos[0], newpos[1]);
        }
        this.oldpos = oldpos;
    } 

    getLocations() {
        let locations = []

        locations.push(super.getLocation());
        locations = locations.concat(this.getNodeLocations());

        return locations
    }

    getNodeLocations() {
        let locations = []

        for(let node of this.body) {
            locations.push(node.getLocation());
        }

        return locations;
    }
}

class Apple {

    constructor(mydiv) {
        this.mydiv = mydiv;
    }

    init() {
        this.generateLocation();
    }

    generateLocation() {
        this.column = Math.round(Math.random()*15 + 1);
        this.row = Math.round(Math.random()*15 + 1);
        this.mydiv.style.gridColumn = this.column;
        this.mydiv.style.gridRow = this.row;
    }

    getLocation() {
        return [this.column, this.row];
    }

}

class SnakeMover {

    GRID_TEMPLATE = 16;

    directions = {
        // Column, Row, Rotation
        'w': [0, -1, 0],
        'a': [-1, 0, 270],
        's': [0, 1, 180],
        'd': [1, 0, 90],
    }

    currentdirection = this.directions['d'];

    constructor(snakehead, apple) {
        this.snakehead = snakehead;
        this.apple = apple;
    }

    init(node1, node2) {
        this.snakehead.init(node1, node2);
        this.apple.init()
        while(this.appleEaten()) {
            this.apple.init();
        }
    }

    start() {
        this._snakeMover();
    }

    stop() {
        this._isPlaying = false;
    }

    async _snakeMover() {
        this._isPlaying = true;
        let player = setInterval(() => {
            // Move Snake
            this.rotateSnake();
            let column = this.snakehead.column + this.currentdirection[0];
            let row = this.snakehead.row + this.currentdirection[1];
            // Check position
            if(!this.isValidPosition(column, row) || !this._isPlaying) {
                this.endGame();
                clearInterval(player);
            } else {
                this.snakehead.move(column, row);
                if(this.appleEaten()) {
                    this.createNewNode(1);
                    this.apple.generateLocation();
                }
            } 
        }, 250)
    }

    rotateSnake() {
        this.snakehead.setRotate(this.currentdirection[2])
    }

    setDirection(key) {
        this.currentdirection = this.directions[key];
    }

    appleEaten() {
        let snakePositions = this.snakehead.getLocations();
        let applePosition = this.apple.getLocation();
        for(let position of snakePositions) {
            if(position[0] == applePosition[0] && position[1] == applePosition[1]) {
                return true; 
            }
        }
        return false;
    }

    isValidPosition(column, row) {
        // can be shorter
        if(!(column > 0 && column < this.GRID_TEMPLATE + 1)) {
            return false
        }
        if(!(row> 0 && row < this.GRID_TEMPLATE + 1)) {
            return false
        }

        let nodeLocations = this.snakehead.getNodeLocations();
        
        for(let position of nodeLocations) {
            if(column == position[0] && row == position[1]) {
                return false; 
            }
        }

        return true
    }

    createNewNode(amount) {

        let container = document.getElementById('snakegame-container');

        for(let i = 0; i < amount; i++) {
            let newNode = document.createElement('div');
            newNode.classList.add("node")
            container.appendChild(newNode);
            this.snakehead.addNode(newNode);
        }
        
    }

    endGame() {
        let gameOverDiv = document.getElementById("ended");
        gameOverDiv.style.display = "block";
    }
}


function initializeGame() {
    let [head, node1, node2] = document.getElementsByClassName("node");
    let apple = document.getElementById("apple");
    let HeadNode = new Head(head, 5, 2);
    let AppleNode = new Apple(apple);
    let snakeMover = new SnakeMover(HeadNode, AppleNode);
    snakeMover.init(node1, node2);
    initializeListeners(snakeMover);
    return snakeMover;
}

function initializeListeners(snakeMover) {

    //  Movement
    window.addEventListener('keypress', (event) => {
        if(['w', 'a', 's', 'd'].includes(event.key)) {
            pressedKey = event.key;
            snakeMover.setDirection(pressedKey);
        }
    })

}

let newGame = initializeGame();
newGame.start();