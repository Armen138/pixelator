class Box {
    constructor(gameObject, options) {
        this.name = "BoxBehavior";
        gameObject.on("draw", this.draw.bind(this));
        this.gameObject = gameObject;
        this.options = options;
        this.width = options.width || 10;
        this.height = options.height || 10;
    }
    draw() {
        this.gameObject.scene.canvas.context.fillStyle = "black";
        this.gameObject.scene.canvas.context.fillRect(this.gameObject.position.x, this.gameObject.position.y, this.width, this.height);
    }
}
export default BoxBehavior;