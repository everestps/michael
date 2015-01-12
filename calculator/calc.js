
var keys = document.querySelectorAll("div.button");

for(var i = 0; i < keys.length; i++) {
  keys[i].addEventListener("click", mathify);
}

var output = document.getElementById("display");

var lastWasNumber = false;
var oppUsed = false;
var answer = 0;
var sign = 0;
var firstNum = 0;
var secondNum = 0;
var dotUsed = false;
var numAfterDot = 1;
function mathify(){
  if(this.classList.contains("sqrt")) {
    sign = 6;
    output.innerHTML = this.innerHTML;
    lastWasNumber = false;
    oppUsed = true;
	}
	else if(this.classList.contains("opp")){
    if(lastWasNumber && !oppUsed){
      var btnVal = output.innerHTML;
      output.insertAdjacentHTML('beforeend', this.innerHTML);
      lastWasNumber = false;
      oppUsed = true;
      if(this.innerHTML === "+"){
          sign = 1;
      }
      else if(this.innerHTML === "-"){
        sign = 2;
      }
      else if(this.innerHTML === "*"){
        sign = 3;
      }
      else if (this.innerHTML === "/"){
        sign = 4;
      }
      else if (this.innerHTML === "^"){
        sign = 5;
      } 
            
      dotUsed = false;
    }
  }
	else if(this.innerHTML === "="){
    if(oppUsed && lastWasNumber){
      lastWasNumber = false;
      oppUsed = false;
      if(sign === 1){
        answer = firstNum + secondNum;
      }
      else if(sign === 2){
        answer = firstNum - secondNum;
      }
      else if(sign === 3){
        answer = firstNum * secondNum;
      }
      else if ( sign === 4){
        answer = firstNum / secondNum;
      }
      else if ( sign === 5){
        answer = Math.pow(firstNum, secondNum);
      } 
      else if ( sign === 6){
        answer = Math.sqrt(secondNum);
      }  
      output.innerHTML = answer;
      sign = 0;
      firstNum = 0;
      secondNum = 0;
      dotUsed = false;  
    }
	}
	else if(this.innerHTML === "Clear"){
    output.innerHTML = "0";
    lastWasNumber = false;
    oppUsed = false;
    sign = 0;
    firstNum = 0;
    secondNum = 0;
    dotUsed = false;
	}
	else if(this.innerHTML === "."){
    if(!dotUsed){
      output.insertAdjacentHTML('beforeend', this.innerHTML);
      dotUsed = true;
      numAfterDot = 1;
    }
	}
	else {
    if(!lastWasNumber && !oppUsed){
      output.innerHTML = "";
    }
    output.insertAdjacentHTML('beforeend', this.innerHTML);
    lastWasNumber = true;
    if(sign === 0){
      if(dotUsed){
        firstNum = firstNum + parseInt(this.innerHTML) * Math.pow(10, -numAfterDot);
        numAfterDot++;
      }
      else{
        firstNum = firstNum * 10 + parseInt(this.innerHTML);
      }
    }
    else{
      if(dotUsed){
        secondNum = secondNum + parseInt(this.innerHTML) * Math.pow(10, -numAfterDot);
        numAfterDot++;
      }
      else{
        secondNum = secondNum * 10 + parseInt(this.innerHTML);
      }
    }
  }
}