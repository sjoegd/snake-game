import Apple from "./modules/Apple.js";
import Snake from "./modules/Snake.js";
import SnakeMover from "./modules/SnakeMover.js";

/**
 * TODO:
 * Make movement system better (for both input and snake itself)
 * Implement an UI.
 * Animation for apple eating (and maybe dying)
 * Sounds?
 */

const MATRIX_SIZE = 192;
const SIZE = 8;

let container = document.getElementById("game_container")

let appleDiv = document.getElementById("apple");
let apple = new Apple(appleDiv, SIZE);
apple.setPosition(apple.generatePosition(MATRIX_SIZE))

let [snakeDiv, node1, node2] = document.getElementsByClassName("node");
let snake = new Snake(snakeDiv, SIZE)
snake.initFirstNodes(node1, node2);

let snakeMover = new SnakeMover(container, snake, apple, SIZE, MATRIX_SIZE);
snakeMover.start();




