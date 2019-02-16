class Size {
    constructor(width = 0, height = 0) {
        this.width = width;
        this.height = height;
    }
    volume() {
        return this.width * this.height;
    }
}

export default Size;