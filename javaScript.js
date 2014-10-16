var context;
var mycanvas;
var ball1X = 100;
var ball1y = 100;
var ball2X = 100;
var ball2y = 100;
var ball3X = 100;
var ball3y = 100;
var magnitude = 5;
var ball1Theta = Math.random() * 2 * Math.PI;
var ball1DX = magnitude * Math.cos(ball1Theta);
var ball1DY = magnitude * Math.sin(ball1Theta);
var ball2Theta = Math.random() * 2 * Math.PI;
var ball2DX = magnitude * Math.cos(ball1Theta);
var ball2DY = magnitude * Math.sin(ball1Theta);
var ball3Theta = Math.random() * 2 * Math.PI;
var ball3DX = magnitude * Math.cos(ball1Theta);
var ball3DY = magnitude * Math.sin(ball1Theta);
var radius = 20;
var canvasWidth = 300;
var canvasHeight = 300;

function init() {
  mycanvas = document.getElementById("myCanvas");
  context = mycanvas.getContext('2d');
  setInterval(draw,10);
}
  
function draw() {
  context.beginPath();
  context.fillStyle="#ffffff";
  context.clearRect(0,0,canvasWidth,canvasHeight);
  context.fillStyle="#0000ff";
  context.arc(ball1X,ball1Y,radius,0,2*Math.PI,true);
  context.arc(ball2X,ball2Y,radius,0,2*Math.PI,true);
  context.arc(ball3X,ball3Y,radius,0,2*Math.PI,true);
  context.closePath();
  context.fill();
  ball1X += ball1DX;
  ball1Y += ball1DY;
  ball2X += ball2DX;
  ball2Y += ball2DY;
  ball3X += ball3DX;
  ball3Y += ball3DY;
  if (ball1X + radius >= canvasWidth)
  {
    ball1X = cavasWidth - radius;
    ball1DX = -ball1DX;
  }
  else if (ball1X - radius <= 0)
  {
    ball1X = radius;
    ball1DX = -ball1DX;
  }
  if (ball1Y + radius >= canvasHeight)
  {
    ball1Y = cavasHeight - radius;
    ball1DY = -ball1DY;
  }
  else if(ball1Y - radius <= 0)
  {
    ball1Y = radius;
    ball1DY = -ball1DY;
  }
  
  if (ball2X + radius >= canvasWidth)
  {
    ball2X = cavasWidth - radius;
    ball2DX = -ball2DX;
  }
  else if (ball2X - radius <= 0)
  {
    ball2X = radius;
    ball2DX = -ball2DX;
  }
  if (ball2Y + radius >= canvasHeight)
  {
    ball2Y = cavasHeight - radius;
    ball2DY = -ball2DY;
  }
  else if(ball2Y - radius <= 0)
  {
    ball2Y = radius;
    ball2DY = -ball2DY;
  }
  
  if (ball3X + radius >= canvasWidth)
  {
    ball3X = cavasWidth - radius;
    ball3DX = -ball3DX;
  }
  else if (ball3X - radius <= 0)
  {
    ball3X = radius;
    ball3DX = -ball3DX;
  }
  if (ball3Y + radius >= canvasHeight)
  {
    ball3Y = cavasHeight - radius;
    ball3DY = -ball3DY;
  }
  else if(ball3Y - radius <= 0)
  {
    ball3Y = radius;
    ball3DY = -ball3DY;
  }
}