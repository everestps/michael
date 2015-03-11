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
var BLOCK_SIZE = 50;
var NORMAL_BLOCK_ID = 0;
var FIRST_MAP = 0;
var MAP = getMap(FIRST_MAP);
var SCENE_ANCHOR_START_X = 0;
var SCENE_ANCHOR_START_Y = 0;
var HERO_START_X = gridToCoordinate(5);
var HERO_START_Y = gridToCoordinate(3);
var INVERSE_GAME_SPEED = 3;
var RUN_TIME = -1;

var sceneAnchor = {
  x: SCENE_ANCHOR_START_X,
  y: SCENE_ANCHOR_START_Y
}

var HERO_MARGIN = 200;
var HERO_ACCEL_INCREMENT = 3;
var HERO_JUMP_INCREMENT = 40;
var GRAVITY_INCREMENT = 3;
var FRICTION_INCREMENT = 1;

var KEY_RIGHT = 39;
var KEY_LEFT = 37;
var KEY_UP = 38;
var KEY_DOWN = 40;
var KEY_SPACE = 32;
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var spacePressed = false;

var hero = new Hero(HERO_START_X, HERO_START_Y, HERO_START_X, HERO_START_Y);

var start = null;
var running = true;
var counter = 0;

document.addEventListener('keydown', function(evt){
  var keyCode = evt.keyCode;
  // alert(keyCode);
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
  }
});

document.addEventListener('keyup', function(evt){
  var keyCode = evt.keyCode;
  // alert(keyCode);
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
    this.move = function(){
        this.oldX = this.x;
        this.oldY = this.y;
        this.x += this.dx;
        this.y += this.dy;
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
    accelChange();
    moveHero();
    checkSurroundingBlocks();
    updateSceneAnchor();
    translateCanvas();
    drawEverything();
    resetCtx();
}

function accelChange(){
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
    
    //TODO Delete below
    if(hero.y >= c.height - (BLOCK_SIZE / 2)){
      hero.y = c.height - (BLOCK_SIZE / 2);
      hero.dy = 0;
    }
    
    // if(hero.x >= c.width - (BLOCK_SIZE / 2)){
    //   hero.x = c.width - (BLOCK_SIZE / 2);
    //   hero.dx = 0;
    // }
    // if(hero.x <= 0 + (BLOCK_SIZE / 2)){
    //   hero.x = 0 + (BLOCK_SIZE / 2);
    //   hero.dx = 0;
    // }
}

function checkSurroundingBlocks(){
  
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
  ctx.fillRect(xIn, yIn, widthIn, heightIn);
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














