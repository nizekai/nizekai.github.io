function InputManager() {
	this.events = {};
	
	if (window.navigator.msPointerEnabled) {
    //Internet Explorer 10 style
		this.eventTouchstart    = "MSPointerDown";
		this.eventTouchend      = "MSPointerUp";
	} else {
		this.eventTouchstart    = "touchstart";
		this.eventTouchend      = "touchend";
	}
	
	this.setListener();
}

InputManager.prototype.addEvent = function (event,callback){
	if (!this.events[event])
		this.events[event] = [];
	this.events[event].push(callback);
}



InputManager.prototype.setListener = function () {
	this.bindEvent ("#temp",this.clickTemp);
	this.bindEvent ("#next",this.clickNext);
	this.bindEvent (".cell",this.clickCell);
	this.bindEvent (".restart",this.clickRestart);
}

InputManager.prototype.clickCell = function(event){ 
	id = event.currentTarget.id;
	idsplit = id.split("-");
	position = {x:parseInt(idsplit[1]),y:parseInt(idsplit[2])};
	this.shellEvent("clickCell",position);
}

InputManager.prototype.clickRestart = function (){
	this.shellEvent("restart");
}

InputManager.prototype.clickTemp = function(){
	this.shellEvent("clickTemp");
}

InputManager.prototype.clickNext = function(){
	this.shellEvent("clickNext");
}

InputManager.prototype.shellEvent = function (event,data){
	if(!this.events[event]) return;
	callbacks = this.events[event];
	callbacks.forEach (function (callback){
		callback(data);
	});
}

InputManager.prototype.bindEvent = function (selector,callback) {
	var ele = document.querySelectorAll(selector);
	if(!ele) return ;
	for (var i =0;i<ele.length;i++)
		ele[i].addEventListener("click",callback.bind(this));

}