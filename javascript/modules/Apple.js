// Class for apple

export default class Apple {

    constructor(div) {
        this._div = div;
        div.style.display = "none";
    }

    generateLocation(gridsize, size) {
        const MIN = 1;
        const MAX = 1; 

        let possible_locations = gridsize/size - MIN - MAX; 
        
        return {
            column: Math.floor((Math.random() * possible_locations) + MIN) * size + 1,
            row: Math.floor((Math.random() * possible_locations) + MIN) * size + 1
        };
    }

    setLocation({column, row}, size) {
        this._column = column;
        this._row = row;
        this._div.style.gridColumn = `${column} / span ${size}`;
        this._div.style.gridRow = `${row} / span ${size}`;
        this._div.style.display = "block";
    }

    getLocation() {
        return {
            column: this._column,
            row: this._row
        }
    }

    getDiv() {
        return this._div;
    }
}