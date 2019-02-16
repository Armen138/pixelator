import Events from "../events.js";

class Prefabs extends Events {
    constructor(salad) {
        super();
        this.salad = salad;
    }
    canLoad(filename) {
        var exp = /^.*\.(json)$/i;         
        return exp.test(filename); 
    }
    assetLoaded(asset, prefab, success) {
        prefab.progress.loaded++;
        if(!success) {
            console.error(`Failed to load asset ${asset}`);
        } else {
            console.info(`Loaded asset ${asset}`);
            console.log(prefab.name, prefab.progress);
        }
        if(prefab.progress.loaded == prefab.progress.total) {
            console.log(prefab.name, "child assets loaded");
            this.fireEvent(`assets:${prefab.name}`);
        }
    }
    loadAssets(prefab) {
        let assets = prefab.assets;
        prefab.progress = { total: Object.keys(assets).length, loaded: 0};
        // this.progress.total = Object.keys(assets).length;
        for(let asset in assets) {
            this.salad.load(assets[asset]).then(item => {
                prefab.assets[asset] = item;
                this.assetLoaded(asset, prefab, true);
            }).catch(err => {
                this.assetLoaded(asset, prefab, true);
                console.error(`Failed to load asset ${asset}: ${err}`);
            });
        }
    }    
    load(asset) {
        let result = new Promise((resolve, reject) => {
            let prefab = {};
            fetch(asset).then(data => data.json()).then(fabdata => {
                prefab = fabdata;
                if(!prefab.name) {
                    console.warn("Prefab loader rejected json: missing name property");
                    reject();
                    return;
                }
                if(prefab.assets) {
                    this.loadAssets(prefab);
                    this.on(`assets:${prefab.name}`, () => {
                        if(prefab.children) {
                            for(let child in prefab.children) {
                                if(typeof prefab.children[child] === 'string') {
                                    prefab.children[child] = this.assets[child];
                                }
                            }
                        }        
                        resolve(prefab);
                    }); 
                } else {
                    resolve(prefab);
                }
            });
        });
        return result;        
    }
}

export default Prefabs;