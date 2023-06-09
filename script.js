
var timer;                                              // move timer
let canvasSize = [600,400];                             // size of playing field
let headSize = [20, 20];                                // size of the snakes head/body segment
var headPosition = [canvasSize[0]/2,canvasSize[1]/2];   // initial position of snake
var foodPosition = [];                                  // food position
var snakeDirection = 4;                                 // initial moving direction
var score = 0;                                          // score variable  
var doc = document.getElementById("main");              // canvas to draw on
var options = document.getElementById("options");       // options section
var scoreSpan = document.getElementById("score");       // score span to update current score
var ctx = doc.getContext("2d");                         // canvas context

var segments = [];                                      // array of blocks to be drawn
var directionBuffer = [];                               // buffer to store directions

const snakeColour = "#000";
const foodColour = "#0F0";
const backgroundColour = "#FFF";
const fontColour = "#F00";
const snakeSpeed = 100;                                 // lower == faster

window.addEventListener("keydown", function (event) {   // keyboard event listner
    if (event.defaultPrevented) {
        return;
    }
    switch (event.key) {
        case "ArrowUp": keyPress(1); break;
        case "ArrowDown": keyPress(2); break;
        case "ArrowLeft": keyPress(3); break;
        case "ArrowRight": keyPress(4); break;
        default: return;
    }
    event.preventDefault();
}, true);

function keyPress(key) {
    directionBuffer.push(key);                          // add the key pressed to the direction buffer
}

function startGame() {
    if (timer != null) { 
        return;
    }

    resetCanvas();
    drawFood();

    timer = setInterval(                                // start timer
        drawBox,
        snakeSpeed
    );
}

function stopGame() {
    clearInterval(timer);                               // clear timer
    timer = null;
}

function drawBox() {
    var xOffset = 0;
    var yOffset = 0
    let direction = directionBuffer.shift();
    if (direction == null) {
        direction = snakeDirection;
    } else {
        snakeDirection = direction;
    }

    switch (direction) {
        case 1: yOffset = -headSize[1]; break;  // up
        case 2: yOffset = headSize[1]; break;   // down
        case 3: xOffset = -headSize[0]; break;  // left
        case 4: xOffset = headSize[0]; break;   // right
    }
    
    headPosition[0] += xOffset; // new X
    headPosition[1] += yOffset; // new Y

    if (outOfBounds()) {
        gameOver();
        return;
    }    

    segments.unshift([headPosition[0], headPosition[1]]);
    if (headPosition[0] == foodPosition[0] && headPosition[1] == foodPosition[1]) {
        gotFood();                                          // got some food, extend the snake
    } else {
        var removeMe = segments.pop();                      // no food, don't extend the snake
        ctx.fillStyle = backgroundColour;
        ctx.fillRect(removeMe[0], removeMe[1], headSize[0], headSize[1]);    
    }

    // add new head position
    ctx.fillStyle = snakeColour;
    ctx.fillRect(segments[0][0], segments[0][1], headSize[0], headSize[1]);
    ctx.strokeStyle = backgroundColour;
    ctx.strokeRect(segments[0][0], segments[0][1], headSize[0], headSize[1]);
}

function outOfBounds() {
    if (headPosition[0] < 0 || headPosition[1] < 0 || headPosition[0] + headSize[0] > canvasSize[0] || headPosition[1] + headSize[1] > canvasSize[1]) {
        return true;
    } else {
        for (var i = 0; i < segments.length-1; i++) {
            if (headPosition[0] == segments[i][0] && headPosition[1] == segments[i][1]) {
                return true;
            }
        }
    }
    return false;
}

function gotFood() {
    score++;
    scoreSpan.innerHTML = score;
    drawFood();
}

function drawFood() {
    let fx = Math.floor(Math.random() * ((canvasSize[0] - (headSize[0]*2))/headSize[0]));
    let fy = Math.floor(Math.random() * ((canvasSize[1] - (headSize[1]*2))/headSize[1]));
    foodPosition = [fx*headSize[0], fy*headSize[1]];
    for (var i = 0; i < segments.length-1; i++) {
        if (foodPosition[0] == segments[i][0] && foodPosition[1] == segments[i][1]) {
            drawFood();
            return;
        }
    }
    ctx.fillStyle = foodColour;
    ctx.fillRect(foodPosition[0], foodPosition[1], headSize[0], headSize[1]);
}

function resetCanvas() {
    snakeDirection = 4;
    scoreSpan.innerHTML = score = 0;

    doc.width = canvasSize[0];
    doc.height = canvasSize[1];
    options.style.width = canvasSize[0];

    headPosition[0] = canvasSize[0]/2;
    headPosition[1] = canvasSize[1]/2;

    segments = [];
    segments.push([headPosition[0],headPosition[1]]);

    ctx.fillStyle = backgroundColour;
    ctx.fillRect(0, 0, canvasSize[0], canvasSize[1]);
}

function gameOver() {
    stopGame();
    ctx.fillStyle = fontColour;
    ctx.font = "20px Monospace";
    ctx.fillText("GAME OVER", headSize[0], headSize[1]*2);
}