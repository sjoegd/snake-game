export default class MoveButtonsManager {

    constructor(gameManager) {
        this.move_buttons_wrapper = document.getElementById("move_buttons_wrapper");
        this.setWrapperDisplay();
        this.gameManager = gameManager;
        this.initListeners();
    }

    isAllowedOnSide() {
        return (window.innerWidth > 1.2 * window.innerHeight)
    }

    isAllowedOnBottom() {
        return (window.innerHeight > 1.2 * window.innerWidth)
    }

    setWrapperDisplay() {
        if(this.isAllowedOnSide()) {
            this.move_buttons_wrapper.style.display = "grid"
            document.body.style.flexDirection = "row"
        } else if(this.isAllowedOnBottom()) {
            this.move_buttons_wrapper.style.display = "grid"
            document.body.style.flexDirection = "column-reverse"
        } else {
            this.move_buttons_wrapper.style.display = "none"
        }
    }

    initListeners() {
        window.addEventListener("resize", () => {
            this.setWrapperDisplay();
        })

        let up_button = document.getElementById("up_button");
        let left_button = document.getElementById("left_button");
        let down_button = document.getElementById("down_button");
        let right_button = document.getElementById("right_button");

        let button_values = [
            {element: up_button, value: "w"},
            {element: left_button, value: "a"},
            {element: down_button, value: "s"},
            {element: right_button, value: "d"},
        ]

        button_values.forEach(button => {
            button.element.addEventListener("click", () => {
                this.gameManager.askNewSnakeDirection(button.value)
            })
        })
    }
}