
document.body.onload = startGame;

var slugWorm = {
	blocks: [],
	addBlocks: function addBlocks(howMany){
	    for (var i = 0; i < howMany; i++) {
	    	this.blocks.push(new Block(10, "black", 10 + (10 * i), 120));
	    }
	},
	update: function update(){
		for(var i in this.blocks){
			this.blocks[i].update();
		}
	},
	move: function move(){
		for(var i in this.blocks){
			this.blocks[i].move();
		}
	}
};
var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        this.canvas.style = "border:1px solid #000000;";
        document.getElementById("gameArea").appendChild(this.canvas);
        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}


function startGame() {
	slugWorm.addBlocks(9);
    myGameArea.start();
}
function updateGameArea() {
    myGameArea.clear();
    slugWorm.move();
    slugWorm.update();
}

function Block(size, color, x, y) {
	return new Component(size, size, color, x, y);
}

function Component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;    
    this.move = function(){
    	this.x++;
    }
    this.update = function(){
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
