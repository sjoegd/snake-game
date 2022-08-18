/** 
 * Made in OOP style.
 * TODO:
 * Event Listeners for WASD that call rotateSnake
 * Implement Node, Head, snakeMover, rotateSnake
 * Let snakeMover implement whether the snake dies
 * Implement a score system
 * Restart option
 */

class Node {
    constructor(mydiv, column, row) {
        this.mydiv = mydiv;
        this.column = column;
        this.row = row;
    }
}

class Head extends Node {
    body = [];

    constructor(mydiv, column, row) {
        super(mydiv, column, row);
    }
}

class SnakeMover {

    async snakeMover() {
        
    }

    rotateSnake(degrees) {
        
    }

}


let head = document.getElementById("head");
let node1 = document.getElementsByClassName("starter1")
let node2 = document.getElementsByClassName("starter2")


