import Apple from "./modules/Apple.js"
import Snake from "./modules/Snake.js";

/**
 * TODO:
 * Completely refractor game with:
 *      - 192*192 grid for smooth movement
 *      - size = 12 for everything
 *      - SVG for whole head (or something similar)
 *      - Better system for moving
 *      - Rotations system for whole snake (and border-radius calculation on purely node after head)
 */



//  TESTING
let container = document.getElementById("game_container")

let appleDiv = document.getElementById("apple");
let apple = new Apple(appleDiv, 12);

let [snakeDiv, node1, node2] = document.getElementsByClassName("node");
let head = new Snake(snakeDiv, 12)

head.initFirstNodes(node1, node2);

async function headMover() {
    while(true) {
        await new Promise((resolve) => {
            setTimeout(resolve, 30)
        })
        head.move({
            column: 1,
            row: 0,
            rotation: 90
        })
    }
}
//headMover();

// END TESTING


