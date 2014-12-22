//constants
BOMB = -1;
VISIBLE = 1;
NOT_VISIBLE = 0;
FLAGED = 2;
FLAG = false;
//main parameters
bombsNum = 40;
rows = 18;
cols = 18;
gameType = 0;
//-----------------------------
//main variables
uncovered = 0;
flaged = 0;
wrongFlaged = 0;
time = 0;
run = false;
game = true;
timerId = 0;
//startPos
startRow = 0;
startCol = 0;

//score board Table : holds the html scores' table
scoreBoardTable = null;

//Array containing numbers written in each cell
//-1 means a bomb
cellsData = null;

//Array containing cell proporties
cellsView = null;
//1 is visible , 0 is not
//2 is flaged

//current game type
currentType = 0;
data=undefined;

function timer(){
    time++;
    document.getElementById("timerLabel").innerHTML = "Time:  " + formatTime(time);
    document.getElementById("flagsLabel").innerHTML = "Flags: "+ flaged + "/" + bombsNum;
    //save current game
    var gamestatus = { gameType : gameType , bombsNum : bombsNum , rows : rows , cols : cols , time : time ,
                       uncovered : uncovered ,flaged : flaged , wrongFlaged : wrongFlaged , cellsData : cellsData ,
                       cellsView : cellsView, gamedate : new Date()
    };
   // localStorage["lastgame"] = JSON.stringify(gamestatus);
}


//helper function to format the time string
function formatTime(time){
    var mins = Math.floor(time/60);
    var secs = time%60;
    return (mins > 9 ? mins: "0" + mins) + ":" + (secs > 9 ? secs: "0" + secs);
}
function scoreTime(time){
	var mins = Math.floor(time/60);
    var secs = time%60;
    return (mins > 9 ? mins: "0" + mins) + (secs > 9 ? secs: "0" + secs);
}
//sets the inner text value of a cell using the
//appropriate image
function setCellText(cell,value){
    if (value == 0) return;
    cell.style.backgroundImage = "url(images/nums/" + value + ".png)";
}

function setFlaged(cell){
    cell.style.backgroundImage = "url(images/flag.png)";
	cell.style.backgroundRepeat ="round";
}

function loadGame(){
    var gamestatus = JSON.parse(localStorage["lastgame"]);
    gameType = gamestatus.gameType;
    bombsNum = gamestatus.bombsNum; rows = gamestatus.rows; cols = gamestatus.cols;
    time = gamestatus.time;
    flaged = gamestatus.flaged;
    wrongFlaged = gamestatus.wrongFlaged;
    uncovered = gamestatus.uncovered;
    game = true;
    cellsData = gamestatus.cellsData;
    cellsView = gamestatus.cellsView;
    var lastplayed = new Date(gamestatus.gamedate);
    var seconds = (new Date().getTime() - lastplayed.getTime())/1000;
    var msg = "";
    if (seconds < 60 * 60 * 24 * 30){
        msg = "Last played : ";
        if (seconds < 60)
            msg += Math.floor(seconds) + " seconds";
        else if (seconds < 60 * 60)
            msg += Math.floor(seconds/60) + " minutes and " + Math.floor(seconds%60) + " seconds";
        else if (seconds < 60*60*24)
            msg += Math.floor(seconds/60/60) + " hours , " + Math.floor(seconds/60%60) + " minutes and" + Math.floor(seconds%60) + " seconds";
        else if (seconds < 60*60*24*30)
            msg += Math.floor(seconds/60/60/24) + " days , " + Math.floor(seconds/60/60%24) + " hours , " + Math.floor(seconds/60%60) + " minutes and" + Math.floor(seconds%60) + " seconds";
        msg += " ago";
    }else{
        msg = "Last played on : " + lastplayed.toDateString();
    }
    showMessage(msg);
}

function startNewGame(type){
    currentType = type;
    run = false;
    time = 0;
    game = false;
    uncovered = 0;
    flaged = 0;
    wrongFlaged = 0;
    clearInterval(timerId);
    gameType = type;
    //hide the scoreBoard if it was visible
    //hide the message div if it was visible
    hideMessage();
    if (type == -1 && localStorage["lastgame"] != undefined && localStorage["lastgame"] != ""){
        //try to load previously saved game
        loadGame();
        drawOldBoard();
    }else{
        if (type == 0){
            bombsNum = 16; rows = 9; cols = 9;run = true;
        }else{
            //default
            bombsNum = 16; rows = 9; cols = 9;run = true;
            //in case type was equal to -1 (first run) but no game was stored
            gameType = 0;
        }
        drawNewBoard();
    }
    //set the board to visible
    document.getElementById("board").style.display = "block";
    //default pause button


    G("timerLabel").innerHTML = "Time:  " + formatTime(time);
    G("flagsLabel").innerHTML = "Flags: "  + flaged +  "/" + bombsNum;
	G("scoreBoard").style.display="none";
    setRun(run);
    //generate the score board
    //in case the user wants to see his previous scores before playing any game

}


