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
var HERO_SIZE = 40;
var HALF_HERO_SIZE = HERO_SIZE / 2;
var NORMAL_BLOCK_ID = 0;
var FIRST_MAP = 0;
var TEST_MAP = 1;
var BLANK_MAP = 8;
var MAP = getMap(TEST_MAP);
var SCENE_ANCHOR_START_X = 0;
var SCENE_ANCHOR_START_Y = 0;
var HERO_START_X = gridToCoordinate(2) + HALF_BLOCK_SIZE;
var HERO_START_Y = gridToCoordinate(9) + HALF_BLOCK_SIZE;

var INVERSE_GAME_SPEED = 2;
var RUN_TIME = -1;

var sceneAnchor = {
  x: SCENE_ANCHOR_START_X,
  y: SCENE_ANCHOR_START_Y
};

var HERO_MARGIN = 200;
var HERO_ACCEL_INCREMENT = 2;
var HERO_JUMP_INCREMENT = 40;
var GRAVITY_INCREMENT = 3;
var FRICTION_INCREMENT = 1;

var VERTICAL = 0;
var HORIZONTAL = 1;
var NUM_CORNERS = 4;
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
var debugCounter = 0;

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
      // qPressed = false;
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
    this.topLeftCornerX = this.x - HALF_HERO_SIZE;
    this.topLeftCornerY = this.y - HALF_HERO_SIZE;
    this.topRightCornerX = this.x + HALF_HERO_SIZE;
    this.topRightCornerY = this.topLeftCornerY;
    this.bottomLeftCornerX = this.topLeftCornerX;
    this.bottomLeftCornerY = this.y + HALF_HERO_SIZE;
    this.bottomRightCornerX = this.topRightCornerX;
    this.bottomRightCornerY = this.bottomLeftCornerY;
    
    this.topLeftCornerOldX;
    this.topLeftCornerOldY;
    this.topRightCornerOldX;
    this.topRightCornerOldY;
    this.bottomLeftCornerOldX;
    this.bottomLeftCornerOldY;
    this.bottomRightCornerOldX;
    this.bottomRightCornerOldY;
    
    this.updateCornerCoordinates = function(){
      this.topLeftCornerOldX = this.topLeftCornerX;
      this.topLeftCornerOldY = this.topLeftCornerY;
      this.topRightCornerOldX = this.topRightCornerX;
      this.topRightCornerOldY = this.topRightCornerY;
      this.bottomLeftCornerOldX = this.bottomLeftCornerX;
      this.bottomLeftCornerOldY = this.bottomLeftCornerY;
      this.bottomRightCornerOldX = this.bottomRightCornerX;
      this.bottomRightCornerOldY = this.bottomRightCornerY;
      
      this.topLeftCornerX = this.x - HALF_HERO_SIZE;
      this.topLeftCornerY = this.y - HALF_HERO_SIZE;
      this.topRightCornerX = this.x + HALF_HERO_SIZE;
      this.topRightCornerY = this.topLeftCornerY;
      this.bottomLeftCornerX = this.topLeftCornerX;
      this.bottomLeftCornerY = this.y + HALF_HERO_SIZE;
      this.bottomRightCornerX = this.topRightCornerX;
      this.bottomRightCornerY = this.bottomLeftCornerY;
    };
    this.move = function(){
        this.updateOldCoordinates();
        this.x += this.dx;
        if(!qPressed) this.y += this.dy;
    };
    this.updateOldCoordinates = function(){
      this.oldX = this.x;
      this.oldY = this.y;
    };
    this.draw = function(){
        ctx.beginPath();
        ctx.arc(hero.x, hero.y, HALF_HERO_SIZE, 0, 2*Math.PI);
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
  debugCounter++;
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
    if(!qPressed){
    velocityChange();
    moveHero();
    // fixHeroCollisions();
    // collisionDetection2();
    collisionDetection();
    updateSceneAnchor();
    translateCanvas();
    drawEverything();
    resetCtx();
    }
}

