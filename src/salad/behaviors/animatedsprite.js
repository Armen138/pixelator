import Vector2 from "../vector2.js";

class AnimatedSprite {
    constructor(gameObject, options) {
        this.fps = options.fps || 5;
        this.name = "animation";
        this.gameObject = gameObject;
        this.looping = true;

        this.animations = options.animations;
        this.current = Object.keys(this.animations)[0];
        this.currentFrame = 0;

        this.lastFrame = Date.now();
        this.scale = options.scale || 1.0;
        this.gameObject.on("draw", this.draw.bind(this));
        this.onAnimationEnd = null;
    }
    run(name) {
        let result = new Promise(resolve => {
            this.looping = false;
            this.currentFrame = 0;
            this.current = name;
            this.onAnimationEnd = resolve;
        });
        return result;
    }
    loop(name) {
        this.looping = true;
        if(this.current != name) {
            this.currentFrame = 0;
            this.current = name;    
        }
    }
    get animationNames() {
        return Object.keys(this.animations);
    }
    get size() {
        let frame = this.gameObject.scene.assets[this.animations[this.current][this.currentFrame]]
        return new Vector2(frame.width * this.scale, frame.height * this.scale);
    }
    draw() {
        let now = Date.now();
        if(now - this.lastFrame > (1000.0 / this.fps)) {
            this.lastFrame = now;
            this.currentFrame++;
            if(this.currentFrame > this.animations[this.current].length - 1) {
                if(this.looping) {
                    this.currentFrame = 0;
                } else {
                    this.currentFrame = this.animations[this.current].length - 1;
                    if(this.onAnimationEnd) {
                        this.onAnimationEnd();
                        this.onAnimationEnd = null;
                    }
                }
            }
        }
        let frame = this.gameObject.scene.assets[this.animations[this.current][this.currentFrame]]
        if(frame) {
            this.gameObject.scene.canvas.context.drawImage(frame,
                                                           0,
                                                           0,
                                                           frame.width * this.scale,
                                                           frame.height * this.scale);            
        }        
        // if(this.sheet) {
        //     this.gameObject.scene.canvas.context.drawImage(this.sheet, 
        //                                                    this.sourcePosition.x, 
        //                                                    this.sourcePosition.y, 
        //                                                    this.tileSize.width, 
        //                                                    this.tileSize.height, 
        //                                                    this.gameObject.position.x, 
        //                                                    this.gameObject.position.y, 
        //                                                    this.tileSize.width, 
        //                                                    this.tileSize.height);
        // }
    }
    tileToPosition(tile, tileSize, tilesPerRow) {
        let position = new Vector2();
        position.y = Math.floor(tile / tilesPerRow) * (tileSize.height);
        position.x = (tile % tilesPerRow) * (tileSize.width);
        return position;
    }
}

export default AnimatedSprite;