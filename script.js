const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let speedCapybar = 5

document.getElementById('leftButton').addEventListener('click', () => {
    keys['ArrowLeft'] = true;
    setTimeout(() => keys['ArrowLeft'] = false, 100); // Отпустить кнопку после небольшого задержки
});

document.getElementById('pauseButton').addEventListener('click', () => {
    isPaused = !isPaused;
});

document.getElementById('rightButton').addEventListener('click', () => {
    keys['ArrowRight'] = true;
    setTimeout(() => keys['ArrowRight'] = false, 100); // Отпустить кнопку после небольшого задержки
});


// Capybara properties
const capybara = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 70,
    width: 50,
    height: 50,
    speed: speedCapybar
};

// Obstacles and fruits arrays
let obstacles = [];
let fruits = [];
let score = 0;
let gameSpeed = 3;
let isPaused = false; // New variable to track pause state

// Track pressed keys
let keys = {};

// Event listeners for key presses
window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (e.code === 'Space') {
        isPaused = !isPaused; // Toggle pause state on Space key press
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// Generate random obstacles and fruits
function generateObstacles() {
    if (!isPaused) {
        const width = Math.random() * (canvas.width / 3);
        const x = Math.random() * (canvas.width - width);
        obstacles.push({ x, y: -50, width, height: 20 });
    }
}

function generateFruits() {
    if (!isPaused) {
        const x = Math.random() * (canvas.width - 20);
        fruits.push({ x, y: -20, width: 20, height: 20 });
    }
}

// Draw capybara
function drawCapybara() {
    ctx.fillStyle = 'brown';
    ctx.fillRect(capybara.x, capybara.y, capybara.width, capybara.height);
}

// Draw obstacles and fruits
function drawObstacles() {
    ctx.fillStyle = 'red';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function drawFruits() {
    ctx.fillStyle = 'orange';
    fruits.forEach(fruit => {
        ctx.fillRect(fruit.x, fruit.y, fruit.width, fruit.height);
    });
}

// Update positions of obstacles and fruits
function updateObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.y += gameSpeed;
    });
    obstacles = obstacles.filter(obstacle => obstacle.y < canvas.height);
}

function updateFruits() {
    fruits.forEach(fruit => {
        fruit.y += gameSpeed;
    });
    fruits = fruits.filter(fruit => fruit.y < canvas.height);
}

// Check for collisions
function checkCollisions() {
    obstacles.forEach(obstacle => {
        if (capybara.x < obstacle.x + obstacle.width &&
            capybara.x + capybara.width > obstacle.x &&
            capybara.y < obstacle.y + obstacle.height &&
            capybara.height + capybara.y > obstacle.y) {
            // Game over
            // alert(`Game Over! Your score: ${score}`);
            document.location.reload();
        }
    });

    fruits.forEach((fruit, index) => {
        if (capybara.x < fruit.x + fruit.width &&
            capybara.x + capybara.width > fruit.x &&
            capybara.y < fruit.y + fruit.height &&
            capybara.height + capybara.y > fruit.y) {
            // Collect fruit
            score += 10;
            fruits.splice(index, 1);
        }
    });
}

// Display score
function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

// Increase game speed after every 100 points
function increaseSpeed() {
    if (score >= 100 && score < 110) {
        gameSpeed = 4;
        speedCapybar = 7;
    }
    if (score >= 200 && score < 210) {
        gameSpeed = 5;
        speedCapybar = 12;
    }
    if (score >= 300 && score < 310) {
        gameSpeed = 6;
        speedCapybar = 17;
    }
    if (score >= 400 && score < 410) {
        gameSpeed = 7;
        speedCapybar = 31;
    }
}

// Update game state
function update() {
    if (keys['ArrowLeft'] && capybara.x > 0) {
        capybara.x -= capybara.speed;
    }
    if (keys['ArrowRight'] && capybara.x < canvas.width - capybara.width) {
        capybara.x += capybara.speed;
    }
    updateObstacles();
    updateFruits();
    checkCollisions();
    increaseSpeed();
}

// Main game loop
function gameLoop() {
    if (!isPaused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawCapybara();
        drawObstacles();
        drawFruits();
        drawScore();
        update();
    }
    requestAnimationFrame(gameLoop);
}

// Generate obstacles and fruits periodically
setInterval(generateObstacles, 2000);
setInterval(generateFruits, 3000);

gameLoop();