function collisionDetection(){
  if(hero.dx !== 0 && hero.dy !== 0){
    var topLeft = getClosestCollision(hero.topLeftCornerX, hero.topLeftCornerY, hero.topLeftCornerOldX, hero.topLeftCornerOldY, hero.dx, hero.dy, "tl");
    var topRight = getClosestCollision(hero.topRightCornerX, hero.topRightCornerY, hero.topRightCornerOldX, hero.topRightCornerOldY, hero.dx, hero.dy, "tr");
    var bottomLeft = getClosestCollision(hero.bottomLeftCornerX, hero.bottomLeftCornerY, hero.bottomLeftCornerOldX, hero.bottomLeftCornerOldY, hero.dx, hero.dy, "bl");
    var bottomRight = getClosestCollision(hero.bottomRightCornerX, hero.bottomRightCornerY, hero.bottomRightCornerOldX, hero.bottomRightCornerOldY, hero.dx, hero.dy, "br");
    
    displayBox.innerHTML = hero.topLeftCornerX + ", " + hero.topLeftCornerY;
    
    
    var xOfClosestCollision = topLeft.x;
    var yOfClosestCollision = topLeft.y;
    var lineTypeOfCollision = topLeft.lineType;
    var topLeftDistance = getDistance(topLeft.x, topLeft.y, hero.topLeftCornerOldX, hero.topLeftCornerOldY);
    var closestDistance = topLeftDistance;
    
    var topRightDistance = getDistance(topRight.x, topRight.y, hero.topRightCornerOldX, hero.topRightCornerOldY);
    if(topRightDistance < closestDistance){
      xOfClosestCollision = topRight.x;
      yOfClosestCollision = topRight.y;
      lineTypeOfCollision = topRight.lineType;
      closestDistance = topRightDistance;
    }
    
    var bottomLeftDistance = getDistance(bottomLeft.x, bottomLeft.y, hero.bottomLeftCornerOldX, hero.bottomLeftCornerOldY);
    if(bottomLeftDistance < closestDistance){
      xOfClosestCollision = bottomLeft.x;
      yOfClosestCollision = bottomLeft.y;
      lineTypeOfCollision = bottomLeft.lineType;
      closestDistance = bottomLeftDistance;
    }
    
    var bottomRightDistance = getDistance(bottomRight.x, bottomRight.y, hero.bottomRightCornerOldX, hero.bottomRightCornerOldY);
    if(bottomRightDistance < closestDistance){
      xOfClosestCollision = bottomRight.x;
      yOfClosestCollision = bottomRight.y;
      lineTypeOfCollision = bottomRight.lineType;
      closestDistance = bottomRightDistance;
    }
    
    
    if(hero.dx > 0) var directionX = -1;
    else if(hero.dx < 0) var directionX = 1;
    
    // displayBox.innerHTML = directionX
    
    if(topLeftDistance <= closestDistance){
      if(topLeft.lineType === VERTICAL){
        hero.x = topLeft.x + (HALF_HERO_SIZE * directionX);
        hero.dx = 0;
        hero.updateCornerCoordinates;
      }
    }
    
  }
}

function getDistance(xIn, yIn, x2In, y2In){
  var dx = xIn - x2In;
  var dy = yIn - y2In;
  return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}

