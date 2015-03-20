/**
* Created with W5 Project.
* User: mvann
* Date: 2015-03-09
* Time: 08:24 PM
* To change this template use Tools | Templates.
*/

var BLOCK_SIZE = 50;
var HALF_BLOCK_SIZE = BLOCK_SIZE / 2;
var HERO_SIZE = 40;
var HALF_HERO_SIZE = HERO_SIZE / 2;
var FIRST_MAP = 0;
var TEST_MAP = 1;
var BLANK_MAP = 8;
var MAP = getMap(FIRST_MAP);
var SCENE_ANCHOR_START_X = 0;
var SCENE_ANCHOR_START_Y = 0;
var HERO_START_X = gridToCoordinate(8) + HALF_BLOCK_SIZE;
var HERO_START_Y = gridToCoordinate(7) + HALF_BLOCK_SIZE;

var CANVAS_WIDTH = document.getElementById("myCanvas").width;
var CANVAS_HEIGHT = document.getElementById("myCanvas").height;
var c = document.getElementById("myCanvas"); 
var ctx = c.getContext("2d");

var displayBox = document.getElementById("displayBox");

var offScreen = {};
offScreen.canvas = document.createElement('canvas');
offScreen.canvas.width = MAP[0].length * BLOCK_SIZE;
offScreen.canvas.height = MAP.length * BLOCK_SIZE;
offScreen.ctx = offScreen.canvas.getContext("2d");

var midground = {};
midground.canvas = document.createElement('canvas');
midground.canvas.width = MAP[0].length * BLOCK_SIZE * 2;
midground.canvas.height = MAP.length * BLOCK_SIZE;
midground.ctx = midground.canvas.getContext("2d");

var TILESET;
var BACKGROUND;
var TREE_SHEET;

var NORMAL_BLOCK = {x: 576, y:865, width: 70, height: 70, id: 1};
var TOP_BLOCK = {x: 504, y: 577, width: 70, height: 70, id: 2};
var LEFT_LEDGE = {x: 504 , y: 649, width: 70, height: 70, id: 3};
var RIGHT_LEDGE = {x: 504, y: 505, width: 70, height: 70, id: 4};

var PLANT_START_Y = 300;
var PLANT_INCREMENT = 500;
var TREE_LOOPS = 4;
var TREE_ONE =   {x: 134, y: 15,  width: 49, height: 96,  dx: -30, dy: c.height - 350, dWidth: 300, dHeight: 350};
var TREE_TWO =   {x: 201, y: 40,  width: 43, height: 72,  dx: 350, dy: c.height - 275, dWidth: 250, dHeight: 275};
var TREE_THREE = {x: 134, y: 132, width: 51, height: 106, dx: 175, dy: c.height - 350, dWidth: 300, dHeight: 350};
var BUSH_ONE =   {x: 517, y: 15,  width: 58, height: 42,  dx: 130, dy: c.height - 150, dWidth: 150, dHeight: 150};
var BUSH_TWO =   {x: 578, y: 8,   width: 59, height: 48,  dx: 510, dy: c.height - 175, dWidth: 150, dHeight: 175};

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
      qPressed = false;
    break;
  }
});

