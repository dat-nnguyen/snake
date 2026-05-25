const canvas = document.getElementById("snake");
const ctx = canvas.getContext("2d");

let dx = 10;
let dy = 0;
let foodX = 0;
let foodY = 0;
let score = 0;
let countApple = 1;
let isBigApple = false;

let snake = [
    {x: 150, y: 150},
    {x: 140, y: 150},
    {x: 130, y: 150},
    {x: 120, y: 150},
    {x: 110, y: 150},
];

function drawSnakePart(snakePart) {
    ctx.fillStyle = "green";
    ctx.strokeStyle = "darkgreen";
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function drawSnake() {
    for (let snakePart of snake) {
        drawSnakePart(snakePart);
    }
}

function drawApple() {
    ctx.fillStyle = "red";
    ctx.strokeStyle = "darkred";
    ctx.fillRect(foodX, foodY, 10, 10);
    ctx.strokeRect(foodX, foodY, 10, 10);
}

function drawBigApple() {
    ctx.fillStyle = "gold";
    ctx.strokeStyle = "darkgoldenrod";
    ctx.fillRect(foodX, foodY, 20, 20);
    ctx.strokeRect(foodX, foodY, 20, 20);
}

function spawnApple(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function createFood() {

    if (countApple % 4 === 0) {
        isBigApple = true;
        foodX = spawnApple(0, canvas.width - 20);
        foodY = spawnApple(0, canvas.height - 20);
    } else {
        isBigApple = false;
        foodX = spawnApple(0, canvas.width - 10);
        foodY = spawnApple(0, canvas.height - 10);
    }

    snake.forEach(function isSnakeOnApple(snakePart) {
        const appleInSnake = snakePart.x === foodX && snakePart.y === foodY;
        if (appleInSnake) {
            createFood(); // Try again if spawned on snake
        }
    });
}


function eatFood() {
    if (isBigApple) {
        return snake[0].x >= foodX && snake[0].x < foodX + 20 &&
            snake[0].y >= foodY && snake[0].y < foodY + 20;
    } else {

        return snake[0].x === foodX && snake[0].y === foodY;
    }
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    if (eatFood()) {
        if (isBigApple) {
            score += 5;
        } else {
            score += 1;
        }

        countApple++;

        const scoreElement = document.getElementById("score");
        if (scoreElement) {
            scoreElement.innerHTML = "Score: " + score;
        }

        createFood();
    } else {
        snake.pop();
    }
}

function clearCanvas() {
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingLeft  = dx === -10;
    const goingRight = dx === 10;

    const keyPressed = event.keyCode;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
    } else if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
    } else if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
    } else if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 10;
    }
}
function snakeCollision() {
   for (let i = 1; i < snake.length; i++) {
       if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
           return true;
       }
   }
   return false;
}

function wallCollision() {
    return snake[0].x < 0 ||
        snake[0].x >= canvas.width ||
        snake[0].y < 0 ||
        snake[0].y >= canvas.height
}

function gameOver() {
    return snakeCollision() || wallCollision();
}

function main() {
    setTimeout(function onTick() {
        if (gameOver()) {
            alert("Game Over");
            return;
        }

        clearCanvas();

        if (isBigApple) {
            drawBigApple();
        } else {
            drawApple();
        }

        moveSnake();
        drawSnake();

        main();
    }, 100);
}

createFood();
main();

document.addEventListener("keydown", changeDirection);