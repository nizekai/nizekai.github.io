GameController = function ( size , level , InputManager , Actuator ){
	this.size = size;
	this.level = level;
	this.actuator = new Actuator(this.size);
	this.inputManager = new InputManager;
	
	this.inputManager.addEvent("clickTemp",this.tempSelect.bind(this));
	this.inputManager.addEvent("clickNext",this.nextSelect.bind(this));
	this.inputManager.addEvent("clickCell",this.cellClick.bind(this));
	this.inputManager.addEvent("restart",this.restart.bind(this));
	this.nextORtemp = 0;    									// 0 为 next ; 1 为 temp 
	
	this.setup();
	
}


GameController.prototype.setup = function (){
	
	this.gr = new GR ( this.size , this.level );
	this.gr.gameOver = 0;
	this.start();
}

GameController.prototype.tempSelect = function (){
	this.nextORtemp = 1;
	if(this.gr.temp){
		var a = this.gr.temp;
		this.gr.temp = this.gr.next;
		this.gr.next = a;
		this.actuate();
	}
	else{
		this.gr.temp = this.gr.next;
		this.flash();
	}
}

GameController.prototype.nextSelect = function (){
	this.nextORtemp = 0;
}

GameController.prototype.cellClick = function (position){
	err=this.gr.add(position,this.gr.next); 
	if(err){
	this.flash();}
}

GameController.prototype.flash = function (){
	this.gr.setJump();
	this.gr.randomNext();
	this.actuate();
}

GameController.prototype.start = function (){
	this.gr.initRndSetGrid();
	this.gr.temp =this.gr.next = 0;
	this.flash();
}




GameController.prototype.restart = function (){
	this.actuator.hideGO();
	this.setup();
}

GameController.prototype.gameOver = function (){
	if(!localData.get("best-score") || localData.get("best-score") < this.gr.score)
		localData.set("best-score",this.gr.score);
}

GameController.prototype.actuate = function (){
	if(this.gr.gameOver) this.gameOver();
	var data={
		over: this.gr.gameOver,
		grid: this.gr.grid,
		score: this.gr.score,
		next: this.gr.next,
		temp:  this.gr.temp
			}
	this.actuator.actuate(data);
	if(this.gr.gameOver) ;
}
