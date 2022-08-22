export default class SnakeNode {

    constructor(div, position) {
        this._div = div;
        this._position = position;
    }

    moveTo({column, row, rotation}, size) {
        let style = this._div.style;

        style.gridColumn = `${column} / span ${size}`
        style.gridRow = `${row} / span ${size}`
        style.rotation = `${rotation}deg`

        this._position = {
            column,
            row,
            rotation
        }
    }

    getPosition() {
        return this._position
    }

    getDiv() {
        return this._div;
    }
}