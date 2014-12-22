
var con = "船海杯扫雷"; //标题
var imgurl = "http://img1.imgtn.bdimg.com/it/u=3718146321,775289870&fm=21&gp=0.jpg"; //图片
var tit = "一起来玩扫雷~"; //简介
var link = window.location.href; //链接

function sendMessage(title){
	if(typeof(WeixinJSBridge)=="undefined")return;
	var title=title|| tit;
   WeixinJSBridge.on('menu:share:timeline', function(argv){
      WeixinJSBridge.invoke('shareTimeline',{ 
				"appid":"",                                              //appid 设置空就好了。
				"img_url":	 imgurl,                                   //分享时所带的图片路径
				"img_width":	"120",                            //图片宽度
				"img_height":	"120",                            //图片高度
				"link":link,                                               //分享附带链接地址
				"desc":con,                            //分享内容介绍
				"title":title
			}, function(res){/* 回调函数，最好设置为空 */});
 
 }); 
  WeixinJSBridge.on('menu:share:appmessage', function(argv){
        WeixinJSBridge.invoke('sendAppMessage',{ 
				"appid":"",                                              //appid 设置空就好了。
				"img_url":	 imgurl,                                   //分享时所带的图片路径
				"img_width":	"120",                            //图片宽度
				"img_height":	"120",                            //图片高度
				"link":link,                                               //分享附带链接地址
				"desc":con,                            //分享内容介绍
				"title":title
			}, function(res){/* 回调函数，最好设置为空 */});
 
 });  
}


if(document.addEventListener){
	document.addEventListener('WeixinJSBridgeReady', sendMessage, false);  
}else if(document.attachEvent){
	document.attachEvent('WeixinJSBridgeReady'   , function(){sendMessage()});	
	document.attachEvent('onWeixinJSBridgeReady' , function(){sendMessage()});  
}
