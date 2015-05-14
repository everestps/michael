var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var displayBox = document.getElementById("displayBox");

var wheel1 = new Wheel(100, 100, false);
var wheel2 = new Wheel(150, 100, false);
var KEY_LEFT = 37;
var KEY_RIGHT = 39;

function Wheel(xIn, yIn, movingIn){
  this.x = xIn;
  this.y = yIn;
  this.moving = movingIn;
  this.theta = 0;
  
  this.updateTheta = function(x2In, y2In){
    this.theta = Math.tan((this.x - x2In) / (this.y - y2In));
    if(isReallyNaN(this.theta))this.theta = 0;
  };
  
  this.move = function(){
    var newTheta = this.theta + 3;
    if(newTheta > 90) newTheta -= 90;
    this.x = (this.theta + 3) * this.x / this.theta;
    this.y = (this.theta + 3) * this.y / this.theta;
    db(this.x);
  };
  
  this.draw = function(){
    ctx.beginPath();
    ctx.arc(this.x, this.y, 10, 0, 2*Math.PI);
    ctx.stroke();
  };
}

var counter = 0;
window.requestAnimationFrame(runGame);

function runGame(){
  wheel2.updateTheta(wheel1.x, wheel1.y);
  // wheel1.move();
  if(wheel2.moving) wheel2.move();
  wheel1.draw();
  wheel2.draw();
  counter ++;
  window.requestAnimationFrame(runGame);
}

document.addEventListener('keydown', function(evt){
  var keyCode = evt.keyCode;
  if(keyCode === KEY_LEFT) wheel1.moving = true;
  else if(keyCode === KEY_RIGHT) wheel2.moving = true;
});

document.addEventListener('keyup', function(evt){
  var keyCode = evt.keyCode;
  if(keyCode === KEY_LEFT) wheel1.moving = false;
  else if(keyCode === KEY_RIGHT) wheel2.moving = false;
});

function db(displayIn){
  displayBox.innerHTML = displayIn;
}

function isReallyNaN(variableIn){
  return variableIn !== variableIn;
}