function getClosestCollision(xIn, yIn, oldXIn, oldYIn, dxIn, dyIn, testingId){
  var slope = dyIn / dxIn;
  var xCoordinatesBetween = getCoordinatesBetween(xIn, oldXIn);
  var ysForXCoordinates = getYsForXCoordinates(xCoordinatesBetween, slope, oldXIn, oldYIn);
  var yCoordinatesBetween = getCoordinatesBetween(yIn, oldYIn);
  var xsForYCoordinates = getXsForYCoordinates(yCoordinatesBetween, slope, oldXIn, oldYIn);
  if(testingId === "tl"){
  // displayBox.innerHTML = xIn + ", " + yIn + ", " + oldXIn + ", " + oldYIn + ", " + dxIn + ", " + dyIn + ", " + testingId;
  // displayBox.innerHTML = displayBox.innerHTML + ", " + xCoordinatesBetween[0] + ", " + ysForXCoordinates[0] + ", " + yCoordinatesBetween[0] + ", " + xsForYCoordinates[0];
  }
  {
  var xCoordinatesOfCollisions = [];
  var yCoordinatesOfCollisions = [];
  var lineType = [];
  

  if(dxIn > 0) var xDirectionMultiplier = 0;
  else if(dxIn < 0) var xDirectionMultiplier = 1;
  
  for(var i = 0; i < xCoordinatesBetween.length; i++){
    if(collisionStatusOfPoint(xCoordinatesBetween[i] - (BLOCK_SIZE * xDirectionMultiplier), ysForXCoordinates[i], testingId)){
      xCoordinatesOfCollisions.push(xCoordinatesBetween[i]);
      yCoordinatesOfCollisions.push(ysForXCoordinates[i]);
      lineType.push(VERTICAL);
    }
  }


  var yDirectionMultiplier;
  
  if(dyIn > 0) yDirectionMultiplier = 0;
  else if(dyIn < 0) yDirectionMultiplier = 1;
  

  
  for(var i = 0; i < yCoordinatesBetween.length; i++){
    if(collisionStatusOfPoint(xsForYCoordinates[i], yCoordinatesBetween[i] - (BLOCK_SIZE * yDirectionMultiplier), testingId)){
      xCoordinatesOfCollisions.push(xsForYCoordinates[i]);
      yCoordinatesOfCollisions.push(yCoordinatesBetween[i]);
      lineType.push(HORIZONTAL);
    }
  }
  

  var xOfClosestCollision;
  var yOfClosestCollision;
  var lineTypeOfCollision;
  var closestDistance = null;
  // if(testingId === "tl") displayBox.innerHTML = displayBox.innerHTML + ", lengthstff: " + xCoordinatesOfCollisions.length + ", " + yCoordinatesOfCollisions.length + ", " + xCoordinatesOfCollisions[0] + ", " + yCoordinatesOfCollisions;
  for(var i = 0; i < xCoordinatesOfCollisions.length; i++){
    var distance = getDistance(xCoordinatesOfCollisions[i], yCoordinatesOfCollisions[i], oldXIn, oldYIn);
    if(closestDistance === null || distance < closestDistance){
      xOfClosestCollision = xCoordinatesOfCollisions[i];
      yOfClosestCollision = yCoordinatesOfCollisions[i];
      lineTypeOfCollision = lineType[i];
      closestDistance = distance;
    }
  }
  // if(testingId === "tl") displayBox.innerHTML = displayBox.innerHTML + "stuff: " + xOfClosestCollision + ", " + yOfClosestCollision + ", " + lineTypeOfCollision;
  if(xOfClosestCollision === null || yOfClosestCollision === null || lineTypeOfCollision === null){
    return null;
  }
  return {x:xOfClosestCollision, y:yOfClosestCollision, lineType:lineTypeOfCollision};
  }
}

function getYsForXCoordinates(xCoordinatesIn, slopeIn, xIn, yIn){
  var ysForXCoordinates = [];
  for(var i = 0; i < xCoordinatesIn.length; i++){
    ysForXCoordinates.push(slopeIn * (xCoordinatesIn[i] - xIn) + yIn);
  }
  return ysForXCoordinates;
}

function getXsForYCoordinates(yCoordinatesIn, slopeIn, xIn, yIn){
  var xsForYCoordinates = [];
  for(var i = 0; i < yCoordinatesIn.length; i++){
    xsForYCoordinates.push(((yCoordinatesIn[i] - yIn) / slopeIn) + xIn);
  }
  return xsForYCoordinates;
}

function getCoordinatesBetween(coorIn, oldCoorIn){
  var coordinatesBetween = [];
  var cell = coordinateToGrid(coorIn);
  var oldCell = coordinateToGrid(oldCoorIn);
  var difference = cell - oldCell;
  if(difference > 0){
    for(var i = 1; i <= difference; i++){
      coordinatesBetween.push(gridToCoordinate(oldCell + i));
    }
  }
  else if (difference < 0){
    for(var i = 0; i < -difference; i++){
      coordinatesBetween.push(gridToCoordinate(oldCell - i)); 
    }
  }
  return coordinatesBetween;
}

function collisionStatusOfPoint(xIn, yIn, idIn){
  var cellX = coordinateToGrid(xIn);
  var cellY = coordinateToGrid(yIn);
  // displayBox.innerHTML = displayBox.innerHTML + ", hurr: " + xIn + ", " + yIn;
  if(MAP[cellY][cellX] === NORMAL_BLOCK_ID) return true;
  else return false;
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
    if(hero.y >= c.height - (HERO_SIZE / 2)){
      hero.y = c.height - (HERO_SIZE / 2);
      hero.dy = 0;
    }
    hero.updateCornerCoordinates();
}


function quantizeCoordinatePlusAdjustment(coordinateIn, adjustmentIn){
  return gridToCoordinate(coordinateToGrid(coordinateIn)) + adjustmentIn;
}

function quantizeCoordinateMiddlePlusAdjustment(coordinateIn, adjustmentIn){
  return gridToCoordinate(coordinateToGrid(coordinateIn) + adjustmentIn) + HALF_BLOCK_SIZE;
}

function drawEverything(){
  clearCanvas();
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





