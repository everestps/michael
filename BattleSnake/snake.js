/**
* Created with Battle Snake.
* User: mvann
* Date: 2015-04-30
* Time: 05:16 PM
* To change this template use Tools | Templates.
*/

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var displayBox = document.getElementById("displayBox");

var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

var KEY_UP = 38;
var KEY_DOWN = 40;
var KEY_LEFT = 37;
var KEY_RIGHT = 39;
var KEY_W = 87;
var KEY_S = 83;
var KEY_A = 65;
var KEY_D = 68;

var MOVE_INCREMENT = 15;
var BODY_PART_RADIUS = Math.floor(MOVE_INCREMENT / 2);
var NUM_HORIZONTAL_INCREMENTS = Math.floor(canvas.width / MOVE_INCREMENT);
var NUM_VERTICAL_INCREMENTS = Math.floor(canvas.height / MOVE_INCREMENT)

var HEAD_START_X = gridToCoordinate(NUM_HORIZONTAL_INCREMENTS / 2);
var HEAD_START_Y = gridToCoordinate(NUM_VERTICAL_INCREMENTS / 2);
var HEAD_START_DIRECTION = RIGHT;
var HEAD2_START_X = gridToCoordinate(NUM_HORIZONTAL_INCREMENTS / 2 - 1);
var HEAD2_START_Y = gridToCoordinate(NUM_VERTICAL_INCREMENTS / 2 - 1);
var HEAD2_START_DIRECTION = LEFT;
var HEAD_INDEX = 0;

var BODY_PART_SPAWN_X = -100;
var BODY_PART_SPAWN_Y = 0;

var FRUIT_START_X = 500 + BODY_PART_RADIUS;
var FRUIT_START_Y = 250 + BODY_PART_RADIUS;
var FRUIT_RADIUS = 4;
var DEFAULT_FRUIT_COLOR = "#f81437";

var INVERSE_GAME_SPEED = 4;

var bodyParts;
var bodyParts2;
var fruit;
startGame();
spawnFruit();

// db(canvas.width + ", " + canvas.height + ", " + gridToCoordinate(65));
var counter = 0;
var gameRunning = true;
window.requestAnimationFrame(runGame);

document.addEventListener('keydown', function(evt){
    var keyCode = evt.keyCode;
    if(keyCode === KEY_UP && bodyParts[HEAD_INDEX].y <= bodyParts[1].y) bodyParts[HEAD_INDEX].direction = UP;
    else if(keyCode === KEY_DOWN && bodyParts[HEAD_INDEX].y >= bodyParts[1].y) bodyParts[HEAD_INDEX].direction = DOWN;
    else if(keyCode === KEY_LEFT && bodyParts[HEAD_INDEX].x <= bodyParts[1].x) bodyParts[HEAD_INDEX].direction = LEFT;
    else if(keyCode === KEY_RIGHT && bodyParts[HEAD_INDEX].x >= bodyParts[1].x) bodyParts[HEAD_INDEX].direction = RIGHT;
    else if(keyCode === KEY_W && bodyParts2[HEAD_INDEX].direction !== DOWN) bodyParts2[HEAD_INDEX].direction = UP;
    else if(keyCode === KEY_S && bodyParts2[HEAD_INDEX].direction !== UP) bodyParts2[HEAD_INDEX].direction = DOWN;
    else if(keyCode === KEY_A && bodyParts2[HEAD_INDEX].direction !== RIGHT) bodyParts2[HEAD_INDEX].direction = LEFT;
    else if(keyCode === KEY_D && bodyParts2[HEAD_INDEX].direction !== LEFT) bodyParts2[HEAD_INDEX].direction = RIGHT;
    if(!gameRunning){ 
        startGame();
        gameRunning = true;
    }
});

function Head(xIn, yIn, directionIn, radiusIn){
    this.x = xIn;
    this.y = yIn;
    this.direction = directionIn;
    this.radius = radiusIn;
    
    this.move = function(){
        if(this.direction === UP){
            this.y -= MOVE_INCREMENT;
        }    
        else if(this.direction === DOWN){
            this.y += MOVE_INCREMENT;
        }
        else if(this.direction === LEFT){
            this.x -= MOVE_INCREMENT;
        }
        else if(this.direction === RIGHT){
            this.x += MOVE_INCREMENT;
        }
        if(this.x < 0) this.x = gridToCoordinate(NUM_HORIZONTAL_INCREMENTS);
        else if(this.x > canvas.width) this.x = gridToCoordinate(0);
        if(this.y < 0) this.y = gridToCoordinate(NUM_VERTICAL_INCREMENTS);
        else if(this.y > canvas.height) this.y = gridToCoordinate(0);
    };
    
    this.draw = function(colorIn){
      changeColor(colorIn);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
      ctx.fill();
    };
}

function BodyPart(xIn, yIn, radiusIn){
    this.x = xIn;
    this.y = yIn;
    this.radius = radiusIn;
    
    this.inherit = function(xIn, yIn){
      this.x = xIn;
      this.y = yIn;
    };
    this.draw = function(){
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
      ctx.fill();
    };
}

