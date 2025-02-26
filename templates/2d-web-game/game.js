// This is a basic js template for a 2d game.

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game variables
let log1 = "Add Favorites Section In Menu";
let playerX = 400;
let playerY = 350;
let playerDirection = "down"; // Initial direction of the player
let playerSize = 20;
let gunLength = 25; // Length of the gun
let coins = [];
let enemies = [];
let score = 0;
const ver = "v1.0.1"
const maxCoins = 10;
const maxEnemies = 5;
const keyState = {};

// Player movement
document.addEventListener("keydown", (event) => {
    keyState[event.key] = true;

    // Move diagonally if two arrow keys are pressed simultaneously
    if (keyState["ArrowUp"] && keyState["ArrowLeft"]) {
        playerY -= 5;
        playerX -= 5;
        playerDirection = "leftup";
    } else if (keyState["ArrowUp"] && keyState["ArrowRight"]) {
        playerY -= 5;
        playerX += 5;
        playerDirection = "rightup";
    } else if (keyState["ArrowDown"] && keyState["ArrowLeft"]) {
        playerY += 5;
        playerX -= 5;
        playerDirection = "leftdown";
    } else if (keyState["ArrowDown"] && keyState["ArrowRight"]) {
        playerY += 5;
        playerX += 5;
        playerDirection = "rightdown";
    } else {
        // Move in single direction
        if (keyState["ArrowUp"]) {
            playerY -= 5;
            playerDirection = "up";
        } else if (keyState["ArrowDown"]) {
            playerY += 5;
            playerDirection = "down";
        } else if (keyState["ArrowLeft"]) {
            playerX -= 5;
            playerDirection = "left";
        } else if (keyState["ArrowRight"]) {
            playerX += 5;
            playerDirection = "right";
        }
    }

    // Teleportation when crossing the boundaries
    if (playerX < 0) {
        playerX = canvas.width - playerSize;
    } else if (playerX + playerSize > canvas.width) {
        playerX = 0;
    }
    if (playerY < 0) {
        playerY = canvas.height - playerSize;
    } else if (playerY + playerSize > canvas.height) {
        playerY = 0;
    }

    // Check for coin collection
    coins.forEach((coin, index) => {
        if (
            playerX < coin.x + coin.size &&
            playerX + playerSize > coin.x &&
            playerY < coin.y + coin.size &&
            playerY + playerSize > coin.y
        ) {
            coins.splice(index, 1);
            score++;
        }
    });
});

// Shooting functionality
document.addEventListener("keyup", (event) => {
    if (event.keyCode === 32) { // Spacebar for shooting
        shoot();
    }
});

gameLoop();

// Clear key state when key is released
document.addEventListener("keyup", (event) => {
    keyState[event.key] = false;
});

// Generate random number between min and max
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Spawn coins
function spawnCoins() {
    setInterval(() => {
        if (coins.length < maxCoins) {
            const coinSize = 10;
            const coinX = getRandomNumber(0, canvas.width - coinSize);
            const coinY = getRandomNumber(0, canvas.height - coinSize);
            coins.push({ x: coinX, y: coinY, size: coinSize });
        }
    }, 2000); // Spawn a new coin every 2 seconds
}

// Spawn enemies
function spawnEnemies() {
    setInterval(() => {
        if (enemies.length < maxEnemies) {
            const enemySize = 10;
            const enemyX = getRandomNumber(0, canvas.width - enemySize);
            const enemyY = getRandomNumber(0, canvas.height - enemySize);
            enemies.push({ x: enemyX, y: enemyY, size: enemySize });
        }
    }, 3000); // Spawn a new enemy every 3 seconds
}

// Draw coins
function drawCoins() {
    coins.forEach((coin) => {
        ctx.fillStyle = "yellow";
        ctx.fillRect(coin.x, coin.y, coin.size, coin.size);
    });
}

// Draw enemies
function drawEnemies() {
    enemies.forEach((enemy) => {
        ctx.fillStyle = "red";
        ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
    });
}

// Update enemies position
function updateEnemiesPosition() {
    enemies.forEach((enemy) => {
        const dx = playerX - enemy.x;
        const dy = playerY - enemy.y;
        const angle = Math.atan2(dy, dx);
        const speed = 1.1; // Adjust speed as needed
        enemy.x += speed * Math.cos(angle);
        enemy.y += speed * Math.sin(angle);
    });
}

// Check collision with enemies
function checkCollision() {
    enemies.forEach((enemy) => {
        if (
            playerX < enemy.x + enemy.size &&
            playerX + playerSize > enemy.x &&
            playerY < enemy.y + enemy.size &&
            playerY + playerSize > enemy.y
        ) {
            gameOver();
        }
    });
}

// Game over
function gameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2 - 20);
    document.getElementById("restartButton").style.display = "block";
    clearInterval(coinsInterval);
    clearInterval(enemiesInterval);
    document.removeEventListener("keydown", movePlayer);
    if (event.key) { // Spacebar for shooting
        restartGame();
    }
}

// Restart game
function restartGame() {
    coins = [];
    enemies = [];
    score = 0;
    playerX = 400;
    playerY = 350;
    document.getElementById("restartButton").style.display = "none";
    spawnCoins();
    spawnEnemies();
    document.addEventListener("keydown", movePlayer);
    gameLoop();
}

// Move player function
function movePlayer(event) {
    const key = event.key;
    if (key === "ArrowUp") {
        playerY -= 5;
    } else if (key === "ArrowDown") {
        playerY += 5;
    } else if (key === "ArrowLeft") {
        playerX -= 5;
    } else if (key === "ArrowRight") {
        playerX += 5;
    }
}

// Game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = "blue";
    ctx.fillRect(playerX, playerY, playerSize, playerSize);

    // Draw gun
    drawGun();

    // Draw coins
    drawCoins();

    // Update enemies position
    updateEnemiesPosition();

    // Draw enemies
    drawEnemies();

    // Display score
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score + ", " + ver + ", log: " + log1, 10, 30);


    // Check collision
    checkCollision();

    // Request next frame
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();

// Start spawning coins
const coinsInterval = spawnCoins();

// Start spawning enemies
const enemiesInterval = spawnEnemies();

// Add event listener for restart button
document.getElementById("restartButton").addEventListener("click", restartGame);