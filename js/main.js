//make b2Vec2 behave like a2d.Position
/*
Box2D.Common.Math.b2Vec2.prototype.__defineGetter__("X", function() { return this.x * 10; });
Box2D.Common.Math.b2Vec2.prototype.__defineGetter__("Y", function() { return this.y * 10; });
Box2D.Common.Math.b2Vec2.prototype.__defineSetter__("X", function(x) { this.x = x / 10; });
Box2D.Common.Math.b2Vec2.prototype.__defineSetter__("Y", function(y) { this.y = y / 10; });
*/
var state = {
	init : function() {},
	clear : function() {},
	run : function() {},
	keyup : function() {},
	keydown : function() {}
};

var states = { current : null,
				set : function(newstate) {
					if(states.current) {
						states.current.clear();
					}
					states.current = newstate;
					states.current.init();
				}
};
function fixedFromCharCode (codePt) {  
    if (codePt > 0xFFFF) {  
        codePt -= 0x10000;  
        return String.fromCharCode(0xD800 + (codePt >> 10), 0xDC00 +  (codePt & 0x3FF));  
    }  
    else {  
        return String.fromCharCode(codePt);  
    }  
}  

var icon = {
	home   : fixedFromCharCode(0x2302),
	pause  : fixedFromCharCode(0x2389),
	up     : fixedFromCharCode(0x25b4),
	play   : fixedFromCharCode(0x25b6),
	right  : fixedFromCharCode(0x25b8),
	down   : fixedFromCharCode(0x25be),
	left   : fixedFromCharCode(0x26c2),
	star   : fixedFromCharCode(0x2605),
	heart  : fixedFromCharCode(0xe800),
	attention: fixedFromCharCode(0x26a0),
	mail   : fixedFromCharCode(0x2709),
	help   : fixedFromCharCode(0xe704),
	logout : fixedFromCharCode(0xe741),
	reload : fixedFromCharCode(0xe760),
	road   : fixedFromCharCode(0xe78f),
	equal  : fixedFromCharCode(0xe795),
	list   : fixedFromCharCode(0xe7ad),
	puzzle : fixedFromCharCode(0xe7b6),
	github : fixedFromCharCode(0xf308),
	target : fixedFromCharCode(0x1f3af),
	toplist: fixedFromCharCode(0x1f3c6),
	user   : fixedFromCharCode(0x1f464),
	lamp   : fixedFromCharCode(0x1f4a1),
	volumeoff : fixedFromCharCode(0x1f507),
	volumedown: fixedFromCharCode(0x1f509),
	volumeup  : fixedFromCharCode(0x1f50a)
};

states.intro = {
	init : function() {
		game.intro = new a2d.Tile(a2d.resources.dialog);
		game.intro.position.X = a2d.dimension.Width / 2;
		game.intro.position.Y = a2d.dimension.Height / 2;
		game.intro.push(new a2d.Label("Dinosaur Street Freak", { font : "38px OrotundHeavy", textAlign: "center", position: new a2d.Position( 0, -220 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} }));
		game.intro.push(new a2d.Label("You know what I hate? Taking a 65 million", { font : "24px OrotundHeavy", textAlign: "left", position: new a2d.Position( -230, -160 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} }));
		game.intro.push(new a2d.Label("year nap, only to discover the entire", { font : "24px OrotundHeavy", textAlign: "left", position: new a2d.Position( -230, -140 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} }));
		game.intro.push(new a2d.Label("planet has been infested with pesky", { font : "24px OrotundHeavy", textAlign: "left", position: new a2d.Position( -230, -120 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} }));
		game.intro.push(new a2d.Label("humans when I wake up.", { font : "24px OrotundHeavy", textAlign: "left", position: new a2d.Position( -230, -100 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} }));
		game.intro.push(new a2d.Label("There is only one thing to do:", { font : "24px OrotundHeavy", textAlign: "left", position: new a2d.Position( -230, -80 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} }));
		game.intro.push(new a2d.Label("eat them all!", { font : "48px OrotundHeavy", textAlign: "center", position: new a2d.Position( 0, 0 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} }));
		game.intro.push(new a2d.Label("press any key to start", { font : "32px OrotundHeavy", textAlign: "center", position: new a2d.Position( 0, 200 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} }));
		a2d.root.push(game.intro);		
	},
	clear : function() {
		a2d.root.remove(a2d.root.indexOf(game.intro));
	},
	run : function() {},
	keyup : function() {
		states.set(states.game);
	},
	keydown : function() {}
};

states.lose = {
	init : function() {
		game.lose = new a2d.Tile(a2d.resources.dialog);
		game.lose.position.X = a2d.dimension.Width / 2;
		game.lose.position.Y = a2d.dimension.Height / 2;
		game.lose.push(new a2d.Label("Oh No!", { font : "38px OrotundHeavy", textAlign: "center", position: new a2d.Position( 0, -220 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} }));
		game.lose.push(new a2d.Label("Those pesky humans are still", { font : "24px OrotundHeavy", textAlign: "left", position: new a2d.Position( -230, -160 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} }));
		game.lose.push(new a2d.Label("Everywhere! and what's worse:", { font : "24px OrotundHeavy", textAlign: "left", position: new a2d.Position( -230, -140 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} }));
		game.lose.push(new a2d.Label("You are now officially extinct!", { font : "24px OrotundHeavy", textAlign: "left", position: new a2d.Position( -230, -100 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} }));
		game.lose.push(new a2d.Label("press any key to restart", { font : "32px OrotundHeavy", textAlign: "center", position: new a2d.Position( 0, 200 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} }));
		a2d.root.push(game.lose);
	},
	clear : function() {
		a2d.root.remove(a2d.root.indexOf(game.lose));
	},
	run : function() {},
	keyup : function() {
		states.set(states.intro);
	},
	keydown : function() {}
};

