
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
	move: function move(speed){
		for(var i in this.blocks){
			this.blocks[i].move(speed);
		}
	},
	eatFood: function eatFood(){
		this.addBlocks(1);
	},
    getPosition: function getPosition(){
    	var xLeft = 0, 
    		xRight = 0;

    	for (var i in this.blocks) {
    		var pos = this.blocks[i].getPosition();
    		xLeft = pos.xLeft;
    		xRight = pos.xRight;
    	}

    	return {
    		xLeft: xLeft,
    		xRight: xRight,
    	};
    }
};
var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.height = 600;
        this.canvas.width = 1200;
        this.context = this.canvas.getContext("2d");
        this.canvas.style = "border:1px solid #000000;";
        document.getElementById("gameArea").appendChild(this.canvas);
        this.interval = setInterval(updateGameArea, 20);
        //this.addFoodInterval = setInterval(addFood, 1000);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    food: null,
    wormEatsFood: function(){
    	food = null;
    }
}


function startGame() {
	slugWorm.addBlocks(9);
	addFood();
    myGameArea.start();
}

function updateGameArea() {
    myGameArea.clear();

    myGameArea.food && myGameArea.food.update();
    slugWorm.move(10);
    slugWorm.update();
    if(willSlugWormEatTheFood(slugWorm, myGameArea.food)){
    	alert("eaten!");
    	myGameArea.wormEatsFood();
    	slugWorm.eatFood();
    }
}

function willSlugWormEatTheFood(slugWorm, food){
	if(!food) return false;
	var foodPos = food.getPosition();
	var wormPos = slugWorm.getPosition();
	if(wormPos.xRight >= foodPos.xLeft && wormPos.xRight <= foodPos.xRight) return true;
	return false;
}

function addFood(){
	if(!myGameArea.food) myGameArea.food = new Block(10, "red", 800, 120);
}

function Block(size, color, x, y) {
	return new Component(size, size, color, x, y);
}

function Component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;    
    this.move = function(speed){
    	this.x+=speed;
    }
    this.update = function(){
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.getPosition = function(){
    	return {
    		xLeft: this.x,
    		xRight: this.x + this.width,
    	};
    }
}
