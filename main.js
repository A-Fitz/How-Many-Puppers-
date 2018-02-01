//Source code adapted from https://stackoverflow.com/questions/16380726/draw-image-on-a-bouncing-context-inside-canvas

// Global variables :)
var canvas;
var ctx;
var particle_count = 1; //Beginning count
const MAX_PARTICLE = 1000;
var particles = [];
var particle;


//Creates canvas, sets the width and height through onResize(), and draws first dog
function loadCanvas() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	onResize();
	draw();
}

//Responsive canvas
function onResize() {
	canvas.width = window.innerWidth; //equal to window dimension
	canvas.height = window.innerHeight;
}

//Get random integer between min and max
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

//Load image, draw first dog, and set source to random dog picture
function draw() {
	var img = new Image();
	img.onload = function() {
		beginAnimation(img);
	};
	img.src = 'img/' + getRandomInt(1, 6) + '.png';
}

//Used onClick to create new particle of random dog
function newrandomdog() {
	var img = new Image();
	img.onload = function() {
		particle = new Particle(img);
		particles.push(particle);
		particle_count++;
	};
	img.src = 'img/' + getRandomInt(1, 6) + '.png';
}

//Used to create a surprise cat
function newcat() {
	var img = new Image();
	img.onload = function() {
		particle = new Particle(img);
		particles.push(particle);
	};
	img.src = 'img/cat.png';
}

//Particle creation for new dogs
function Particle(img) {
	//Properties of a new particle
	var W = canvas.width;
	var H = canvas.height;
	this.radius = 100;
	this.x = parseInt(Math.random() * W);
	this.y = H;

	//Operation to give the new particle left/right velocity randomly
	if (getRandomInt(0, 2) == 1) {
		this.vx = -7;
	} else {
		this.vx = 7;
	}

	//Operation to give new particle up/down velocity randomly
	if (getRandomInt(0, 2) == 1) {
		this.vy = -5;
	} else {
		this.vy = 5;
	}

	//draw the bouncing object at every frame
	this.draw = function() {
		ctx.drawImage(img, this.x, this.y);
	};
}


//Render every frame of canvas
function renderFrame(img, speedreset) {
	requestAnimationFrame(renderFrame);

	//Setting width and height, height2 is divided by 4 to start particles near top of screen
	var W = canvas.width;
	var H2 = canvas.height;
	var H = canvas.height / 4;
	
	//Clearing screen to prevent trails
	ctx.clearRect(0, 0, W, H2);

	//Adding number of particles to pupper-count
	var div = document.getElementById('numberdogs');
	if(particle_count % 100 == 1){
		div.innerHTML = particle_count
	} else {
		div.innerHTML = particle_count;
	}

	particles.forEach(function(particle) {

		//Adding velocity to x and y axis
		particle.x += particle.vx;
		particle.y += particle.vy;

		//These conditions bounce the particles off of the sides of the screen
		
		//Width
		if (particle.x + particle.radius > W) {
			particle.x -= 5;
			particle.vx = -particle.vx;
		}
		if (particle.x - particle.radius < -100) {
			particle.x += 5;
			particle.vx = -particle.vx;
		}
		//Height
		if (particle.y + particle.radius > H2) {
			particle.y -= 5;
			particle.x += getRandomInt(-6, 6);
			particle.vy = -particle.vy;
		}
		if (particle.y + particle.radius < 90) {
			particle.y += 5;
			particle.x += getRandomInt(-6, 6);
			particle.vy = -particle.vy;
		}

		particle.draw();
	});
}

//create the particles and start to render them
function beginAnimation(img) {
	//Render the first particle group, currently just 1, but keeping this if I want to increase it
	for (var i = 0; i < particle_count; i++) {
		particle = new Particle(img);
		particles.push(particle);
	}

	//If you click on the canvas, create a new random dog
	document.getElementById('canvas').addEventListener('click', function(evt) {
		if (particle_count < MAX_PARTICLE) {
			if(getRandomInt(1, 35) == 15) { //Randomly create a cat for 1/35 chance
				newcat();
			} else {
				newrandomdog();
			}
		}
	}, false);

	renderFrame();
}