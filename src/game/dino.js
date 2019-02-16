import Vector2 from "../salad/vector2.js";
import Size from "../salad/size.js";

class Dino {
    constructor(gameObject, options) {
        this.name = "Dino";
        this.movingRight = false;
        this.options = options;
        this.gameObject = gameObject;
        this.gameObject.on("keydown:ArrowUp", this.jump.bind(this));
        this.gameObject.on("keydown: ", this.jump.bind(this));
        this.gameObject.on("update", this.update.bind(this));
        this.map = this.gameObject.scene.find("map");
        if(options.drawBoundingBox) {
            this.gameObject.on("draw", this.drawBoundingBox.bind(this));
        }
    }
    drawBoundingBox() {
        // let size = this.gameObject.behaviors.animation.size;
        this.gameObject.scene.canvas.context.strokeStyle = "orange";
        this.gameObject.scene.canvas.context.strokeRect(0, 0, this.options.width, this.options.height);
    }
    jump() {
        this.gameObject.behaviors.animation.run("jump").then(() => {
            this.gameObject.behaviors.animation.loop("idle");
        });
    }
    update(delta) {
        this.gameObject.scene.camera.position = new Vector2(this.gameObject.position.x, this.gameObject.position.y);
        if(this.map) {
            this.gameObject.scene.camera.position.clamp(
                new Vector2(this.gameObject.scene.canvas.width / 2.0, this.gameObject.scene.canvas.height / 2.0),
                new Size(this.map.width, this.map.height));
    
        }
        if(this.gameObject.scene.salad.keyboard.isDown("ArrowRight")) {
            this.gameObject.scale = 1.0;
            this.gameObject.position.x += delta * 0.2;
            // this.map.position.x -= delta * 0.2;
            this.gameObject.behaviors.animation.loop("walk");
        } else if(this.gameObject.scene.salad.keyboard.isDown("ArrowLeft")) {
            this.gameObject.scale = -1.0;
            this.gameObject.position.x -= delta * 0.2;
            // this.map.position.x -= delta * 0.2;
            this.gameObject.behaviors.animation.loop("walk");
        } else {
            if(this.gameObject.behaviors.animation.current === "walk") {
                this.gameObject.behaviors.animation.loop("idle");
            }
        }
    }
}

export default Dino;