const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game variables
let log1 = "S M O O T H movement";
let playerX = 400;
let playerY = 350;
let playerDirection = "down"; // Initial direction of the player
let playerSize = 20;
let gunLength = 25; // Length of the gun
let enemies = [];
const ver = "v1.0.6"
const maxCoins = 10;
const maxEnemies = 5;
const keyState = {};

// Button Pressed
document.addEventListener("keydown", (event) => {
    keyState[event.key] = true;
});
document.addEventListener("keyup", (event) => {
    keyState[event.key] = false; // Clear key state when key is released

    if (event.keyCode === 32) { // Spacebar for shooting
        if (!gameOverFlag) { // Only allow shooting if the game is not over
            shoot();
        }
    }
});

// Move diagonally if two arrow keys are pressed simultaneously
function handleDiagonalMovement() {
    if (keyState["ArrowUp"] && keyState["ArrowLeft"]) {
        playerY -= 1.25;
        playerX -= 1.25;
        playerDirection = "leftup";
    } else if (keyState["ArrowUp"] && keyState["ArrowRight"]) {
        playerY -= 1.25;
        playerX += 1.25;
        playerDirection = "rightup";
    } else if (keyState["ArrowDown"] && keyState["ArrowLeft"]) {
        playerY += 1.25;
        playerX -= 1.25;
        playerDirection = "leftdown";
    } else if (keyState["ArrowDown"] && keyState["ArrowRight"]) {
        playerY += 1.25;
        playerX += 1.25;
        playerDirection = "rightdown";
    }
}

// Move in single direction
function handleSingleDirectionMovement() {
    if (keyState["ArrowUp"]) {
        playerY -= 2.5;
        playerDirection = "up";
    } else if (keyState["ArrowDown"]) {
        playerY += 2.5;
        playerDirection = "down";
    } else if (keyState["ArrowLeft"]) {
        playerX -= 2.5;
        playerDirection = "left";
    } else if (keyState["ArrowRight"]) {
        playerX += 2.5;
        playerDirection = "right";
    }
}

// Check for boundary teleportation
function handleBoundaryTeleportation() {
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
}

// Game loop
function gameLoop() {
    handleDiagonalMovement();
    handleSingleDirectionMovement();
    handleBoundaryTeleportation();

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = "blue";
    ctx.fillRect(playerX, playerY, playerSize, playerSize);

    // Draw gun
    drawGun();

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

// Shooting function
function shoot() {
    let bulletX = playerX + playerSize / 2; // Starting position of the bullet (center of the player)
    let bulletY = playerY + playerSize / 2;
    let bulletSize = 6; // Increased size of the bullet hitbox
    let bulletSpeed = 5; // Adjust bullet speed as needed

    // Calculate the direction of the bullet based on the player's last movement direction
    let dx = 0;
    let dy = 0;
    if (playerDirection === "up") {
        dy = -1;
    } else if (playerDirection === "down") {
        dy = 1;
    } else if (playerDirection === "left") {
        dx = -1;
    } else if (playerDirection === "right") {
        dx = 1;
    } else if (playerDirection === "leftup") {
        dx = -1;
        dy = -1;
    } else if (playerDirection === "rightup") {
        dx = 1;
        dy = -1;
    } else if (playerDirection === "leftdown") {
        dx = -1;
        dy = 1;
    } else if (playerDirection === "rightdown") {
        dx = 1;
        dy = 1;
    }

    // Move the bullet
    let interval = setInterval(() => {
        ctx.clearRect(bulletX - bulletSize / 2, bulletY - bulletSize / 2, bulletSize, bulletSize); // Clear the previous position of the bullet
        bulletX += dx * bulletSpeed;
        bulletY += dy * bulletSpeed;
        ctx.fillRect(bulletX - bulletSize / 2, bulletY - bulletSize / 2, bulletSize, bulletSize); // Draw the bullet with increased hitbox size
        if (bulletX < 0 || bulletX > canvas.width || bulletY < 0 || bulletY > canvas.height) {
            clearInterval(interval); // Stop moving the bullet if it goes out of the canvas
        }
        // Check collision with enemies
        enemies.forEach((enemy, index) => {
            if (
                bulletX < enemy.x + enemy.size &&
                bulletX > enemy.x &&
                bulletY < enemy.y + enemy.size &&
                bulletY > enemy.y
            ) {
                enemies.splice(index, 1);
                clearInterval(interval); // Stop moving the bullet if it hits an enemy
            }
        });
    }, 20); // Adjust bullet interval for smoother animation
}

// Generate random number between min and max
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
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
        const speed = 1.005; // Adjust speed as needed
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
let gameOverFlag = false; // Add a flag to indicate game over
function gameOver() {
    gameOverFlag = true; // Set the game over flag
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2 - 20);
    document.getElementById("restartButton").style.display = "block";
    clearInterval(coinsInterval);
    clearInterval(enemiesInterval);
    document.removeEventListener("keydown", movePlayer);
    document.removeEventListener("keyup", movePlayer);
}

// Restart game
function restartGame() {
    gameOverFlag = false; // Reset the game over flag
    coins = [];
    enemies = [];
    score = 0;
    playerX = 400;
    playerY = 300;
    document.getElementById("restartButton").style.display = "none";
    spawnCoins();
    spawnEnemies();
    gameLoop();
}


// Move player function
function movePlayer(event) {
    const key = event.key;

    // Temporary variables to hold the new position
    let newX = playerX;
    let newY = playerY;

    if (key === "ArrowUp") {
        newY -= 2.5;
    } else if (key === "ArrowDown") {
        newY += 2.5;
    } else if (key === "ArrowLeft") {
        newX -= 2.5;
    } else if (key === "ArrowRight") {
        newX += 2.5;
    }

    // Update player position
    playerX = newX;
    playerY = newY;

    // Check for coin collection after moving
    checkCoinCollection();
}

// Draw the gun
function drawGun() {
    ctx.beginPath();
    ctx.moveTo(playerX + playerSize / 2, playerY + playerSize / 2); // Start position of the gun (center of the player)
    // End position of the gun based on the player's last movement direction
    if (playerDirection === "up") {
        ctx.lineTo(playerX + playerSize / 2, playerY);
    } else if (playerDirection === "down") {
        ctx.lineTo(playerX + playerSize / 2, playerY + playerSize);
    } else if (playerDirection === "left") {
        ctx.lineTo(playerX, playerY + playerSize / 2);
    } else if (playerDirection === "right") {
        ctx.lineTo(playerX + playerSize, playerY + playerSize / 2);
    } else if (playerDirection === "leftup") {
        ctx.lineTo(playerX, playerY);
    } else if (playerDirection === "rightup") {
        ctx.lineTo(playerX + playerSize, playerY);
    } else if (playerDirection === "leftdown") {
        ctx.lineTo(playerX, playerY + playerSize);
    } else if (playerDirection === "rightdown") {
        ctx.lineTo(playerX + playerSize, playerY + playerSize);
    }
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Start the game loop
gameLoop();

// Start spawning coins
const coinsInterval = spawnCoins();

// Start spawning enemies
const enemiesInterval = spawnEnemies();

// Add event listener for restart button
document.getElementById("restartButton").addEventListener("click", restartGame);
