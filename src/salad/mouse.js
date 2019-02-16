import Vector2 from "./vector2.js";

class Mouse {
    constructor(salad) {
        this.name = "MouseInput";
        this.salad = salad;
        this.buttonsDown = {};
        this.position = new Vector2(0, 0);
        window.addEventListener("mousemove", this.move.bind(this));
        window.addEventListener("click", this.click.bind(this));
        window.addEventListener("mousedown", this.down.bind(this));
        window.addEventListener("mouseup", this.up.bind(this));
    }
    get worldPosition() {
        // this offset is the relative camera position (0, 0 is the center of the canvas)
        let offset = new Vector2(this.salad.canvas.canvas.width / 2, this.salad.canvas.canvas.height / 2);
        return this.position.subtract(this.salad.currentScene.camera.position).subtract(offset);
    }
    move(e) {
        let offset = new Vector2(this.salad.canvas.canvas.offsetLeft, this.salad.canvas.canvas.offsetTop);
        this.position = new Vector2(e.clientX, e.clientY).subtract(offset);
        if(this.salad.currentScene) {
            this.salad.currentScene.root.bubble("mousemove", this.position);
        }
    }
    click(e) {
        // let offset = new Vector2(this.salad.canvas.canvas.offsetLeft, this.salad.canvas.canvas.offsetTop);
        this.salad.currentScene.root.bubble("click", e);
        this.salad.currentScene.root.bubble(`click:${Mouse.BUTTONS[e.button]}`, e);
    }
    up(e) {        
        this.salad.currentScene.root.bubble("mousedown", e);
        this.salad.currentScene.root.bubble(`mousedown:${Mouse.BUTTONS[e.button]}`, e);
        this.buttonsDown[e.which] = false;
    }
    down(e) {
        this.salad.currentScene.root.bubble("mouseup", e);
        this.salad.currentScene.root.bubble(`mouseup:${Mouse.BUTTONS[e.button]}`, e);
        this.buttonsDown[e.which] = true;
    }
    isDown(which) {
        return this.buttonsDown[which] || false;
    }
}

// button constants
Mouse.LEFT = 0;
Mouse.RIGHT = 2;
Mouse.MIDDLE = 1;
Mouse.BUTTONS = [ "left", "middle", "right" ];

export default Mouse;