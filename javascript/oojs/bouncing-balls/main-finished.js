/* eslint-env browser, es6*/

// Set up for a ball counter display

const para = document.querySelector('p');
let ballCount = 0;

// Setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// Function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// Define Shape constructor
/*
x - x coordinate
y - y coordinate
velX - velocity in regards to X
velY - velocity in regards to Y
exists - whether or not ball exists in world
*/

function Shape(x, y, velX, velY,exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;
}

// Define Ball constructor, inherits from Shape. Also defining prototype and constructor
/*
color - color of ball 
size - size of ball
*/

function Ball(x,y,velX,velY,exists,color,size){
    Shape.call(this,x,y,velX,velY,exists);
    
    this.color = color;
    this.size = size;
}

Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

// Define ball draw method

Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

// Define ball update method. Update position of X and Y according to velocity
// change direction if ball crashes into boundary

Ball.prototype.update = function() {
  if((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
};

// Define ball collision detection, change color if collision occurs

Ball.prototype.collisionDetect = function() {
  for(let j = 0; j < balls.length; j++) {
    if(!(this === balls[j])) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = 'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')';
      }
    }
  }
};

// Define EvilCircle constructor (inherits from Shape) and set prototype and constructor
/*
color - color of EvilCircle
size - size of EvilCircle
*/

function EvilCircle(x,y,exists){
    Shape.call(this,x,y,20,20,exists);
    
    this.color = 'white';
    this.size = 10;
}

EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.constructor = EvilCircle;

// Define EvilCircle draw method

EvilCircle.prototype.draw = function() {
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
};

// Define EvilCircle checkBounds method
// reposition EvilCircle back into bounds if crash with boundary occurs

EvilCircle.prototype.checkBounds = function() {
  if((this.x + this.size) >= width) {
    this.x -= this.velX - this.size;
  }

  if((this.x - this.size) <= 0) {
    this.x += this.size;
  }

  if((this.y + this.size) >= height) {
    this.y -= this.size;
  }

  if((this.y - this.size) <= 0) {
    this.y += this.size;
  }
};

// Define EvilCircle setControls method
// Movement with WASD keys established

EvilCircle.prototype.setControls = function(){
  let _this = this;
    
  window.onkeydown = function(e) {
      if (e.key === 'a') {
        _this.x -= _this.velX;
      } else if (e.key === 'd') {
        _this.x += _this.velX;
      } else if (e.key === 'w') {
        _this.y -= _this.velY;
      } else if (e.key === 's') {
        _this.y += _this.velY;
      }
    }
}

// Define EvilCircle collisionDetect method
// If collision detected, ball no longer exists and ballCount incremented

EvilCircle.prototype.collisionDetect = function() {
  for(let j = 0; j < balls.length; j++) {
    if(balls[j].exists) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].exists = false;
        ballCount--;
        para.textContent = `Ball Count: ${ballCount}`;
      }
    }
  }
};

// Define array to store balls and populate it

let balls = [];
while(balls.length < 25) {
  const size = random(10,20);
  let ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the adge of the canvas, to avoid drawing errors
    random(0 + size,width - size),
    random(0 + size,height - size),
    random(-7,7),
    random(-7,7),
    true,
    'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
    size
  );
  ballCount++;
  para.textContent = `Ball Count: ${ballCount} `;
  balls.push(ball);
}

// Create EvilCircle instance

let evil = new EvilCircle(width/2,height/2,true);
evil.setControls();

// Define loop that keeps drawing the scene constantly
// Fill canvas, draw, update, and collisionDetect balls
// draw, checkBounds, and collisionDetect evil circle instance

function loop() {
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0,0,width,height);

  for(let i = 0; i < balls.length; i++) {
    if (balls[i].exists){
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
  }

  evil.draw();
  evil.checkBounds();
  evil.collisionDetect();
  
  requestAnimationFrame(loop);
}

loop();
