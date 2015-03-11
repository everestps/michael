/**
* Created with W5 Project.
* User: mvann
* Date: 2015-03-09
* Time: 08:52 PM
* To change this template use Tools | Templates.
*/



var FIRST_MAP = 0;
var BLANK_MAP = 8;
var x = 0;
var y = 1;


function getMap(mapNumberIn){
    if(mapNumberIn === FIRST_MAP){
        return [[x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x],
                [x,x,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,x],
                [x,y,x,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,x,y,x],
                [x,y,y,x,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,x],
                [x,y,y,y,x,y,y,y,y,x,x,y,y,x,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,x],
                [x,y,y,y,y,x,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,x],
                [x,y,y,y,y,y,x,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,x],
                [x,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,x],
                [x,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,x],
                [x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x]];
    }
    else if(mapNumberIn === BLANK_MAP){
      return[[y,y],
            [y,y]];
    }
    else{
        return false;
    }
}