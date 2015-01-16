var CANVAS_BORDER_WIDTH = 30;
var CANVAS_WIDTH = document.getElementById("myCanvas").width;
var CANVAS_HEIGHT = document.getElementById("myCanvas").height;
var INVERSE_GAME_SPEED = 4;
var RIGHT = 0;
var LEFT = 1;
var UP = 2;
var DOWN = 3;
var INVERSE_SPAWN_RATE = 100;
var NUM_HORIZONTAL_NODES = 20;
var NUM_VERTICAL_NODES = 10;
var NODE_WIDTH = CANVAS_WIDTH / NUM_HORIZONTAL_NODES;
var NODE_HEIGHT = CANVAS_HEIGHT / NUM_VERTICAL_NODES;
var DRAW_NODES = true;
var ENEMY_START_X = -10;
var ENEMY_START_Y = 225;
var ENEMY_START_HEALTH = 1000;
var ENEMY_SPEED = 3;
var ENEMY_START_DIRECTION = RIGHT;
var ENEMY_COLOR = "#FFFF00";
var ENEMY_OUTLINE_COLOR = "#000000";
var MAX_ENEMIES = 10;
if(NODE_WIDTH > NODE_HEIGHT){
  var TOWER_SIDE_LENGTH = (NODE_HEIGHT) - 10;
  var ENEMY_START_RADIUS = (NODE_HEIGHT) / 2 - 10;
}
else{
  var TOWER_SIDE_LENGTH = (NODE_WIDTH) - 10;
  var ENEMY_START_RADIUS = (NODE_WIDTH) / 2- 10;
}
var DIRECTOR_RADIUS = ENEMY_START_RADIUS;
var NODE_RADIUS = ENEMY_START_RADIUS / 3;
var TOWER_RANGE = 200;
var TOWER_DAMAGE = 1;
var TOWER_COLOR = '#660033';
var LAZER_COLOR = '#FF0000';
var PHANTOM_TOWER_START_X = -1000;
var PHANTOM_TOWER_START_Y = -1000;
var PHANTOM_COLOR = '#838181';
var c = document.getElementById("myCanvas"); 
var ctx = c.getContext("2d");
var displayBox = document.getElementById("displayBox");
var enemies = [];
var enemySpawnCounter = -1;
var phantomTower = new PhantomTower(PHANTOM_TOWER_START_X, PHANTOM_TOWER_START_Y);
c.style.borderWidth = CANVAS_BORDER_WIDTH + "px";
var DRAW_DIRECTORS = true;
var directors = [];

var nodeCoordinates = determineArrayNodeCoordinates();
createDirectors();

function determineArrayNodeCoordinates(){
  var nodeWidthStart = NODE_WIDTH / 2;
  var nodeHeightStart = NODE_HEIGHT / 2;
  var nodeXCoordinates = [];
  var nodeYCoordinates = [];
  for(var i = 0; i < NUM_HORIZONTAL_NODES; i++){
    nodeXCoordinates.push(nodeWidthStart + (NODE_WIDTH * i));
  }
  for(i = 0; i < NUM_VERTICAL_NODES; i++){
    nodeYCoordinates.push(nodeHeightStart + (NODE_HEIGHT * i));
  }
  var nodeCoordinates = {
    xCoordinates: nodeXCoordinates, 
    yCoordinates: nodeYCoordinates};
  return nodeCoordinates;
}

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

c.addEventListener('click', function(evt){createTowerWithMousePos(evt)});
c.addEventListener('mousemove', function(evt){movePhantomTower(evt)});

function createTowerWithMousePos(evt) {
  var mousePos = getMousePosInCanvas(c, evt);
  mousePos.x = quantizeXToGrid(mousePos.x);
  mousePos.y = quantizeYToGrid(mousePos.y);
  towers.push(new Tower(mousePos.x, mousePos.y));
}

