class Events {

    constructor() {
        this.events = {};
    }
    /**
     * @function
     * @alias addEventListener
     */
    on(ev, callback) {
        this.addEventListener(ev, callback);
    }
    addEventListener(ev, callback) {
        this.events = this.events || {};
        this.events[ev] = this.events[ev] || [];
        this.events[ev].unshift(callback);
    }
    removeEventListener(ev, callback) {
        this.events = this.events || {};
        if(this.events[ev]) {
            for(var i = 0; i < this.events[ev].length; i++) {
                if(this.events[ev][i] === callback) {
                    this.events[ev].splice(i, 1);
                    return;
                }
            }
        }
    }
    fireEvent(ev, data) {
        this.events = this.events || {};
        if(this.events[ev]) {
            for(var i = 0; i < this.events[ev].length; i++) {
                this.events[ev][i].call(this, data);
            }
        }
    }
}

export default Events;
