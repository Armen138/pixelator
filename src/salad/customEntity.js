class CustomEntity extends Entity {
    constructor() {
        super();
        //register(parent) {
            //this.parent = parent;

        //}
        //unregister() {

        //}
        this.on('draw', this.drawMe);
    }
    drawMe() {
        console.log('drawme');
    }
}
