var mr = .1;
var skfd = 0;
var skpr = 1;
var skpd = 2;
var sefd = 3;
var sepr = 4;
var sepd = 5;
var maxs = 6;
var maxf = 7;
var nutd = 8;
var sze = 9;

function Creature(x, y, clr, type, dna){
	this.pos = createVector(x, y);
	this.vel = createVector();
	this.acc = createVector();
	this.clr = clr;
	this.history = [];
	this.life = 1;
	this.lifeSpan = 0;
	this.sze = 15;
	this.canMate = false;
	this.type = type;
	this.childrens = 0;
	this.dna = [];

	if(!dna){
	//seek food = 0
	this.dna[skfd] = random(-1,1);

	//seek prey = 1
	this.dna[skpr] = random(-1,1);

	//seek predator = 2
	this.dna[skpd] = random(-1,1);

	//see food = 3
	this.dna[sefd] = random(40,200);

	//see prey = 4
	this.dna[sepr] = random(40,200);

	//see predator = 5
	this.dna[sepd] = random(40,200);

	//maxSpeed = 6
	this.dna[maxs] = random(1,5);

	//maxForce = 7
	this.dna[maxf] = random(0.3,1);

	//nutritDeath = 8
	this.dna[nutd] = random(-2,2);

	//size = 9
	this.dna[sze] = random(3, 10);

	} else{
		for(var i = 0; i < dna.length; i++){
			this.dna[i] = dna[i];
		}
	}

	this.goBack = function(){
		if(this.pos.x < 0){
			this.applyForce(createVector(1,0));			
		}
		if(this.pos.x > width){
			this.applyForce(createVector(-1,0));			
		}
		if(this.pos.y < 0){
			this.applyForce(createVector(0,1));			
		}
		if(this.pos.y > height){
			this.applyForce(createVector(0,-1));
		}
	}

	this.mutate = function(mr){
		this.dna = this.dna.map(x => x+=random(-mr, mr) * x);
	}


	this.applyForce = function(force){
		this.acc.add(force);
	}
	this.applyPhysics = function(){
		this.vel.limit(this.dna[maxs]);
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.acc.mult(0);
	}
	this.update = function(){
		this.life -= 0.01;
		this.behavior();
		this.applyPhysics();
		this.goBack();
		this.show();
		this.lifeSpan++;
	}
	this.drawPath = function(){
		stroke(200);
		line(0, 0, 5*this.vel.x, 5*this.vel.y);
	}

	this.drawDebug = function(){
			strokeWeight(.5);
			noFill();
			strokeWeight(.5);
			stroke("green");
			ellipse(0, 0, this.dna[sefd],this.dna[sefd]);
			stroke("yellow");
			ellipse(0, 0, this.dna[sepr], this.dna[sepr]);
			stroke("blue");
			ellipse(0, 0, this.dna[sepd], this.dna[sepd]);
	}

	this.drawCreature = function(){
		var rd = color(255,0,0);
		var gr = color(0,255,0);
		var lifeColor = lerpColor(rd, gr, this.life);
		stroke(lifeColor);
		strokeWeight(1);
		fill(this.clr);
		ellipse(0, 0, this.sze, this.sze);
	}
	this.show = function(){
		push();
		translate(this.pos.x, this.pos.y);
		rectMode(CENTER);
		if(debug){
			this.drawCreature();
			//this.drawDebug();
			//this.drawPath();
		}
		pop();		
	}

	this.drawSeek = function(target, desired){
		push();
		translate(this.pos.x, this.pos.y);
		rectMode(CENTER);
		stroke(target.clr);
		line(0, 0, desired.x, desired.y);
		pop();
	}

	this.behavior = function(){
		this.chase(food, 0, 3);
		this.chase(prey.creatures, 1, 4);
		this.chase(predator.creatures, 2, 5)
	}

	this.chase = function(target, seekIndex, seeIndex){
		var steer = this.eat(target, this.dna[seeIndex]);
		steer.mult(this.dna[seekIndex]);
		this.applyForce(steer);
	}

	this.seek = function(target, perception){
		var desired = p5.Vector.sub(target.pos, this.pos);
		//this.drawSeek(target, desired);
		if(perception > desired.mag()){
			desired.setMag(this.dna[maxs]);
		}
		else{
			desired = this.vel;
		}
		var steer = p5.Vector.sub(desired, this.vel);
		steer.limit(this.dna[maxf]);
		return steer;
	}

	this.eat = function(list, perception){
		var record = Infinity;
		var closest = null;
		this.canMate = false;
		for(var i =  list.length-1; i >= 0; i--){
			var d = this.pos.dist(list[i].pos);
			if(d < this.sze + list[i].sze){
				if((list[i].type == "prey" && this.type == "pred")){
					this.life += 0.5;
					list[i].nutrit -=0.5;

				}
				else if(list[i].type == "edible" && this.type == "pred"){
					this.life -= .5;
					list.splice(i, 1);
				}
				else if(list[i].type == "edible" && this.type == "prey"){
					this.life += list[i].nutrit;
					list.splice(i, 1);
				}
				else if(list[i].type === this.type){
					this.canMate = true;
				}
			}else{
				if(d < record && list[i] != this){
					record = d;
					closest = list[i];
				}
			}
		}
		if(this.life > 2){
			this.life = 2;
		}
		if(closest){
			return this.seek(closest, perception);
		} else{
			return createVector(0, 0);
		}
	}

	this.clone = function(){
		if(random(1) < 0.01 && this.canMate == true && this.life >= 0.6){
			var clone = new Creature(this.pos.x, this.pos.y, this.clr, this.type, this.dna);
			clone.vel.x += random(-this.dna[maxs], this.dna[maxs]);
			clone.vel.y += random(-this.dna[maxs], this.dna[maxs]);
			clone.mutate(mr);
			return clone;
		}
	}

	this.isDead = function(){
		if(this.life <= 0){
			var remains = new edible (foodNut);
			remains.pos = this.pos;
			food.push(remains);
			return true;
		}
		return false;
	}
}