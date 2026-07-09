let currentGame = null;
let gameRunning = true;

function navigateTo(game) {
    document.getElementById('home-page').style.display = 'none';
    document.getElementById('game-page').style.display = 'flex';
    document.getElementById('game-page').style.flexDirection = 'column';
    currentGame = game;
    gameRunning = true;
    
    const gameInfo = {
        bounce: { title: '🏓 Bounce', info: 'Click to create balls' },
        draw: { title: '🎨 Draw', info: 'Free drawing' },
        paint: { title: '🖌️ Paint Particles', info: 'Trail effect' },
        music: { title: '🎵 Music', info: 'Play piano' },
        gravity: { title: '🌍 Gravity Field', info: 'Attract particles' },
        mandelbrot: { title: '🌀 Mandelbrot', info: 'Zoom fractal' },
        flappybird: { title: '🐦 Flappy Bird', info: 'Score: <span id="score">0</span>' },
        snake: { title: '🐍 Snake Master', info: 'Score: <span id="score">0</span>' },
        spaceraid: { title: '🛸 Space Raid', info: 'Score: <span id="score">0</span>' },
        colorclash: { title: '🎯 Color Clash', info: 'Score: <span id="score">0</span>' },
        puzzleblast: { title: '💥 Puzzle Blast', info: 'Score: <span id="score">0</span>' },
        infinityrun: { title: '🏃 Infinity Run', info: 'Score: <span id="score">0</span>' },
        anniversary: { title: '🎂 1 Year Anniversary', info: '🎉 Celebration!' }
    };
    
    document.getElementById('game-title').textContent = gameInfo[game].title;
    document.getElementById('game-info').innerHTML = gameInfo[game].info;
    document.getElementById('game-container').innerHTML = '';
    
    switch(game) {
        case 'bounce': createBouncePage(); break;
        case 'draw': createDrawPage(); break;
        case 'paint': createPaintPage(); break;
        case 'music': createMusicPage(); break;
        case 'gravity': createGravityPage(); break;
        case 'mandelbrot': createMandelbrotPage(); break;
        case 'flappybird': createFlappyBirdPage(); break;
        case 'snake': createSnakePage(); break;
        case 'spaceraid': createSpaceRaidPage(); break;
        case 'colorclash': createColorClashPage(); break;
        case 'puzzleblast': createPuzzleBlastPage(); break;
        case 'infinityrun': createInfinityRunPage(); break;
        case 'anniversary': createAnniversaryPage(); break;
    }
}

function goHome() {
    gameRunning = false;
    document.getElementById('home-page').style.display = 'block';
    document.getElementById('game-page').style.display = 'none';
    document.getElementById('game-container').innerHTML = '';
}

function updateScore(score) {
    const scoreEl = document.getElementById('score');
    if (scoreEl) scoreEl.textContent = score;
}

// BOUNCE PAGE
function createBouncePage() {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    document.getElementById('game-container').appendChild(canvas);
    
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
        if (!gameRunning) return;
        ctx.fillStyle = 'rgba(10, 14, 39, 0.3)';
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
    
    animate();
}

// DRAW PAGE
function createDrawPage() {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    document.getElementById('game-container').appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    let isDrawing = false;
    let color = '#6366f1';
    let size = 5;
    
    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
    });
    
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseout', () => isDrawing = false);
    
    const controls = document.createElement('div');
    controls.className = 'controls';
    controls.innerHTML = `
        <button onclick="const c = document.querySelector('canvas'); c.getContext('2d').clearRect(0, 0, c.width, c.height);">Clear</button>
        <div class="control-group">
            <label>Color:</label>
            <input type="color" id="drawColor" value="#6366f1" onchange="color = this.value;">
        </div>
        <div class="control-group">
            <label>Size:</label>
            <input type="range" id="brushSize" min="1" max="50" value="5" onchange="size = this.value;">
        </div>
    `;
    document.getElementById('game-container').appendChild(controls);
}

// PAINT PAGE
function createPaintPage() {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    document.getElementById('game-container').appendChild(canvas);
    
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
            this.size = Math.random() * 4 + 2;
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
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
    
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        for (let i = 0; i < 5; i++) {
            particles.push(new Particle(x, y));
        }
    });
    
    function animate() {
        if (!gameRunning) return;
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
    const container = document.getElementById('game-container');
    const keyboard = document.createElement('div');
    keyboard.className = 'keyboard-grid';
    
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
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        oscillator.stop(ctx.currentTime + 0.5);
        
        delete activeOscillators[key];
        document.querySelector(`[data-key="${key}"]`)?.classList.remove('active');
    }
    
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
        if (keyMap[key] !== undefined) playNote(frequencies[keyMap[key]], key);
    });
    
    document.addEventListener('keyup', (e) => {
        const key = e.key.toLowerCase();
        if (keyMap[key] !== undefined) stopNote(key);
    });
    
    container.appendChild(keyboard);
}

