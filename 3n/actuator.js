function Actuator(size) {
	this.size = size;
	this.w_h= 500;			// width & height
	this.margin = 2;
	this.defaultCellFontSize = 20;
	this.defaultTNFontSize = 90;
	this.initial();
}

Actuator.prototype.initial = function (){									//初始化
	this.drawCells();
	this.setScore(0);
}


Actuator.prototype.drawCells = function (){									//绘制格子

	var gridContainer = document.getElementById("grid");
	var cell_out_wh = Math.round(this.w_h / this.size)						//外围
	var cell_in_wh = cell_out_wh - this.margin * 2 ;		//格子
	this.defaultCellFontSize = cell_in_wh*0.9;
	gridContainer.style.width = gridContainer.style.height = this.size * cell_out_wh; 
	for(var i = 0;i< this.size;i++)
		for(var j = 0;j<this.size;j++){
		var cell = document.createElement("div");
		cell.className = "cell";
		cell.id = "cell-" + i + "-" + j;
		cell.classList.add(["cell-appear"]);
		cell.style.width = cell.style.height = cell.style.lineHeight = cell_in_wh + "px";
		cell.style.fontSize = this.defaultCellFontSize + "px";
		cell.style.webkitAnimationDelay = 200+(i*this.size+j)*150/this.size +"ms";			//动画
		cell.style.animationDelay = 200+(i*this.size+j)*150/this.size +"ms";
		cell.style.mozAnimationDelay = 200+(i*this.size+j)*150/this.size +"ms";
		cell.innerHTML = null;
		gridContainer.appendChild(cell);
		
	}
}

Actuator.prototype.actuate = function (data){
	
	var self = this;
	
	window.requestAnimationFrame(function () {
		
		for(var x=0;x<self.size;x++)			// draw Cells
			for(var y=0;y<self.size;y++)
				self.setCell ({x:x,y:y}, data.grid.cells[x][y]);
				
		self.setScore(data.score);
		self.setNext(data.next);
		self.setTemp(data.temp);
				
		
		});
		
	if(data.over) {this.showGameOver(data.score);return;}	
}

Actuator.prototype.hideGO = function (value){
	document.getElementById("go").style.display = "none";
}


Actuator.prototype.getValue = function (value){
	switch(value){
		case false: return "";
		case -1	: return "JUMP";
		case -4 : return "CLEAR";
		case -3: return "LvUP";
	}
	return !value ? "" : Math.pow(3,value-1);
}

Actuator.prototype.setCell = function (position,value){
	var val = this.getValue(value);
	var cell = document.getElementById(this.positionId(position));
	var cell_text = document.createElement("div");
	if(cell.innerHTML && cell.firstChild.innerHTML == val) {
		return;
	}
	else if(val){
		cell_text.innerHTML = val;
		cell_text.classList.add("cell-flash");
	}
	cell.innerHTML = "";
	cell.style.fontSize = this.calcFontSize(val)+ "px";
	cell.appendChild(cell_text);
}



Actuator.prototype.setScore = function (score){
	if(!score) return;
	var scoreIncrease = score - this.getScore();
	var scoreContainer = document.getElementById("scoreContainer");
	var scoreText = document.getElementById("score");
	if (scoreIncrease){
		scoreIncrease = scoreIncrease>0? "+"+scoreIncrease : ""+scoreIncrease;
		var scoreAdd = document.createElement("div");
		scoreAdd.className = "score-add";
		scoreAdd.innerHTML = scoreIncrease;
		scoreContainer.appendChild(scoreAdd);	
	}
	
	scoreText.innerHTML = score;
}

Actuator.prototype.setNext = function (value){
	
	var nextText = document.getElementById("next");
	if(!value) nextText.innerHTML = "";
	var val = this.getValue(value);
	
	nextText.innerHTML = "";
	nextStr = document.createElement("div");
	nextStr.innerHTML = val;
	nextStr.className = "next-text";
	nextStr.style.fontSize = this.calcFontSize(val,this.defaultTNFontSize)+ "px";
	nextText.appendChild(nextStr);
}

Actuator.prototype.setTemp = function (value){
	var tempText = document.getElementById("temp");
	var val = this.getValue(value);
	if(!val || val == tempText.innerHTML) return;
	
	tempText.classList.remove("temp-text");
	tempText.offsetWidth = tempText.offsetWidth;
	tempText.classList.add("temp-text");
	tempText.innerHTML = "";
	
	tempText.innerHTML = val;
	tempText.style.fontSize = this.calcFontSize(val,this.defaultTNFontSize)+ "px";
}

Actuator.prototype.getScore = function (){
	return document.getElementById("score").innerHTML;
}

Actuator.prototype.positionId = function (position){
	return "cell-" + position.x + "-" + position.y;
}

Actuator.prototype.calcFontSize = function (value,fontsize){
	fontsize = fontsize ||  this.defaultCellFontSize;
	var valueStr = value + "";
	var rate = Math.pow(0.77,valueStr.length);					// 字体大小计算函数，这个比较粗略
	return Math.round(fontsize*rate);
}

Actuator.prototype.showGameOver = function (score){
	var go =document.getElementById("go");
	var goMessage = document.getElementById("gomessage");
	var goScore = document.getElementById("go-score");
	var goBestScore = document.getElementById("go-best-score");
	go.style.display = "block";
	go.style.width =  document.body.clientWidth;
	go.style.height = document.body.clientHeight;
	goMessage.style.left = (document.body.scrollLeft + document.body.clientWidth/2 
            - goMessage.scrollWidth/2 + 50) + "px";
	goMessage.style.top = (document.body.scrollTop + document.body.clientHeight/2 
            - goMessage.scrollHeight/2 -100) + "px";
	goScore.innerHTML = score;
	goBestScore.innerHTML = localData.get("best-score") || "Nobody Knows";
	
}