window.onload = function(){
    TILESET = document.getElementById("platformTiles");
    BACKGROUND = document.getElementById("background");
    TREE_SHEET = document.getElementById("treeSheet");
    drawBlocks();
    drawMidground();
    window.requestAnimationFrame(step);
}

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
    
    this.updateOldCornerCoordinates = function(){
      this.topLeftCornerOldX = this.topLeftCornerX;
      this.topLeftCornerOldY = this.topLeftCornerY;
      this.topRightCornerOldX = this.topRightCornerX;
      this.topRightCornerOldY = this.topRightCornerY;
      this.bottomLeftCornerOldX = this.bottomLeftCornerX;
      this.bottomLeftCornerOldY = this.bottomLeftCornerY;
      this.bottomRightCornerOldX = this.bottomRightCornerX;
      this.bottomRightCornerOldY = this.bottomRightCornerY;
    }
    this.updateCornerCoordinates = function(){
      
      
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
    
    var closestDistance = null;
    var topLeftDistance = getDistance(topLeft.x, topLeft.y, hero.topLeftCornerOldX, hero.topLeftCornerOldY);
    var topRightDistance = getDistance(topRight.x, topRight.y, hero.topRightCornerOldX, hero.topRightCornerOldY);
    var bottomLeftDistance = getDistance(bottomLeft.x, bottomLeft.y, hero.bottomLeftCornerOldX, hero.bottomLeftCornerOldY);
    var bottomRightDistance = getDistance(bottomRight.x, bottomRight.y, hero.bottomRightCornerOldX, hero.bottomRightCornerOldY);


    if(topLeftDistance < closestDistance || closestDistance === null || isNaN(closestDistance)){
      closestDistance = topLeftDistance;
    }
    
    if(topRightDistance < closestDistance || closestDistance === null || isNaN(closestDistance)){
      closestDistance = topRightDistance;
    }
    
    if(bottomLeftDistance < closestDistance || closestDistance === null || isNaN(closestDistance)){
      closestDistance = bottomLeftDistance;
    }
    
    if(bottomRightDistance < closestDistance || closestDistance === null || isNaN(closestDistance)){
      closestDistance = bottomRightDistance;
    }
    
    
    if(hero.dx > 0) var directionX = -1;
    else if(hero.dx < 0) var directionX = 1;
    


    if(topLeftDistance <= closestDistance){
      if(topLeft.lineType === VERTICAL){
        hero.x = topLeft.x + HALF_HERO_SIZE;
        hero.dx = 0;
        
      }
      else{
        hero.y = topLeft.y + HALF_HERO_SIZE;
        hero.dy = 0;
      }
    }

    if(topRightDistance <= closestDistance){
      if(topRight.lineType === VERTICAL){
        hero.x = topRight.x - HALF_HERO_SIZE - 1;
        hero.dy = 0;
      }
      else{
        hero.y = topRight.y + HALF_HERO_SIZE;
        hero.dy = 0;
      }
    }
    
    if(bottomLeftDistance <= closestDistance){
      if(bottomLeft.lineType === VERTICAL){
        hero.x = bottomLeft.x + HALF_HERO_SIZE;
        hero.dx = 0;
        
      }
      else{
        hero.y = bottomLeft.y - HALF_HERO_SIZE - 1;
        hero.dy = 0;
      }
    }
    
    if(bottomRightDistance <= closestDistance){
      if(bottomRight.lineType === VERTICAL){
        hero.x = bottomRight.x - HALF_HERO_SIZE - 1;
        hero.dx = 0;
        
      }
      else{
        hero.y = bottomRight.y - HALF_HERO_SIZE - 1;
        hero.dy = 0;
      }
    }
    
  }
  else if(hero.dx !== 0 && hero.dy === 0){
    if(hero.dx > 0){
      var topRightCoordinatesBetween = getCoordinatesBetween(hero.topRightCornerX, hero.topRightCornerOldX);
      var bottomRightCoordinatesBetween = getCoordinatesBetween(hero.bottomRightCornerX, hero.bottomRightCornerOldX);
      var ysForXCoordinatesTop = [];
      var ysForXCoordinatesBottom = [];
      for(var i = 0; i < topRightCoordinatesBetween.length; i++){
        ysForXCoordinatesTop.push(hero.y - HALF_HERO_SIZE);
      }
      for(i = 0; i < bottomRightCoordinatesBetween.length; i++){
        ysForXCoordinatesBottom.push(hero.y + HALF_HERO_SIZE);
      }
      var xCoordinatesOfCollisionsTop = [];
      var yCoordinatesOfCollisionsTop = [];
      var xCoordinatesOfCollisionsBottom = [];
      var yCoordinatesOfCollisionsBottom = [];
      
      for(i = 0; i < topRightCoordinatesBetween.length; i++){
        if(collisionStatusOfPoint(topRightCoordinatesBetween[i], ysForXCoordinatesTop[i])){
          xCoordinatesOfCollisionsTop.push(topRightCoordinatesBetween[i]);
          yCoordinatesOfCollisionsTop.push(ysForXCoordinatesTop[i]);
        }
      }
      
      for(i = 0; i < bottomRightCoordinatesBetween.length; i++){
        if(collisionStatusOfPoint(bottomRightCoordinatesBetween[i], ysForXCoordinatesBottom[i])){
          xCoordinatesOfCollisionsBottom.push(bottomRightCoordinatesBetween[i]);
          yCoordinatesOfCollisionsBottom.push(ysForXCoordinatesBottom[i]);
        }
      }
      
      var closestDistance = null;
      for(i = 0; i < xCoordinatesOfCollisionsTop.length; i++){
        var distance = getDistance(hero.topRightCornerOldX, hero.topRightCornerOldY, xCoordinatesOfCollisionsTop[i], ysForXCoordinatesTop[i]);
        if(distance < closestDistance || closestDistance === null || isNaN(closestDistance)){
          closestDistance = distance;
          hero.x = xCoordinatesOfCollisionsTop[i] - HALF_HERO_SIZE - 1;
          hero.dx = 0;
        }
      }
      for(i = 0; i < xCoordinatesOfCollisionsBottom.length; i++){
        var distance = getDistance(hero.bottomRightCornerOldX, hero.bottomRightCornerOldY, xCoordinatesOfCollisionsBottom[i], ysForXCoordinatesBottom[i]);
        if(distance < closestDistance || closestDistance === null || isNaN(closestDistance)){
          closestDistance = distance;
          hero.x = xCoordinatesOfCollisionsBottom[i] - HALF_HERO_SIZE - 1;
          hero.dx = 0;
        }
      }
      
      
    }
    else {//dx < 0
      var topLeftCoordinatesBetween = getCoordinatesBetween(hero.topLeftCornerX, hero.topLeftCornerOldX);
      var bottomLeftCoordinatesBetween = getCoordinatesBetween(hero.bottomLeftCornerX, hero.bottomLeftCornerOldX);
      var ysForXCoordinatesTop = [];
      var ysForXCoordinatesBottom = [];
      for(var i = 0; i < topLeftCoordinatesBetween.length; i++){
        ysForXCoordinatesTop.push(hero.y - HALF_HERO_SIZE);
      }
      for(i = 0; i < bottomLeftCoordinatesBetween.length; i++){
        ysForXCoordinatesBottom.push(hero.y + HALF_HERO_SIZE);
      }
      var xCoordinatesOfCollisionsTop = [];
      var yCoordinatesOfCollisionsTop = [];
      var xCoordinatesOfCollisionsBottom = [];
      var yCoordinatesOfCollisionsBottom = [];
      
      for(i = 0; i < topLeftCoordinatesBetween.length; i++){
        if(collisionStatusOfPoint(topLeftCoordinatesBetween[i] - BLOCK_SIZE, ysForXCoordinatesTop[i])){
          xCoordinatesOfCollisionsTop.push(topLeftCoordinatesBetween[i]);
          yCoordinatesOfCollisionsTop.push(ysForXCoordinatesTop[i]);
        }
      }
      
      
      
      for(i = 0; i < bottomLeftCoordinatesBetween.length; i++){
        if(collisionStatusOfPoint(bottomLeftCoordinatesBetween[i] - BLOCK_SIZE, ysForXCoordinatesBottom[i])){
          xCoordinatesOfCollisionsBottom.push(bottomLeftCoordinatesBetween[i]);
          yCoordinatesOfCollisionsBottom.push(ysForXCoordinatesBottom[i]);
        }
      }
      
      
      var closestDistance = null;
      for(i = 0; i < xCoordinatesOfCollisionsTop.length; i++){
        var distance = getDistance(hero.topLeftCornerOldX, hero.topLeftCornerOldY, xCoordinatesOfCollisionsTop[i], ysForXCoordinatesTop[i]);
        if(distance < closestDistance || closestDistance === null || isNaN(closestDistance)){
          closestDistance = distance;
          hero.x = xCoordinatesOfCollisionsTop[i] + HALF_HERO_SIZE;
          hero.dx = 0;
        }
      }
      for(i = 0; i < xCoordinatesOfCollisionsBottom.length; i++){
        var distance = getDistance(hero.bottomLeftCornerOldX, hero.bottomLeftCornerOldY, xCoordinatesOfCollisionsBottom[i], ysForXCoordinatesBottom[i]);
        if(distance < closestDistance || closestDistance === null || isNaN(closestDistance)){
          closestDistance = distance;
          hero.x = xCoordinatesOfCollisionsBottom[i] + HALF_HERO_SIZE;
          hero.dx = 0;
        }
      }
    }
  }
  else if(hero.dx === 0 && hero.dy!== 0){
    if(hero.dy > 0){
      var bottomLeftCoordinatesBetween = getCoordinatesBetween(hero.bottomLeftCornerY, hero.bottomLeftCornerOldY);
      var bottomRightCoordinatesBetween = getCoordinatesBetween(hero.bottomRightCornerY, hero.bottomRightCornerOldY);
      var xsForYCoordinatesLeft = [];
      var xsForYCoordinatesRight = [];
      for(var i = 0; i < bottomLeftCoordinatesBetween.length; i++){
        xsForYCoordinatesLeft.push(hero.x - HALF_HERO_SIZE);
      }
      for(i = 0; i < bottomRightCoordinatesBetween.length; i++){
        xsForYCoordinatesRight.push(hero.x + HALF_HERO_SIZE);
      }
      var xCoordinatesOfCollisionsLeft = [];
      var yCoordinatesOfCollisionsLeft = [];
      var xCoordinatesOfCollisionsRight = [];
      var yCoordinatesOfCollisionsRight = [];
      
      for(i = 0; i < bottomLeftCoordinatesBetween.length; i++){
        if(collisionStatusOfPoint(xsForYCoordinatesLeft[i], bottomLeftCoordinatesBetween[i])){
          xCoordinatesOfCollisionsLeft.push(xsForYCoordinatesLeft[i]);
          yCoordinatesOfCollisionsLeft.push(bottomLeftCoordinatesBetween[i]);
        }
      }
      
      for(i = 0; i < bottomRightCoordinatesBetween.length; i++){
        if(collisionStatusOfPoint(xsForYCoordinatesRight[i], bottomRightCoordinatesBetween[i])){
          xCoordinatesOfCollisionsRight.push(xsForYCoordinatesRight[i]);
          yCoordinatesOfCollisionsRight.push(bottomRightCoordinatesBetween[i]);
        }
      }
      
      var closestDistance = null;
      for(i = 0; i < xCoordinatesOfCollisionsLeft.length; i++){
        var distance = getDistance(hero.bottomLeftCornerOldX, hero.bottomLeftCornerOldX, xCoordinatesOfCollisionsLeft[i], yCoordinatesOfCollisionsLeft[i]);
        if(distance < closestDistance || closestDistance === null || isNaN(closestDistance)){
          closestDistance = distance;
          hero.y = yCoordinatesOfCollisionsLeft[i] - HALF_HERO_SIZE - 1;
          hero.dy = 0;
        }
      }
      for(i = 0; i < xCoordinatesOfCollisionsRight.length; i++){
        var distance = getDistance(hero.bottomRightCornerOldX, hero.bottomRightCornerOldY, xCoordinatesOfCollisionsRight[i], yCoordinatesOfCollisionsRight[i]);
        if(distance < closestDistance || closestDistance === null || isNaN(closestDistance)){
          closestDistance = distance;
          hero.y = yCoordinatesOfCollisionsRight[i] - HALF_HERO_SIZE - 1;
          hero.dy = 0;
        }
      }
      
      
    }
    else { //hero.dy < 0
      var topLeftCoordinatesBetween = getCoordinatesBetween(hero.topLeftCornerY, hero.topLeftCornerOldY);
      var topRightCoordinatesBetween = getCoordinatesBetween(hero.topRightCornerY, hero.topRightCornerOldY);
      var xsForYCoordinatesLeft = [];
      var xsForYCoordinatesRight = [];
      for(var i = 0; i < topLeftCoordinatesBetween.length; i++){
        xsForYCoordinatesLeft.push(hero.x - HALF_HERO_SIZE);
      }
      for(i = 0; i < topRightCoordinatesBetween.length; i++){
        xsForYCoordinatesRight.push(hero.x + HALF_HERO_SIZE);
      }
      var xCoordinatesOfCollisionsLeft = [];
      var yCoordinatesOfCollisionsLeft = [];
      var xCoordinatesOfCollisionsRight = [];
      var yCoordinatesOfCollisionsRight = [];
      
      for(i = 0; i < topLeftCoordinatesBetween.length; i++){
        if(collisionStatusOfPoint(xsForYCoordinatesLeft[i], topLeftCoordinatesBetween[i] - BLOCK_SIZE)){
          xCoordinatesOfCollisionsLeft.push(xsForYCoordinatesLeft[i]);
          yCoordinatesOfCollisionsLeft.push(topLeftCoordinatesBetween[i]);
        }
      }
      
      for(i = 0; i < topRightCoordinatesBetween.length; i++){
        if(collisionStatusOfPoint(xsForYCoordinatesRight[i], topRightCoordinatesBetween[i] - BLOCK_SIZE)){
          xCoordinatesOfCollisionsRight.push(xsForYCoordinatesRight[i]);
          yCoordinatesOfCollisionsRight.push(topRightCoordinatesBetween[i]);
        }
      }
      
      var closestDistance = null;
      for(i = 0; i < xCoordinatesOfCollisionsLeft.length; i++){
        var distance = getDistance(hero.topLeftCornerOldX, hero.topLeftCornerOldX, xCoordinatesOfCollisionsLeft[i], yCoordinatesOfCollisionsLeft[i]);
        if(distance < closestDistance || closestDistance === null || isNaN(closestDistance)){
          closestDistance = distance;
          hero.y = yCoordinatesOfCollisionsLeft[i] + HALF_HERO_SIZE;
          hero.dy = 0;
        }
      }
      for(i = 0; i < xCoordinatesOfCollisionsRight.length; i++){
        var distance = getDistance(hero.topRightCornerOldX, hero.topRightCornerOldY, xCoordinatesOfCollisionsRight[i], yCoordinatesOfCollisionsRight[i]);
        if(distance < closestDistance || closestDistance === null || isNaN(closestDistance)){
          closestDistance = distance;
          hero.y = yCoordinatesOfCollisionsRight[i] + HALF_HERO_SIZE;
          hero.dy = 0;
        }
      }
    }
  }
  hero.updateCornerCoordinates();
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
  for(var i = 0; i < xCoordinatesOfCollisions.length; i++){
    var distance = getDistance(xCoordinatesOfCollisions[i], yCoordinatesOfCollisions[i], oldXIn, oldYIn);
    if(closestDistance === null || distance < closestDistance){
      xOfClosestCollision = xCoordinatesOfCollisions[i];
      yOfClosestCollision = yCoordinatesOfCollisions[i];
      lineTypeOfCollision = lineType[i];
      closestDistance = distance;
    }
  }
  if(xOfClosestCollision === null || yOfClosestCollision === null || lineTypeOfCollision === null){
    return null;
  }
  return {x:xOfClosestCollision, y:yOfClosestCollision, lineType:lineTypeOfCollision};
  }
}

