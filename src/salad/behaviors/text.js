import Vector2 from "../vector2.js";

class Text {
    constructor(gameObject, options) {
        this.name = "Text";
        this.gameObject = gameObject;
        this.font = options.font || "Arial";
        this.size = options.size || 10;
        this.color = options.color || "black";
        this.text = options.text || "text";
        this.gameObject.on("draw", this.draw.bind(this));
    }
    draw() {
        this.gameObject.scene.canvas.context.font = `${this.size}px ${this.font}`;
        this.gameObject.scene.canvas.context.fillStyle = this.color;
        this.gameObject.scene.canvas.context.fillText(this.text, 0, 0);
    }
}

export default Text;