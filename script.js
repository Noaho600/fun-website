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
                <p>Click and drag to bounce things around</p>
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
    let isDragging = false;
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
                <p>Click to zoom in on the fractal. Scroll to reset zoom level.</p>
            </div>
            <canvas id="mandelbrotCanvas" width="800" height="600"></canvas>
            <div class="controls">
                <button onclick="resetMandelbrot()">Reset</button>
                <div class="control-group">
                    <label>Iterations:</label>
                    <input type="range" id="iterations" min="10" max="500" value="100" onchange="drawMandelbrot()">
                </div>
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
        const iterations = parseInt(document.getElementById('iterations').value);
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