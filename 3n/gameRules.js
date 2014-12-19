function GR ( size , level ){
	this.size = size;
	this.level = level;
	this.score = null;
	this.jumpCells = [];
	this.next = 0;
	this.temp = 0;
	this.presentMaxLevel = 3;
	this.startN = 5;
	this.gameOver = 0;
	this.initial();
}


GR.prototype.initial = function (){								// set up
	this.grid = new Grid (this.size);
	this.matchN = 3;											// match number
}


GR.prototype.add = function ( position , value ){
	if(value != -4 && this.grid.getCell(position)) return false;
	switch (value){
		
		case -4 : {
					this.grid.wipeCell ( position );
					for(var i = this.jumpCells.length-1;i>=0;i--){
						p = this.jumpCells[i];
						if ( p.x == position.x && p.y == position.y ) 
							{this.jumpCells.splice(i,1);break;}
					}
					break;
					}	
						
		case -1: {
					this.grid.setCell( position , value );
					this.jumpCells.push( position );
					break;
				 }
		case -3: {														
					
					for (var i = this.level ; i >= 1 ; i-- ){			// match biggest value
						this.grid.setCell ( position , i );
						if ( this.cellAround ( position , -1 ).sum >= this.matchN ) {
							this.grid.wipeCell(position);
							this.add ( position , i );
							return true;
		
						}}
					this.grid.wipeCell(position);
					this.add(position,-1);
					break;
				 }
		default: {
					this.presentMaxLevel = Math.max(this.presentMaxLevel,value);
					this.grid.setCell ( position , value);
					var get = this.cellAround ( position , -1 );				// -1 means first call
					if ( get.sum >= this.matchN && ++value <= this.level){
						for (var i in get.matchCells ){
							this.grid.wipeCell ( get.matchCells[ i ] ); 
						}
						this.add ( position , value ); 
						
					}
					this.score += Math.pow(3,value-1);
					break;
				 }
	}
	if (this.isGameOver()) this.gameOver = 1;
	return true;
}

GR.prototype.isGameOver = function (){
	var isNoEmpty = true;
	this.grid.eachCell(function(cell){isNoEmpty = isNoEmpty && cell});
	return isNoEmpty;
}

GR.prototype.cellAround = function ( position , from ){			// find match-cell around
	if(!this.grid.getCell(position)) return ;
	var vector = {
		0: { x: 1,  y: 0 },  // Down
		1: { x: 0,  y: 1 },  // Right
		2: { x: 0,  y:-1 },  // Left
		3: { x:-1,  y: 0 }   // Up
	};
	var now = position;
	var sum = 1;			 									//self
	var matchCells = []; matchCells.push ( now );				//
	
	for ( var i in vector ){
		if ( i == 3-from ) continue;
		
		var next = this.positionCalc ( now , vector[i] );
		if ( this.grid.compareCells(now,next)){
			var get =  this.cellAround ( next , i );    		//find nextcell
			sum += get.sum;
			matchCells = matchCells.concat( get.matchCells );
		}
	}
	return {
			sum 		: sum ,
			matchCells 	: matchCells }    
	
}


GR.prototype.positionCalc = function ( position , vector ){
	return { 
				x : parseInt(position.x) + parseInt(vector.x ),
				y : parseInt(position.y) + parseInt(vector.y)
			};
}

GR.prototype.setJump = function (){
	if(!this.jumpCells.length) return ;
	self = this;
	num = this.jumpCells.length;
	this.jumpCells.forEach(function(cell){
			self.grid.wipeCell(cell);});
	this.jumpCells = [];
	for (var i = 1;i <= num ; i++ ){
		var position = this.randomPosition() ;
		this.grid.setCell(position, -1);
		this.jumpCells.push(position);
	}
}

GR.prototype.randomValue = function (){							// 随机值
	var Srates  = [ 0.05,  0.02 , 0.05	, 0.05 	];				// Special item 's rate
	var values  = [ -1  ,  -2	, -4	, -3	]; 				// -1:跳动 -2:未知 -4:删除 -3: ？升级：石头
	
	if ( arguments.length ){									// 有参数时候的重载: function(except[]){} 剔除value
	    for (var i = 0 ; i < values.length ; i++ ){
			for ( var except in arguments )
			if ( values[i] == arguments[except] ){
				Srates.splice ( i );
				values.splice ( i );
			}
		}
	}
	
	var rates 	= this.createRandomRate ( Srates );
	
	for ( var i = 1 ; i <= this.presentMaxLevel ; i++)				//fill values
		values.push(i);
	
	var rnd 	= Math.random();
	
	for ( var i = 0 ; i < rates.length ; i++ ){
		if ( rates[i] > rnd.toFixed(4) ){
			if( values[ i ] == -2 ) return this.randomValue( -2 , 0 , -3 );		// 随机重选;
			return values[i];
			
		}
	}
	
}

GR.prototype.randomNext = function(){
	this.next = this.randomValue();
}

GR.prototype.randomPosition = function (){
	var position = {
				x : Math.ceil(Math.random() * this.size)-1,
				y : Math.ceil(Math.random() * this.size)-1
			};

	return !this.grid.getCell(position) ? position : this.randomPosition(); 
}


GR.prototype.createRandomRate = function ( Orates ){							//Original rates
	full = 1.0;
	used = 0.0;	
	rates = [];
	
	for ( var i in Orates ){
		used += Orates[ i ];
		rates.push ( used );
	}  
	for ( var i = 1 ; i < this.presentMaxLevel ; i++ ){
		used += ( full - used ) / 2
		rates.push ( used );
	}
	rates.push ( full );
	return rates;
}

GR.prototype.initRndSetGrid = function (){
	for (var i = 1 ; i <= this.startN ; i++ ){
		var value =  this.randomValue(-3,-2,-1,-4) ;
		this.add ( this.randomPosition() , value );
		
	}
}

GR.prototype.getScore = function (score){
	return this.score;
}
GR.prototype.setScore = function (score){
	this.score = score;
}

