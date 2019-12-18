const WIDTH = 32*48; // canvas elementets bredd
const HEIGHT = 32*24; // canvas elementets höjd

window.addEventListener("keydown", function (e) {
    // space and arrow keys
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

let canvas = document.createElement('canvas'); // skapa canvaselementet
let ctx = canvas.getContext('2d'); // spara canvaselementets context, vi behöver det för att kunna rita
canvas.setAttribute("class", "border"); // ge canvas klassen border så vi markerar ut det
canvas.width  = WIDTH; // sätt elementets bredd
canvas.height = HEIGHT; // ... & höjd

let background = function() {
    const bg = {};
    bg.height = HEIGHT;
    bg.width = WIDTH;
    bg.x = 0;
    bg.y = 0
    bg.img = sprites.background;
    bg.draw = function() {
        ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
    }
    return bg;
}


let Player = function(x,y,width,height) {
    const player = {};
    player.x = x;
    player.y = y;
    player.width = width;
    player.height = height;
    player.speedX = 4;
    player.speedY = 4;
    player.color = "black";
    player.direction = "left";
    player.img = sprites.tomte;
    player.curDir = 2;
    player.loop = [0,1,2,3,4,5,6,7,8];
    player.alive=true;
    player.loopIndex = 0;
    player.draw = function() {
        if (this.direction == "left") {
            this.curDir = 2;
        } else if (this.direction == "right") {   
            this.curDir = 1;
        } else if (this.direction == "down") {
            this.curDir = 0;
        } else if (this.direction == "up") {
            this.curDir = 3;
        }
        ctx.drawImage(this.img,64*this.loop[this.loopIndex],128*this.curDir,64,128,this.x,this.y,this.width,this.height);
    }
    return player;
}

let Tail = function(x,y) {
    const tail = {};
    tail.x = x;
    tail.y = y;
    tail.width = 64;
    tail.height = 64;
    tail.dir = "left";
    tail.color = "black";
    tail.speed = 4;
    tail.curDir = 2;
    tail.img = sprites.elf;
    tail.loop= [0,1,2,3,4,5,6,7,8];
    tail.loopIndex = 0;
    tail.draw = function() {
        if (this.dir == "left") {
            this.curDir = 2;
        } else if (this.dir == "right") {   
            this.curDir = 1;
        } else if (this.dir == "down") {
            this.curDir = 0;
        } else if (this.dir == "up") {
            this.curDir = 3;
        }
        ctx.drawImage(this.img,64*this.loop[this.loopIndex],128*this.curDir,64,128,this.x,this.y,this.width,this.height);
    }
    tail.setPosition = function(x,y) {
        this.x = x;
        this.y = y;
    }
    return tail;
}

let Gift = function(x,y,width,height) {
    const gift = {};
    gift.x = x;
    gift.y = y;
    gift.width = width;
    gift.height = height;
    gift.color = "yellow";
    gift.img = sprites.gift;
    gift.draw = function() {
        ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
    }

    return gift;
}

let points = 0;

let bg = new background();

let player = Player(WIDTH/2,HEIGHT/2-64,64,64);

let canvasLoop = window.requestAnimationFrame(step);

let gift = Gift(random(68, WIDTH-120) ,random(80,HEIGHT-82),32,32);

let tails = new Array();
let frameCount = 0;
let turnLimiter = 0;

let start, timestamp;
function step(timestamp) {
    // timestamp för hur länge animationen kört
    if (!start) start = timestamp;
    let progress = timestamp - start;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    bg.draw();


    this.logic();
      
    
    for (let i in tails) {
        if (i > 0) {
            var colb = this.colCheck(player,tails[i]);
        if (colb) {
            player.alive = false;
        }
        }
    }
    

    frameCount++;
    if (frameCount >= 3) {
        frameCount = 0;
        if (player.alive) {
            player.loopIndex++;
        }
        if (player.loopIndex >= player.loop.length) {
            player.loopIndex = 0;
        }
        for (let i in tails) {
            if (i == 0 && player.alive) {
                tails[i].loopIndex++;
            } else if (i > 0 && tails[i].dir != "none") {
                tails[i].loopIndex++;
            }
            if (tails[i].loopIndex >= tails[i].loop.length) {
            tails[i].loopIndex = 0;
            }
        }
    }
    

    var col = colCheck(player,gift);
    if (col) {
        this.newgift(random(68, WIDTH-120) ,random(80,HEIGHT-82));
        col = false;
        points += 1;
        this.addTail();
    }
    
    gift.draw();

    if (player.direction == "up") {
        player.y -= player.speedY; 
    }
    if (player.direction == "down") {
        player.y += player.speedY; 
    }
    if (player.direction == "right") {
        player.x += player.speedX; 
    }
    if (player.direction == "left") {
        player.x -= player.speedX; 
    }

    this.update();

    if (player.x - 60 < 0 || player.x + player.width + 60 > WIDTH || player.y - 48 < 0 || player.y + player.height + 34 > HEIGHT ) {
        player.alive = false;
    }


    for (let i in tails) {
        tails[i].draw();
    }    

    player.draw();

    ctx.font = "32px Arial";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 4;
        ctx.strokeText("points: " + points, 4, 30);
        ctx.fillStyle = "blue";
        ctx.fillText("points: " + points, 4, 30);


    // callback på sig själv genom requestAnimationFrame
    canvasLoop = window.requestAnimationFrame(step);
}

function logic(){
    //up key pressed when you aren't moving down and
    if (player.direction != "down" && player.direction != "up" && move.up && player.alive) {
        player.direction = "up";
        
    }
    //down key pressed
    if (player.direction != "up" && player.direction != "down" && move.down && player.alive) {
        player.direction = "down";
        
    }
    //left key pressed
    if (player.direction != "right" && player.direction != "left" && move.left && player.alive) {
        player.direction = "left";

    }
    //right key pressed
    if (player.direction != "left" && player.direction != "right" && move.right && player.alive){
        player.direction = "right";

    }
    if (!player.alive) {
        player.direction="none";
    }
}

function random(min,max) {
    return Math.floor(Math.random()*(max-min)) + min;
}

function newgift(x,y) {
    gift.x = x;
    gift.y = y;   
}

function addTail() {
    if (tails.length == 0) {
        var tail = new Tail(player.x, player.y)
        //up
        if (player.direction == "up") {
            tail.y = player.y + player.height;
            tail.dir = "up";
        }
        //right
        if (player.direction == "right") {
            tail.x = player.x - player.width;
            tail.dir = "right";
        }
        //down
        if (player.direction == "down") {
            tail.y = player.y - player.height;
            tail.dir = "down";
        }
        //left
        if (player.direction == "left") {
            tail.x = player.x + player.width;
            tail.dir = "left";
        }
    } else if (tails.length > 0) {
        let lastTail = tails.length - 1;
        
        var tail = new Tail(tails[lastTail].x, tails[lastTail].y)
        //up
        if (tails[lastTail].dir == "up") {
            tail.y = tails[lastTail].y + 64;
            tail.dir = "up";
        }
        //right
        if (tails[lastTail].dir == "right") {
            tail.x = tails[lastTail].x - 64;
            tail.dir = "right";
        }
        //down
        if (tails[lastTail].dir == "down") {
            tail.y = tails[lastTail].y - 64;
            tail.dir = "down";
        }
        //left
        if (tails[lastTail].dir == "left") {
            tail.x = tails[lastTail].x + 64;
            tail.dir = "left";
        }
    }

    //if(this.direction == "none") tail.x = this.x
    tails.push(tail);
    console.log("aa");   
}

function update() {
    for (let i in tails) {
        if (i == 0 && tails[i].dir == "up") {
            tails[i].setPosition(tails[i].x,tails[i].y - tails[i].speed);
            if (tails[i].y == player.y) {
                tails[i].dir = player.direction;
            }

        } else if (i == 0 && tails[i].dir == "down") {
            tails[i].setPosition(tails[i].x,tails[i].y + tails[i].speed);
            if (tails[i].y == player.y) {
                tails[i].dir = player.direction;
            }

        } else if (i == 0 && tails[i].dir == "left") {
            tails[i].setPosition(tails[i].x - tails[i].speed,tails[i].y);
            if (tails[i].x == player.x) {
                tails[i].dir = player.direction;
            }

        } else if (i == 0 && tails[i].dir == "right") {
            tails[i].setPosition(tails[i].x + tails[i].speed,tails[i].y);
            if (tails[i].x == player.x) {
                tails[i].dir = player.direction;
            }

        } else if (i > 0 && tails[i].dir == "left")  {
            tails[i].setPosition(tails[i].x - tails[i].speed, tails[i].y);
            if (tails[i].x == tails[i-1].x) {
                tails[i].dir = tails[i-1].dir;
                
            }

        }  else if (i > 0 && tails[i].dir == "right")  {
            tails[i].setPosition(tails[i].x + tails[i].speed,tails[i].y);
            if (tails[i].x == tails[i-1].x) {
                tails[i].dir = tails[i-1].dir;
            }

        }  else if (i > 0 && tails[i].dir == "up")  {
            tails[i].setPosition(tails[i].x,tails[i].y - tails[i].speed);
            if (tails[i].y == tails[i-1].y) {
                tails[i].dir = tails[i-1].dir;
            }

        }  else if (i > 0 && tails[i].dir == "down")  {
            tails[i].setPosition(tails[i].x,tails[i].y + tails[i].speed);
            if (tails[i].y == tails[i-1].y) {
                tails[i].dir = tails[i-1].dir;
            }

        } else if (player.alive == false) {
            tails[i].setPosition(player.x, player.y);
            tails[i].dir = "none";  
        }
    }
}

function colCheck(shapeA, shapeB) {
    var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
        vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
        // add the half widths and half heights of the objects
        hWidths = (shapeA.width / 2) + (shapeB.width / 2),
        hHeights = (shapeA.height / 2) + (shapeB.height / 2),
        col = false;
 
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
        var oX = hWidths - Math.abs(vX),
        oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            if (vY > 0) {
                col = true;
                console.log("a");
            } else {
                col = true;
                console.log("a");
            }
        } else {
            if (vX > 0) {
                col = true;
                console.log("a");
            } else {
                col = true;
                console.log("a");
            }
        }
    }
    return col;
}

let main = document.getElementsByTagName('main')[0]; // hämta main elementet från vårt HTML dokument
main.appendChild(canvas); // lägg till canvaselementet i main i HTML dokumentet

let move = { right: false, left: false, up: false, down: false }

document.addEventListener("keydown", function(e) {
	switch(e.key) {
		case "ArrowRight":
            move.right = true;
            break;
		case "ArrowLeft":
            move.left = true;
            break;
        case "ArrowUp":
            move.up = true;
            break;
		case "ArrowDown":
            move.down = true;
            break;
        }
});

// keyup på movement
document.addEventListener("keyup", function(e) {
	switch(e.key) {
		case "ArrowRight":
            move.right = false;
            break;
		case "ArrowLeft":
            move.left = false;
            break;
        case "ArrowUp":
            move.up = false;
            break;
		case "ArrowDown":
            move.down = false;
            break;
        }
});