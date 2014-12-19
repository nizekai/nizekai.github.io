Grid = function(size){
	this.size = size;
	this.cells = this.initialCells();
}

Grid.prototype.initialCells = function (){
	var cells = [];
	for (var x = 0 ; x < this.size ; x++ ){
		var row = cells[x] = [];
		
		for(var y = 0 ; y < this.size ; y++){
			row.push(null);
		}
	}
	return cells;
}

Grid.prototype.setCell = function ( position , value ){	
		this.cells[position.x][position.y] = value;
}

Grid.prototype.getCell = function ( position ){
	if ( !this.cells[position.x][position.y] ) return false;
	return this.cells[position.x][position.y];
}

Grid.prototype.wipeCell = function ( position ){
	this.cells[position.x][position.y] = null;
}

Grid.prototype.eachCell = function (callback){
	this.cells.forEach(function (x){
		x.forEach(function (y){
			callback(y);
		})
	});
}

Grid.prototype.inCells = function ( position ){
	return position.x >= 0 && position.x < this.size && position.y >= 0 && position.y < this.size;
}

Grid.prototype.compareCells = function ( p1 , p2 ){
	return ( this.inCells(p1) && this.inCells(p2) && this.getCell(p1) && this.getCell(p2) && this.getCell(p1)==this.getCell(p2) && this.getCell(p1)>0);
}




