import Events from './events.js';
import GameObject from './gameobject.js';
import Vector2 from './vector2.js';
import Size from "./size.js";

var sceneId = 0;

class Scene extends Events {
    constructor(salad) {
        super();
        this.name = "DefaultScene";
        this.id = sceneId++;
        this.root = new GameObject("root", this);
        this.canvas = salad.canvas;
        this.salad = salad;
        this.camera  = new GameObject("camera");
        this.lastUpdate = 0;
        this.assets = [];
        this.progress = {
            loaded: 0,
            total: 0
        }
        this.update();
    }
    get loaded() {
        return this.progress.total === this.progress.loaded;
    }
    run() {
        let viewport = new Size(this.canvas.canvas.width, this.canvas.canvas.height);
        this.canvas.context.translate(-this.camera.position.x + viewport.width / 2.0, -this.camera.position.y + viewport.height / 2.0);
        this.root._draw();
        // this.root.bubble("draw");
    }
    update() {
        let now = Date.now();
        let delta = now - this.lastUpdate;
        this.root.bubble("update", delta);
        setTimeout(this.update.bind(this), 20); // 20ms update ticks
        this.lastUpdate = now;
    }
    assetLoaded(asset, success) {
        this.progress.loaded++;
        if(!success) {
            console.error(`Failed to load asset ${asset}`);
        } else {
            console.info(`Loaded asset ${asset}`);
            console.log(this.progress);
        }
        if(this.progress.loaded == this.progress.total) {
            this.fireEvent("assets");
        }
    }
    loadAssets(assets) {
        this.progress.total = Object.keys(assets).length;
        if(this.progress.total === 0) {
            this.fireEvent("assets");
        }
        for(let asset in assets) {
            this.salad.load(assets[asset]).then(item => {
                this.assets[asset] = item;
                this.assetLoaded(asset, true);
            }).catch(err => {
                this.assetLoaded(asset, true);
                console.error(`Failed to load asset ${asset}: ${err}`);
            });
        }
    }
    findIn(gameObject, name) {
        for(let item of gameObject.children) {
            if(item.name === name) {
                return item;
            }
        }
        return null;
    }
    find(path) {
        let pathNodes = path.split(".");
        let gameNode = this.root;
        console.info(pathNodes);
        while(pathNodes.length !== 0) {
            let pathNode = pathNodes.shift();
            let item = this.findIn(gameNode, pathNode);
            if(!item) {
                return null;
            } else {
                gameNode = item;
                console.log(gameNode);
            }
        }
        return gameNode;
    }
    addGameObject(item, parent, behaviors) {
        console.log("Add item", item);
        let gameObject = new GameObject(item.name || "gameObject", this);
        if(item.behaviors) {
            for(let behavior in item.behaviors) {
                gameObject.addBehavior(behaviors[behavior], item.behaviors[behavior]);
            }
        }
        if(item.assets) {
            for(let asset in item.assets) {
                this.assets[asset] = item.assets[asset];
            }
            // this.progress.total += Object.keys(item.assets).length;
        }
        gameObject.position = item.position ? new Vector2(item.position.x, item.position.y) : new Vector2();
        gameObject.scale = item.scale || 0.0;
        gameObject.rotation = item.rotation || 0.0;
        gameObject.parent = parent;
        parent.add(gameObject);
        if(item.children) {
            for(let child of item.children) {
                if(typeof child === "string") {
                    child = this.assets[child];
                }
                this.addGameObject(child, gameObject, behaviors);
            }
        }
        console.log("Added item");
    }
    serialize() {
        let serialized = this.root.serialize();
        return serialized;
    }
    load(manifest, behaviors) {
        this.name = manifest.name || "loaded_from_json";
        this.on("assets", () => {
            this.root = new GameObject("root", this);
            for(let item of manifest.root) {
                this.addGameObject(item, this.root, behaviors);
                // let gameObject = new GameObject(item.name || "gameObject", this);
                // if(item.behaviors) {
                //     for(let behavior in item.behaviors) {
                //         gameObject.addBehavior(behaviors[behavior], item.behaviors[behavior]);
                //     }
                // }
                // gameObject.position = item.position || new Vector2();
                // gameObject.scale = item.scale || 0.0;
                // gameObject.rotation = item.rotation || 0.0;
                // this.root.add(gameObject);
            }
            console.log("load event");
            this.fireEvent("load");
        });
        this.loadAssets(manifest.assets);
    }
}

export default Scene;