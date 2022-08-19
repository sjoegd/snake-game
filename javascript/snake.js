/** 
 * TODO:
 * Create an UI for game customizations
 * Implement game customizations
 * Upgrade score system
 * Update looks for everything (let nodes inherit rotate for nicer look)
 * Upgrade grid system (for nicer movement (more grids and snake takes more grids as space))
 * Make modules for everything (one file is trash)
 * Add modes (visual only)
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

    setStyling({top_left, bot_left, bot_right, top_right}) {
        this.mydiv.style.borderTopLeftRadius = top_left;
        this.mydiv.style.borderBottomLeftRadius = bot_left;
        this.mydiv.style.borderBottomRightRadius = bot_right;
        this.mydiv.style.borderTopRightRadius = top_right;
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
            if(i > 0) {
                this.body[i-1].setStyling(this.getNodeStyling(i-1));
            }
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

    getNodeStyling(index) {

        let obj = {
            top_left: "0%", 
            bot_left: "0%", 
            bot_right: "0%", 
            top_right: "0%"
        }

        let node  = this.body[index]

        let prevx, prevy;

        if(index == 0) {
            [prevx, prevy] = super.getLocation();
        } else {
            [prevx, prevy] = this.body[index-1].getLocation();
        }

        let [nodex, nodey] = node.getLocation();
        let [followx, followy] = this.body[index+1].getLocation();

        if(prevx == nodex && nodex == followx) {
            return obj;
        }
        if(prevy == nodey && nodey == followy) {
            return obj
        }

        prevx -= nodex
        prevy -= nodey
        followx -= nodex
        followy -= nodey

        let newx = prevx + followx
        let newy = prevy + followy

        let top_left, bot_left, bot_right, top_right;
        top_left = bot_left = bot_right = top_right = "0%"

        // can go shorter
        if(newx == 1 && newy == 1) {
            top_left = "20%"
        }
        if(newx == 1 && newy == -1) {
            bot_left = "20%"
        }
        if(newx == -1 && newy == -1) {
            bot_right = "20%"
        }
        if(newx == -1 && newy == 1) {
            top_right = "20%"
        }

        return {
            top_left, 
            bot_left, 
            bot_right, 
            top_right
        }
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
        let [newcolumn, newrow] = [Math.round(Math.random()*17) + 2, Math.round(Math.random()*17) + 2]
        this.column = newcolumn;
        this.row = newrow;
        this.mydiv.style.gridColumn = newcolumn;
        this.mydiv.style.gridRow = newrow;
    }

    getLocation() {
        return [this.column, this.row];
    }

}

class SnakeMover {

    GRID_TEMPLATE = 20;

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
        //  [pressedkey][currentkey] (can be shorter)
        "w": {
            "s": true,
            "w": true,
        },
        "s": {
            "w": true,
            "s": true
        },
        "a": {
            "d": true,
            "a": true
        },
        "d": {
            "a": true,
            "d": true
        }
    }

    currentkey = 'd'
    currentdirection = this.directions[this.currentkey];
    currentrotation = 90;
    newkey = "";
    cansetdirection = true;
    score = 0;

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
        this.allowedtoplay = true;
        this.scorediv = document.getElementById("score")
    }

    start() {
        this._snakeMover();
    }

    stop() {
        this._isPlaying = false;
    }

    async _snakeMover() {
        if(!this.allowedtoplay) {
            return;
        }
        this._isPlaying = true;
        let player = setInterval(() => {
            this.rotateSnake();
            let column = this.snakehead.column + this.currentdirection[0];
            let row = this.snakehead.row + this.currentdirection[1];
            if(!this.isValidPosition(column, row)) {
                this.endGame();
                clearInterval(player);    
            } else if(!this._isPlaying) {
                clearInterval(player);
            } else {
                this.snakehead.move(column, row);
                if(this.appleEaten()) {
                    this.score += 1;
                    this.scorediv.innerHTML = this.score;
                    this.createNewNode(1);
                    this.apple.generateLocation();
                    while(this.appleEaten()) {
                        this.apple.generateLocation();
                    }
                }
            } 
        }, 150)
    }

    rotateSnake() {
        this.cansetdirection = true;
        this.snakehead.setRotate(this.currentrotation)
        if(this.newkey.length > 0) {
            this.currentkey = this.newkey;
            this.newkey = "";
        }
    }

    setDirection(key) {
        if(!this._isPlaying) {
            return;
        }
        if(this.notValidDir[key][this.currentkey] || !this.cansetdirection) {
            return;
        }
        this.currentdirection = this.directions[key];
        this.setNewRotation(key);
        this.newkey = key;
        this.cansetdirection = false;
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
        let gameContainer = document.getElementById("snakegame-container");
        let pauseButton = document.getElementById("pause");

        gameContainer.style.filter = "brightness(0.5)";
        gameOverDiv.style.display = "block";
        pauseButton.classList.add("stopped");
        pauseButton.setAttribute("disabled", "disabled");

        this.allowedtoplay = false;
    }

    setNewRotation(key) {
        let addRotation = this.keymap[key][this.currentkey]

        if(addRotation) {
            this.currentrotation += addRotation
        }
    }

    calculateClickMovement(event) {
        
        let [snakeX, snakeY] = this.snakehead.getLocation()
        let {width: snakeWidth, height: snakeHeight} = this.snakehead.mydiv.getBoundingClientRect();
        
        let clickX = Math.round(event.offsetX / snakeWidth);
        let clickY = Math.round(event.offsetY / snakeHeight);

        if(event.target.parentElement.parentElement.parentElement == this.apple.mydiv) { // make recursive till id=apple
            [clickX, clickY] = this.apple.getLocation();
        }

        let differenceX = clickX - snakeX;
        let differenceY = clickY - snakeY;

        if(["w","s"].includes(this.currentkey)) {
            // Only look at differenceX
            if(differenceX > 0) {
                this.setDirection("d")
            }
            if(differenceX < 0) {
                this.setDirection("a")
            }
        }
        else if (["a", "d"].includes(this.currentkey)) {
            // Only look at differenceY
            if(differenceY > 0) {
                this.setDirection("s")
            }
            if(differenceY < 0) {
                this.setDirection("w")
            }
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

    let startButton = document.getElementById("pause");
    let gameContainer = document.getElementById("snakegame-container");
    let restartButton = document.getElementById("restart");

    window.addEventListener('keypress', (event) => {
        if(['w', 'a', 's', 'd'].includes(event.key)) {
            pressedKey = event.key;
            snakeMover.setDirection(pressedKey);
        }
        if(event.key == "p") {
            pauseGame();
        }
    })

    gameContainer.addEventListener('click', (event) => {
        snakeMover.calculateClickMovement(event);
    })

    // UI

    startButton.addEventListener('click', () => {
        pauseGame()
    })

    restartButton.addEventListener('click', () => {
        location.reload();
    })

    function pauseGame() {

        if(startButton.classList.contains("stopped")) {
            return;
        }

        if(startButton.classList.contains("unpaused")) {
            snakeMover.stop();
            startButton.classList.remove("unpaused")
            startButton.classList.add("paused")
            startButton.innerHTML = "Resume";
        } else {
            snakeMover.start();
            if(startButton.classList.contains("paused")) {
                startButton.classList.remove("paused")
            }
            startButton.classList.add("unpaused")
            startButton.innerHTML = "Pause"
        }
    }
}

let newGame = initializeGame();
newGame.start();


