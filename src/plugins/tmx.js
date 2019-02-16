import Vector2 from "../salad/vector2.js";
import Size from "../salad/size.js";

class MapLoader {
    canLoad(filename) {
        var exp = /^.*\.tmx$/i;
        return exp.test(filename);
    }
    load(asset) {
        let result = new Promise((resolve, reject) => {
            fetch(asset).then(response => response.text())
                .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
                .then(data => {
                    this.parseMap(asset, data, resolve, reject);
                    //resolve(data);
                })
                .catch(err => { reject(err); });
        });
        return result;
    }
    parseMap(domPath, data, callback, fail) {
        let mapAsset = {};
        mapAsset.dom = data;
        mapAsset.image = {};
        let map = data.querySelector("map");
        let tileSets = map.querySelectorAll("tileset");
        let tileSetsLoaded = 0;
        let paths = [];

        let mapProperties = ["height", "width", "orientation", "renderorder", "tiledversion", "tileheight", "tilewidth"];

        for (let property of mapProperties) {
            let value = map.getAttribute(property);
            mapAsset[property] = isNaN(parseInt(value, 10)) ? value : parseInt(value, 10); //map.getAttribute(property);
        }

        mapAsset.layers = [];
        mapAsset.tiles = [{ dummy: "dummy" }];
        let layerNodes = map.querySelectorAll("layer");
        for (let layerNode of layerNodes) {
            mapAsset.layers.push({
                name: layerNode.getAttribute("name"),
                width: layerNode.getAttribute("width"),
                height: layerNode.getAttribute("height"),
                tiles: layerNode.querySelector("data").textContent.split(",").map(item => parseInt(item, 10))
            });
        }


        let tileToPosition = function (tile, tileSize, tilesPerRow) {
            let position = new Vector2();
            position.y = Math.floor(tile / tilesPerRow) * (tileSize.height);
            position.x = (tile % tilesPerRow) * (tileSize.width);
            return position;
        };
        console.log(tileSets);
        for (let tileSet of tileSets) {
            let firstGid = parseInt(tileSet.getAttribute("firstgid"), 10) || 0;
            let image = map.querySelector("image");
            let sprites = image.getAttribute("source");
            let tileHeight = parseInt(tileSet.getAttribute("tileheight"), 10);
            let tileWidth = parseInt(tileSet.getAttribute("tilewidth"), 10);
            let tileCount = parseInt(tileSet.getAttribute("tilecount"), 10);
            let columns = parseInt(tileSet.getAttribute("columns"), 10);
            paths.push(sprites);
            let tileNodes = tileSet.querySelectorAll("tile");
            for (let tileNode of tileNodes) {
                let tile = {};
                let properties = tileNode.querySelectorAll("property");
                for (let property of properties) {
                    let value = property.getAttribute("value");
                    tile[property.getAttribute("name")] = property.getAttribute("type") === "int" ? parseInt(value, 10) : value;
                }
                let tileImage = tileNode.querySelector("image");
                let id = parseInt(tileNode.getAttribute("id"), 10) + firstGid;
                tile.width = tileWidth;
                tile.height = tileHeight;
                if(tileImage) {
                    tile.spritesheet = tileImage.getAttribute("source");
                    paths.push(tile.spritesheet);
                    tile.x = 0;
                    tile.y = 0;
                } else {
                    let position = tileToPosition(id - 1, new Size(tileWidth, tileHeight), columns);
                    tile.spritesheet = sprites;
                    tile.x = position.x;
                    tile.y = position.y;
                }
                mapAsset.tiles[id] = tile;
            }
            //fill gaps in tile list
            for (let tileNode = 0; tileNode < tileCount; tileNode++) {
                if(!mapAsset.tiles[tileNode + 1]) {
                    let tile = {};
                    let position = tileToPosition(tileNode, new Size(tileWidth, tileHeight), columns);
                    tile.width = tileWidth;
                    tile.height = tileHeight;
                    tile.spritesheet = sprites;
                    tile.x = position.x;
                    tile.y = position.y;
                    mapAsset.tiles[tileNode + 1] = tile;
                }
            }
        }

        var loadImage = (path) => {
            var basepath = domPath.split("/");
            basepath.pop();
            basepath.push(path);
            let filepath = basepath.join("/");
            let alt = filepath.replace(".xml", ".png");

            new Promise((resolve, reject) => {
                mapAsset.image[path] = new Image();
                mapAsset.image[path].src = filepath;
                mapAsset.image[path].addEventListener("load", resolve);
                mapAsset.image[path].addEventListener("error", reject);
            }).then(() => {
                tileSetsLoaded++;
                if (tileSetsLoaded == paths.length) {
                    callback(mapAsset);
                }
            }, () => {
                if (path !== alt) {
                    loadImage(alt);
                } else {
                    fail(`Failed to load sprite sheet for ${filepath}`);
                }
            });
        };
        for (let path of paths) {
            loadImage(path);
        }
    }
}

