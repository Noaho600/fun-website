// Page Management
function goToPage(page) {
    const content = document.getElementById('page-content');
    content.innerHTML = '';
    
    switch(page) {
        case 'bounce':
            createBouncePage();
            break;
        case 'draw':
            createDrawPage();
            break;
        case 'paint':
            createPaintPage();
            break;
        case 'music':
            createMusicPage();
            break;
        case 'gravity':
            createGravityPage();
            break;
        case 'mandelbrot':
            createMandelbrotPage();
            break;
        case 'flappy':
            createFlappyPage();
            break;
        case 'snake':
            createSnakePage();
            break;
        case 'breakout':
            createBreakoutPage();
            break;
        case 'pong':
            createPongPage();
            break;
        case 'anniversary':
            createAnniversaryPage();
            break;
    }
    window.scrollTo(0, 0);
}

function backButton() {
    document.getElementById('page-content').innerHTML = '';
    window.scrollTo(0, 0);
}

// BOUNCE PAGE
function createBouncePage() {
    const content = document.getElementById('page-content');
    content.innerHTML = `
        <div class="page">
            <button class="back-button" onclick="backButton()">← Back</button>
            <div class="page-header">
                <h2>🏓 Bounce</h2>
                <p>Click to create bouncing balls</p>
            </div>
            <canvas id="bounceCanvas" width="800" height="600"></canvas>
            <div class="controls">
                <button onclick="resetBounce()">Reset</button>
                <div class="control-group">
                    <label>Gravity:</label>
                    <input type="range" id="gravitySlider" min="0" max="2" step="0.1" value="1" onchange="updateBounceGravity()">
                </div>
            </div>
        </div>
    `;
    
    const canvas = document.getElementById('bounceCanvas');
    const ctx = canvas.getContext('2d');
    let balls = [];
    let gravity = 1;
    
    class Ball {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 8;
            this.vy = (Math.random() - 0.5) * 8;
            this.radius = Math.random() * 10 + 5;
            this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        }
        
        update() {
            this.vy += 0.2 * gravity;
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
                this.vx *= -0.8;
                this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
            }
            if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
                this.vy *= -0.8;
                this.y = Math.max(this.radius, Math.min(canvas.height - this.radius, this.y));
            }
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    function animate() {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        balls.forEach(ball => {
            ball.update();
            ball.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        balls.push(new Ball(x, y));
    });
    
    window.resetBounce = () => {
        balls = [];
    };
    
    window.updateBounceGravity = () => {
        gravity = parseFloat(document.getElementById('gravitySlider').value);
    };
    
    animate();
}

// DRAW PAGE
function createDrawPage() {
    const content = document.getElementById('page-content');
    content.innerHTML = `
        <div class="page">
            <button class="back-button" onclick="backButton()">← Back</button>
            <div class="page-header">
                <h2>🎨 Draw</h2>
                <p>Create art with your mouse</p>
            </div>
            <canvas id="drawCanvas" width="800" height="600"></canvas>
            <div class="controls">
                <button onclick="clearDrawing()">Clear</button>
                <div class="control-group">
                    <label>Color:</label>
                    <input type="color" id="drawColor" value="#6366f1">
                </div>
                <div class="control-group">
                    <label>Size:</label>
                    <input type="range" id="brushSize" min="1" max="50" value="5">
                </div>
            </div>
        </div>
    `;
    
    const canvas = document.getElementById('drawCanvas');
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    let isDrawing = false;
    
    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        ctx.strokeStyle = document.getElementById('drawColor').value;
        ctx.lineWidth = document.getElementById('brushSize').value;
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
    });
    
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseout', () => isDrawing = false);
    
    window.clearDrawing = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
}

