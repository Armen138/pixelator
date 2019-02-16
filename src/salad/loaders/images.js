class Images {
    canLoad(filename) {
        var exp = /^.*\.(jpg|jpeg|gif|png)$/i;         
        return exp.test(filename); 
    }
    load(asset) {
        let result = new Promise((resolve, reject) => {
            let img = new Image();
            img.addEventListener("load", resolve.bind(null, img));
            img.addEventListener("error", reject.bind());
            img.src = asset;
        });
        return result;        
    }
}

export default Images;