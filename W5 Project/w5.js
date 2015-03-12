/**
* Created with W5 Project.
* User: mvann
* Date: 2015-03-09
* Time: 08:24 PM
* To change this template use Tools | Templates.
*/



var CANVAS_WIDTH = document.getElementById("myCanvas").width;
var CANVAS_HEIGHT = document.getElementById("myCanvas").height;
var c = document.getElementById("myCanvas"); 
var ctx = c.getContext("2d");
var displayBox = document.getElementById("displayBox");
var BLOCK_SIZE = 50;
var HALF_BLOCK_SIZE = BLOCK_SIZE / 2;
var NORMAL_BLOCK_ID = 0;
var FIRST_MAP = 0;
var BLANK_MAP = 8;
var MAP = getMap(FIRST_MAP);
var SCENE_ANCHOR_START_X = 0;
var SCENE_ANCHOR_START_Y = 0;
var HERO_START_X = gridToCoordinate(15) + HALF_BLOCK_SIZE;
var HERO_START_Y = gridToCoordinate(8) + HALF_BLOCK_SIZE;

var INVERSE_GAME_SPEED = 75;
var RUN_TIME = -1;

var sceneAnchor = {
  x: SCENE_ANCHOR_START_X,
  y: SCENE_ANCHOR_START_Y
};

var HERO_MARGIN = 200;
var HERO_ACCEL_INCREMENT = 3;
var HERO_JUMP_INCREMENT = 40;
var GRAVITY_INCREMENT = 3;
var FRICTION_INCREMENT = 1;

var NO_COLLISION_ID = 0;
var COLLISION_ID = 1;
var heroCornerStatus = [NO_COLLISION_ID, NO_COLLISION_ID, NO_COLLISION_ID, NO_COLLISION_ID];
var TOP_LEFT_CORNER = 0;
var TOP_RIGHT_CORNER = 1;
var BOTTOM_LEFT_CORNER = 2;
var BOTTOM_RIGHT_CORNER = 3;
var NO_ADJUSTMENT = 0;

var KEY_RIGHT = 39;
var KEY_LEFT = 37;
var KEY_UP = 38;
var KEY_DOWN = 40;
var KEY_SPACE = 32;
var KEY_Q = 81;
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var spacePressed = false;
var qPressed = false;

var hero = new Hero(HERO_START_X, HERO_START_Y, HERO_START_X, HERO_START_Y);

var start = null;
var running = true;
var counter = 0;

document.addEventListener('keydown', function(evt){
  var keyCode = evt.keyCode;
  switch(keyCode){
    case KEY_RIGHT:
      rightPressed = true;
    break;
    case KEY_LEFT:
      leftPressed = true;
    break;
    case KEY_UP:
      upPressed = true;
    break;
    case KEY_DOWN:
      downPressed = true;
    break;
    case KEY_SPACE:
      spacePressed = true;
    break;
    case KEY_Q:
      qPressed = true;
    break;
  }
});

document.addEventListener('keyup', function(evt){
  var keyCode = evt.keyCode;
  switch(keyCode){
    case KEY_RIGHT:
      rightPressed = false;
    break;
    case KEY_LEFT:
      leftPressed = false;
    break;
    case KEY_UP:
      upPressed = false;
    break;
    case KEY_DOWN:
      downPressed = false;
    break;
    case KEY_SPACE:
      spacePressed = false;
    break;
    case KEY_Q:
      qPressed = false;
    break;
  }
});

window.requestAnimationFrame(step);