// PAINT PAGE
function createPaintPage() {
    const content = document.getElementById('page-content');
    content.innerHTML = `
        <div class="page">
            <button class="back-button" onclick="backButton()">← Back</button>
            <div class="page-header">
                <h2>🖌️ Paint With Particles</h2>
                <p>Leave a trail of colorful particles</p>
            </div>
            <canvas id="paintCanvas" width="800" height="600"></canvas>
        </div>
    `;
    
    const canvas = document.getElementById('paintCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 4;
            this.vy = (Math.random() - 0.5) * 4 - 2;
            this.life = 1;
            this.decay = Math.random() * 0.02 + 0.01;
            this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.1;
            this.life -= this.decay;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.life;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
    
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        for (let i = 0; i < 3; i++) {
            particles.push(new Particle(x, y));
        }
    });
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles = particles.filter(p => p.life > 0);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// MUSIC PAGE
function createMusicPage() {
    const content = document.getElementById('page-content');
    content.innerHTML = `
        <div class="page">
            <button class="back-button" onclick="backButton()">← Back</button>
            <div class="page-header">
                <h2>🎵 Music</h2>
                <p>Press keys to play notes. Use QWERTY for piano.</p>
            </div>
            <div class="keyboard-grid" id="keyboard"></div>
        </div>
    `;
    
    const keys = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C+'];
    const frequencies = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
    const keyMap = {'q': 0, 'w': 1, 'e': 2, 'r': 3, 't': 4, 'y': 5, 'u': 6, 'i': 7};
    
    let audioContext = null;
    let activeOscillators = {};
    
    function getAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return audioContext;
    }
    
    function playNote(frequency, key) {
        if (activeOscillators[key]) return;
        
        const ctx = getAudioContext();
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        
        oscillator.start();
        activeOscillators[key] = { oscillator, gain, ctx };
        
        document.querySelector(`[data-key="${key}"]`)?.classList.add('active');
    }
    
    function stopNote(key) {
        if (!activeOscillators[key]) return;
        
        const { oscillator, gain, ctx } = activeOscillators[key];
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        oscillator.stop(ctx.currentTime + 0.5);
        
        delete activeOscillators[key];
        document.querySelector(`[data-key="${key}"]`)?.classList.remove('active');
    }
    
    const keyboard = document.getElementById('keyboard');
    keys.forEach((key, index) => {
        const keyEl = document.createElement('div');
        keyEl.className = 'key';
        keyEl.textContent = key;
        keyEl.dataset.key = Object.keys(keyMap)[index];
        
        keyEl.addEventListener('mousedown', () => playNote(frequencies[index], keyEl.dataset.key));
        keyEl.addEventListener('mouseup', () => stopNote(keyEl.dataset.key));
        keyEl.addEventListener('mouseleave', () => stopNote(keyEl.dataset.key));
        
        keyboard.appendChild(keyEl);
    });
    
    document.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        if (keyMap[key] !== undefined) {
            playNote(frequencies[keyMap[key]], key);
        }
    });
    
    document.addEventListener('keyup', (e) => {
        const key = e.key.toLowerCase();
        if (keyMap[key] !== undefined) {
            stopNote(key);
        }
    });
}

