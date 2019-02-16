import Events from "./events.js";
import Size from "./size.js";

class Canvas extends Events {
    constructor(selector = "canvas") {
        super();
        this.canvas = document.querySelector(selector);
        if(!this.canvas) {
            console.error(`No canvas found for selector "${selector}"`);
        }
        this.context = this.canvas.getContext("2d");
    }
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.fireEvent("resize", new Size(width, height));
    }
}

export default Canvas;