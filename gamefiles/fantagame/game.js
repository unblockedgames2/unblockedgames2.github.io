const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");

        const bird = {
            x: 50,
            y: canvas.height / 2,
            radius: 10,
            gravity: 0.6,
            velocity: 0,
            jump: -6
        };

        let pipes = [];
        const pipeWidth = 50;
        const pipeGap = 275;
        const pipeSpeed = 2.80;
        let score = 0;
        let ver = "1.0.3";

        function drawBird(color) {
            if (color === null) {
                color === "yellow";
                }
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        function drawPipe(x, height) {
            ctx.fillStyle = "green";
            ctx.fillRect(x, 0, pipeWidth, height);
            ctx.fillRect(x, height + pipeGap, pipeWidth, canvas.height - height - pipeGap);
        }

        function drawScore() {
            ctx.fillStyle = "black";
            ctx.font = "24px Arial";
            ctx.fillText("Score: " + score + ", " + ver, 10, 30);
        }

        function update() {
            // Update bird position
            bird.velocity += bird.gravity;
            bird.y += bird.velocity;

            // Generate new pipes
            if (frames % 100 === 0) {
                const height = Math.floor(Math.random() * (canvas.height - pipeGap - 100)) + 50;
                pipes.push({ x: canvas.width, height: height });
            }

            // Update pipe positions
            pipes.forEach((pipe, index) => {
                pipe.x -= pipeSpeed;

                // Check for collision
                if (bird.x + bird.radius > pipe.x && bird.x - bird.radius < pipe.x + pipeWidth && (bird.y - bird.radius < pipe.height || bird.y + bird.radius > pipe.height + pipeGap)) {
                    gameOver();
                }

                // Increment score if bird passes pipe
                if (bird.x > pipe.x + pipeWidth && !pipe.passed) {
                    score++;
                    pipe.passed = true;
                }

                // Remove pipes that are off the screen
                if (pipe.x + pipeWidth < 0) {
                    pipes.splice(index, 1);
                }
            });

            // Check for bird going out of bounds
            if (bird.y + bird.radius > canvas.height || bird.y - bird.radius < 0) {
                gameOver();
            }
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBird("yellow");
            pipes.forEach(pipe => drawPipe(pipe.x, pipe.height));
            drawScore();
        }

        function gameOver() {
            alert("Game Over! Score: " + score);
            reset();
        }

        function reset() {
            bird.y = canvas.height / 2;
            bird.velocity = 0;
            pipes = [];
            score = 0;
        }

        let frames = 0;
        function animate() {
            frames++;
            update();
            draw();
            requestAnimationFrame(animate);
        }

        animate();

        document.addEventListener("keydown", (event) => {
            if (event.key === " ") { // Spacebar for jump
                bird.velocity = bird.jump;
            }
        });