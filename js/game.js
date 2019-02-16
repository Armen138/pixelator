states.game = {
	init: function() {			
		game.humans = 0;
		game.state = "intro";
		game.scene = new a2d.Node();
		game.level = null;
		setInterval(function() {
			game.fps = game.frames;
			game.dps = a2d.drawCounter;
			console.log(a2d.drawCounter);
			game.frames = 0;
			a2d.drawCounter = 0;
		}, 1000);		
		// setting up physics stuff
		/*var fixDef = new Box2D.Dynamics.b2FixtureDef,
			bodyDef = new Box2D.Dynamics.b2BodyDef;
		if(!game.world) {
			game.world = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(0, 5), true);
		}
		fixDef.density = 1.0;
		fixDef.friction = 0.5;
		fixDef.restitution = 0.2;*/

		//loading level data
		//game.get("data/level.dst?" + Math.random(), function(data) {
			var data = levelData;
			var lines = data.split(",");
			var level = {}, city = {};
			level.gridSize = [lines[lines.length -1].length, lines.length];
			level.tileSize = [64, 64];
			level.tileSet = "tiles";
			level.tiles = [];
			game.level = new a2d.TileGrid();
			for(var x = 0; x < level.gridSize[0]; x++) {
				for(var y = 0; y < level.gridSize[1]; y++) {
					//console.log(lines[y][x]);
					if(lines[y].length > x) {
						level.tiles.push(lines[y][x] === "-" ? 0 : -1);
						if(lines[y][x] === 'h') {
							game.humans++;
							//level.tiles[level.tiles.length -1].meat = true;							
							game.level.push(new game.Meat(new a2d.Position(x * 64 + parseInt(64 / 2, 10), y * 64 + parseInt(64 / 2, 10))));
						}						
					} else {
						level.tiles.push(-1);
					}					
				}
			}

			for(var x = 0; x < level.gridSize[0]; x++) {
				for(var y = 0; y < level.gridSize[1]; y++) {
					level.tiles.push(-1);
				}
			}
			game.level.setData(level);

			city.gridSize = [6, 1];
			city.tileSize = [1240, 1024];
			city.tileSet = "city";
			city.tiles = [0, 0, 0, 0, 0, 0];
			game.city = new a2d.TileGrid(city);
			city.tileSet = "sky";
			city.tileSize = [1240, 900];
			game.sky = new a2d.TileGrid(city);
			//create physics boxes for each tile in grid
			/*
			var tiles = game.level.getTiles(),
				pos = new Box2D.Common.Math.b2Vec2(0, 0);
			for(var x = 0; x < level.gridSize[0]; x++) {
				for(var y = 0; y < level.gridSize[1]; y++) {
					if(tiles[x][y].tile !== -1) {
						pos.X = tiles[x][y].position.X;
						pos.Y = tiles[x][y].position.Y;
						bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
						fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape;
						fixDef.shape.SetAsBox(3.2, 3.2);
						bodyDef.position.Set(pos.x, pos.y);
						game.world.CreateBody(bodyDef).CreateFixture(fixDef);				
					}
				}
			}*/
			game.scene.push(game.sky);
			game.scene.push(game.city);
			game.scene.push(game.level);
			game.player = new game.Player(new a2d.Position(4, 4));			
			game.level.push(game.player);
			
			//a2d.resources.start.play();
			//a2d.resources.music.play(true);
			game.lives = new a2d.Label(icon.heart, { font : "48px fontello", textAlign: "left", position: new a2d.Position( 50, 50 ), color: "#FF4444", border: { width: 5, color: "#000000"} });		

			var mute = new a2d.Label(icon.volumeup, { font : "48px fontello", position: new a2d.Position( a2d.dimension.Width - 120, 50 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} });		
			var gh = new a2d.Label(icon.github, { font : "48px fontello", position: new a2d.Position( a2d.dimension.Width - 50, 50 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} });					
			game.humansLabel = new a2d.Label("humans eaten: 0/" + game.humans, { font : "32px Orotund", textAlign: "left", position: new a2d.Position( 50, 100 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} });
			game.fpsLabel = new a2d.Label("fps: " + 0, { font : "32px Orotund", textAlign: "left", position: new a2d.Position( 50, 150 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} });
			game.dpsLabel = new a2d.Label("dps: " + 0, { font : "32px Orotund", textAlign: "left", position: new a2d.Position( 50, 180 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} });
			gh.on("click", function() {
				window.location = "https://github.com/hashbbg/bbgchallenge7";
			});		
			gh.on("mouseover", function() {
				gh.set({border: { width: 5, color: "#e34500"} });
			});
			gh.on("mouseout", function() {
				gh.set({border: { width: 5, color: "#000000"} });
			});					
			mute.on("mouseover", function() {
				mute.set({border: { width: 5, color: "#e34500"} });
			});
			mute.on("mouseout", function() {
				mute.set({border: { width: 5, color: "#000000"} });
			});			
			mute.on("click", function() {
				a2d.mute = !a2d.mute;
				if(a2d.mute) {
					mute.text = icon.volumeoff;					
					a2d.resources.music.stop();					
				} else {
					mute.text = icon.volumeup;
					//a2d.resources.music.play();
				}
				
			});
			//var mute = new a2d.Label('volume mute', { font : "21px fontello", position: new a2d.Position( 100, 100 ), color: "#FFFFFF" });



			game.scene.push(mute);
			game.scene.push(gh);
			game.scene.push(game.lives);
			game.scene.push(game.humansLabel);
			game.scene.push(game.fpsLabel);
			game.scene.push(game.dpsLabel);
			//game.scene.push(game.intro);
			a2d.root.push(game.scene);
			game.updateLives();
		//})
	},
	keydown : function(keyCode) {
		switch(keyCode) {
			case a2d.key.ARROW_LEFT:
				game.player.left = true;
			break;
			case a2d.key.ARROW_RIGHT:
				game.player.right = true;
			break
			case a2d.key.SPACE:
				game.player.jump();
			break;
		}
	},
	keyup : function(keyCode) {
		switch(keyCode) {
			case a2d.key.ARROW_LEFT:
				game.player.left = false;
			break;
			case a2d.key.ARROW_RIGHT:
				game.player.right = false;
			break
		}
	},	
	clear : function () {
		a2d.root.remove(a2d.root.indexOf(game.scene));
		game.scene.length = 0;
		var bodies = game.world.GetBodyList();
		while(bodies) {
			var n = bodies.GetNext();
			game.world.DestroyBody(bodies);
			bodies = n;
		}
	},	
	run : function() {
	 	if(game.level) {
	 		game.frames++;
			//game.world.Step(0.12, 10, 10);
			//game.world.ClearForces();
			game.fpsLabel.text = "fps: " + game.fps;
			game.dpsLabel.text = "dps: " + game.dps;
			if(game.player) {
				var p = game.player.position.clone(),
					parallax;
				p.X -= a2d.dimension.Width / 2;
				p.Y -= a2d.dimension.Height / 2;
				p.scale(new a2d.Position(-1, -1));
				if(p.X > 0) {
					p.X = 0;
				}
				if(p.X < -game.level.getWidth() * 64 + a2d.dimension.Width) {
					p.X = -game.level.getWidth() * 64 + a2d.dimension.Width;
				}
				game.level.offset = p;
				parallax = p.clone();
				parallax.divide(new a2d.Position(2, 2));
				game.city.offset = parallax;
				parallax2 = parallax.clone();
				parallax2.divide(new a2d.Position(2, 2));
				game.sky.offset = parallax2;
				if(game.humans === 0) {
					states.set(states.win);
				}
				if(game.player.lives === 0) {					
					states.set(states.lose);
				}
			}			
		}
	}
};