function Fruit(xIn, yIn, colorIn){
    this.x = xIn;
    this.y = yIn;
    this.color = colorIn;
    
    this.draw = function(){
        changeColor(this.color);
        ctx.beginPath();
        ctx.arc(this.x, this.y, FRUIT_RADIUS, 0, 2*Math.PI);
        ctx.fill();
    };
}

function runGame(){
    if(counter % INVERSE_GAME_SPEED === 0 && gameRunning){
        moveEverything();
        drawEverything();
        checkCollisions();
    }
    counter++;
    window.requestAnimationFrame(runGame);
}

function moveEverything(){
    bodiesInherit(bodyParts);
    bodiesInherit(bodyParts2);
    bodyParts[HEAD_INDEX].move();
    bodyParts2[HEAD_INDEX].move();
}

function bodiesInherit(bodyPartsIn){
    for(var i = bodyPartsIn.length-1; i > 0; i--){
        bodyPartsIn[i].inherit(bodyPartsIn[i-1].x, bodyPartsIn[i-1].y);
    }
}

function checkCollisions(){
    checkCollisionsWithBodyParts();
    checkCollisionsWithFruit();
}

function checkCollisionsWithBodyParts(){
    var snake1ReadyToPop = false;
    var snake2ReadyToPop = false;
    for(var i = 1; i < bodyParts.length; i++){
        if((bodyParts[HEAD_INDEX].x === bodyParts[i].x) && (bodyParts[HEAD_INDEX].y === bodyParts[i].y)){
          snake1ReadyToPop = true;
        }
        if((bodyParts2[HEAD_INDEX].x === bodyParts[i].x) && (bodyParts2[HEAD_INDEX].y === bodyParts[i].y)) snake2ReadyToPop = true;
    }
    for(i = 1; i < bodyParts2.length; i++){
        if((bodyParts[HEAD_INDEX].x === bodyParts2[i].x) && (bodyParts[HEAD_INDEX].y === bodyParts2[i].y)) snake1ReadyToPop = true;
        if((bodyParts2[HEAD_INDEX].x === bodyParts2[i].x) && (bodyParts2[HEAD_INDEX].y === bodyParts2[i].y)) snake2ReadyToPop = true; 
    }
    if(snake1ReadyToPop) bodyParts.pop();
    if(snake2ReadyToPop) bodyParts2.pop();
    if (!gameRunning)db("Game Over! Press any key to play again.");
}

function checkCollisionsWithFruit(){
    if((bodyParts[HEAD_INDEX].x === fruit.x) && (bodyParts[HEAD_INDEX].y === fruit.y)){
        spawnFruit();
        addBodyParts(5, bodyParts);
    }
    if((bodyParts2[HEAD_INDEX].x === fruit.x) && (bodyParts2[HEAD_INDEX].y === fruit.y)){
        spawnFruit();
        addBodyParts(5, bodyParts2);
    }
}

function spawnFruit(){
    fruit = new Fruit(getRandomCoor("x"), getRandomCoor("y"), DEFAULT_FRUIT_COLOR);
}

function getRandomCoor(axisIn){
    if(axisIn === "x") return gridToCoordinate(Math.floor(Math.random() * Math.floor(canvas.width / MOVE_INCREMENT)));
    else if(axisIn === "y") return gridToCoordinate(Math.floor(Math.random() * Math.floor(canvas.height / MOVE_INCREMENT)));
}

function drawEverything(){
    drawCanvasBackground();
    drawBodyParts(bodyParts, "#f4a51b");
    drawBodyParts(bodyParts2, "#a634c3");
    drawFruit();
}

function drawBodyParts(bodyPartsIn, colorIn){
    bodyPartsIn.forEach(function(element){ element.draw(colorIn);});
}

function drawFruit(){
    fruit.draw();
}

function drawCanvasBackground(){
    changeColor("#34c39a");
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function clearCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function notToBeEntered(){
    alert("doNotEnter");
}

function db(displayedVariable){displayBox.innerHTML = displayedVariable;};

function addBodyParts(numParts, bodyPartsIn){
    for(var i = 0; i < numParts; i++){
        bodyPartsIn.push(new BodyPart(BODY_PART_SPAWN_X, (BODY_PART_RADIUS * 3) * i + BODY_PART_SPAWN_Y, BODY_PART_RADIUS));
    }
}

function gridToCoordinate(gridIn){
    return Math.floor(gridIn) * MOVE_INCREMENT + BODY_PART_RADIUS;
}

function changeColor(colorIn){
    ctx.fillStyle = colorIn;
}

function startGame(){
    bodyParts = [];
    bodyParts2 = [];
    bodyParts.push(new Head(HEAD_START_X, HEAD_START_Y, HEAD_START_DIRECTION, BODY_PART_RADIUS));
    bodyParts2.push(new Head(HEAD2_START_X, HEAD2_START_Y, HEAD2_START_DIRECTION, BODY_PART_RADIUS));
    addBodyParts(10, bodyParts);
    addBodyParts(10, bodyParts2);
    spawnFruit();
}

















// Screen Anchor