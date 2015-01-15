var CANVAS_BORDER_WIDTH = 30;
var RIGHT = 0;
var LEFT = 1;
var UP = 2;
var DOWN = 3;
var ENEMY_START_X = 100;
var ENEMY_START_Y = 100;
var ENEMY_START_RADIUS = 10;
var ENEMY_START_HEALTH = 25;
var ENEMY_SPEED = 3;
var ENEMY_START_DIRECTION = RIGHT;
var MAX_ENEMIES = 10;
var TOWER_SIDE_LENGTH = 50;
var TOWER_RANGE = 200;
var TOWER_DAMAGE = 1;
var c = document.getElementById("myCanvas"); 
var ctx = c.getContext("2d");
var displayBox = document.getElementById("displayBox");
var dBox = displayBox.innerHTML;
var enemies = [];
var enemySpawnCounter = -1;
displayBox.innerHTML = enemySpawnCounter;
c.style.borderWidth = CANVAS_BORDER_WIDTH + "px";

/*This function returns the mouse x and y coordinates in
**the form of an array. These coordinates are the 
**coordinates relative to the top, left corner of the 
**canvas.
*/
function getMousePosInCanvas(c, evt) {
  var rect = c.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left - CANVAS_BORDER_WIDTH,
    y: evt.clientY - rect.top - CANVAS_BORDER_WIDTH
  };
}

c.addEventListener('click', function(evt){
  var mousePos = getMousePosInCanvas(c, evt);
  towers.push(new Tower(mousePos.x, mousePos.y));
});

// function createTowerWithMouseCoordinates(evt) {
//   var mousePos = getMousePosInCanvas(c, evt);
//   towers.push(new Tower(mousePos.x, mousePos.y));
// }

//create enemy array

var towers = [];
towers[0] = new Tower(175,175);

/*This function constructs the enemy object. 
**
**  move(): Function for moving the Object. The speed 
**variable is used as an increment for how much the 
**object moves in a direction. 
**
**  draw(): Draws the enemy as a black circle.
**
**  getCoordinates(): Gets the x and y variables of 
**the object and returns them in an array.
*/
function Enemy(xIn, yIn, directionIn, speedIn, radiusIn, healthIn){
  this.x = xIn;
  this.y = yIn;
  this.direction = directionIn;
  this.speed = speedIn;
  this.radius = radiusIn;
  this.health = healthIn;
  this.alive = true;
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
  this.getCoordinates = function(){
    return {
      x: this.x,
      y: this.y
    };
  };
  this.die = function(){
    this.x = -1000;
    this.y = -1000;
    this.speed = 0;
    this.alive = false;
  };
  this.decreaseHealth = function(damageTaken){
    this.health -= damageTaken;
    if(this.health <= 0) this.die();
  };
}


/*This is the tower object constructor. 
**
**  draw(): Draws the tower as a black square. 
**
**  getCoordinates(): Gets the x and y variables of 
**the object and returns them in an array.
**
**  tryToFire(): Tries to fire the tower lazer.
*/
function Tower(xIn, yIn) {
  this.x = xIn;
  this.y = yIn;
  this.firing = false;
  this.draw = function() {
    ctx.fillRect(this.x - TOWER_SIDE_LENGTH / 2, this.y - TOWER_SIDE_LENGTH / 2, 
    TOWER_SIDE_LENGTH, TOWER_SIDE_LENGTH);
    if(this.firing && this.target.alive){
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.target.x, this.target.y);
      ctx.stroke();
    }
  };
  this.getCoordinates = function(){
    return {
      x: this.x,
      y: this.y
    };
  };
  this.fire = function(){
    this.target.decreaseHealth(TOWER_DAMAGE);
    if(!this.target.alive) {
      this.firing = false;
    }
    else {
      this.firing = true;
    }
  };
  this.checkIfShootable = function(){
    var xDifferenceSquared = Math.pow((this.x - this.target.x), 2);
    var yDifferenceSquared = Math.pow((this.y - this.target.y), 2);
    var sumOfXDiffAndYDiff = xDifferenceSquared + yDifferenceSquared;
    var distance = Math.sqrt(sumOfXDiffAndYDiff);
    if(distance <= TOWER_RANGE && this.target.alive){
      this.fire();
    }
    else{
      this.firing = false;
    }
  };
  this.sendNewTargetToCheck = function(newTarget){
    this.target = newTarget;
    this.checkIfShootable();
  };
}

//step method
var start = null;
var running = true;
var counter = 0;

/*A function that calls itself to loop continuously each time 
**updating the game before telling the window to update it's 
**visuals.
*/
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

/*Starts a series of functions that change the state of the game.
*/
function runGame(){
  //run for loop for entire enemy array that runs the following functions for every enemy
  runEnemySpawner();
  towersCheckEnemies();
  drawEverything();
  moveEverything();
}


/*Clears the canvas and then uses a series of 
**for loops to draw everything. 
*/
function drawEverything(){
  ctx.clearRect(0, 0, c.width, c.height);
  for(var i = 0; i < enemies.length; i++){
    enemies[i].draw();
  }
  for(i = 0; i < towers.length; i++){
    towers[i].draw();
  }
}

/*Uses a for loop to move everything that
**needs to be moved.
*/
function moveEverything(){
  for(var d = 0; d < enemies.length; d++){
    enemies[d].move();
  }
}

/*Contains a for loop that runs through all of the towers 
**to see if any enemies are within range of any towers.
*/
function towersCheckEnemies(){
  for(var j = 0; j < towers.length; j++){
    if(towers[j].firing) towers[j].checkIfShootable();
    for(var i = enemies.length - 1; i >= 0 && !towers[j].firing; i--){
      towers[j].sendNewTargetToCheck(enemies[i]);
    }
  }
}

function runEnemySpawner(){
  if(enemySpawnCounter % 10 === 0){
    enemies.unshift(new Enemy(ENEMY_START_X, ENEMY_START_Y, 
      ENEMY_START_DIRECTION, ENEMY_SPEED, ENEMY_START_RADIUS, ENEMY_START_HEALTH));
  }
  if(enemies.length > MAX_ENEMIES){
    enemies[enemies.length - 1].die();
    // enemies.splice(enemies.length - 1,1);
    enemies.pop();
  }
  enemySpawnCounter++;
}

//run window.requestAnimationFrame(step);
window.requestAnimationFrame(step);