// GRAVITY PAGE
function createGravityPage() {
    const content = document.getElementById('page-content');
    content.innerHTML = `
        <div class="page">
            <button class="back-button" onclick="backButton()">← Back</button>
            <div class="page-header">
                <h2>🌍 Gravity</h2>
                <p>Move your mouse to attract particles</p>
            </div>
            <canvas id="gravityCanvas" width="800" height="600"></canvas>
        </div>
    `;
    
    const canvas = document.getElementById('gravityCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 3;
            this.vy = (Math.random() - 0.5) * 3;
            this.mass = Math.random() * 2 + 1;
            this.color = `hsl(${Math.random() * 60 + 200}, 100%, 50%)`;
        }
        
        update() {
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 500) {
                const force = (500 - dist) / 500;
                this.vx += (dx / dist) * force * 0.3;
                this.vy += (dy / dist) * force * 0.3;
            }
            
            this.vx *= 0.99;
            this.vy *= 0.99;
            
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            
            this.x = Math.max(0, Math.min(canvas.width, this.x));
            this.y = Math.max(0, Math.min(canvas.height, this.y));
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.mass * 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle(
            Math.random() * canvas.width,
            Math.random() * canvas.height
        ));
    }
    
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });
    
    function animate() {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        ctx.fillStyle = 'rgba(99, 102, 241, 0.5)';
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 20, 0, Math.PI * 2);
        ctx.fill();
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// MANDELBROT PAGE
function createMandelbrotPage() {
    const content = document.getElementById('page-content');
    content.innerHTML = `
        <div class="page">
            <button class="back-button" onclick="backButton()">← Back</button>
            <div class="page-header">
                <h2>🌀 Mandelbrot Set</h2>
                <p>Click to zoom in on the fractal</p>
            </div>
            <canvas id="mandelbrotCanvas" width="800" height="600"></canvas>
            <div class="controls">
                <button onclick="resetMandelbrot()">Reset</button>
            </div>
        </div>
    `;
    
    const canvas = document.getElementById('mandelbrotCanvas');
    const ctx = canvas.getContext('2d');
    
    let zoomLevel = 1;
    let offsetX = 0;
    let offsetY = 0;
    
    function mandelbrot(c, maxIter) {
        let z = { x: 0, y: 0 };
        for (let i = 0; i < maxIter; i++) {
            const x = z.x * z.x - z.y * z.y + c.x;
            const y = 2 * z.x * z.y + c.y;
            z = { x, y };
            
            if (x * x + y * y > 4) return i;
        }
        return maxIter;
    }
    
    window.drawMandelbrot = () => {
        const iterations = 100;
        const imageData = ctx.createImageData(canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let px = 0; px < canvas.width; px++) {
            for (let py = 0; py < canvas.height; py++) {
                const x = (px / canvas.width - 0.5) / zoomLevel + offsetX;
                const y = (py / canvas.height - 0.5) / zoomLevel + offsetY;
                
                const iter = mandelbrot({ x, y }, iterations);
                const hue = (iter / iterations * 360) % 360;
                const brightness = iter < iterations ? 100 : 0;
                
                const rgb = hslToRgb(hue, 100, brightness);
                
                const index = (py * canvas.width + px) * 4;
                data[index] = rgb.r;
                data[index + 1] = rgb.g;
                data[index + 2] = rgb.b;
                data[index + 3] = 255;
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
    };
    
    function hslToRgb(h, s, l) {
        const c = (1 - Math.abs(2 * l / 100 - 1)) * s / 100;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l / 100 - c / 2;
        
        let r = 0, g = 0, b = 0;
        if (h < 60) { r = c; g = x; }
        else if (h < 120) { r = x; g = c; }
        else if (h < 180) { g = c; b = x; }
        else if (h < 240) { g = x; b = c; }
        else if (h < 300) { r = x; b = c; }
        else { r = c; b = x; }
        
        return {
            r: Math.round((r + m) * 255),
            g: Math.round((g + m) * 255),
            b: Math.round((b + m) * 255)
        };
    }
    
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;
        
        offsetX += (px / canvas.width - 0.5) / zoomLevel;
        offsetY += (py / canvas.height - 0.5) / zoomLevel;
        zoomLevel *= 2;
        
        window.drawMandelbrot();
    });
    
    window.resetMandelbrot = () => {
        zoomLevel = 1;
        offsetX = 0;
        offsetY = 0;
        window.drawMandelbrot();
    };
    
    window.drawMandelbrot();
}

// FLAPPY BIRD PAGE
function createFlappyPage() {
    const content = document.getElementById('page-content');
    content.innerHTML = `
        <div class="page">
            <button class="back-button" onclick="backButton()">← Back</button>
            <div class="page-header">
                <h2>🐦 Flappy Bird</h2>
                <p>Click or press SPACE to flap. Avoid the pipes!</p>
            </div>
            <div class="score-display" id="flappyScore">Score: 0</div>
            <canvas id="flappyCanvas" width="400" height="600"></canvas>
            <div class="controls">
                <button onclick="resetFlappy()">Restart</button>
            </div>
        </div>
    `;
    
    const canvas = document.getElementById('flappyCanvas');
    const ctx = canvas.getContext('2d');
    
    let bird = { x: 50, y: canvas.height / 2, vy: 0, width: 20, height: 20 };
    let pipes = [];
    let score = 0;
    let gameOver = false;
    const gravity = 0.6;
    const flapPower = -12;
    
    function update() {
        if (gameOver) return;
        
        bird.vy += gravity;
        bird.y += bird.vy;
        
        if (bird.y + bird.height > canvas.height || bird.y < 0) {
            gameOver = true;
        }
        
        if (Math.random() < 0.01) {
            const gapSize = 100;
            const pipeY = Math.random() * (canvas.height - gapSize - 100) + 50;
            pipes.push({ x: canvas.width, y: pipeY, width: 60, gapSize: gapSize });
        }
        
        pipes.forEach(pipe => {
            pipe.x -= 4;
            
            if (bird.x < pipe.x + pipe.width && bird.x + bird.width > pipe.x) {
                if (bird.y < pipe.y || bird.y + bird.height > pipe.y + pipe.gapSize) {
                    gameOver = true;
                }
            }
            
            if (pipe.x + pipe.width < bird.x && !pipe.scored) {
                score++;
                pipe.scored = true;
                document.getElementById('flappyScore').textContent = `Score: ${score}`;
            }
        });
        
        pipes = pipes.filter(p => p.x + p.width > 0);
    }
    
    function draw() {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#6366f1';
        ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
        
        ctx.fillStyle = '#ec4899';
        pipes.forEach(pipe => {
            ctx.fillRect(pipe.x, 0, pipe.width, pipe.y);
            ctx.fillRect(pipe.x, pipe.y + pipe.gapSize, pipe.width, canvas.height - pipe.y - pipe.gapSize);
        });
        
        if (gameOver) {
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 30px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
            ctx.font = '20px Arial';
            ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 40);
        }
    }
    
    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
    
    canvas.addEventListener('click', () => {
        bird.vy = flapPower;
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            bird.vy = flapPower;
        }
    });
    
    window.resetFlappy = () => {
        bird = { x: 50, y: canvas.height / 2, vy: 0, width: 20, height: 20 };
        pipes = [];
        score = 0;
        gameOver = false;
        document.getElementById('flappyScore').textContent = `Score: 0`;
    };
    
    gameLoop();
}

