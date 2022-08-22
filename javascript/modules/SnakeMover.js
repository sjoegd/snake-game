// Class which manages snakes movement, the apple, and the snake

export default class SnakeMover {

    _movement = {
        "w": {
            column: 0,
            row: -1
        },
        "a": {
            column: -1,
            row: 0
        },
        "s": {
            column: 0,
            row: 1
        },
        "d": {
            column: 1,
            row: 0
        }
    }

    _snake_direction = this._movement["d"];
    _snake_rotation = 90;
    _snake_speed = 15; //ms
    _direction_ask = {
        "called": false,
        "value": undefined
    }

    constructor(snake, apple, size, matrixsize) {
        this._snake = snake;
        this._apple = apple;
        this._size = size;
        this._matrixsize = matrixsize;
    }

    start() {
        this.mover();
    }

    stop() {
        this.playing = false;
    }

    async mover() {

        this.playing = true;

        let move = () => {
            setTimeout(() => {
                // check if allowed to move
                if(!this.playing) return;
                // set snake direction 
                if(this._direction_ask.called) {
                    this.setSnakeDirection();
                }
                // Move snake
                let snakePos = this._snake.getPosition();
                snakePos.column += this._snake_direction.column;
                snakePos.row += this._snake_direction.row;
                // Only rotate and check if at new block
                this.allowedtoMove = true; 
                if(snakePos.column % this._size == 1 && snakePos.row % this._size == 1) {
                    snakePos.rotation = this._snake_rotation;
                    this.movementCheck(snakePos);
                }
                if(this.allowedtoMove) {
                    this._snake.move(snakePos, this._size);
                }
                move();
            }, this._snake_speed)
        }
   
        move();
    }

    movementCheck({column, row}) {
        let columnEnd = column + this._size;
        let rowEnd = row + this._size;
        
        if(column < 1 || row < 1 || columnEnd > this._matrixsize || rowEnd > this._matrixsize) {
            this.allowedtoMove = false;
            this.endGame();
            return;
        }

        if(this.appleEaten({column, row})) {

            // make new div
            let div = document.createElement("div")
            this._snake.addNode();

            let applePos = this.apple.generateLocation(this._matrixsize, this._size);
            while(this.appleEaten(applePos)) {
                applePos = this.apple.generateLocation(this._matrixsize, this._size);
            }
        }

    }

    appleEaten({column, row}) {

    }

    setSnakeDirection() {
        if(this._direction_ask.value) {
            let newKey = this._direction_ask.value;
            this._snake_direction = this._movement[newKey];
            this._snake_rotation = this.getNewRotation(newKey);
        }
        this._direction_ask = {
            "called": false,
            "value": undefined
        }
    }

    askSnakeDirection(key) {
        this._direction_ask = {
            "called": true,
            "value": key
        }
    }

    getNewRotation(key) {
        let rotation = this._snake_rotation % 360;
        switch (rotation) {
            case 0: // w
                if(key == "a") {
                    return this._snake_rotation - 90;
                }
                if(key == "d") {
                    return this._snake_rotation + 90;
                }
                return this._snake_rotation;
            case 90: // d
                if(key == "w") {
                    return this._snake_rotation - 90;
                }
                if(key == "s") {
                    return this._snake_rotation + 90;
                }
                return this._snake_rotation;
            case 180: // s
                if(key == "a") {
                    return this._snake_rotation + 90;
                }
                if(key == "d") {
                    return this._snake_rotation - 90;
                }
                return this._snake_rotation;
            case 270: // a
                if(key == "w") {
                    return this._snake_rotation + 90;
                }
                if(key == "s") {
                    return this._snake_rotation - 90;
                }
                return this._snake_rotation;
        }
        return this._snake_rotation;
    }

    endGame() {

    }
}