// GRAVITY PAGE
function createGravityPage() {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    document.getElementById('game-container').appendChild(canvas);
    
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
        if (!gameRunning) return;
        ctx.fillStyle = 'rgba(10, 14, 39, 0.2)';
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
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    document.getElementById('game-container').appendChild(canvas);
    
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
    
    function drawMandelbrot() {
        if (!gameRunning) return;
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
    }
    
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
        
        drawMandelbrot();
    });
    
    drawMandelbrot();
}

// FLAPPY BIRD PAGE
function createFlappyBirdPage() {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 600;
    document.getElementById('game-container').appendChild(canvas);
    
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
        
        if (bird.y + bird.height > canvas.height || bird.y < 0) gameOver = true;
        
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
                updateScore(score);
            }
        });
        
        pipes = pipes.filter(p => p.x + p.width > 0);
    }
    
    function draw() {
        ctx.fillStyle = '#1a1f3a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#6366f1';
        ctx.beginPath();
        ctx.arc(bird.x + bird.width / 2, bird.y + bird.height / 2, bird.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
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
        if (!gameRunning) return;
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
    
    canvas.addEventListener('click', () => {
        if (!gameOver) bird.vy = flapPower;
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            if (!gameOver) bird.vy = flapPower;
        }
    });
    
    gameLoop();
}

// SNAKE PAGE
function createSnakePage() {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    document.getElementById('game-container').appendChild(canvas);
    
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
            updateScore(score);
            food = {x: Math.floor(Math.random() * (canvas.width / gridSize)), y: Math.floor(Math.random() * (canvas.height / gridSize))};
        } else {
            snake.pop();
        }
    }
    
    function draw() {
        ctx.fillStyle = '#1a1f3a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        snake.forEach((segment, index) => {
            ctx.fillStyle = index === 0 ? '#14b8a6' : '#6366f1';
            ctx.fillRect(segment.x * gridSize + 2, segment.y * gridSize + 2, gridSize - 4, gridSize - 4);
        });
        
        ctx.fillStyle = '#ec4899';
        ctx.fillRect(food.x * gridSize + 2, food.y * gridSize + 2, gridSize - 4, gridSize - 4);
        
        if (gameOver) {
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
            ctx.font = '16px Arial';
            ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 30);
        }
    }
    
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowUp': if (direction.y === 0) nextDirection = {x: 0, y: -1}; break;
            case 'ArrowDown': if (direction.y === 0) nextDirection = {x: 0, y: 1}; break;
            case 'ArrowLeft': if (direction.x === 0) nextDirection = {x: -1, y: 0}; break;
            case 'ArrowRight': if (direction.x === 0) nextDirection = {x: 1, y: 0}; break;
        }
    });
    
    let gameTimer = setInterval(() => {
        if (!gameRunning) {
            clearInterval(gameTimer);
            return;
        }
        update();
        draw();
    }, 100);
}

// SPACE RAID PAGE
function createSpaceRaidPage() {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 500;
    document.getElementById('game-container').appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    let player = {x: canvas.width / 2, y: canvas.height - 40, width: 30, height: 30, vx: 0};
    let bullets = [];
    let enemies = [];
    let score = 0;
    let gameOver = false;
    let keys = {};
    
    document.addEventListener('keydown', (e) => {
        keys[e.key] = true;
        if (e.key === ' ') {
            e.preventDefault();
            bullets.push({x: player.x + player.width / 2, y: player.y, width: 5, height: 10, vy: -8});
        }
    });
    
    document.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });
    
    function update() {
        if (gameOver) return;
        
        if (keys['ArrowLeft'] || keys['a']) player.x = Math.max(0, player.x - 5);
        if (keys['ArrowRight'] || keys['d']) player.x = Math.min(canvas.width - player.width, player.x + 5);
        
        bullets.forEach((bullet, i) => {
            bullet.y += bullet.vy;
            if (bullet.y < 0) bullets.splice(i, 1);
        });
        
        if (Math.random() < 0.02) {
            enemies.push({
                x: Math.random() * (canvas.width - 30),
                y: -30,
                width: 30,
                height: 30,
                vy: 2 + score / 1000
            });
        }
        
        enemies.forEach((enemy, i) => {
            enemy.y += enemy.vy;
            
            bullets.forEach((bullet, j) => {
                if (bullet.x < enemy.x + enemy.width &&
                    bullet.x + bullet.width > enemy.x &&
                    bullet.y < enemy.y + enemy.height &&
                    bullet.y + bullet.height > enemy.y) {
                    enemies.splice(i, 1);
                    bullets.splice(j, 1);
                    score++;
                    updateScore(score);
                }
            });
            
            if (enemy.y > canvas.height) gameOver = true;
        });
    }
    
    function draw() {
        ctx.fillStyle = '#1a1f3a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw stars
        ctx.fillStyle = '#94a3b8';
        for (let i = 0; i < 100; i++) {
            ctx.fillRect(Math.sin(i) * 300, (i * 7) % canvas.height, 1, 1);
        }
        
        // Draw player
        ctx.fillStyle = '#14b8a6';
        ctx.beginPath();
        ctx.moveTo(player.x + player.width / 2, player.y);
        ctx.lineTo(player.x + player.width, player.y + player.height);
        ctx.lineTo(player.x, player.y + player.height);
        ctx.closePath();
        ctx.fill();
        
        // Draw bullets
        ctx.fillStyle = '#fbbf24';
        bullets.forEach(bullet => {
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
        
        // Draw enemies
        ctx.fillStyle = '#ef4444';
        enemies.forEach(enemy => {
            ctx.beginPath();
            ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.width / 2, 0, Math.PI * 2);
            ctx.fill();
        });
        
        if (gameOver) {
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 30px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
            ctx.font = '20px Arial';
            ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 40);
        }
    }
    
    function gameLoop() {
        if (!gameRunning) return;
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
    
    gameLoop();
}

