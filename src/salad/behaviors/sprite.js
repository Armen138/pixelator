import Vector2 from "../vector2.js";

class Sprite {
    constructor(gameObject, options) {
        this.name = "Sprite";
        this.gameObject = gameObject;
        if(options.image) {
            this.image = this.gameObject.scene.assets[options.image];            
        }
        if(options.sheet) {
            this.sheet = this.gameObject.scene.assets[options.sheet];
            let tilesPerRow = Math.floor(this.sheet.width / options.size.width);
            if(options.index) {
                this.sourcePosition = this.tileToPosition(options.index, options.tileSize, tilesPerRow);
            } else {
                this.sourcePosition = options.position;
            }            
            this.tileSize = options.size;
            this.isFromSheet = true;
        }
        this.scale = options.scale || 1.0;
        this.gameObject.on("draw", this.draw.bind(this));
    }
    draw() {
        if(this.image) {
            this.gameObject.scene.canvas.context.drawImage(this.image,
                                                           this.gameObject.position.x,
                                                           this.gameObject.position.y,
                                                           this.image.width * this.scale,
                                                           this.image.height * this.scale);            
        }        
        if(this.sheet) {
            this.gameObject.scene.canvas.context.drawImage(this.sheet, 
                                                           this.sourcePosition.x, 
                                                           this.sourcePosition.y, 
                                                           this.tileSize.width, 
                                                           this.tileSize.height, 
                                                           this.gameObject.position.x, 
                                                           this.gameObject.position.y, 
                                                           this.tileSize.width, 
                                                           this.tileSize.height);
        }
    }
    tileToPosition(tile, tileSize, tilesPerRow) {
        let position = new Vector2();
        position.y = Math.floor(tile / tilesPerRow) * (tileSize.height);
        position.x = (tile % tilesPerRow) * (tileSize.width);
        return position;
    }
}

export default Sprite;