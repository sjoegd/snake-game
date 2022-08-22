import SnakeNode from "./SnakeNode.js";

export default class Snake extends SnakeNode {

    body = [];
    endPos = {
        column: 1,
        row: 1,
        rotation: 90
    };

    constructor(div, position) {
        super(div, position);
    }

    moveTo({column, row, rotation}, size) {
        let oldpos = this._position;
        let newpos = {column, row, rotation};
        super.moveTo(newpos, size);

        for(let i = 0; i < this.body.length; i++) {
            let node = body[i];
            newpos = oldpos;
            oldpos = node.getPosition();
            node.moveTo(newpos, size);
        }
        this.endPos = oldpos
    }

    addNode(div) {
        let node = new SnakeNode(div, this.endPos)
        this.body.push(node);
    }

    getAllPositions() {
        let positions = [];
        positions.push(this.getPosition());
        for(let node of this.body) {
            positions.push(node.getPosition());
        }
        return positions;
    }
}