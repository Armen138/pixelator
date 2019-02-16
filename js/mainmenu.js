states.mainmenu = {
	init: function() {		
		if(!game.menu) {
			function addButton(txt, toState) {
				var button = new a2d.Label(txt, { font : "32px OrotundHeavy", textAlign: "center", position: new a2d.Position( a2d.dimension.Width / 2, 150 + game.menu.buttonCount * 40), color: "#FFFFFF" });
				button.on("click", function() {
					states.set(toState);
				});
				button.on("hover", function() {
					button.color = "#9DD6E3";
				});
				button.on("mouseout", function() {
					button.color = "#FFFFFF";
				});
				game.menu.push(button);
				game.menu.buttonCount++;
			}			
			game.menu = new a2d.Node();
			game.menu.push(new a2d.Label("A2D: platformer", { font : "42px Orotund", textAlign: "center", position: new a2d.Position( a2d.dimension.Width / 2, 100 ), color: "#FFFFFF" }));
			game.menu.buttonCount = 0;
			addButton("play", states.game);
			addButton("credits", states.intro);
			/*
			var playButton = new a2d.Label("Play", { font : "32px OrotundHeavy", textAlign: "center", position: new a2d.Position( a2d.dimension.Width / 2, 150 ), color: "#FFFFFF", border: { width: 5, color: "#0000FF"} });
			playButton.on("click", function() {
				states.set(states.game);
			});
			playButton.on("hover", function() {
				playButton.border = { width: 5, color: "#00FF00"};
			});
			playButton.on("mouseout", function() {
				playButton.border = { width: 5, color: "#0000FF"};
			});*/
			
			console.log("created main menu");
		}
		a2d.root.push(game.menu);
	},
	clear: function() {
		a2d.root.remove(game.menu);
	},
	run: function() {},
	keyup: function(keyCode) {},
	keydown: function(keyCode) {
		states.set(states.game);
	}
};