// COLOR CLASH PAGE
function createColorClashPage() {
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 500;
    document.getElementById('game-container').appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    const colors = ['#6366f1', '#ec4899', '#14b8a6', '#fbbf24', '#ef4444', '#10b981'];
    let gridSize = 4;
    let grid = [];
    let score = 0;
    let gameOver = false;
    let moves = 30;
    
    function initGrid() {
        grid = [];
        for (let i = 0; i < gridSize; i++) {
            grid[i] = [];
            for (let j = 0; j < gridSize; j++) {
                grid[i][j] = colors[Math.floor(Math.random() * colors.length)];
            }
        }
    }
    
    function draw() {
        ctx.fillStyle = '#1a1f3a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const cellSize = canvas.width / gridSize;
        
        grid.forEach((row, i) => {
            row.forEach((color, j) => {
                ctx.fillStyle = color;
                ctx.fillRect(j * cellSize + 2, i * cellSize + 2, cellSize - 4, cellSize - 4);
            });
        });
        
        // Draw score
        ctx.fillStyle = '#14b8a6';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Score: ${score}  Moves: ${moves}`, 10, 20);
        
        if (moves <= 0 || gameOver) {
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
            ctx.font = '20px Arial';
            ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 40);
        }
    }
    
    canvas.addEventListener('click', (e) => {
        if (moves <= 0) return;
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / (canvas.width / gridSize));
        const y = Math.floor((e.clientY - rect.top) / (canvas.width / gridSize));
        
        if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
            const targetColor = grid[y][x];
            let matchCount = 0;
            
            function floodFill(i, j, targetColor) {
                if (i < 0 || i >= gridSize || j < 0 || j >= gridSize || grid[i][j] !== targetColor) return;
                grid[i][j] = null;
                matchCount++;
                floodFill(i - 1, j, targetColor);
                floodFill(i + 1, j, targetColor);
                floodFill(i, j - 1, targetColor);
                floodFill(i, j + 1, targetColor);
            }
            
            floodFill(y, x, targetColor);
            
            // Drop blocks
            for (let j = 0; j < gridSize; j++) {
                let writePos = gridSize - 1;
                for (let i = gridSize - 1; i >= 0; i--) {
                    if (grid[i][j] !== null) {
                        grid[writePos][j] = grid[i][j];
                        if (writePos !== i) grid[i][j] = null;
                        writePos--;
                    }
                }
            }
            
            // Fill gaps
            for (let i = 0; i < gridSize; i++) {
                for (let j = 0; j < gridSize; j++) {
                    if (grid[i][j] === null) {
                        grid[i][j] = colors[Math.floor(Math.random() * colors.length)];
                    }
                }
            }
            
            score += matchCount * matchCount;
            moves--;
            updateScore(score);
        }
    });
    
    initGrid();
    let gameTimer = setInterval(() => {
        if (!gameRunning) {
            clearInterval(gameTimer);
            return;
        }
        draw();
    }, 50);
}

// PUZZLE BLAST PAGE
function createPuzzleBlastPage() {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 500;
    document.getElementById('game-container').appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    const blockSize = 40;
    const cols = Math.floor(canvas.width / blockSize);
    const rows = Math.floor(canvas.height / blockSize);
    
    let blocks = [];
    let score = 0;
    
    function initBlocks() {
        blocks = [];
        for (let i = 0; i < rows; i++) {
            blocks[i] = [];
            for (let j = 0; j < cols; j++) {
                blocks[i][j] = Math.random() > 0.3 ? Math.floor(Math.random() * 5) : -1;
            }
        }
    }
    
    function draw() {
        ctx.fillStyle = '#1a1f3a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const blockColors = ['#6366f1', '#ec4899', '#14b8a6', '#fbbf24', '#ef4444'];
        
        blocks.forEach((row, i) => {
            row.forEach((block, j) => {
                if (block >= 0) {
                    ctx.fillStyle = blockColors[block];
                    ctx.fillRect(j * blockSize + 2, i * blockSize + 2, blockSize - 4, blockSize - 4);
                    ctx.fillStyle = '#fff';
                    ctx.font = 'bold 16px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(block + 1, j * blockSize + blockSize / 2, i * blockSize + blockSize / 2 + 6);
                }
            });
        });
        
        ctx.fillStyle = '#14b8a6';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Score: ${score}`, 10, 20);
    }
    
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / blockSize);
        const y = Math.floor((e.clientY - rect.top) / blockSize);
        
        if (x >= 0 && x < cols && y >= 0 && y < rows && blocks[y][x] >= 0) {
            blocks[y][x]--;
            if (blocks[y][x] < 0) {
                score += 10;
                updateScore(score);
            }
        }
    });
    
    initBlocks();
    let gameTimer = setInterval(() => {
        if (!gameRunning) {
            clearInterval(gameTimer);
            return;
        }
        draw();
    }, 50);
}

