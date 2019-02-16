import Vector2 from "../salad/vector2.js";
import Size from "../salad/size.js";

class Editor {
    constructor(gameObject, options) {
        this.name = "Editor";
        this.options = options;
        this.selectedPalette = "db16";
        this.color = 1;
        this.gameObject = gameObject;        
        // this.gameObject.on("update", this.update.bind(this));
        this.gameObject.on("draw", this.draw.bind(this));
        this.gameObject.on("click:left", this.click.bind(this));
        this.canvas = new Size(this.options.grid.width * this.options.scale, this.options.grid.height * this.options.scale);
        // init bitmap
        this.origin = new Vector2(this.options.grid.width * this.options.scale / 2.0,
                                  this.options.grid.height * this.options.scale / 2.0);
        this.bitmap = [];
        for(let x = 0; x < this.options.grid.width; x++) {
            this.bitmap[x] = [];
            for(let y = 0; y < this.options.grid.height; y++) {
                this.bitmap[x][y] = 0;
            }
        }
        // expose editor to hook up to ui
        window.EDITOR = this;
    }
    
    get palette() {
        return this.gameObject.scene.assets[this.selectedPalette];
    }
    selectColor(index) {
        this.color = index;
    }
    click(e) {
        console.log(e);
        let position = this.gameObject.scene.salad.mouse.worldPosition;
        position = position.add(this.origin);
        position.x = position.x / this.options.scale | 0;
        position.y = position.y / this.options.scale | 0;
        console.log(position);
        this.bitmap[position.x][position.y] = this.color;
        console.log(this.bitmap);
    }
    draw() {
        let ctx = this.gameObject.scene.canvas.context; 
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeRect(-0.5 * this.canvas.width, -0.5 * this.canvas.height, this.canvas.width, this.canvas.height);
        let palette = this.gameObject.scene.assets.db16;
        for(let x = 0; x < this.options.grid.width; x++) {
            for(let y = 0; y < this.options.grid.height; y++) {
                ctx.fillStyle = palette[this.bitmap[x][y]].rgba;
                ctx.fillRect(x * this.options.scale - this.origin.x, y * this.options.scale - this.origin.y, this.options.scale, this.options.scale);
            }
        }
        if(this.options.showGrid) {
            ctx.lineWidth = 1;
            ctx.beginPath();
            for(let x = 0; x < this.options.grid.width; x++) {
                let horizontal = x * this.options.scale - 0.5 * this.canvas.width;
                let vertical = this.canvas.height - 0.5 * this.canvas.height;
                ctx.moveTo(horizontal, vertical);
                ctx.lineTo(horizontal, vertical - this.canvas.height);
            }
            for(let y = 0; y < this.options.grid.height; y++) {
                let horizontal = this.canvas.width - 0.5 * this.canvas.width;
                let vertical = y * this.options.scale - 0.5 * this.canvas.height;
                ctx.moveTo(horizontal, vertical);
                ctx.lineTo(horizontal - this.canvas.width, vertical);
            }
            ctx.stroke();    
        }
    }
    // update(delta) {
    // }
}

export default Editor;