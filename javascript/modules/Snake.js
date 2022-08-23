import SnakeNode from "./SnakeNode.js";

export default class Snake extends SnakeNode {

    body = [];

    constructor(div, size) {
        super(div, size, {
            column: size*3 + 1,
            row: size + 1,    // current snake pos
            rotation: 90
        });
    }

    initFirstNodes(node1, node2) {
        let node1pos = Object.assign({}, this.getPosition())
        node1pos.column -= this._size;
        let node1queue = this.generateNewQueue(1, 0);
        this.addNode(node1, node1pos, node1queue)
        let node2pos = node1pos
        node2pos.column -= this._size;
        let node2queue = this.generateNewQueue(1, 0);
        this.addNode(node2, node2pos, node2queue)
    }

    addNode(nodeDiv, position, queue) {
        let node = new SnakeNode(nodeDiv, this._size, position ?? this.getEndPosition(), queue ?? this.generateNewQueue()) 
        this.body.push(node);
    }

    getEndPosition() {
        if(this.body.length > 1) {
            let lastNode = this.body[this.body.length - 1]
            return lastNode.getPosition();
        }
        else return this.getPosition();
    }

    generateNewQueue(column = 0, row = 0) {
        let queue = []
        for(let i = 0; i < this._size; i++) {
            queue.push({
                column,
                row,
                rotation: this.getEndPosition().rotation
            })
        }
        return queue;
    }

    move(direction) { // direction: {column, row, rotation}
        super.move(direction)
        for(let node of this.body) {
            direction = node.move(direction) // move returns the move comitted by that node
        }
    }

    getNodePositions() {
        let positions = [];
        for(let node of this.body) {
            positions.push(node.getPosition());
        }
        return positions;
    }

    getAllPositions() {
        let positions = this.getNodePositions();
        positions.unshift(this.getPosition());
        return positions;
    }
}