// SNAKE PAGE
function createSnakePage() {
    const content = document.getElementById('page-content');
    content.innerHTML = `
        <div class="page">
            <button class="back-button" onclick="backButton()">← Back</button>
            <div class="page-header">
                <h2>🐍 Snake</h2>
                <p>Use arrow keys to move. Eat the food and grow!</p>
            </div>
            <div class="score-display" id="snakeScore">Score: 0</div>
            <canvas id="snakeCanvas" width="400" height="400"></canvas>
            <div class="controls">
                <button onclick="resetSnake()">Restart</button>
            </div>
        </div>
    `;
    
    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');
    const gridSize = 20;
    
    let snake = [{x: 10, y: 10}];
    let food = {x: 15, y: 15};
    let direction = {x: 1, y: 0};
    let nextDirection = {x: 1, y: 0};
    let score = 0;
    let gameOver = false;
    
    function update() {
        if (gameOver) return;
        
        direction = nextDirection;
        const head = snake[0];
        const newHead = {x: head.x + direction.x, y: head.y + direction.y};
        
        if (newHead.x < 0 || newHead.x >= canvas.width / gridSize || newHead.y < 0 || newHead.y >= canvas.height / gridSize) {
            gameOver = true;
        }
        
        for (let segment of snake) {
            if (newHead.x === segment.x && newHead.y === segment.y) {
                gameOver = true;
            }
        }
        
        snake.unshift(newHead);
        
        if (newHead.x === food.x && newHead.y === food.y) {
            score++;
            document.getElementById('snakeScore').textContent = `Score: ${score}`;
            food = {x: Math.floor(Math.random() * (canvas.width / gridSize)), y: Math.floor(Math.random() * (canvas.height / gridSize))};
        } else {
            snake.pop();
        }
    }
    
    function draw() {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#6366f1';
        snake.forEach((segment, index) => {
            if (index === 0) ctx.fillStyle = '#ec4899';
            else ctx.fillStyle = '#6366f1';
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
        });
        
        ctx.fillStyle = '#14b8a6';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);
        
        if (gameOver) {
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
            ctx.font = '16px Arial';
            ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 30);
        }
    }
    
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowUp':
                if (direction.y === 0) nextDirection = {x: 0, y: -1};
                break;
            case 'ArrowDown':
                if (direction.y === 0) nextDirection = {x: 0, y: 1};
                break;
            case 'ArrowLeft':
                if (direction.x === 0) nextDirection = {x: -1, y: 0};
                break;
            case 'ArrowRight':
                if (direction.x === 0) nextDirection = {x: 1, y: 0};
                break;
        }
    });
    
    window.resetSnake = () => {
        snake = [{x: 10, y: 10}];
        food = {x: 15, y: 15};
        direction = {x: 1, y: 0};
        nextDirection = {x: 1, y: 0};
        score = 0;
        gameOver = false;
        document.getElementById('snakeScore').textContent = `Score: 0`;
    };
    
    let gameTimer = setInterval(() => {
        if (gameOver) return;
        update();
        draw();
    }, 100);
}

