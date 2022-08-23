
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

    _speed = 17.5; //ms

    _directions = {
        "w": {
            column: 0,
            row: -1,
            rotation: 0
        },
        "a": {
            column: -1,
            row: 0,
            rotation: 270
        },
        "s": {
            column: 0,
            row: 1,
            rotation: 180
        },
        "d": {
            column: 1,
            row: 0,
            rotation: 90
        }
    }

    _current_direction = "d"

    //TODO: make queue for smoother movement?
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

            this._snake.move(this._directions[this._current_direction])

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
                this._current_direction = this._asked_direction.key
            } 
            this._asked_direction = {
                asked: false,
                key: undefined
            }
        }
    }

    checkSnakeSpot(snakePos) {
        if(this.snakeOutOfBounds(snakePos)) {
            // end game
            this.stop();
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

    snakeEatsApple(position) {
        let applePos = this._apple.getPosition();
        return(position.column == applePos.column && position.row == applePos.row)
    }

    appleEaten() {
        this._snake.addNode(this.createNewNode());
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

    isValidBlockSpot(position) {
        return (position.column % this._size == 1 && position.row % this._size == 1);
    }

    initializeListeners() {
        window.addEventListener('keypress', (event) => {
            if(["w","a","s","d"].includes(event.key)) {
                this.askNewDirection(event.key);
            }
        })
    }
}
