



/* FUNCTION GRAVEYARD

function collisionDetection2(){
  var slope = hero.dy / hero.dx;
  if(hero.dx > 0){
    
  }
  else if(hero.dx < 0){
    if(hero.dy > 0){
      var tempX = hero.bottomLeftCornerX;
      var tempY = hero.bottomLeftCornerY;
      var tempOldX = hero.bottomLeftCornerOldX;
      var tempOldY = hero.bottomLeftCornerOldY;
      
      var xCoordinatesBetween = getCoordinatesBetween(coordinateToGrid(tempX), coordinateToGrid(tempOldX));
      xCoordinatesBetween.sort(function(a, b){return b - a});
      var ysForXCoordinates = getYsForXCoordinates(xCoordinatesBetween, slope, tempX, tempY);
      var yCoordinatesBetween = getCoordinatesBetween(coordinateToGrid(tempY), coordinateToGrid(tempOldY));
      yCoordinatesBetween.sort(function(a, b){return a - b});
      var xsForYCoordinates = getXsForYCoordinates(yCoordinatesBetween, slope, tempX, tempY);
      
      var xOfFirstCollision = 0;
      for(var i = xCoordinatesBetween.length - 1; i >= 0; i--){
        if(collisionStatusOfPoint(coordinateToGrid(xCoordinatesBetween[i]) - 1, coordinateToGrid(ysForXCoordinates[i]))
        || collisionStatusOfPoint(coordinateToGrid(xCoordinatesBetween[i]) - 1, coordinateToGrid(ysForXCoordinates[i] - HERO_SIZE))){
          xOfFirstCollision = xCoordinatesBetween[i];
          // hero.x = xCoordinatesBetween[i] + HALF_HERO_SIZE;
          // hero.updateCornerCoordinates();
          // hero.dx = 0;
          

        }
      }
      
      
      for(var i = yCoordinatesBetween.length - 1; i >= 0; i--){
        if((collisionStatusOfPoint(coordinateToGrid(xsForYCoordinates[i]), coordinateToGrid(yCoordinatesBetween[i]))
        && xsForYCoordinates[i] >= xOfFirstCollision)
        || (collisionStatusOfPoint(coordinateToGrid(xsForYCoordinates[i] + HERO_SIZE), coordinateToGrid(yCoordinatesBetween[i]))
        && xsForYCoordinates[i] + HERO_SIZE >= xOfFirstCollision)){
          hero.y = yCoordinatesBetween[i] - HALF_HERO_SIZE;
          hero.updateCornerCoordinates();
          hero.dy = 0;
        }
      }
      

      
      var yOfFirstCollision = 0;
      for(var i = yCoordinatesBetween.length - 1; i >= 0; i--){
        if(collisionStatusOfPoint(coordinateToGrid(xsForYCoordinates[i]), coordinateToGrid(yCoordinatesBetween[i]))
        || collisionStatusOfPoint(coordinateToGrid(xsForYCoordinates[i] + HERO_SIZE), coordinateToGrid(yCoordinatesBetween[i]))){
          yOfFirstCollision = yCoordinatesBetween[i];
        }
      }
      


      for(var i = xCoordinatesBetween.length - 1; i >= 0; i--){

        if((collisionStatusOfPoint(coordinateToGrid(xCoordinatesBetween[i]), coordinateToGrid(ysForXCoordinates[i]))
        && ysForXCoordinates[i] < yOfFirstCollision)
        || (collisionStatusOfPoint(coordinateToGrid(xCoordinatesBetween[i]), coordinateToGrid(ysForXCoordinates[i] - HERO_SIZE))
        && ysForXCoordinates[i] - HERO_SIZE < yOfFirstCollision)){
          hero.x = xCoordinatesBetween[i] - HALF_HERO_SIZE;
          hero.updateCornerCoordinates();
          hero.dx = 0;

        }
      }
    }
    else if(hero.dy < 0){
      var tempX = hero.topLeftCornerX;
      var tempY = hero.topLeftCornerY;
      var tempOldX = hero.topLeftCornerOldX;
      var tempOldY = hero.topLeftCornerOldY;
      
      var xCoordinatesBetween = getCoordinatesBetween(coordinateToGrid(tempX), coordinateToGrid(tempOldX));
      xCoordinatesBetween.sort(function(a, b){return b - a});
      var ysForXCoordinates = getYsForXCoordinates(xCoordinatesBetween, slope, tempX, tempY);
      var yCoordinatesBetween = getCoordinatesBetween(coordinateToGrid(tempY), coordinateToGrid(tempOldY));
      yCoordinatesBetween.sort(function(a, b){return b - a});
      var xsForYCoordinates = getXsForYCoordinates(yCoordinatesBetween, slope, tempX, tempY);
      
      var xOfFirstCollision = 0;
      for(var i = xCoordinatesBetween.length - 1; i >= 0; i--){
        if(collisionStatusOfPoint(coordinateToGrid(xCoordinatesBetween[i]) - 1, coordinateToGrid(ysForXCoordinates[i]))
        || collisionStatusOfPoint(coordinateToGrid(xCoordinatesBetween[i]) - 1, coordinateToGrid(ysForXCoordinates[i] + 1))){
          xOfFirstCollision = xCoordinatesBetween[i];
          hero.x = xCoordinatesBetween[i] + HALF_HERO_SIZE;
          hero.updateCornerCoordinates();
          hero.dx = 0;
        }
      }

      for(var i = yCoordinatesBetween.length - 1; i >= 0; i--){
        if((collisionStatusOfPoint(coordinateToGrid(xsForYCoordinates[i]), coordinateToGrid(yCoordinatesBetween[i]))
        && xsForYCoordinates[i] >= xOfFirstCollision)
        || (collisionStatusOfPoint(coordinateToGrid(xsForYCoordinates[i]) + 1, coordinateToGrid(yCoordinatesBetween[i]))
        && xsForYCoordinates[i] + HERO_SIZE >= xOfFirstCollision)){
          hero.y = yCoordinatesBetween[i] + HALF_HERO_SIZE;
          hero.updateCornerCoordinates();
          // hero.dy = 0;
        }
      }
    }
    else{
      
    }
  }
  else{
    
  }
  
  
  // var tempX = hero.topLeftCornerX;
  // var tempY = hero.topLeftCornerY;
  // var tempOldX = hero.topLeftCornerOldX;
  // var tempOldY = hero.topLeftCornerOldY;
  // // var slope = (tempY - tempOldY) / (tempX - tempOldX);
  // var xCoordinatesBetween = getCoordinatesBetween(coordinateToGrid(tempX), coordinateToGrid(tempOldX));
  // var ysForXCoordinates = getYsForXCoordinates(xCoordinatesBetween, slope, tempX, tempY);
  // var yCoordinatesBetween = getCoordinatesBetween(coordinateToGrid(tempY), coordinateToGrid(tempOldY));
  // var xsForYCoordinates = getXsForYCoordinates(yCoordinatesBetween, slope, tempX, tempY);
  

  // for(var i = 0; i < xCoordinatesBetween.length; i++){
  //   if(hero.dx < 0){
  //     if(collisionStatusOfPoint(coordinateToGrid(xCoordinatesBetween[i] - 1), coordinateToGrid(ysForXCoordinates[i]))){
        
  //       hero.x = quantizeCoordinatePlusAdjustment(xCoordinatesBetween[i], HALF_HERO_SIZE);
  //       hero.updateCornerCoordinates();
  //       hero.dx = 0;

  //     }
  //   }
  //   // else if(hero.dx < 0){
      
  //   // }
  // }
}

function getYIntercepts (xIn, yIn, oldXIn, oldYIn){
  var yIntercepts = [];
  var slope = (yIn - oldYIn) / (xIn - oldYIn);
  var coordinatesBetween = getCoordinatesBetween(coordinateToGrid(xIn), coordinateToGrid(oldXIn));
  for(var i = 0; i < coordinatesBetween.length; i++){
    yIntercepts.push(slope * (coordinatesBetween[i] - xIn) + yIn);
  }
  return yIntercepts;
}

function getXIntercepts(xIn, yIn, oldXIn, oldYIn){
  var xIntercepts = [];
  var slope = (yIn - oldYIn) / (xIn - oldYIn);
  var coordinatesBetween = getCoordinatesBetween(coordinateToGrid(yIn), coordinateToGrid(oldYIn));
  for(var i = 0; i < coordinatesBetween.length; i++){
    xIntercepts.push(slope * (coordinatesBetween[i] - xIn) + yIn);
  }
  return xIntercepts;
}

function fixHeroCollisions(){
  updateHeroCornerStatus();
  clearCanvas();
  hero.draw();
  //           + coordinateToGrid(hero.topRightCornerX) + ", " + coordinateToGrid(hero.topRightCornerY) + ")("
  //           + coordinateToGrid(hero.bottomLeftCornerX) + ", " + coordinateToGrid(hero.bottomLeftCornerY) + ")("
  //           + coordinateToGrid(hero.bottomRightCornerX) + ", " + coordinateToGrid(hero.bottomRightCornerY) + ")("
  //           + hero.dx + "," + hero.dy + ")(" + hero.x + "," + hero.y + ")("
  //           + hero.oldX + "," + hero.oldY + ")");
            
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

function display(whatIsBeingDisplayed){
}


*/