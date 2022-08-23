export default class Apple {

    constructor(div, size) {
        this._div = div;
        this._size = size;
    }

    generatePosition(matrixsize) {
        const MIN = 1;
        const MAX = 1; 

        let possible_locations = matrixsize/this._size - MIN - MAX; 
        
        return {
            column: Math.floor((Math.random() * possible_locations) + MIN) * this._size + 1,
            row: Math.floor((Math.random() * possible_locations) + MIN) * this._size + 1
        };
    }

    setPosition({column, row}) {
        this._column = column;
        this._row = row;
        this._div.style.gridColumn = `${column} / span ${this._size}`;
        this._div.style.gridRow = `${row} / span ${this._size}`;
        this._div.style.display = "flex";
    }

    getPosition() {
        return {
            column: this._column,
            row: this._row
        }
    }

    getDiv() {
        return this._div;
    }
}