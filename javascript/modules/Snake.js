import SnakeNode from "./SnakeNode.js";

export default class Snake extends SnakeNode {

    _body = [];

    constructor(div, size) {
        super(div, size, {
            column: size*3 + 1,
            row: size + 1,    // current snake pos
            rotation: 90
        });
    }

    initFirstNodes(node1, node2) {
        let node1_pos = Object.assign({}, this.getPosition())
        node1_pos.column -= this._size;
        let node1_queue = this.generateNewQueue(1, 0);
        this.addNode(node1, node1_pos, node1_queue)

        let node2_pos = Object.assign({}, node1_pos);
        node2_pos.column -= this._size;
        let node2_queue = this.generateNewQueue(1, 0);
        this.addNode(node2, node2_pos, node2_queue)
    }

    addNode(nodeDiv, position, queue) {
        let node = new SnakeNode(nodeDiv, this._size, position ?? this.getEndPosition(), queue ?? this.generateNewQueue()) 
        this._body.push(node);
    }

    getEndPosition() {
        if(this._body.length > 0) {
            let lastNode = this._body[this._body.length - 1]
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

    move(direction) { 
        super.move(direction)
        for(let node of this._body) {
            direction = node.move(direction) // move returns the move comitted by that node
        }
    }

    getNodePositions() {
        let positions = [];
        for(let node of this._body) {
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