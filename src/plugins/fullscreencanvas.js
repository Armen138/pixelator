class FullScreenCanvas {
    constructor(salad) {
        this.name = "CanvasResizer";
        this.salad = salad;
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.overflow = "hidden";
        this.resize();
        window.addEventListener("resize", this.resize.bind(this));
    }
    resize() {        
        this.salad.canvas.resize(window.innerWidth, window.innerHeight);
    }
}

export default FullScreenCanvas;