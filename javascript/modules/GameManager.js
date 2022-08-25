import Apple from "./Apple.js";
import Snake from "./Snake.js";
import SnakeMover from "./SnakeMover.js";

export function initializeGame(MATRIX_SIZE, SIZE) {
    new GameManager(MATRIX_SIZE, SIZE)
}

class GameManager {

    highscore = 0;

    constructor(MATRIX_SIZE, SIZE) {
        this.MATRIX_SIZE = MATRIX_SIZE;
        this.SIZE = SIZE;

        this._container = document.getElementById("game_container");
        this._overlay_container = document.getElementById("overlay_container");

        this.manageContainerBackground(this.MATRIX_SIZE, this.SIZE)

        this.game = this.createNewGame(this.MATRIX_SIZE, this.SIZE);
        this.initializeUIListeners();

        this._overlay_score = document.getElementsByClassName("score_copy")[0];
        this._overlay_highscore = document.getElementsByClassName("highscore_copy")[0];
        this._overlay_score.innerHTML = document.getElementById("score").innerHTML;
        this._overlay_highscore.innerHTML = this.highscore
    }

    manageContainerBackground(MATRIX_SIZE, SIZE) {
        let blocks = MATRIX_SIZE / SIZE;
        this._container.parentElement.style.setProperty("--n", blocks);
    }

    createNewGame(MATRIX_SIZE, SIZE) {
        this._container.style.gridTemplate = `repeat(${MATRIX_SIZE}, 1fr) / repeat(${MATRIX_SIZE}, 1fr)`

        let [snakeDiv, node1, node2] = document.getElementsByClassName("node");
        let snake = new Snake(snakeDiv, SIZE)
        snake.initFirstNodes(node1, node2);

        let appleDiv = document.getElementById("apple");
        let apple = new Apple(appleDiv, SIZE);
    
        let snakeMover = new SnakeMover(this._container, this, snake, apple, SIZE, MATRIX_SIZE);

        let applePosition = apple.generatePosition(MATRIX_SIZE)
        while(!snakeMover.isValidApplePosition(applePosition)) {
            applePosition = apple.generatePosition(MATRIX_SIZE);
        }
        apple.setPosition(applePosition)

        return snakeMover;
    }

    gameEnded(score) {
        this._overlay_container.style.display = "grid";   
        this._container.parentElement.style.filter = "brightness(0.5)"
        this.updateScores(score)
    }

    updateScores(score) {
        if(score > this.highscore) {
            this.highscore = score
        }
        this._overlay_score.innerHTML = score
        this._overlay_highscore.innerHTML = this.highscore
    }

    startGame() {
        this.showSettings(false)
        this._container.parentElement.style.filter = "brightness(1)"
        this._overlay_container.style.display = "none"
        this.game.start()
    }
    
    restartGame() {
        this.game = null;
        // remove all nodes from container without removing head apple and the first 2 nodes
        let container = document.getElementById("game_container")
        while(container.childElementCount > 4) {
            container.removeChild(container.lastElementChild)
        }
        this.game = this.createNewGame(this.MATRIX_SIZE, this.SIZE)
    }

    initializeUIListeners() {
        let play_button = document.getElementById("play_button");
        play_button.addEventListener("click", () => {
            this.restartGame();
            this.startGame();
        })
        let menu_button = document.getElementById("menu_button");
        menu_button.addEventListener("click", () => {
            this.game.endGame();
        })
        let settings_button = document.querySelector(".settings_button");
        settings_button.addEventListener("click", () => {
            this.manageSettingsButton();
        })
        window.addEventListener("keydown", (event) => {
            if(event.key == "Escape") {
                this.game.endGame();
            }
        }) 
    }

    manageSettingsButton() {
        this.showSettings(!this._showingsettings)
    }

    showSettings(value) {
        this._showingsettings = value;
        let settings_wrapper = document.querySelector(".settings_wrapper")
        let overlay_score_wrapper = document.querySelector(".overlay_score_wrapper")
        if(value) {
            settings_wrapper.style.display = "flex"
            overlay_score_wrapper.style.display = "none"
        } else {
            settings_wrapper.style.display = "none"
            overlay_score_wrapper.style.display = "flex"  
        }
    }
}