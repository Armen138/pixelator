class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    add(other) {
        return new Vector2(this.x + other.x, this.y + other.y);
    }
    subtract(other) {
        return new Vector2(this.x - other.x, this.y - other.y);
    }
    substract(other) {
        return subtract(other);
    }
    clamp(position, size) {
        let bottomRight = new Vector2(position.x + size.width, position.y + size.height);
        this.x  = this.x < position.x ? position.x : this.x;
        this.y = this.y < position.y ? position.y : this.y;
        this.x = this.x > bottomRight.x ? bottomRight.x : this.x;
        this.y = this.y > bottomRight.y ? bottomRight.y : this.y;
    }
}

export default Vector2;