// BREAKOUT PAGE
function createBreakoutPage() {
    const content = document.getElementById('page-content');
    content.innerHTML = `
        <div class="page">
            <button class="back-button" onclick="backButton()">← Back</button>
            <div class="page-header">
                <h2>🧱 Breakout</h2>
                <p>Move your paddle to bounce the ball and break bricks!</p>
            </div>
            <div class="score-display" id="breakoutScore">Score: 0</div>
            <canvas id="breakoutCanvas" width="600" height="400"></canvas>
            <div class="controls">
                <button onclick="resetBreakout()">Restart</button>
            </div>
        </div>
    `;
    
    const canvas = document.getElementById('breakoutCanvas');
    const ctx = canvas.getContext('2d');
    
    let paddle = {x: canvas.width / 2 - 40, y: canvas.height - 20, width: 80, height: 10};
    let ball = {x: canvas.width / 2, y: canvas.height / 2, radius: 6, vx: 3, vy: -3};
    let bricks = [];
    let score = 0;
    let gameOver = false;
    
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 6; col++) {
            bricks.push({x: col * 100, y: row * 20 + 20, width: 95, height: 15, alive: true});
        }
    }
    
    document.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, e.clientX - rect.left - paddle.width / 2));
    });
    
    function update() {
        if (gameOver) return;
        
        ball.x += ball.vx;
        ball.y += ball.vy;
        
        if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) ball.vx *= -1;
        if (ball.y - ball.radius < 0) ball.vy *= -1;
        
        if (ball.y - ball.radius > canvas.height) gameOver = true;
        
        if (ball.y + ball.radius > paddle.y && ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
            ball.vy *= -1;
        }
        
        bricks.forEach(brick => {
            if (brick.alive && ball.x > brick.x && ball.x < brick.x + brick.width && ball.y > brick.y && ball.y < brick.y + brick.height) {
                brick.alive = false;
                ball.vy *= -1;
                score++;
                document.getElementById('breakoutScore').textContent = `Score: ${score}`;
            }
        });
    }
    
    function draw() {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ec4899';
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
        
        ctx.fillStyle = '#6366f1';
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();
        
        bricks.forEach(brick => {
            if (brick.alive) {
                ctx.fillStyle = '#14b8a6';
                ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
            }
        });
        
        if (gameOver) {
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 30px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
            ctx.font = '20px Arial';
            ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 40);
        }
    }
    
    window.resetBreakout = () => {
        paddle = {x: canvas.width / 2 - 40, y: canvas.height - 20, width: 80, height: 10};
        ball = {x: canvas.width / 2, y: canvas.height / 2, radius: 6, vx: 3, vy: -3};
        bricks = [];
        score = 0;
        gameOver = false;
        document.getElementById('breakoutScore').textContent = `Score: 0`;
        
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 6; col++) {
                bricks.push({x: col * 100, y: row * 20 + 20, width: 95, height: 15, alive: true});
            }
        }
    };
    
    setInterval(() => {
        update();
        draw();
    }, 30);
}