function movePhantomTower(evt){
  var mousePos = getMousePosInCanvas(c, evt);
  phantomTower.x = mousePos.x;
  phantomTower.y = mousePos.y;
  phantomTower.x = quantizeXToGrid(phantomTower.x);
  phantomTower.y = quantizeYToGrid(phantomTower.y);
  displayBox.innerHTML = phantomTower.x + ", " + phantomTower.y;
}

function quantizeXToGrid(xIn){
  var indexOfClosestX;
  var leastDifference = null;
  var differenceOfCoordinates
  for(var i = 0; i < NUM_HORIZONTAL_NODES; i++){
    differenceOfCoordinates = Math.abs(xIn - nodeCoordinates.xCoordinates[i]);
    if(leastDifference === null || differenceOfCoordinates < leastDifference){
      leastDifference = differenceOfCoordinates;
      indexOfClosestX = i;
    }
  }
  return nodeCoordinates.xCoordinates[indexOfClosestX];
}

function quantizeYToGrid(yIn){
  var indexOfClosestY;
  var leastDifference = null;
  var differenceOfCoordinates
  for(var i = 0; i < NUM_HORIZONTAL_NODES; i++){
    differenceOfCoordinates = Math.abs(yIn - nodeCoordinates.yCoordinates[i]);
    if(leastDifference === null || differenceOfCoordinates < leastDifference){
      leastDifference = differenceOfCoordinates;
      indexOfClosestY = i;
    }
  }
  return nodeCoordinates.yCoordinates[indexOfClosestY];
}

//create enemy array