// polyfill for offscreen canvas
class OffscreenCanvasPoly {
    constructor(width, height) {
        let canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }
}

class TMXRenderer {
    constructor(gameObject, options) {
        let Offscreen = window.OffscreenCanvas || OffscreenCanvasPoly;
        this.name = "tmx";
        this.gameObject = gameObject;
        this.map = this.gameObject.scene.assets[options.map];
        this.sheet = this.gameObject.scene.assets[options.spriteSheet];

        this.width = options.static ? this.map.width * this.map.tilewidth : gameObject.scene.canvas.canvas.width;
        this.height = options.static ? this.map.height * this.map.tileheight : gameObject.scene.canvas.canvas.height;
        this.mapRender = new Offscreen(this.width, this.height);
        this.mapRenderContext = this.mapRender.getContext("2d");
        this.render();
        if(!options.static) {
            this.gameObject.scene.canvas.on("resize", (size) => {
                this.mapRender = new Offscreen(size.width, size.height);
                this.mapRenderContext = this.mapRender.getContext("2d");
                this.render();
            });    
        }
        this.gameObject.on("draw", this.draw.bind(this));
    }
    orthogonal(position) {
        let screenPosition = new Vector2();
        screenPosition.x = position.x * this.map.tilewidth;
        screenPosition.y = position.y * this.map.tileheight;
        return screenPosition;
    }
    isometric(position) {
        let screenPosition = new Vector2();
        screenPosition.x = position.x * (this.map.tilewidth / 2) - (position.y * (this.map.tilewidth / 2)) + (this.map.width / 2 * this.map.tilewidth) - (this.map.tilewidth / 2);
        screenPosition.y = position.y * (this.map.tileheight / 2) + (position.x * (this.map.tileheight / 2)) - (this.map.tileheight / 2);
        return screenPosition;
    }
    render() {
        let context = this.mapRenderContext;
        for (let layer of this.map.layers) {
            for (let tileIdx in layer.tiles) {
                let tile = this.map.tiles[layer.tiles[tileIdx]];
                let tileCoordinates = new Vector2(tileIdx % this.map.width, tileIdx / this.map.width | 0);
                // currently supported orientations: isometric, orthogonal
                let position = this[this.map.orientation](tileCoordinates);
                if (tile && tile.spritesheet) {
                    context.drawImage(this.map.image[tile.spritesheet], tile.x, tile.y, tile.width, tile.height, position.x, position.y, tile.width, tile.height);
                    // console.log(this.map.image[tile.spritesheet], tile.x, tile.y, tile.width, tile.height, position.x, position.y, tile.width, tile.height);
                }
                // else {
                //     console.warn(`Undrawable tile ${layer.tiles[tileIdx]}`);
                // }
            }
        }
    }
    draw() {
        this.gameObject.scene.canvas.context.drawImage(this.mapRender, 0, 0);
    }
}
class TMX {
    constructor(salad) {
        this.name = "TMX";
        salad.use(MapLoader);
        salad.behave("TMX", TMXRenderer);
    }
}

export default TMX;