function Hero(xIn, yIn, oldXIn, oldYIn){
    this.x = xIn;
    this.y = yIn;
    this.oldX = oldXIn;
    this.oldY = oldYIn;
    this.dx = 0;
    this.dy = 0;
    this.topLeftCornerX;
    this.topLeftCornerY;
    this.topRightCornerX;
    this.topRightCornerY;
    this.bottomLeftCornerX;
    this.bottomLeftCornerY;
    this.bottomRightCornerX;
    this.bottomRightCornerY;
    this.updateCornerCoordinates = function(){
      this.topLeftCornerX = this.x - HALF_BLOCK_SIZE;
      this.topLeftCornerY = this.y - HALF_BLOCK_SIZE;
      this.topRightCornerX = this.x + HALF_BLOCK_SIZE - 1;
      this.topRightCornerY = this.topLeftCornerY;
      this.bottomLeftCornerX = this.topLeftCornerX;
      this.bottomLeftCornerY = this.y + HALF_BLOCK_SIZE - 1;
      this.bottomRightCornerX = this.topRightCornerX;
      this.bottomRightCornerY = this.bottomLeftCornerY;
    };
    this.move = function(){
        this.oldX = this.x;
        this.oldY = this.y;
        this.x += this.dx;
        if(!qPressed) this.y += this.dy;
    };
    this.draw = function(){
        ctx.beginPath();
        ctx.arc(hero.x, hero.y, BLOCK_SIZE / 2, 0, 2*Math.PI);
        ctx.stroke();  
    };
    this.changeDx = function(incrementIn){
      this.dx += incrementIn;
    };
    this.changeDy = function(incrementIn){
      this.dy += incrementIn;
    };
}

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
    if(progress >= RUN_TIME && RUN_TIME !== -1){
      running = false;
    }
  }
}

/*Starts a series of functions that change the state of the game.
*/
function runGame(){
    velocityChange();
    moveHero();
    fixHeroCollisions();
    updateSceneAnchor();
    translateCanvas();
    drawEverything();
    resetCtx();
}

function velocityChange(){
  if(rightPressed) hero.changeDx(HERO_ACCEL_INCREMENT);
  if(leftPressed) hero.changeDx(-HERO_ACCEL_INCREMENT);
  if(spacePressed && hero.dy === 0) hero.changeDy(-HERO_JUMP_INCREMENT);
  if(hero.dy === 0 && hero.dx !== 0){
    if(hero.dx > FRICTION_INCREMENT) hero.dx += -FRICTION_INCREMENT;
    else if(hero.dx > 0) hero.dx = 0;
    else if(hero.dx >= -FRICTION_INCREMENT) hero.dx = 0;
    else hero.dx += FRICTION_INCREMENT;
  }
  hero.changeDy(GRAVITY_INCREMENT);
}

function moveHero(){
    hero.move();
    
    //TODO Delete below. Code that keeps hero from falling through the floor
    if(hero.y >= c.height - (BLOCK_SIZE / 2)){
      hero.y = c.height - (BLOCK_SIZE / 2);
      hero.dy = 0;
    }
    hero.updateCornerCoordinates();
}

function fixHeroCollisions(){
  updateHeroCornerStatus();
  clearCanvas();
  hero.draw();
  // displayBox.innerHTML = ("(" + coordinateToGrid(hero.topLeftCornerX) + "," + coordinateToGrid(hero.topLeftCornerY) + ")("
  //           + coordinateToGrid(hero.topRightCornerX) + ", " + coordinateToGrid(hero.topRightCornerY) + ")("
  //           + coordinateToGrid(hero.bottomLeftCornerX) + ", " + coordinateToGrid(hero.bottomLeftCornerY) + ")("
  //           + coordinateToGrid(hero.bottomRightCornerX) + ", " + coordinateToGrid(hero.bottomRightCornerY) + ")("
  //           + hero.dx + "," + hero.dy + ")(" + hero.x + "," + hero.y + ")("
  //           + hero.oldX + "," + hero.oldY + ")");
            
  displayBox.innerHTML = ("(" + hero.topLeftCornerX + "," + hero.topLeftCornerY + ")("
            + hero.topRightCornerX + ", " + hero.topRightCornerY + ")("
            + hero.bottomLeftCornerX + ", " + hero.bottomLeftCornerY + ")("
            + hero.bottomRightCornerX + ", " + hero.bottomRightCornerY + ")("
            + hero.dx + "," + hero.dy + ")(" + hero.x + "," + hero.y + ")("
            + hero.oldX + "," + hero.oldY + ")");
  
  
  
  while(getNumberOfCollisions() > 0){
    if (hero.x < quantizeCoordinateMiddlePlusAdjustment(hero.x, NO_ADJUSTMENT)){
      if(hero.y < quantizeCoordinateMiddlePlusAdjustment(hero.y, NO_ADJUSTMENT)){ //1,4,2,3
        fixTopRightBottomLeft();
      }
      else{
        fixTopLeftBottomRight();
      }
    }
    else{
      if(hero.y < quantizeCoordinateMiddlePlusAdjustment(hero.y, NO_ADJUSTMENT)){ 
        fixTopLeftBottomRight();
      }
      else{
        fixTopRightBottomLeft();
      }
    }
  }
}

