// Get the canvas element
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set the canvas dimensions
canvas.width = 400;
canvas.height = 400;

// Set the snake and food dimensions
const snakeSize = 20;
const foodSize = 20;

// Set the initial snake position and direction
let snake = [
    { x: canvas.width / 2, y: canvas.height / 2 },
    { x: canvas.width / 2 - snakeSize, y: canvas.height / 2 },
    { x: canvas.width / 2 - snakeSize * 2, y: canvas.height / 2 },
];
let direction = 'right';

// Set the initial food position
let food = {
    x: Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize,
    y: Math.floor(Math.random() * (canvas.height / snakeSize)) * snakeSize,
};

// Set the score and high score
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;

// Game state
let isPaused = true;

// Draw the game
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = 'green';
        ctx.fillRect(snake[i].x, snake[i].y, snakeSize, snakeSize);
    }

    // Draw the food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, foodSize, foodSize);

    // Draw the score and high score
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`Score: ${score}`, 10, 10);
    ctx.fillText(`High Score: ${highScore}`, 10, 40);

    // Draw pause message if paused
    if (isPaused) {
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
    }
}

// Update the game state
function update() {
    if (isPaused) return; // Do not update if paused

    // Update the snake position
    for (let i = snake.length - 1; i > 0; i--) {
        snake[i].x = snake[i - 1].x;
        snake[i].y = snake[i - 1].y;
    }

    // Update the snake head position based on the direction
    if (direction === 'right') {
        snake[0].x += snakeSize;
    } else if (direction === 'left') {
        snake[0].x -= snakeSize;
    } else if (direction === 'up') {
        snake[0].y -= snakeSize;
    } else if (direction === 'down') {
        snake[0].y += snakeSize;
    }

    // Check for collision with the walls
    if (snake[0].x < 0 || snake[0].x >= canvas.width || snake[0].y < 0 || snake[0].y >= canvas.height) {
        gameOver();
    }

    // Check for collision with the snake body
    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            gameOver();
        }
    }

    // Check if the snake eats the food
    if (snake[0].x === food.x && snake[0].y === food.y) {
        score++;
        snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
        food = {
            x: Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize,
            y: Math.floor(Math.random() * (canvas.height / snakeSize)) * snakeSize,
        };
    }
}

// Handle game over
function gameOver() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
    score = 0;
    snake = [
        { x: canvas.width / 2, y: canvas.height / 2 },
        { x: canvas.width / 2 - snakeSize, y: canvas.height / 2 },
        { x: canvas.width / 2 - snakeSize * 2, y: canvas.height / 2 },
    ];
    direction = 'right';
    food = {
        x: Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize,
        y: Math.floor(Math.random() * (canvas.height / snakeSize)) * snakeSize,
    };
    isPaused = true;
}

// Handle user input
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' && direction !== 'left') {
        direction = 'right';
    } else if (event.key === 'ArrowLeft' && direction !== 'right') {
        direction = 'left';
    } else if (event.key === 'ArrowUp' && direction !== 'down') {
        direction = 'up';
    } else if (event.key === 'ArrowDown' && direction !== 'up') {
        direction = 'down';
    } else if (event.key === ' ') {
        isPaused = !isPaused;
    }
});

// Handle reset button click
document.getElementById('resetButton').addEventListener('click', () => {
    localStorage.removeItem('highScore');
    highScore = 0;
    score = 0;
    snake = [
        { x: canvas.width / 2, y: canvas.height / 2 },
        { x: canvas.width / 2 - snakeSize, y: canvas.height / 2 },
        { x: canvas.width / 2 - snakeSize * 2, y: canvas.height / 2 },
    ];
    direction = 'right';
    food = {
        x: Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize,
        y: Math.floor(Math.random() * (canvas.height / snakeSize)) * snakeSize,
    };
    isPaused = true;
    location.reload()
});

// Main game loop
setInterval(() => {
    update();
    draw();
}, 100);