// PONG PAGE
function createPongPage() {
    const content = document.getElementById('page-content');
    content.innerHTML = `
        <div class="page">
            <button class="back-button" onclick="backButton()">← Back</button>
            <div class="page-header">
                <h2>🏸 Pong</h2>
                <p>Player 1: W/S keys | Player 2: Arrow Up/Down</p>
            </div>
            <div class="game-info"><span id="p1Score">0</span> - <span id="p2Score">0</span></div>
            <canvas id="pongCanvas" width="800" height="400"></canvas>
        </div>
    `;
    
    const canvas = document.getElementById('pongCanvas');
    const ctx = canvas.getContext('2d');
    
    let p1 = {x: 20, y: canvas.height / 2 - 50, width: 10, height: 100, vy: 0};
    let p2 = {x: canvas.width - 30, y: canvas.height / 2 - 50, width: 10, height: 100, vy: 0};
    let ball = {x: canvas.width / 2, y: canvas.height / 2, radius: 5, vx: 4, vy: 4};
    let p1Score = 0, p2Score = 0;
    let keys = {};
    
    document.addEventListener('keydown', (e) => {
        keys[e.key.toLowerCase()] = true;
    });
    
    document.addEventListener('keyup', (e) => {
        keys[e.key.toLowerCase()] = false;
    });
    
    function update() {
        if (keys['w'] && p1.y > 0) p1.y -= 5;
        if (keys['s'] && p1.y < canvas.height - p1.height) p1.y += 5;
        if (keys['arrowup'] && p2.y > 0) p2.y -= 5;
        if (keys['arrowdown'] && p2.y < canvas.height - p2.height) p2.y += 5;
        
        ball.x += ball.vx;
        ball.y += ball.vy;
        
        if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) ball.vy *= -1;
        
        if (ball.x - ball.radius < p1.x + p1.width && ball.y > p1.y && ball.y < p1.y + p1.height) {
            ball.vx *= -1;
            ball.x = p1.x + p1.width + ball.radius;
        }
        
        if (ball.x + ball.radius > p2.x && ball.y > p2.y && ball.y < p2.y + p2.height) {
            ball.vx *= -1;
            ball.x = p2.x - ball.radius;
        }
        
        if (ball.x - ball.radius < 0) {
            p2Score++;
            document.getElementById('p2Score').textContent = p2Score;
            ball = {x: canvas.width / 2, y: canvas.height / 2, radius: 5, vx: 4, vy: 4};
        }
        
        if (ball.x + ball.radius > canvas.width) {
            p1Score++;
            document.getElementById('p1Score').textContent = p1Score;
            ball = {x: canvas.width / 2, y: canvas.height / 2, radius: 5, vx: -4, vy: 4};
        }
    }
    
    function draw() {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = '#94a3b8';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.fillStyle = '#6366f1';
        ctx.fillRect(p1.x, p1.y, p1.width, p1.height);
        
        ctx.fillStyle = '#ec4899';
        ctx.fillRect(p2.x, p2.y, p2.width, p2.height);
        
        ctx.fillStyle = '#14b8a6';
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    setInterval(() => {
        update();
        draw();
    }, 30);
}

// ANNIVERSARY PAGE
function createAnniversaryPage() {
    const content = document.getElementById('page-content');
    content.innerHTML = `
        <div class="page">
            <button class="back-button" onclick="backButton()">← Back</button>
            <div class="page-header">
                <h2>🎂 1 Year Anniversary! 🎂</h2>
                <p>Thank you for visiting! Let's celebrate with some fireworks!</p>
            </div>
            <canvas id="anniversaryCanvas" width="800" height="600"></canvas>
            <div class="controls">
                <button onclick="location.reload()">Close Celebration</button>
            </div>
        </div>
    `;
    
    const canvas = document.getElementById('anniversaryCanvas');
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    let confetti = [];
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 8;
            this.vy = (Math.random() - 0.5) * 8;
            this.life = 1;
            this.size = Math.random() * 20 + 10;
            this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life -= 0.01;
            this.vy += 0.1;
        }
        
        draw() {
            ctx.globalAlpha = this.life;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    class Confetti {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = -10;
            this.vx = (Math.random() - 0.5) * 3;
            this.vy = Math.random() * 3 + 2;
            this.rotation = Math.random() * Math.PI * 2;
            this.color = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'][Math.floor(Math.random() * 6)];
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.rotation += 0.1;
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.fillStyle = this.color;
            ctx.fillRect(-5, -2, 10, 4);
            ctx.restore();
        }
    }
    
    // Create initial burst
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Create confetti
        if (Math.random() < 0.3) {
            confetti.push(new Confetti());
        }
        
        // Create new particles
        if (Math.random() < 0.2) {
            particles.push(new Particle());
        }
        
        particles = particles.filter(p => p.life > 0);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        confetti = confetti.filter(c => c.y < canvas.height);
        confetti.forEach(c => {
            c.update();
            c.draw();
        });
        
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🎉 THANK YOU! 🎉', canvas.width / 2, 50);
        ctx.font = '20px Arial';
        ctx.fillText('A year of fun and creativity', canvas.width / 2, 90);
        ctx.fillText('Here\'s to many more!', canvas.width / 2, 120);
        
        requestAnimationFrame(animate);
    }
    
    animate();
}
