export default class SnakeNode {

    _queue = []

    constructor(div, size, position, queue) {
        this._div = div;
        this._size = size;
        this.setPosition(position);
        if(queue) {
            this.addQueue(queue)
        }
    }

    setPosition({column, row, rotation}) {
        this._position = {column, row, rotation}
        this._div.style.gridColumn = `${column} / span ${this._size}`
        this._div.style.gridRow = `${row} / span ${this._size}`
        this._div.style.rotate = `${rotation}deg`
    }

    addQueue(queue) {
        this._queue = this._queue.concat(queue)
    }

    getNewMove() {
        return this._queue.shift();
    }

    move(direction) {
        this.addQueue(direction);
        let current_dir = this.getNewMove();
        let position = this.getPosition();
        position.column += current_dir.column;
        position.row += current_dir.row;
        position.rotation = current_dir.rotation;
        this.setPosition(position);
        return current_dir;
    }

    getPosition() {
        return this._position
    }
}