/*jshint esversion:6 */

import Events from './events.js';
/** static */
var entityId = 0;

/**
 * Entity
 * @class
 */
class Entity extends Events {
    constructor() {
        super();
        this.id = entityId++;
        this.controllers = {};
        this.components = [];
        this.on('draw', function() {
            for(var i = 0; i < this.components.length; i++) {
                this.components[i].fireEvent('draw');
            }
        });
    }
    addController(name, controller) {
        this.controllers[name] = controller;
        if(controller.register) {
            controller.register();
        }
    }
    removeController(name) {
        if(this.controllers[name].unregister) {
            this.controllers[name].unregister();
        }
    }
}

export default Entity;

