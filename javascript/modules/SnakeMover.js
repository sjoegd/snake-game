
/**
 * Snake direction:
 * {
 * column: , (*what to add to column*)
 * row: , (*what to add to row*)
 * rotation: (*which rotation*)
 * }
 * 
 */

export default class SnakeMover {

    _speed = 16; //ms

    _directions = {
        "w": {
            column: 0,
            row: -1,
        },
        "a": {
            column: -1,
            row: 0,
        },
        "s": {
            column: 0,
            row: 1,
        },
        "d": {
            column: 1,
            row: 0,
        }
    }

    _current_direction = "d"
    _current_rotation = 90;

    //TODO: smoother?
    _asked_direction = {
        asked: false,
        key: undefined
    }

    constructor(container, snake, apple, size, matrixsize) {
        this._container = container;
        this._snake = snake;
        this._apple = apple;
        this._size = size;
        this._matrixsize = matrixsize;
        this.initializeListeners();
    }

    start() {
        this.playing = true;
        this.snakeMover();
    }

    stop() {
        this.playing = false;
    }

    async snakeMover() {
        let id = setInterval(() => {
            if(!this.playing) {
                clearInterval(id)
                return;
            }

            let direction = this._directions[this._current_direction]
            direction.rotation = this._current_rotation
            this._snake.move(direction)

            let snakePos = this._snake.getPosition();
            this.checkSnakeSpot(snakePos);
            
        }, this._speed)
    }

    askNewDirection(key) {
        this._asked_direction = {
            asked: true,
            key
        }
    }

    setNewDirection() {
        if(this._asked_direction.asked) {
            if(this._asked_direction.key) {
                let rotation_to_add = this.getNewRotationAdd(this._current_direction, this._asked_direction.key)
                this._current_rotation += rotation_to_add
                if(rotation_to_add != 0) {
                    this._current_direction = this._asked_direction.key
                }
            } 
            this._asked_direction = {
                asked: false,
                key: undefined
            }
        }
    }

    checkSnakeSpot(snakePos) {
        if(this.snakeOutOfBounds(snakePos) || this.snakeHitIself(snakePos)) {
            // end game
            this.endGame();
            return;
        }

        if(!this.isValidBlockSpot(snakePos)) {
            return;
        }

        this.setNewDirection();

        if(this.snakeEatsApple(snakePos)) {
           this.appleEaten();
        }
    }

    snakeOutOfBounds(position) {
        return ((position.column < 1 || position.row < 1) || 
                ((position.column + this._size) > this._matrixsize + 1) ||
                ((position.row + this._size) > this._matrixsize + 1))
    }

    snakeHitIself(position) {
        if(!this.isValidHitItselfSpot(position)) {
            return false;
        }

        let nodePositions = this._snake.getNodePositions();
        for(let nodePos of nodePositions) {
            if(this.nodesConnect(position, nodePos)) {
                return true
            }
        }
        return false;
    }

    isValidHitItselfSpot(position) {
        return (position.column % this._size == 2 || position.row % this._size == 2 ||
                position.column % this._size == (this._size - 2) || position.row % this._size == (this._size - 2));
    }

    nodesConnect(pos1, pos2) {
        let pos1_corners = {
            270: {
                column: pos1.column,
                row: pos1.row + (this._size/2)
            },
            0: {
                column: pos1.column + (this._size/2),
                row: pos1.row
            },
            90: {
                column: pos1.column + this._size,
                row: pos1.row + (this._size/2)
            },
            180: {
                column: pos1.column + (this._size/2),
                row: pos1.row + this._size
            }
        }

        let rotation = pos1.rotation % 360

        if(rotation < 0) {
            rotation = 360 + rotation
        }

        let border_tocheck = pos1_corners[rotation]

        return (this.inBetween(border_tocheck.column, pos2.column, pos2.column + this._size) && 
                this.inBetween(border_tocheck.row, pos2.row, pos2.row + this._size))
    }

    inBetween(number, x, y) {
        return(number > x && number < y)
    }

    snakeEatsApple(position) {
        let applePos = this._apple.getPosition();
        return(position.column == applePos.column && position.row == applePos.row)
    }

    appleEaten() {
        this._snake.addNode(this.createNewNode());
        this.updateScore(1);
        let newApplePos = this._apple.generatePosition(this._matrixsize);
        while(!this.isValidApplePosition(newApplePos)) {
            newApplePos = this._apple.generatePosition(this._matrixsize);
        }
        this._apple.setPosition(newApplePos);
    }

    isValidApplePosition(position) {
        let snakePositions = this._snake.getAllPositions();
        for(let snakePos of snakePositions) {
            if(snakePos.column == position.column && snakePos.row == position.row) {
                return false
            }
        }
        return true;
    }

    createNewNode() {
        let node = document.createElement("div");
        let nodebg = document.createElement("div");
        node.classList.add("node");
        nodebg.classList.add("node-bg");
        node.appendChild(nodebg);
        this._container.appendChild(node);
        return node;
    }

    updateScore(number) {
        let score = document.getElementById("score")
        let current = +score.innerHTML;
        score.innerHTML = current + number;
    }

    isValidBlockSpot(position) {
        return (position.column % this._size == 1 && position.row % this._size == 1);
    }

    getNewRotationAdd(currentkey, newkey) {
        function getRotationToAdd(currentkey) {
            switch(currentkey) {
                case "w":
                    return {
                        "w": 0, 
                        "s": 0,
                        "a": -90,
                        "d": 90
                    }
                case "a":
                    return {
                        "w": 90, 
                        "s": -90,
                        "a": 0,
                        "d": 0
                    }
                case "d":
                    return {
                        "w": -90, 
                        "s": 90,
                        "a": 0,
                        "d": 0
                    }
                case "s":
                    return {
                        "w": 0, 
                        "s": 0,
                        "a": 90,
                        "d": -90
                    }
            }
        }
        return getRotationToAdd(currentkey)[newkey];
    }

    endGame() {
        this.stop();
        this._container.style.filter = "brightness(0.5)"
        let gameover = document.getElementById("gameover")
        gameover.style.display = "block";
    }

    initializeListeners() {
        window.addEventListener('keypress', (event) => {
            if(["w","a","s","d"].includes(event.key)) {
                this.askNewDirection(event.key);
            }
        })
    }
}