function getYsForXCoordinates(xCoordinatesIn, slopeIn, xIn, yIn){
  var ysForXCoordinates = [];
  for(var i = 0; i < xCoordinatesIn.length; i++){
    if(xCoordinatesIn[i] === xIn) ysForXCoordinates.push(yIn);
    else ysForXCoordinates.push(slopeIn * (xCoordinatesIn[i] - xIn) + yIn);
  }
  return ysForXCoordinates;
}

function getXsForYCoordinates(yCoordinatesIn, slopeIn, xIn, yIn){
  var xsForYCoordinates = [];
  for(var i = 0; i < yCoordinatesIn.length; i++){
    if(yCoordinatesIn[i] === yIn) xsForYCoordinates.push(xIn);
    else xsForYCoordinates.push(((yCoordinatesIn[i] - yIn) / slopeIn) + xIn);
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
  if(MAP[cellY][cellX] === NORMAL_BLOCK.id ||
     MAP[cellY][cellX] === TOP_BLOCK.id ||
     MAP[cellY][cellX] === LEFT_LEDGE.id ||
     MAP[cellY][cellX] === RIGHT_LEDGE.id){
       return true;
  }
  else{
      return false;
  }
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
    if(hero.y >= c.height - 1 - HALF_HERO_SIZE){
      hero.y = c.height - 1 - HALF_HERO_SIZE;
      hero.dy = 0;
    }
    hero.updateOldCornerCoordinates();
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
  drawBackground();
  drawMidgroundCanvas();
  drawOffScreenCanvas();
  drawHero();
}

function drawOffScreenCanvas(){
  ctx.drawImage(offScreen.canvas, 0, 0, offScreen.canvas.width, offScreen.canvas.height);
}

function drawMidgroundCanvas(){
  ctx.drawImage(midground.canvas, sceneAnchor.x / 2, sceneAnchor.y / 2, midground.canvas.width, midground.canvas.height);
}

function drawBackground(){
    ctx.drawImage(BACKGROUND, sceneAnchor.x, sceneAnchor.y, c.width, c.height);
}

function drawMidground(){
    for(var i = 0; i < TREE_LOOPS; i++){
        drawToCanvas(midground.ctx, TREE_SHEET, TREE_ONE, TREE_ONE.dx + PLANT_INCREMENT * i, TREE_ONE.dy, TREE_ONE.dWidth, TREE_ONE.dHeight);
        drawToCanvas(midground.ctx, TREE_SHEET, BUSH_ONE, BUSH_ONE.dx + PLANT_INCREMENT * i, BUSH_ONE.dy, BUSH_ONE.dWidth, BUSH_ONE.dHeight);
        drawToCanvas(midground.ctx, TREE_SHEET, TREE_TWO, TREE_TWO.dx + PLANT_INCREMENT * i, TREE_TWO.dy, TREE_TWO.dWidth, TREE_TWO.dHeight);
        drawToCanvas(midground.ctx, TREE_SHEET, BUSH_TWO, BUSH_TWO.dx + PLANT_INCREMENT * i, BUSH_TWO.dy, BUSH_TWO.dWidth, BUSH_TWO.dHeight);
        drawToCanvas(midground.ctx, TREE_SHEET, TREE_THREE, TREE_THREE.dx + PLANT_INCREMENT * i, TREE_THREE.dy, TREE_THREE.dWidth, TREE_THREE.dHeight);
    }
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
      if(MAP[i][j] === NORMAL_BLOCK.id){
        drawToCanvas(offScreen.ctx, TILESET, NORMAL_BLOCK, gridToCoordinate(j), gridToCoordinate(i), BLOCK_SIZE, BLOCK_SIZE);
      }
      else if(MAP[i][j] === TOP_BLOCK.id){
        drawToCanvas(offScreen.ctx, TILESET, TOP_BLOCK,  gridToCoordinate(j), gridToCoordinate(i), BLOCK_SIZE, BLOCK_SIZE);
      }
      else if(MAP[i][j] === LEFT_LEDGE.id){
        drawToCanvas(offScreen.ctx, TILESET, LEFT_LEDGE,  gridToCoordinate(j), gridToCoordinate(i), BLOCK_SIZE, BLOCK_SIZE);
      }
      else if(MAP[i][j] === RIGHT_LEDGE.id){
        drawToCanvas(offScreen.ctx, TILESET, RIGHT_LEDGE,  gridToCoordinate(j), gridToCoordinate(i), BLOCK_SIZE, BLOCK_SIZE);
      }
    }
  }
}

function drawToCanvas(contextIn, imageIn, tileIn, xIn, yIn, widthIn, heightIn){
  contextIn.drawImage(imageIn, tileIn.x, tileIn.y, tileIn.width, tileIn.height, xIn, yIn, widthIn + 1, heightIn + 1);
}

// function drawPlant(tileIn, xIn, yIn, widthIn, heightIn){
    
// }

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





