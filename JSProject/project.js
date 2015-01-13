//declare starting enemy positions, speed, direction, number of enemies (delayed)wall coordinates
var BORDER_WIDTH = 30;
var RIGHT = 0;
var Left = 1;
var UP = 2;
var DOWN = 3;
var ENEMY_START_X = 100;
var ENEMY_START_Y = 100;
var ENEMY_START_RADIUS = 10;
var ENEMY_SPEED = 3;
var ENEMY_START_DIRECTION = RIGHT;
var NUM_ENEMIES = 1;
var TOWER_SIDE_LENGTH = 25;
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
//(delayed)draw walls
c.style.borderWidth = BORDER_WIDTH + "px";

function getMousePos(c, evt) {
  var rect = c.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left - BORDER_WIDTH,
    y: evt.clientY - rect.top - BORDER_WIDTH
  };
}

c.addEventListener('click', function(evt) {
        var mousePos = getMousePos(c, evt);
        towers.push(new Tower(mousePos.x, mousePos.y));
});


// function getMouseX(e) {
//   return e.clientX || e.pageX;
// }

// function getMouseY(e) {
//   return e.clientY || e.pageY;
// }

//create enemy array
var enemies = [];
//for loop that pushes desired number of enemies into enemy array
for(var i = 0; i < NUM_ENEMIES; i++){
  enemies.push(new Enemy(ENEMY_START_X, ENEMY_START_Y, ENEMY_START_DIRECTION, ENEMY_SPEED, ENEMY_START_RADIUS));
}
var towers = [];
towers[0] = new Tower(175,175);

//enemy object constructor 
function Enemy(xIn, yIn, directionIn, speedIn, radiusIn){
  this.x = xIn;
  this.y = yIn;
  this.direction = directionIn;
  this.speed = speedIn;
  this.radius = radiusIn;
  // this.ctx = ctxIn;
  this.move = function() {
    if(this.direction === RIGHT){
      this.x += this.speed;
    }
    else if(this.direction === LEFT){
      this.x -= this.speed;
    }
    else if(this.direction === UP){
      this.y -= this.speed;
    }
    else {//(direction === DOWN)
      this.y += this.speed;
    }
  };
  this.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
    ctx.stroke();
  };
  
}


//tower object constructor
function Tower(xIn, yIn) {
  this.x = xIn;
  this.y = yIn;
  this.draw = function() {
    ctx.fillRect(this.x - TOWER_SIDE_LENGTH / 2, this.y - TOWER_SIDE_LENGTH / 2, 
    TOWER_SIDE_LENGTH, TOWER_SIDE_LENGTH);
  }
}

//step method
var start = null;
var running = true;
var counter = 0;

function step(timestamp) {
  //start equals the current time but only if the start variable is null
  if (start === null) start = timestamp;
  //progress equals the time minus the start
  var progress = timestamp - start;
  // runGame function fires
  if(counter % 5 === 0){
    runGame();
  }
  counter ++;
  if (running) {
    window.requestAnimationFrame(step);
    if(progress >= 70000){
      running = false;
    }
  }
}


//window.requestAnimationFrame(step);
//tells the browser that you want to run the step function before the bowser repaints

//runGame function
function runGame() {
  //run for loop for entire enemy array that runs the following functions for every enemy
  drawEverything();
  moveEverything();
}
//tells the enemies to move function
//redraws enemies function

function drawEverything(){
  ctx.clearRect(0, 0, c.width, c.height);
  for(var e = 0; e < enemies.length; e++){
    enemies[e].draw();
  }
  for(e = 0; e < towers.length; e++){
    towers[e].draw();
  }
}

function moveEverything(){
  for(var d = 0; d < enemies.length; d++){
    enemies[d].move();
  }
}

//run window.requestAnimationFrame(step);
window.requestAnimationFrame(step);


