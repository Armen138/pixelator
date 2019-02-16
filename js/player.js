game.Player = function(pos) {
	a2d.Tile.apply(this, [a2d.resources["dino"]]);
	var self = this,
		/*fixDef = new Box2D.Dynamics.b2FixtureDef,
		bodyDef = new Box2D.Dynamics.b2BodyDef,
		body = null,*/
		$draw = this.draw.bind(this),
		left = false,
		right = false,
		walkcycle = new a2d.Vector(0, 2);
	//constructor body
	this.position = game.level.toPix(pos);
	/*pPos = new Box2D.Common.Math.b2Vec2(0, 0);
	pPos.X = pos.X;
	pPos.Y = pos.Y;
	//fixDef.density = 1.0;
	fixDef.friction = 5.0;
	fixDef.restitution = 0.2;	
	bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
	//fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape;
	//fixDef.shape.SetAsBox(3.0, 3.0);
	fixDef.shape = new Box2D.Collision.Shapes.b2CircleShape(3.0);
	fixDef.userData = this;
	bodyDef.position.Set(pPos.x, pPos.y);
	bodyDef.allowSleep = false;
	body = game.world.CreateBody(bodyDef);
	body.CreateFixture(fixDef);
*/
	this.scale = new a2d.Vector(1.0 , 1.0);
	this.fps = 4;
	this.jumping = 0;
	this.lastUpdate = 0;
	this.lives = 5;
	this.eat = function() {		
/*		var contacts = body.GetContactList();
    	while(contacts) {
    		var fixa = contacts.contact.GetFixtureA(),
    			fixb = contacts.contact.GetFixtureB();
    		if(contacts.contact.IsTouching()) {
	    		if(fixa.m_userData !== self) {
	    			userData = fixa.m_userData;
	    		} else {
	    			userData = fixb.m_userData;	    			
	    		}
    			if(userData) {
    				if (userData.meat) {
	    				game.level.remove(game.level.indexOf(userData.die()));
	    				game.humans--;
	    				game.humansLabel.text = "humans eaten: " + (14 - game.humans) + "/14";
	    				//a2d.resources.coin.play();
    				}
    				if (userData.grenade) {
	    				userData.die();	    				
	    				self.lives--;
	    				game.updateLives();
    				}

    			} 	    		
	    	}
    		contacts = contacts.next;
    	}*/
	}
	this.isGrounded = function() {
		//var cl = body.GetContactList();
		//return cl !== null
		var gridPos = game.level.getTile(self.boundingBox.bottomLeft);
		if(game.level.getTiles()[gridPos.X][gridPos.Y].tile != -1) {

			return true;
		}
		return false;
	};

	this.draw = function() {
		var now = (new Date()).getTime();
		self.delta = now - self.lastUpdate;
		if(self.delta > 100) { self.delta = 0; }
		/*var pPos = body.GetPosition(),
			v = body.GetLinearVelocity();
		this.position.X = pPos.X;
		this.position.Y = pPos.Y;
		if(v.x === 0 && v.y === 0) {
			self.stop(0);
		} else {
			if(!self.animated) {
				self.frameLoop(walkcycle, true);
			}
		}*/
		//this.angle = body.GetAngle();
		if(!self.isGrounded() && self.jumping === 0) {
			self.position.Y+=10;
		}
		if(self.jumping !== 0) {
			var now = (new Date()).getTime();
			if(now - self.jumping > 500) {
				self.jumping = 0;
			}
			var br = game.level.getTile(self.boundingBox.bottomRight);
			if(game.level.getTiles()[br.X][br.Y - 2].tile === -1) {			
				self.position.Y -= 10;				
			}			
			
		}
		$draw();
		self.eat();
		self.move();
		self.lastUpdate = now;
		//console.log(self.tile);
	};

	this.move = function() {		
		if(this.left) {
			var br = game.level.getTile(self.boundingBox.bottomRight);
			if(game.level.getTiles()[br.X - 1][br.Y - 1].tile === -1) {			
				self.position.X -= self.delta / 3;
				self.scale.X = -1.0;
			}
		}
		if(this.right) {
			var br = game.level.getTile(self.boundingBox.bottomLeft);
			if(game.level.getTiles()[br.X + 1][br.Y - 1].tile === -1) {			
				self.position.X += self.delta / 3;
				self.scale.X = 1.0;
			}
		}
	};

	this.jump = function() {
		//body.SetLinearVelocity(new Box2D.Common.Math.b2Vec2(0, 0));
		if(self.isGrounded()) {			
			self.jumping = (new Date()).getTime();
			/*var f = new Box2D.Common.Math.b2Vec2(0, -15),
				v = body.GetLinearVelocity();
			body.ApplyImpulse(f, body.GetPosition());*/
			//a2d.resources.jump.play();
		}
	};
};