// INFINITY RUN PAGE
function createInfinityRunPage() {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    document.getElementById('game-container').appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    let player = {x: canvas.width / 2, y: canvas.height - 60, width: 25, height: 30, vy: 0, jumping: false};
    let obstacles = [];
    let score = 0;
    let gameOver = false;
    let speed = 3;
    
    document.addEventListener('keydown', (e) => {
        if ((e.key === ' ' || e.code === 'Space') && !player.jumping) {
            e.preventDefault();
            player.vy = -15;
            player.jumping = true;
        }
    });
    
    function update() {
        if (gameOver) return;
        
        // Gravity
        player.vy += 0.6;
        player.y += player.vy;
        
        // Ground collision
        if (player.y + player.height >= canvas.height - 20) {
            player.y = canvas.height - player.height - 20;
            player.jumping = false;
            player.vy = 0;
        }
        
        // Spawn obstacles
        if (Math.random() < 0.03) {
            obstacles.push({
                x: canvas.width,
                y: canvas.height - 40,
                width: 20,
                height: 40
            });
        }
        
        // Update obstacles
        obstacles.forEach((obs, i) => {
            obs.x -= speed;
            
            if (player.x < obs.x + obs.width &&
                player.x + player.width > obs.x &&
                player.y < obs.y + obs.height &&
                player.y + player.height > obs.y) {
                gameOver = true;
            }
            
            if (obs.x < -50) obstacles.splice(i, 1);
        });
        
        score++;
        speed = 3 + score / 2000;
        updateScore(Math.floor(score / 10));
    }
    
    function draw() {
        ctx.fillStyle = '#1a1f3a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Ground
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
        
        // Player
        ctx.fillStyle = '#14b8a6';
        ctx.fillRect(player.x, player.y, player.width, player.height);
        
        // Obstacles
        ctx.fillStyle = '#ef4444';
        obstacles.forEach(obs => {
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        });
        
        if (gameOver) {
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 30px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
            ctx.font = '20px Arial';
            ctx.fillText(`Distance: ${Math.floor(score / 10)}`, canvas.width / 2, canvas.height / 2 + 40);
        }
    }
    
    function gameLoop() {
        if (!gameRunning) return;
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
    
    gameLoop();
}

// ANNIVERSARY PAGE
function createAnniversaryPage() {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    document.getElementById('game-container').appendChild(canvas);
    
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
    
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        if (!gameRunning) return;
        ctx.fillStyle = 'rgba(10, 14, 39, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        if (Math.random() < 0.3) {
            confetti.push(new Confetti());
        }
        
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
        ctx.font = 'bold 50px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🎉 THANK YOU! 🎉', canvas.width / 2, 50);
        ctx.font = 'bold 30px Arial';
        ctx.fillText('1 Year of Fun!', canvas.width / 2, 110);
        ctx.font = '24px Arial';
        ctx.fillText('Here\'s to many more amazing experiences', canvas.width / 2, 160);
        
        requestAnimationFrame(animate);
    }
    
    animate();
}