function fixTopLeftBottomRight(){
  if(isCornerColliding(TOP_LEFT_CORNER)){
    moveBecauseOfCollision(hero.topLeftCornerX, hero.topLeftCornerY);
    updateHeroCornerStatus();
  }
  else if(isCornerColliding(BOTTOM_RIGHT_CORNER)){
    moveBecauseOfCollision(hero.bottomRightCornerX, hero.bottomRightCornerY);
    updateHeroCornerStatus();   
  }
  else if(isCornerColliding(TOP_RIGHT_CORNER)){
    moveBecauseOfCollision(hero.topRightCornerX, hero.topRightCornerY);
    updateHeroCornerStatus();      
  }
  else{ //isCornerColliding(BOTTOM_LEFT_CORNER)
    moveBecauseOfCollision(hero.bottomLeftCornerX, hero.bottomLeftCornerY);
    updateHeroCornerStatus();      
  }
}

function fixTopRightBottomLeft(){
  alert(isCornerColliding(BOTTOM_LEFT_CORNER));
  if(isCornerColliding(TOP_RIGHT_CORNER)){
    moveBecauseOfCollision(hero.topRightCornerX, hero.topRightCornerY);
    updateHeroCornerStatus();   
  }
  else if(isCornerColliding(BOTTOM_LEFT_CORNER)){
    moveBecauseOfCollision(hero.bottomLeftCornerX, hero.bottomLeftCornerY);
    updateHeroCornerStatus();   
  }
  else if(isCornerColliding(TOP_LEFT_CORNER)){
    moveBecauseOfCollision(hero.topLeftCornerX, hero.topLeftCornerY);
    updateHeroCornerStatus();  
  }
  else{ //isCornerColliding(BOTTOM_RIGHT_CORNER)
    moveBecauseOfCollision(hero.bottomRightCornerX, hero.bottomRightCornerY);
    updateHeroCornerStatus(); 
  }
}

function isCornerColliding(cornerIn){
  return heroCornerStatus[cornerIn] === COLLISION_ID;
}

function moveBecauseOfCollision(cornerXIn, cornerYIn){
  var num = hero.dy / hero.dx;
  var gridCenterX = quantizeCoordinateMiddlePlusAdjustment(cornerXIn, NO_ADJUSTMENT);
  var gridCenterY = quantizeCoordinateMiddlePlusAdjustment(cornerYIn, NO_ADJUSTMENT);
  var slope = (hero.oldY - (gridCenterY)) / (hero.oldX - (gridCenterX));
  if(slope <= num && slope >= -num){
    if(hero.oldX < gridCenterX){
      hero.x = quantizeCoordinateMiddlePlusAdjustment(cornerXIn, -1);
      hero.dx = 0;
    }
    else{
      hero.x = quantizeCoordinateMiddlePlusAdjustment(cornerXIn, 1);
      hero.dx = 0;
    }
  }
  else {
    if(hero.oldY < gridCenterY){
      hero.y = quantizeCoordinateMiddlePlusAdjustment(cornerYIn, -1);
      hero.dy = 0;
    }
    else{
      hero.y = quantizeCoordinateMiddlePlusAdjustment(cornerYIn, 1);
      hero.dy = 0;
    }
  }
  hero.updateCornerCoordinates();
}

