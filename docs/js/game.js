const WIDTH = 32*24; // canvas elementets bredd
const HEIGHT = 32*24; // canvas elementets höjd

let canvas = document.createElement('canvas'); // skapa canvaselementet
let ctx = canvas.getContext('2d'); // spara canvaselementets context, vi behöver det för att kunna rita
canvas.setAttribute("class", "border"); // ge canvas klassen border så vi markerar ut det
canvas.width  = WIDTH; // sätt elementets bredd
canvas.height = HEIGHT; // ... & höjd

let Player = function(x,y,width,height) {
    const player = {};
    player.x = x;
    player.y = y;
    player.width = width;
    player.height = height;
    player.speedX = width/10;
    player.speedY = height/10;
    player.color = "black";
    player.direction = "left";
    player.alive=true;
    player.draw = function() {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x,player.y,player.width,player.height);
    }
    return player;
}

let Tail = function(x,y) {
    const tail = {};
    tail.x = x;
    tail.y = y;
    tail.width = 32;
    tail.height = 32;
    tail.lastX = 0;
    tail.lastY = 0;
    tail.color = "black";
    tail.draw = function() {
        ctx.fillStyle = tail.color;
        ctx.fillRect(tail.x,tail.y,tail.width,tail.height);
    }
    tail.setPosition = function(x,y) {
        tail.lastX = tail.x;
        tail.lastY = tail.y;
        tail.x = x;
        tail.y = y;
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
    gift.draw = function() {
        ctx.fillStyle = gift.color;
        ctx.fillRect(gift.x,gift.y,gift.width,gift.height);
    }

    return gift;
}

let points = 0;

let player = Player(WIDTH/2,HEIGHT/2-32,32,32);

let canvasLoop = window.requestAnimationFrame(step);

let gift = Gift(random(32, WIDTH-32) ,random(32,HEIGHT-32),32,32);

let tails = new Array();

let start, timestamp;
function step(timestamp) {
    // timestamp för hur länge animationen kört
    if (!start) start = timestamp;
    let progress = timestamp - start;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'; // getRandomColor()???
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    this.logic();


    var col = colCheck(player,gift);
    if (col) {
        this.newgift(random(32,WIDTH-32),random(32,HEIGHT-32));
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

    if (player.x < 0 || player.x + player.width > WIDTH || player.y < 0 || player.y + player.height > HEIGHT ) {
        player.alive = false;
    }

    this.update();

    player.draw();

    for (let i in tails) {
        tails[i].draw();
    }    

    ctx.font = "32px Arial";
        ctx.fillStyle = "white";
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
        }
        //right
        if (player.direction == "right") {
            tail.x = player.x - player.width;
        }
        //down
        if (player.direction == "down") {
            tail.y = player.y - player.height;
        }
        //left
        if (player.direction == "left") {
            tail.x = player.x + player.width;
        }
    } else if (tails.length > 0) {
        let lastTail = tails.length - 1;
        
        var tail = new Tail(tails[lastTail].x, tails[lastTail].y)
        //up
        if (player.direction == "up") {
            tail.y = tails[lastTail].y + 32;
        }
        //right
        if (player.direction == "right") {
            tail.x = tails[lastTail].x - 32;
        }
        //down
        if (player.direction == "down") {
            tail.y = tails[lastTail].y - 32;
        }
        //left
        if (player.direction == "left") {
            tail.x = tails[lastTail].x + 32;
        }
    }

    //if(this.direction == "none") tail.x = this.x
    tails.push(tail);
    console.log("aa");   
}

function update() {
    for (let i in tails) {
        if (i == 0 && player.direction == "up") {
            tails[i].setPosition(player.x, player.y + player.height);

        } else if (i == 0 && player.direction == "down") {
            tails[i].setPosition(player.x, player.y - player.height);

        } else if (i == 0 && player.direction == "left") {
            tails[i].setPosition(player.x + player.width, player.y);

        } else if (i == 0 && player.direction == "right") {
            tails[i].setPosition(player.x - player.width, player.y);

        } else if (i == 0 && player.alive == false) {
            tails[i].setPosition(tails[i].x, tails[i].y);

        } else if (i > 0) {
            tails[i].setPosition(tails[i - 1].lastX,tails[i - 1].lastY);
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