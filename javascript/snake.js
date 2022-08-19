/** 
 * TODO:
 * Update the rotation system so that the animation is more smooth
 * Implement a score system
 * Restart option (currently F5)
 * Make modules for everything
 * Create an UI for game customizations
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
        //  Column, Row
        'w': [0, -1],
        'a': [-1, 0],
        's': [0,  1],
        'd': [1,  0]
    }

    keymap = {
        //  [pressedkey][currentkey]
        "w": {
            "a": 90,
            "s": 0,
            "d": -90
        },
        "a": {
            "w": -90,
            "s": 90,
            "d": 0
        },
        "s": {
            "a": -90,
            "w": 0,
            "d": 90
        },
        "d": {
            "a": 0,
            "s": -90,
            "w": 90
        }
    }

    notValidDir = {
        //  [pressedkey][currentkey]
        "w": {
            "s": true
        },
        "s": {
            "w": true
        },
        "a": {
            "d": true
        },
        "d": {
            "a": true
        }
    }

    currentkey = 'd'
    currentdirection = this.directions[this.currentkey];
    currentrotation = 90;
    newkey = "";
    cansetdirection = true;

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
                    while(this.appleEaten()) {
                        this.apple.generateLocation();
                    }
                }
            } 
        }, 250)
    }

    rotateSnake() {
        this.snakehead.setRotate(this.currentrotation)
        if(this.newkey.length > 0) {
            this.currentkey = this.newkey;
            this.newkey = "";
        }
    }

    setDirection(key) {
        if(this.notValidDir[key][this.currentkey] || !this.cansetdirection) {
            return;
        }
        this.currentdirection = this.directions[key];
        this.setNewRotation(key);
        this.newkey = key;
        this.cansetdirection = false;
        setTimeout(() => {
            this.cansetdirection = true;
        }, 200)
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

    setNewRotation(key) {
        let addRotation = this.keymap[key][this.currentkey]

        if(addRotation) {
            this.currentrotation += addRotation
        }
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