export default class MouseMoveHandler {

    constructor(snakeMover, container, speed, size) {
        this.snakeMover = snakeMover;
        this.container = container;
        this.speed = speed
        this.size = size
        this.initListeners();
    }

    startDrag(event) {
        this.isDragging = true;
        this.lastPosition = {
            x: event.offsetX,
            y: event.offsetY
        }
        this.followDrag(this.lastPosition)
    }

    stopDrag() {
        this.isDragging = false;
    }

    followDrag(lastPosition) {
        let lastPos = lastPosition;
        let id = setInterval(() => {
            if(!this.isDragging) {
                clearInterval(id);
                return;
            }
            let newPos = this.lastPosition;
            if(newPos.x != lastPos.x || newPos.y != lastPos.y) {
                if(this.askSnakeDirection(lastPos, newPos)) {
                    lastPos = newPos
                    this.stopDrag;
                }
            }
        }, this.speed)
    }

    askSnakeDirection(lastPosition, newPosition) {
        if(this.delaying) {
            return false;
        }

        let difference = {
            x: newPosition.x - lastPosition.x,
            y: newPosition.y - lastPosition.y
        }

        let absX = Math.abs(difference.x);
        let absY = Math.abs(difference.y);

        if(absX > absY) {
            difference.x < 0 ? this.snakeMover.askNewDirection("a") : this.snakeMover.askNewDirection("d")
        } else {
            difference.y < 0 ? this.snakeMover.askNewDirection("w") : this.snakeMover.askNewDirection("s")
        }
        this.delaying = true;
        setTimeout(() => {
            this.delaying = false
        }, this.speed*this.size)

        return true;
    }

    initListeners() {
        this.container.addEventListener("mousedown", (event) => {
            this.startDrag(event)
        })
        this.container.addEventListener("mouseup", () => {
            this.stopDrag();
        })
        this.container.addEventListener("mousemove", (event) => {
            if(this.isDragging) {
                let newPosition = {
                    x: event.offsetX,
                    y: event.offsetY
                }
                let difference = {
                    x: newPosition.x - this.lastPosition.x,
                    y: newPosition.y - this.lastPosition.y
                }
                if(Math.abs(difference.x) > (this.size*2) || Math.abs(difference.y) > (this.size*2)) {
                    this.lastPosition = newPosition;
                }
            }   
        })
    }

}