import Vector2 from "../salad/vector2.js";
import Size from "../salad/size.js";

class Body {
    constructor(gameObject, options) {
        this.name = "body";
        this.type = options.type || "dynamic";
        this.mass = options.mass || 1.0;
        this.gameObject = gameObject;
        this._position = options.position;
        this.options = options;
        if(options.width && options.height) {
            this.width = this.options.width;
            this.height = this.options.height;    
        } else {
            // if(gameObject.behaviors.tmx) {
            //     this.width = gameObject.behaviors.tmx.tilewidth;
            //     this.height = gameObject.behaviors.tmx.tileheight;    
            // }
        }
    }
    overlaps(other) {
        let topLeft = this.position;
        let otherTopLeft = other.position;
        let bottomRight = new Vector2(topLeft.x + this.width, topLeft.y + this.height);
        let otherBottomRight = new Vector2(otherTopLeft.x + other.width, otherTopLeft.y + other.height);
        if(bottomRight.x < otherTopLeft.x ||
            topLeft.x > otherBottomRight.x) {
                return false;
        }
        if(bottomRight.y < otherTopLeft.y ||
            topLeft.y > otherBottomRight.y) {
                return false;
        }
        return true;
        // return !((position.x > otherPosition.x + other.width || 
        //           otherPosition.x > position.x + this.width) &&
        //          (position.y > otherPosition.y + other.height || 
        //           otherPosition.y > position.y + this.height));
    }
    get position() {
        if(this.gameObject) {
            return this.gameObject.position;
        } else {
            return this._position;
        }
    }
    set position(/* Vector2 */ position) {
        if(this.gameObject) {
            this.gameObject.position = position;
        } else {
            this._position = position;
        }
    }
}

class World {
    constructor(gameObject, options) {
        this.name = "world";
        this.map = gameObject.scene.assets[options.map];
        this.gravity = options.gravity || 10;
        // static bodies without gameobjects attached
        this.bodies = [];
        this.gameObject = gameObject;
        gameObject.on("update", this.step.bind(this));
        if(options.debug) {
            gameObject.on("draw", this.debugDraw.bind(this));
        }
        if(options.tmxLayer) {
            let layers = this.map.layers;
            for(let layer of layers) {
                if(layer.name === options.tmxLayer) {
                    let tiles = layer.tiles;
                    console.log(tiles);
                    for(let x = 0; x < layer.width; x++) {
                        for(let y = 0; y < layer.height; y++) {
                            if(tiles[x + y * layer.width] !== 0) {
                                this.addStatic(
                                    new Body(null, {
                                        width: this.map.tilewidth,
                                        height: this.map.tileheight,
                                        position: new Vector2(x * this.map.tilewidth, y * this.map.tileheight),
                                        type: "static"
                                    })
                                );
                            }
                        }
                    }
                }
            }
            console.log(this.bodies);
            // console.log(gameObject.behaviors.map.layers)
        }
    }
    debugDraw() {
        this.gameObject.scene.canvas.context.strokeStyle = "orange";
        for(let body of this.bodies) {
            let position = body.position;
            this.gameObject.scene.canvas.context.strokeRect(position.x, position.y, body.width, body.height);
        }
    }
    // helper to add non-object static boxes to world (loade fom tmx for example)
    addStatic(box) {
        this.bodies.push(box);
    }
    step(delta) {
        let stepBodies = (gameObject) => {
            if(!gameObject.children) {
                return;
            }
            for(let child of gameObject.children) {
                if(child.behaviors.body) {
                    if(child.behaviors.body.type === "dynamic") {
                        let position = child.behaviors.body.position;
                        position.y += this.gravity / child.behaviors.body.mass;
                        for(let body of this.bodies) {
                            if(body.overlaps(child.behaviors.body)) {
                                position.y -= this.gravity / child.behaviors.body.mass;
                                // console.log("overlap", body, child.behaviors.body);
                            }
                        }
                        child.behaviors.body.position = position;
                    }
                }
                stepBodies(child);
            }                
        };
        stepBodies(this.gameObject);
        // console.log("physics step");
    }
}

class PlatformPhysics {
    constructor(salad) {
        this.name = "PlatformPhysics";
        salad.behave("World", World);
        salad.behave("Body", Body);
    }
}
export default PlatformPhysics;