class Keyboard {
    constructor(salad) {
        this.name = "KeyboardInput";
        this.salad = salad;
        this.keysDown = {};
        window.addEventListener("keyup", this.up.bind(this));
        window.addEventListener("keydown", this.down.bind(this));
    }
    up(e) {        
        this.salad.currentScene.root.bubble("keydown", e);
        this.salad.currentScene.root.bubble(`keydown:${e.key}`, e);
        this.keysDown[e.key] = false;
    }
    down(e) {
        this.salad.currentScene.root.bubble("keyup", e);
        this.salad.currentScene.root.bubble(`keyup:${e.key}`, e);
        this.keysDown[e.key] = true;
    }
    isDown(key) {
        return this.keysDown[key] || false;
    }
}

export default Keyboard;