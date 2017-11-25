var food = [];
var poison = [];
var predator;
var prey;

var foodAmount = 50;
var foodNut = .5;

var newRecord = null;
var predRecord = null;
var prayRecord = null;
var debug = false;
var show = true;
function setup(){
	createCanvas(600, 400);
	predator = new Population(20, "blue", "pred");
	prey = new Population(80, "yellow", "prey");
	for(var i = 0; i < foodAmount; i++){
		food.push(new edible(foodNut));
	}

	frameRate(120);
}

function draw(){
	background(0,10,20);
	noStroke();
	fill(0,255,0);
	for(var i = 0; i < food.length; i++){
		if(debug){
			ellipse(food[i].pos.x,food[i].pos.y, food[i].sze, food[i].sze);	
		}
	}

	for(var i = 0; i < foodAmount; i++){
		if(food.length < foodAmount){
			food.push(new edible(foodNut));
		}

	}
	predator.run();
	predRecord = newRecord;
	prey.run();
	prayRecord = newRecord;
}

function keyTyped(){
	if(key === 'd'){
		debug = !debug;
	}
	if(key === 'r'){
		console.log("life",predRecord.life.toFixed(2));
		console.log("lifeSpan",predRecord.lifeSpan.toFixed(0));
		console.log("childrens",predRecord.childrens.toFixed(0));
		console.log("see food",predRecord.dna[3].toFixed(2));
		console.log("see prey",predRecord.dna[4].toFixed(2));
		console.log("see predator",predRecord.dna[5].toFixed(2));
		console.log("seek food",predRecord.dna[0].toFixed(2));
		console.log("seek prey",predRecord.dna[1].toFixed(2));
		console.log("seek predator",predRecord.dna[2].toFixed(2));
		console.log("maxSpeed",predRecord.dna[6].toFixed(2));
		console.log("maxForce",predRecord.dna[7].toFixed(2));
		console.log("");
		console.log("life",prayRecord.life.toFixed(2));
		console.log("lifeSpan",prayRecord.lifeSpan.toFixed(0));
		console.log("childrens",prayRecord.childrens.toFixed(0));
		console.log("see food",prayRecord.dna[3].toFixed(2));
		console.log("see prey",prayRecord.dna[4].toFixed(2));
		console.log("see predator",prayRecord.dna[5].toFixed(2));
		console.log("seek food",prayRecord.dna[0].toFixed(2));
		console.log("seek prey",prayRecord.dna[1].toFixed(2));
		console.log("seek predator",prayRecord.dna[2].toFixed(2));
		console.log("maxSpeed",prayRecord.dna[6].toFixed(2));
		console.log("maxForce",prayRecord.dna[7].toFixed(2));
		console.log("");
	}
}

function edible(nutrit){
	var dna = [];
	this.pos = createVector(random(width), random(height));
	this.type = "edible";
	this.nutrit = nutrit;
	this.sze = 10;
	this.clr = color(0,255,0);
}

