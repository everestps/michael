/**
* Created with W5 Project.
* User: mvann
* Date: 2015-03-09
* Time: 08:52 PM
* To change this template use Tools | Templates.
*/



var FIRST_MAP = 0;
var TEST_MAP = 1;
var BLANK_MAP = 8;

/*     KEY   
Normal Block: 1
Top Block: 2
Left Ledge: 3
Right Ledge: 4
*/

function getMap(mapNumberIn){
    if(mapNumberIn === FIRST_MAP){
        return [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,2,2,2,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,2,2,2,2,1],
                [1,0,0,0,0,0,0,0,0,3,2,2,2,2,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1]];
    }
    else if(mapNumberIn === TEST_MAP){
      return [[x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x],
              [x,x,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,x],
              [x,y,x,y,y,y,y,y,y,y,y,y,y,y,y,x,y,y,y,x,y,x,x,x,y,x,x,x,y,x],
              [x,y,y,x,y,y,y,y,y,y,y,y,y,y,y,x,x,y,x,x,y,x,y,x,y,x,y,x,y,x],
              [x,y,y,y,x,y,y,y,y,x,x,x,y,y,y,x,y,x,y,x,y,x,x,x,y,x,x,x,y,x],
              [x,y,y,y,y,x,y,y,y,y,y,y,y,y,y,x,y,y,y,x,y,x,y,x,y,x,y,y,y,x],
              [x,y,y,y,y,y,x,y,y,y,y,y,y,y,y,x,y,y,y,x,y,x,y,x,y,x,y,y,y,x],
              [x,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,x],
              [x,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,x],
              [x,x,x,x,x,x,x,x,y,y,y,y,y,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x]];
    }
    else{
        return false;
    }
}