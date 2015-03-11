WIDTH = 6;
HEIGHT = 5;
var cells = [];
var textBox = document.getElementById("textBox");

CreateCells();
AssignRandomOrbs();
WriteOrbs();
UpdateOrbs();

function CreateCells(){
  for(var i = 0; i < WIDTH; i++){
    cells.push([]);
    for(var j = 0; j < HEIGHT; j++){
        cells[i][j] = new Cell();
    }
  }
}

function AssignRandomOrbs(){
  for(var i = 0; i < cells.length; i++){
    for(var j = 0; j <cells[i].length; j++){
      cells[i][j].assignOrb(Math.floor((Math.random() * 6) + 1));
    }
  }
}

function UpdateOrbs(){
  for(var i = 0; i < WIDTH; i++){
    for(var j = 0; j < HEIGHT; j++){
      if(i > 0){
        if(cells[i][j].orb == cells[i-1][j]){
          if(i > 1){
            if(cells[i][j].orb == cells[i - 2][j].orb){
              
            }
          }
          else if(i < WIDTH - 1)
        }
      }
      else if(i < WIDTH - 2){
        
      }
      if(j > 0 && cells[i][j].orb !== "X"){
        
      }
      else if(j < HEIGHT - 2){
        
      }
    }
  }
}

function Cell(){
  this.assignOrb = function(orbIn){
    this.orb = orbIn;
  };
}

function WriteOrbs(){
  for(var j = 0; j < HEIGHT; j++){
    var lineString = "";
    for(var i = 0; i < WIDTH; i++){
      lineString = lineString + cells[i][j].orb + "  ";
    }
    console.log(lineString);
  }
  console.log("");
}
console.log(cells[0][1].orb);