function drawOldBoard(){
    var board = document.getElementById("board");
    var tbl = "<table cellspacing = '0'>";
    for (var i = 0;i < rows;i++){
        tbl+="<tr>";
        for (var j = 0;j< cols;j++){
            if (cellsView[i][j] == VISIBLE)
                tbl += " <td><div id = '" + i +"-" + j + "' class= 'cell_opened' > </div></td> ";
            else
                tbl += " <td><div id = '" + i +"-" + j + "' class= 'cell_closed' > </div></td> ";
        }
        tbl+= "</tr>";
    }

    board.innerHTML = tbl + "</table>";
    clickfun = function(i, j){
        return function() {
            cell_click(i, j, event);
        }
    };
    //set images and events
    for (var i=0;i< rows;++i)
        for (var j=0;j< cols;++j){
            if (cellsData[i][j] != BOMB && cellsView[i][j] == VISIBLE)
                setCellText(document.getElementById(i + "-" + j),cellsData[i][j]);
            if (cellsView[i][j] == FLAGED)
                setFlaged(document.getElementById(i + "-" + j));
            document.getElementById(i + "-" + j).addEventListener('click', clickfun(i ,j));
            document.getElementById(i + "-" + j).addEventListener('contextmenu', clickfun(i ,j));
        }
}

function drawNewBoard(){
    var board = document.getElementById("board");
    var tbl = "<table cellspacing = '0'>";
    cellsData = new Array(rows);
    cellsView = new Array(rows);
    for (var i = 0;i < rows;i++){
        tbl+="<tr>";
        cellsData[i] = new Array(cols);
        cellsView[i] = new Array(cols);
        for (var j = 0;j< cols;j++){
            tbl += " <td><div id = '" + i +"-" + j + "' class= 'cell_closed' > </div></td> ";
            cellsData[i][j] = 0;
            cellsView[i][j] = NOT_VISIBLE;
        }
        tbl+= "</tr>";
    }
    board.innerHTML = tbl + "</table>";

    clickfun = function(i, j){
        return function() {
            cell_click(i, j, event);
        }
    };

    for (var i = 0;i < rows;i++){
        for (var j = 0;j< cols;j++){
            document.getElementById(i + "-" + j).addEventListener('click', clickfun(i, j));

            document.getElementById(i + "-" + j).addEventListener('contextmenu', clickfun(i ,j));
        }
    }
}

function generate(){
    var i = 0
    while (i < bombsNum){
        var col=Math.floor(Math.random()*cols);
        var row=Math.floor(Math.random()*rows);
        //if new location is already a bomb
        if (cellsData[row][col] == BOMB) continue;
        //if new location is near the start region

        if (col == startCol-1 || col == startCol || col == startCol +1){
            if (row == startRow -1 || row == startRow || row == startRow+1)
                continue;
        }

        i++;
        cellsData[row][col] = BOMB;


        if (row+1 < rows && cellsData[row+1][col] != BOMB)
            cellsData[row+1][col] += 1;
        if (row > 0 && cellsData[row-1][col] != BOMB)
            cellsData[row-1][col] += 1;
        if (col+1 < cols && cellsData[row][col+1] != BOMB)
            cellsData[row][col+1] += 1;
        if (col > 0 && cellsData[row][col-1] != BOMB)
            cellsData[row][col-1] += 1;
        //diagonals
        if (row +1 < rows && col+1 < cols && cellsData[row+1][col+1] != BOMB)
            cellsData[row+1][col+1] += 1;
        if (row > 0 && col > 0 && cellsData[row-1][col-1] != BOMB)
            cellsData[row-1][col-1] += 1;
        if (row +1 < rows && col > 0 && cellsData[row+1][col-1] != BOMB)
            cellsData[row+1][col-1] += 1;
        if (row > 0 && col+1 < cols && cellsData[row-1][col+1] != BOMB)
            cellsData[row-1][col+1] += 1;

    }
}