var towers = [];
// towers[0] = new Tower(175,175);

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
    changeCanvasColor(ENEMY_COLOR);
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
    ctx.fill();
    changeCanvasColor(ENEMY_OUTLINE_COLOR);
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
  this.directIfInRange = function(directorIn){
    var distance = distanceBetweenPoints(this.x, this.y, directorIn.x, directorIn.y);
    if(distance < (this.speed) && this.direction !== directorIn.direction){
      this.direction = directorIn.direction;
      this.x = quantizeXToGrid(this.x);
      this.y = quantizeYToGrid(this.y);
    }
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
    changeCanvasColor(TOWER_COLOR);
    ctx.fillRect(this.x - TOWER_SIDE_LENGTH / 2, this.y - TOWER_SIDE_LENGTH / 2, 
    TOWER_SIDE_LENGTH, TOWER_SIDE_LENGTH);
    if(this.firing && this.target.alive){
      changeCanvasColor(LAZER_COLOR);
      ctx.beginPath();
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
    // var xDifferenceSquared = Math.pow((this.x - this.target.x), 2);
    // var yDifferenceSquared = Math.pow((this.y - this.target.y), 2);
    // var sumOfXDiffAndYDiff = xDifferenceSquared + yDifferenceSquared;
    var distance = distanceBetweenPoints(this.x, this.y, this.target.x, this.target.y);
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

function distanceBetweenPoints(x1, y1, x2, y2){
  var xDifferenceSquared = Math.pow((x1 - x2), 2);
  var yDifferenceSquared = Math.pow((y1 - y2), 2);
  var sumOfXDiffAndYDiff = xDifferenceSquared + yDifferenceSquared;
  var distance = Math.sqrt(sumOfXDiffAndYDiff);
  return distance;
}

function Director(xIn, yIn, directionIn){
  this.x = quantizeXToGrid(xIn);
  this.y = quantizeYToGrid(yIn);
  this.direction = directionIn;
  this.draw = function(){
    changeCanvasColor(ENEMY_OUTLINE_COLOR)
    ctx.beginPath();
    ctx.arc(this.x, this.y, DIRECTOR_RADIUS, 0, 2*Math.PI);
    ctx.stroke();
  }
}

function PhantomTower(xIn, yIn){
  this.x = xIn;
  this.y = yIn;
  this.draw = function() {
    changeCanvasColor(PHANTOM_COLOR);
    ctx.fillRect(this.x - TOWER_SIDE_LENGTH / 2, this.y - TOWER_SIDE_LENGTH / 2, 
    TOWER_SIDE_LENGTH, TOWER_SIDE_LENGTH);
  }
}

function PathBlocker(){
  
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
  if(counter % INVERSE_GAME_SPEED === 0){
    runGame();
  }
  counter ++;
  if (running) {
    window.requestAnimationFrame(step);
    if(progress >= 140000){
      running = false;
    }
  }
}

function createDirectors(){
  directors.push(new Director(ENEMY_START_X + 200, ENEMY_START_Y, UP));
  directors.push(new Director(nodeToX(4), nodeToY(2), RIGHT));
  directors.push(new Director(nodeToX(9), nodeToY(2), DOWN));
  directors.push(new Director(nodeToX(9), nodeToY(7), RIGHT));
  directors.push(new Director(nodeToX(49), nodeToY(7), UP));
  directors.push(new Director(nodeToX(943), nodeToY(-39), RIGHT));
}

function nodeToX(nodeIn){
  if(nodeIn > NUM_HORIZONTAL_NODES) nodeIn = NUM_HORIZONTAL_NODES;
  else if(nodeIn <= 0) nodeIn = 1;
  var xCoordinate = nodeIn * NODE_WIDTH - (NODE_WIDTH/2);
  return xCoordinate;
}

function nodeToY(nodeIn){
  if(nodeIn > NUM_VERTICAL_NODES) nodeIn = NUM_VERTICAL_NODES;
  else if(nodeIn <= 0) nodeIn = 1;
  var yCoordinate = nodeIn * NODE_HEIGHT - (NODE_HEIGHT / 2);
  return yCoordinate;
}

//window.requestAnimationFrame(step);
//tells the browser that you want to run the step function before the bowser repaints

/*Starts a series of functions that change the state of the game.
*/
function runGame(){
  //run for loop for entire enemy array that runs the following functions for every enemy
  runEnemySpawner();
  towersCheckEnemies();
  enemiesCheckDirectors();
  drawEverything();
  moveEverything();
}


/*Clears the canvas and then uses a series of 
**for loops to draw everything. 
*/
function drawEverything(){
  clearCanvas();
  if(DRAW_NODES) drawNodes();
  if(DRAW_DIRECTORS) drawDirectors();
  phantomTower.draw();
  drawEnemies();
  drawTowers();
}

function drawNodes(){
  // for(var i = 1; i <= NUM_HORIZONTAL_NODES; i++){
  // for(var j = 1; j <= NUM_VERTICAL_NODES; i++){
  //   changeCanvasColor(ENEMY_COLOR);
  //   ctx.beginPath();
  //   ctx.arc(nodeToX(i), nodeToY(j), NODE_RADIUS, 0,2*Math.PI);
  //   ctx.fill();
  // } 
  // }
}

function clearCanvas(){
  ctx.clearRect(0, 0, c.width, c.height);
}

function drawDirectors(){
  for(var j = 0; j < directors.length; j++){
      directors[j].draw();
    }
}

function drawEnemies(){
  for(var i = 0; i < enemies.length; i++){
    enemies[i].draw();
  }
}

function drawTowers(){
  for(i = 0; i < towers.length; i++){
    towers[i].draw();
  }
}

function changeCanvasColor(colorIn){
  ctx.strokeStyle = colorIn;
  ctx.fillStyle = colorIn;
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
  for(var i = 0; i < towers.length; i++){
    if(towers[i].firing) towers[i].checkIfShootable();
    for(var j = enemies.length - 1; j >= 0 && !towers[i].firing; j--){
      towers[i].sendNewTargetToCheck(enemies[j]);
    }
  }
}

function enemiesCheckDirectors(){
  for(var i = 0; i < enemies.length; i++){
    for(var j = 0; j < directors.length; j++){
      enemies[i].directIfInRange(directors[j]);
    }
  }
}

function runEnemySpawner(){
  if(enemySpawnCounter % INVERSE_SPAWN_RATE === 0){
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