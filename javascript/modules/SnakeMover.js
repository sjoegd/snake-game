
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
    _current_score = 0;

    _asked_direction = {
        asked: false,
        key: undefined
    }

    constructor(container, game_manager ,snake, apple, size, matrixsize, speed = 16) {
        this._container = container;
        this._game_manager = game_manager;
        this._snake = snake;
        this._apple = apple;
        this._size = size;
        this._matrixsize = matrixsize;
        this._scorediv = document.getElementById("score");
        this._scorediv.innerHTML = this._current_score;
        this._speed = speed;
        this.initializeListeners();
    }

    start() {
        this._snake._div.style.transform = "" // bad practice
        this._apple.turnOnAnimation();
        this.playing = true;
        this.snakeMover();
    }

    stop() {
        this._apple.turnOffAnimation();
        this.playing = false;
    }

    endGame(timeout) {
        this.stop();
        this.fixSnakeHead();
        timeout ?
        setTimeout(() => {
            this._game_manager.gameEnded(this._current_score)
        }, 500) : this._game_manager.gameEnded(this._current_score)
    }

    // Bad practice but otherwise i would have to change the whole system
    fixSnakeHead() {
        let pos = this._snake.getPosition();
        if(pos.column + this._size - 1 > this._matrixsize || pos.row + this._size - 1 > this._matrixsize) {
            this._snake._div.style.transform = "scale(1.15)"
        }
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

    checkSnakeSpot(snakePos) {
        if(this.snakeOutOfBounds(snakePos) || this.snakeHitIself(snakePos)) {
            this.endGame(true);
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

    isValidBlockSpot(position) {
        return (position.column % this._size == 1 && position.row % this._size == 1);
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
            },
            270: {
                column: pos1.column,
                row: pos1.row + (this._size/2)
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
        this._current_score += number
        this._scorediv.innerHTML = this._current_score
    }

    askNewDirection(key) {
        if(!this.isValidDirection(this._current_direction, key)) {
            return;
        }

        this._asked_direction = {
            asked: true,
            key
        }
    }

    isValidDirection(currentkey, key) {
        if(currentkey == key) {
            return false;
        }
        switch(currentkey) {
            case "w":
                return (key != "s")
            case "a":
                return (key != "d")
            case "s":
                return (key != "w")
            case "d":
                return(key != "a")
        }
        return false
    }

    setNewDirection() {
        if(this._asked_direction.asked) {
            if(this._asked_direction.key) {
                this._current_rotation += this.getNewRotationAdd(this._current_direction, this._asked_direction.key)
                this._current_direction = this._asked_direction.key
            } 
            this._asked_direction = {
                asked: false,
                key: undefined
            }
        }
    }

    getNewRotationAdd(currentkey, newkey) {
        function getRotationToAdd(key) {
            switch(key) {
                case "w":
                    return {
                        "a": -90,
                        "d": 90
                    }
                case "a":
                    return {
                        "w": 90, 
                        "s": -90,
                    }
                case "d":
                    return {
                        "w": -90, 
                        "s": 90,
                    }
                case "s":
                    return {
                        "a": 90,
                        "d": -90
                    }
            }
        }
        return getRotationToAdd(currentkey)[newkey] ?? 0;
    }

    initializeListeners() {
        window.addEventListener("keydown", (event) => {
            if(["w","a","s","d"].includes(event.key)) {
                this.askNewDirection(event.key);
            }
        })
    }
}