function walk(row,col){
    if (row >= rows || col >= cols || row < 0 || col < 0 || cellsView[row][col] != 0)
	    return;

    cellsView[row][col] = 1;
    uncovered +=1;
    cell = document.getElementById(row + "-" + col);
    cell.className = "cell_opened";
    //show the cell number
    setCellText(cell,cellsData[row][col]);

    if (cellsData[row][col] == 0){
	    walk(row+1,col);
	    walk(row,col+1);
	    walk(row,col-1);
	    walk(row-1,col);


	    walk(row-1,col-1);
	    walk(row+1,col+1);
	    walk(row+1,col-1);
	    walk(row-1,col+1);
    }
}

function showBombs(){
    //this can be improved alot by saving the position of the bombs
    //then showing them directly
    for (i=0;i<rows;i++){
        for (j=0;j<cols;j++){
            var cell = document.getElementById(i+ "-" + j);
            if (cellsView[i][j] != FLAGED){
                if (cellsData[i][j] == BOMB){
                    //show a bomb image
                    cell.style.backgroundImage = "url(images/mine.png)";
					cell.style.backgroundRepeat ="no-repeat";
	
                }else{
                    //show the cell number
                    cell.className = "cell_opened";
                    setCellText(cell,cellsData[i][j]);
                }
            }else{
                //found a wrong flag
                if (cellsData[i][j] != BOMB)
                    cell.style.backgroundImage = "url(images/flag2.png)";
					cell.style.backgroundRepeat ="no-repeat";

            }
        }
    }
}

//called when user clicked on an visible cell
//to uncover all the cells near it
function helper(row,col){
    if (!game) return;
    //counting flags
    var flags = 0;
    if (row > 0 && cellsView[row-1][col] == FLAGED) flags++;
    if (row < rows-1 && cellsView[row+1][col] == FLAGED) flags++;
    if (col > 0 && cellsView[row][col-1] == FLAGED) flags++;
    if (col < cols-1 && cellsView[row][col+1] == FLAGED) flags++;

    if (row > 0 && col > 0 && cellsView[row-1][col-1] == FLAGED) flags++;
    if (row < rows-1 && col < cols-1 && cellsView[row+1][col+1] == FLAGED) flags++;
    if (row > 0 && col < cols-1 && cellsView[row-1][col+1] == FLAGED) flags++;
    if (row < rows-1 && col > 0 && cellsView[row+1][col-1] == FLAGED) flags++;

    if (flags == cellsData[row][col]){
        if (row > 0 && cellsView[row-1][col] != FLAGED)
            if (cellsData[row-1][col] == BOMB) {lostAction();return;} else walk(row-1,col);

        if (row < rows-1 && cellsView[row+1][col] != FLAGED)
            if (cellsData[row+1][col] == BOMB)    {lostAction();return;} else walk(row+1,col);

        if (col > 0 && cellsView[row][col-1] != FLAGED)
            if (cellsData[row][col-1] == BOMB)     {lostAction();return;} else walk(row,col-1);

        if (col < cols-1 && cellsView[row][col+1] != FLAGED)
            if (cellsData[row][col+1] == BOMB)     {lostAction();return;} else walk(row,col+1);

        if (row > 0 && col > 0 && cellsView[row-1][col-1] != FLAGED)
            if (cellsData[row-1][col-1] == BOMB)     {lostAction();return;} else walk(row-1,col-1);

        if (row < rows-1 && col < cols-1 && cellsView[row+1][col+1] != FLAGED)
            if (cellsData[row+1][col+1] == BOMB)    {lostAction();return;} else walk(row+1,col+1);

        if (row > 0 && col < cols-1 && cellsView[row-1][col+1] != FLAGED)
            if (cellsData[row-1][col+1] == BOMB)     {lostAction();return;} else walk(row-1,col+1);

        if (row < rows -1 && col > 0 && cellsView[row+1][col-1] != FLAGED)
            if (cellsData[row+1][col-1] == BOMB)     {lostAction();return;} else walk(row+1,col-1);
    }



    if ((flaged == bombsNum || uncovered == rows*cols - bombsNum) && wrongFlaged == 0)
        winAction();
}

function lostAction(){
    clearInterval(timerId);
    run = false;
    game = false;
    showBombs();
    setTimeout(function() {finishGame(false)}, 200);

}

function winAction(){
    clearInterval(timerId);
    run = false;
    game = false;
    showBombs();
    setTimeout(function() {finishGame(true)}, 200);
	
}

function finishGame(win){
    var lastAddedScore = "";
    var msg = null;
    var action = undefined;

    if (win){
        msg = {	status:"WIN",
				text:"过了？小CASE啦~~咱来<a onclick=\"newscore()\">比比分</a><br/>名字<input type='text' id=\"name\"></input>"};

        

    }else{
        msg = {	status:"LOSE",
				text:"胜败乃兵家常事，大侠请<a onclick=\"startNewGame(0) \">重新来过</a>"};
    }


    showMessage(msg);



}

