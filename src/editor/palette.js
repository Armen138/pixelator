class Color {
    constructor(red, green, blue, name) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = 1.0;
        this.name = name;
    }
    get rgba() {
        return `rgba(${this.red},${this.green},${this.blue},${this.alpha})`;
    }
}
class Palette {
    canLoad(filename) {
        var exp = /^.*\.(pal)$/i;         
        return exp.test(filename); 
    }
    load(asset) {
        let result = new Promise((resolve, reject) => {
            fetch(asset).then(data => data.text()).then(data => {
                console.log(data);
                let palette = this.parse(data);
                resolve(palette);
            }).catch(error => {
                reject(error);
            });
        });
        return result;        
    }
    parse(data) {
        let transparency = new Color(0, 0, 0, "transparent");
        transparency.alpha = 0.0;
        let palette = [ transparency ];
        let lines = data.split("\n").map(item => { return item.trim() });
        let paletteStart = lines.indexOf("#") + 1;
        for(let i = paletteStart; i < lines.length - 1; i++) {
            let [red, green, blue, name] = lines[i].split(/\s+/);
            palette.push(new Color(red, green, blue, name));
        }
        return palette;
    }
}

export default Palette;