states.win = {
	init : function() {
		game.win = new a2d.Tile(a2d.resources.dialog);
		game.win.position.X = a2d.dimension.Width / 2;
		game.win.position.Y = a2d.dimension.Height / 2;
		game.win.push(new a2d.Label("Victory!", { font : "38px OrotundHeavy", textAlign: "center", position: new a2d.Position( 0, -220 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} }));
		game.win.push(new a2d.Label("Oh joy, the peace, the quiet, I think", { font : "24px OrotundHeavy", textAlign: "left", position: new a2d.Position( -230, -160 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} }));
		game.win.push(new a2d.Label("I might just take a nap!", { font : "24px OrotundHeavy", textAlign: "left", position: new a2d.Position( -230, -140 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} }));
		game.win.push(new a2d.Label("press any key to restart", { font : "32px OrotundHeavy", textAlign: "center", position: new a2d.Position( 0, 200 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} }));
		a2d.root.push(game.win);
	},
	clear : function() {
		a2d.root.remove(a2d.root.indexOf(game.win));
	},
	run : function() {},
	keyup : function() {
		states.set(states.intro);
	},
	keydown : function() {}
};

var game = {

	updateLives: function() {
		game.lives.text = "";
		for(var i = 0; i < game.player.lives; i++) {
			game.lives.text += icon.heart + " ";
		}
	},
	get: function(datafile, cb) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", datafile);
		xhr.onreadystatechange = function() {
			if(xhr.readyState === 4) {
				cb(xhr.responseText);
			}
		};
		xhr.send(null);
	}
};

game.credits = {
	game : "12 hour BBG Challenge #7",
	title : "Dinosaur Street Freak",
	dev : "Armen138",
	graphics : "Arme138",
	physics : "Box2D",
	background : "HyperFoxX (http://hyperfoxx.deviantart.com/art/City-Background-139773996)",
	music : "Beat One by Kevin MacLeod (http://freepd.com/Unclassified%20Electronic/Beat%20One)",
	font : "Jakob Fischer / pizzadude.dk"
};

window.addEventListener("load", function() {
	a2d.forceClear = true;
	a2d.drawCounter = 0;
	a2d.on("load", function() {
		//game.init();
		//states.set(states.intro);
		states.set(states.mainmenu);
	});
	game.touchies = {};
	a2d.canvas.addEventListener("touchstart", function(e) {
		var touch = e.touches[0];
		if(states.current && states.current.keydown) {
			if(touch.pageX > a2d.dimension.Width / 2) {
				states.current.keydown(a2d.key.ARROW_RIGHT);
			} else {
				states.current.keydown(a2d.key.ARROW_LEFT);
			}
			game.touchies[touch.identifier] = touch.pageY;
			//game.touchy = touch.pageY;
		}
	});

	a2d.canvas.addEventListener("touchend", function(e) {
		var touch = e.changedTouches[0];
		if(states.current && states.current.keyup) {
			if(touch.pageX > a2d.dimension.Width / 2) {
				states.current.keyup(a2d.key.ARROW_RIGHT);
			} else {
				states.current.keyup(a2d.key.ARROW_LEFT);
			}/*
			if(game.touchies[touch.identifier] && game.touchies[touch.identifier] < touch.pageY - 30) {
				states.current.keydown(a2d.key.SPACE);
			}*/
		}
	});

	a2d.canvas.addEventListener("touchmove", function(e) {
		var touch = e.changedTouches[0];
		if(states.current && states.current.keydown) {
			if(game.touchies[touch.identifier] && game.touchies[touch.identifier] > touch.pageY + 30) {
				states.current.keydown(a2d.key.SPACE);
			}
		}
	});

	document.addEventListener("keydown", function(e) {
		if(states.current) {
			states.current.keydown(e.keyCode);
		}
	});
	document.addEventListener("keyup", function(e) {
		if(states.current) {
			states.current.keyup(e.keyCode);
		}
	});	
	a2d.on("draw", function() {
		if(states.current && states.current.run) {
			states.current.run();
		}
	});
	var loading = new a2d.Label("loading...", { font : "72px OrotundHeavy", position: new a2d.Position( a2d.dimension.Width / 2, a2d.dimension.Height / 2), color: "#FFFFFF", border: { width: 5, color: "#000000"} });
    a2d.on("progress", function(progress) {
    	var pct = (100.0 / progress.total) * progress.loaded;
    	loading.text = "loading ["  +  parseInt(pct, 10) + "%]";
    });
    a2d.on("load", function() {
    	a2d.root.remove(a2d.root.indexOf(loading));
    });
	a2d.root.push(loading);
	a2d.load({	"dino" : "images/dinosaur.png",
				"tiles": "images/tiles.png",
				"meat" : "images/meat.png",
				"city" : "images/city.png",
				"sky"  : "png/BG/BG.png",
				"grenade" : "images/grenade.png",
				"explosion" : "images/explosion.png",
				"dialog" : "images/intro.png" });
});
