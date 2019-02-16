/*jshint esversion:6 */

import Events from './events.js';
import Vector2 from "./vector2.js";
/** static */
var gameObjectId = 0;

/**
 * GameObject
 * @class
 */
class GameObject extends Events {
    constructor(name, scene) {
        super();
        this.scene = scene;
        this.id = gameObjectId++;
        this.name = name;
        this.tags = [];
        this.position = new Vector2();
        this.scale = 0.0;
        this.rotation = 0.0;
        this.parent = null;
        this.children = [];
        this.behaviors = {};
    }
    serialize() {
        let serialized = {
            children: [],
            behaviors: []            
        };
        let properties = [ "name", "tags", "position", "scale", "rotation" ];
        for(let property of properties) {
            serialized[property] = this[property];
        }
        for(let child of this.children) {
            serialized.children.push(child.serialize());
        }
        // serialized.behaviors = this.behaviors;
        return serialized;
        
    }
    _draw() {
        this.scene.canvas.context.save();
        this.scene.canvas.context.translate(this.position.x, this.position.y);
        this.fireEvent("draw");
        for(let child of this.children) {
            child._draw();
        }
        this.scene.canvas.context.restore();
    }
    bubble(event, data) {
        for(let child of this.children) {
            child.bubble(event, data);
        }
        this.fireEvent(event, data);
    }
    add(gameObject) {
        this.children.push(gameObject);
    }
    addBehavior(Behavior, options = {}) {
        if(Behavior === undefined) {
            console.warn("Trying to add undefined behavior.");
            return;
        }
        let behavior = new Behavior(this, options);
        if(!behavior.name) {
            console.erro("Behavior missing name property.");
        } else {
            this.behaviors[behavior.name] = behavior;
        }
    }
}

export default GameObject;