function hideMessage(){
   G("mask").style.display = G("gamemessage").style.display  = "none";
  }

//popup alert replacement
function showMessage(msg){
    G("mask").style.display = G("gamemessage").style.display = "block";
	G("winorlose").innerHTML = "YOU " + msg.status;
	G("tick").innerHTML = msg.text;
	
}


function newscore(){
	if(G("name").value!=""){
		$.ajax({
		url:"http://nizekai.sinaapp.com/minesweeperscore/setscore/"+G("name").value+"/"+scoreTime(time),
		async : false, 
		success: alert("上传成功")	
	});
	}
	showScoreBoard(G("name").value);
}
//show the score Board
//will pause the game
function showScoreBoard(uname){
    var scoreBoard = document.getElementById("scoreBoard");
    var board = document.getElementById("board");
	$.ajax({
		url:"http://nizekai.sinaapp.com/minesweeperscore/getscore",
		async : false, 
		success: function(str){
			data=str;
			}
			}
		
	);
	scoreBoardTable="<table id = 'scoretable'><tr style=\"font-size:20px;font-weight:bold;line-height:30px\"><td>名字</td><td>分数</td><td>排名</td></tr>"
	scoreTable="";
	n_f=false;
	for(var i=0;i<20;i++){
		name = data[i]?data[i]["name"]:"-";
		score=data[i]?data[i]["score"].substr(3,5):"-"
		l=data[i]?i+1:"-";
		adt="";
		if(uname && uname==name) {adt=" style='color:red' ";n_f=true;}
		scoreTable+="<tr"+adt+"><td>"+name+"</td><td>"+score+"</td><td>"+l+"</td><tr>";
	}
	if(!n_f){
		var find=19;
		while(uname && data[++find] && data[find].name!=uname){}
		if(data[find] && find>19) {
			scoreBoardTable+="<tr style='color:red'><td>"+data[find].name+"</td>"+"<td>"+data[find].score.substr(3,5)+"</td>"+"<td>"+(++find)+"</td><tr>";
			score=data[find].score.substr(3,5);
			l=find;
		}
	}
	scoreBoardTable+=scoreTable+"</talbe>";

    if (!game){
        scoreBoard.innerHTML = scoreBoardTable;
		
        scoreBoard.style.display = "block";
        board.style.display = "none";
		hideMessage();
        return;
    }
    if (run)
        setRun(false);

    scoreBoard.innerHTML = scoreBoardTable;
    scoreBoard.style.display = "block";
    board.style.display = "none";
	hideMessage();
}

function setRun(value){
    if (!game) return;
    var board = document.getElementById("board");

    var scoreBoard = document.getElementById("scoreBoard");

    run = value;
    if (value){
        timerId = setInterval(timer ,1000);
        board.style.display = "block";
        scoreBoard.style.display = "none";
        hideMessage();
    }else{
        clearInterval(timerId);
        board.style.display = "none";
    }
}

function cell_click(row,col,e){
    //start a new game
    if (uncovered == 0){
        //first click start the game
        if (game==false){
            run = true;
            timerId = setInterval(timer,1000);
            game = true;
        }
        //first left click generate minefield
        if (e.which == 1){
            startRow = row;
            startCol = col;
            generate();
        }
    }
    if (!run) return;

    //click on covered cell with left mouse button
    if (e.which == 1 && cellsView[row][col] == 0 && !FLAG ){
        if (cellsData[row][col] == BOMB){
            lostAction();
        }else{
            walk(row,col);
            if (uncovered == rows*cols - bombsNum)
                winAction();
        }
    //click on uncovered cell with left mouse button
    }else if (e.which == 1 && cellsView[row][col] == 1 && !FLAG ){
        helper(row,col);
    //click on uncovered cell with right mouse button
    }else if ((e.which == 3 || FLAG )&& cellsView[row][col] != 1 ) {
        cell = document.getElementById(row+ "-" +col);
        if (cellsView[row][col] == NOT_VISIBLE){
            setFlaged(cell);
            cellsView[row][col] = 2;
            flaged++;
            if (cellsData[row][col] != BOMB) wrongFlaged++;
        }else{
            cell.style.backgroundImage = "";
            cellsView[row][col] = 0;
            flaged--;
            if (cellsData[row][col] != BOMB) wrongFlaged--;
        }
		setFlagStatus(false);
    }
}

function setFlagStatus(st){
	G("FL").style.backgroundColor = st? "#FF2D2D" : "#D9B3B3";
	FLAG = st;
}
function G(id) {
    return document.getElementById(id);
}
