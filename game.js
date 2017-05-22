
document.body.onload = startGame;

var slugWorm = {
	blocks: [],
    speed: 5, 
    direction: "right",
    lastBlockDirection: "right",
    addBlocks: function addBlocks(howMany){
        var lastBlock = this.getLastBlock();
        var newBlockX = lastBlock ? (lastBlock.x - lastBlock.width) : 10;
        var newBlockY = lastBlock ? (lastBlock.y) : 100;

        var newBlock = new Block(10, "black", newBlockX, newBlockY);
    	this.blocks.push(newBlock);
        if(--howMany > 0) this.addBlocks(howMany);
	},
    getLastBlock: function getLastBlock(){
        return this.blocks[this.blocks.length-1];
    },
	update: function update(){
		for(var i in this.blocks){
			this.blocks[i].update();
		}
	},
	move: function move(){
		for(var i in this.blocks){
			this.blocks[i].move(this.speed, this.direction);
            //this.lastBlockDirection = this.blocks[i].direction;
		}
	},
    eatFood: function eatFood(){
		this.addBlocks(1);
	},
    getPosition: function getPosition(){
    	var xLeft = 0, 
    		xRight = 0,
            top = 0,
            bottom = 0;

    	for (var i in this.blocks) {
    		var pos = this.blocks[i].getPosition();
    		xLeft = pos.xLeft;
    		xRight = pos.xRight;
            top = pos.top;
            bottom = pos.bottom;
    	}

    	return {
    		xLeft: xLeft,
    		xRight: xRight,
            top: top,
            bottom: bottom
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
    	this.food = null;
    }
}


function startGame() {
    document.addEventListener("keydown", updateDirection);
	slugWorm.addBlocks(9);
	addFood(800, 120);
    myGameArea.start();
}


function updateDirection(event){
    var x = event.which || event.keyCode;
    slugWorm.direction = getDirectionFromKeyCode(x);
}


function updateGameArea() {
    myGameArea.clear();

    myGameArea.food && myGameArea.food.update();
    slugWorm.move();
    slugWorm.update();
    if(willSlugWormEatTheFood(slugWorm, myGameArea.food)){
    	myGameArea.wormEatsFood();
    	slugWorm.eatFood();
    }
}

function willSlugWormEatTheFood(slugWorm, food){
	if(!food) return false;
	var foodPos = food.getPosition();
	var wormPos = slugWorm.getPosition();
	return (
        (wormPos.xRight >= foodPos.xLeft && wormPos.xRight <= foodPos.xRight)
        &&
        (
            (wormPos.top <= foodPos.top && wormPos.top >= foodPos.bottom)
            ||
            (wormPos.bottom <= foodPos.top && wormPos.bottom >= foodPos.bottom)
        )
    )
}

function addFood(x, y){
	if(!myGameArea.food) myGameArea.food = new Block(10, "red", x, y);
}

function Block(size, color, x, y) {
	return new Component(size, size, color, x, y);
}

function Component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;    
    this.move = function(speed, direction){

        switch(direction)
        {
            case "up":
                this.y-=speed;
            break;
            case "down":
                this.y+=speed;
            break;
            case "left":
                this.x-=speed;
            break;
            case "right":
                this.x+=speed;
            break;

        }

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
            top: this.y + this.height,
            bottom: this.y
    	};
    }
}

function getDirectionFromKeyCode(x){
    switch(x)
    {
        case 37:
            return "left";
        case 38:
            return "up";
        case 39:
            return "right";
        case 40:
            return "down";    
    }
}