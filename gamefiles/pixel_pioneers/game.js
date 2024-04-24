// Game variables
let log1 = "Add Favorites Section In Menu";
let playerX = 400;
let playerY = 350;
let playerDirection = "down"; // Initial direction of the player
let playerSize = 20;
let coins = [];
let enemies = [];
let score = 0;
const ver = "v1.0.2"
const maxCoins = 10;
const maxEnemies = 5;
const keyState = {};

// Create a Pixi.js application instance
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view);

// Load images for player, coins, and enemies
PIXI.Loader.shared
    .add('player', 'player.png')
    .add('coin', 'coin.png')
    .add('enemy', 'enemy.png')
    .load(setup);

function setup() {
    // Create player sprite
    const player = new PIXI.Sprite(PIXI.Loader.shared.resources['player'].texture);
    player.position.set(playerX, playerY);
    app.stage.addChild(player);

    // Set up keyboard input handling
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Start game loop
    app.ticker.add(gameLoop);
}

function handleKeyDown(event) {
    keyState[event.key] = true;
}

function handleKeyUp(event) {
    keyState[event.key] = false;
}

function gameLoop(delta) {
    // Update player position based on keyState
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

    // Teleportation when crossing the boundaries
    if (playerX < 0) {
        playerX = app.renderer.width - playerSize;
    } else if (playerX + playerSize > app.renderer.width) {
        playerX = 0;
    }
    if (playerY < 0) {
        playerY = app.renderer.height - playerSize;
    } else if (playerY + playerSize > app.renderer.height) {
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
            app.stage.removeChild(coin.sprite);
        }
    });

    // Update enemies position
    updateEnemiesPosition();

    // Check collision
    checkCollision();

    // Update score text
    scoreText.text = "Score: " + score + ", " + ver + ", log: " + log1;
}

function spawnCoins() {
    setInterval(() => {
        if (coins.length < maxCoins) {
            const coinSize = 10;
            const coinX = getRandomNumber(0, app.renderer.width - coinSize);
            const coinY = getRandomNumber(0, app.renderer.height - coinSize);
            const coin = new PIXI.Sprite(PIXI.Loader.shared.resources['coin'].texture);
            coin.position.set(coinX, coinY);
            app.stage.addChild(coin);
            coins.push({ x: coinX, y: coinY, size: coinSize, sprite: coin });
        }
    }, 2000); // Spawn a new coin every 2 seconds
}

function spawnEnemies() {
    setInterval(() => {
        if (enemies.length < maxEnemies) {
            const enemySize = 10;
            const enemyX = getRandomNumber(0, app.renderer.width - enemySize);
            const enemyY = getRandomNumber(0, app.renderer.height - enemySize);
            const enemy = new PIXI.Sprite(PIXI.Loader.shared.resources['enemy'].texture);
            enemy.position.set(enemyX, enemyY);
            app.stage.addChild(enemy);
            enemies.push({ x: enemyX, y: enemyY, size: enemySize, sprite: enemy });
        }
    }, 3000); // Spawn a new enemy every 3 seconds
}

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

function gameOver() {
    // Display game over message and restart button
    const gameOverText = new PIXI.Text('Game Over', { fontFamily: 'Arial', fontSize: 30, fill: 0x000000 });
    gameOverText.position.set(app.renderer.width / 2 - 100, app.renderer.height / 2 - 20);
    app.stage.addChild(gameOverText);
    const restartButton = new PIXI.Text('Restart', { fontFamily: 'Arial', fontSize: 20, fill: 0x000000 });
    restartButton.position.set(app.renderer.width / 2 - 50, app.renderer.height / 2 + 20);
    restartButton.interactive = true;
    restartButton.buttonMode = true;
    restartButton.on('pointerdown', restartGame);
    app.stage.addChild(restartButton);
    // Clear intervals
    clearInterval(coinsInterval);
    clearInterval(enemiesInterval);
}

function restartGame() {
    // Reset game variables and remove game over message and restart button
    app.stage.removeChildren();
    coins = [];
    enemies = [];
    score = 0;
    playerX = 400;
    playerY = 350;
    spawnCoins();
    spawnEnemies();
}

// Utility function to get random number
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Start spawning coins and enemies
const coinsInterval = spawnCoins();
const enemiesInterval = spawnEnemies();

// Display score
const scoreText = new PIXI.Text("Score: " + score + ", " + ver + ", log: " + log1, { fontFamily: 'Arial', fontSize: 20, fill: 0x000000 });
scoreText.position.set(10, 30);
app.stage.addChild(scoreText);
