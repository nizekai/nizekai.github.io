imgList = [	"img/gameover.png",
			"img/Next_background.png",
			"img/restart.png",
			"img/Score_background.png",
			"img/Temp_background.png",
			];
window.onload = function (){
	imgList.forEach(function(imgsrc){
		var img = new Image();
		img.src = imgsrc;
	});
	
	
	new GameController(5,15,InputManager,Actuator);
}