import Scene from "./scene.js";
import Canvas from "./canvas.js";
import Images from "./loaders/images.js";
import Prefabs from "./loaders/prefabs.js";
import Keyboard from "./keyboard.js";
import Mouse from "./mouse.js";
import GameObject from "./gameobject.js";
import Size from "./size.js";

class Salad {
    constructor(canvasSelector = "canvas") {
        this.version = "0.1";
        this.plugins = {};
        this.behaviors = {};
        this.loaders = [];
        this.currentScene = null;
        this.canvas = new Canvas(canvasSelector);
        this.loaders.push(new Images());
        this.loaders.push(new Prefabs(this));
        if(!window.salad) {
            // for easy debugging in console
            window.salad = this;
        }
        this.keyboard = new Keyboard(this);
        this.mouse = new Mouse(this);
    }
    behave(name, behavior) {
        console.log("Behave: ", behavior);
        this.behaviors[name] = behavior;
        return this;
    }
    use(Plugin) {
        let plugin = new Plugin(this);
        if(plugin.type == "loader" || plugin.canLoad) {
            this.loaders.push(plugin);
        } else {
            if (!plugin.name) {
                console.error("Trying to add a plugin without a name property, aborting.");
                return;
            }    
            this.plugins[plugin.name] = plugin;
        }
        return this;
    }
    load(asset) {
        let result;
        for (let loader of this.loaders) {
            if (loader.canLoad(asset)) {
                result = loader.load(asset);
                break;
            }
        }
        if (!result) {
            result = new Promise((resolve, reject) => {
                fetch(asset).then(response => {
                    const contentType = response.headers.get("content-type");
                    console.info(contentType);
                    if (contentType && contentType.indexOf("application/json") !== -1) {
                        return response.json().then(data => {
                            resolve(data);
                        });
                    } else {
                        return response.text().then(text => {
                            resolve(text);
                        })
                    }
                }).catch(err => {
                    reject(err);
                });
            });
        }
        return result;
    }

    loadScene(manifest) {
        var scene = new Scene(this);
        scene.load(manifest, this.behaviors);
        this.currentScene = scene;
        return scene;
    }
    loadSceneFromJson(jsonFile) {
        let result = new Promise((resolve, reject) => {
            fetch(jsonFile).then((data) => { return data.json(); }).then((data) => {
                let scene = this.loadScene(data);
                if(scene.loaded) {
                    resolve(scene);
                } else {
                    scene.on("load", () => {
                        console.log("Resolve scene");
                        resolve(scene);
                    });    
                }
                // resolve(scene);
            }).catch((err) => {
                reject(`Failed to load scene from JSON file "${jsonFile}, ${err}"`);
            });
        });
        return result;
    }
    run() {
        // let viewport = new Size(this.canvas.canvas.width, this.canvas.canvas.height);
        this.canvas.canvas.width = this.canvas.canvas.width;
        this.canvas.context.save();
        if (this.currentScene) {
            this.currentScene.run();
        }
        this.canvas.context.restore();
        window.requestAnimationFrame(this.run.bind(this));
    }
}
export default Salad;