function updateHeroCornerStatus(){
  if(collisionStatusOfPoint(coordinateToGrid(hero.topLeftCornerX), coordinateToGrid(hero.topLeftCornerY))){
    heroCornerStatus[TOP_LEFT_CORNER] = COLLISION_ID;
  }
  else{
    heroCornerStatus[TOP_LEFT_CORNER] = NO_COLLISION_ID;
  }
  if(collisionStatusOfPoint(coordinateToGrid(hero.topRightCornerX), coordinateToGrid(hero.topRightCornerY))){
    heroCornerStatus[TOP_RIGHT_CORNER] = COLLISION_ID;
  }
  else{
    heroCornerStatus[TOP_RIGHT_CORNER] = NO_COLLISION_ID;
  }
  if(collisionStatusOfPoint(coordinateToGrid(hero.bottomLeftCornerX), coordinateToGrid(hero.bottomLeftCornerY))){
    heroCornerStatus[BOTTOM_LEFT_CORNER] = COLLISION_ID;
  }
  else{
    heroCornerStatus[BOTTOM_LEFT_CORNER] = NO_COLLISION_ID;
  }
  if(collisionStatusOfPoint(coordinateToGrid(hero.bottomRightCornerX), coordinateToGrid(hero.bottomRightCornerY))){
    heroCornerStatus[BOTTOM_RIGHT_CORNER] = COLLISION_ID;
  }
  else{
    heroCornerStatus[BOTTOM_RIGHT_CORNER] = NO_COLLISION_ID;
  }
}

function getNumberOfCollisions(){
  var numberOfCollisions = 0;
  for(var i = 0; i < heroCornerStatus.length; i++){
    numberOfCollisions += heroCornerStatus[i];
  }
  return numberOfCollisions;
}

function quantizeCoordinateMiddlePlusAdjustment(coordinateIn, adjustmentIn){
  return gridToCoordinate(coordinateToGrid(coordinateIn) + adjustmentIn) + HALF_BLOCK_SIZE;
}

function collisionStatusOfPoint(xIn, yIn){
  if(MAP[yIn][xIn] === NORMAL_BLOCK_ID) return true;
  else return false;
}

function drawEverything(){
  // clearCanvas();
  drawBlocks();
  drawHero();
}

function translateCanvas(){
  ctx.translate(-sceneAnchor.x, -sceneAnchor.y);
}

function resetCtx(){
  ctx.translate(sceneAnchor.x, sceneAnchor.y);
}

function updateSceneAnchor(){
  if(hero.x >= (c.width - HERO_MARGIN + sceneAnchor.x)){
    sceneAnchor.x = hero.x - (c.width - HERO_MARGIN);
  }
  else if(hero.x <= 0 + HERO_MARGIN + sceneAnchor.x){
    sceneAnchor.x = hero.x - (0 + HERO_MARGIN);
  }
}

function clearCanvas(){
  ctx.clearRect(sceneAnchor.x, sceneAnchor.y, c.width, c.height);
}

function drawBlocks(){
  for(var i  = 0; i < MAP.length; i++){
    for(var j = 0; j < MAP[i].length; j++){
      if(MAP[i][j] === NORMAL_BLOCK_ID){
        drawNormalBlock(gridToCoordinate(j), gridToCoordinate(i), BLOCK_SIZE, BLOCK_SIZE);
      }
    }
  }
}

function drawNormalBlock(xIn, yIn, widthIn, heightIn){
  changeDrawingColor("#000000");
  // ctx.fillRect(xIn, yIn, widthIn, heightIn);
  ctx.beginPath();
  ctx.lineWidth="1";
  ctx.rect(xIn, yIn, widthIn, heightIn);
  ctx.stroke();
}

function changeDrawingColor(colorIn){
  ctx.fillStyle = colorIn;
}

function drawHero(){
  hero.draw();
}

function gridToCoordinate(gridIn){
    var coordinateOut = gridIn * BLOCK_SIZE;
    return coordinateOut;
}

function coordinateToGrid(coorIn){
  var gridOut = Math.floor(coorIn / BLOCK_SIZE);
  return gridOut;
}

function display(whatIsBeingDisplayed){
  displayBox.innerHTML = (whatIsBeingDisplayed);
}







