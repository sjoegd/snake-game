import Apple from "./modules/Apple.js";
import Snake from "./modules/Snake.js";
import SnakeMover from "./modules/SnakeMover.js";

/**
 * TODO:
 * Implement an UI.
 * Animation for apple eating (and maybe dying)
 * Sounds?
 * Make movement system better (for both input and snake itself)
 */

function createNewGame(MATRIX_SIZE, SIZE) {
    let container = document.getElementById("game_container")
    container.style.gridTemplate = `repeat(${MATRIX_SIZE + 1}, 1fr) / repeat(${MATRIX_SIZE + 1}, 1fr)`
    let overlay_container = document.getElementById("overlay_container");

    let appleDiv = document.getElementById("apple");
    let apple = new Apple(appleDiv, SIZE);
    apple.setPosition(apple.generatePosition(MATRIX_SIZE))

    let [snakeDiv, node1, node2] = document.getElementsByClassName("node");
    let snake = new Snake(snakeDiv, SIZE)
    snake.initFirstNodes(node1, node2);

    let snakeMover = new SnakeMover(container, overlay_container, snake, apple, SIZE, MATRIX_SIZE);
    return snakeMover;
}

function initializeUIListeners(snakeMover) {
    let play_button = document.getElementById("play_button");
    play_button.addEventListener("click", () => {
        snakeMover.start();
    })

}

let game = createNewGame(192, 8);
initializeUIListeners(game);







