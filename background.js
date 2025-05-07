class ThunderstormBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.raindrops = [];
        this.lightning = [];
        this.particles = [];
        this.stars = [];
        this.lastLightning = 0;
        this.lightningInterval = 5000; // Time between lightning strikes in ms
        this.lightningChance = 0.3; // Chance of lightning on interval
        this.bgColor = 'rgba(25, 25, 38, 0.9)'; // Deep indigo background for lofi aesthetic
        this.gradient = null;
        this.time = 0;
        
        this.init();
    }

    init() {
        // Set canvas size
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Add canvas to background
        document.getElementById('background-animation').appendChild(this.canvas);
        
        // Create initial elements
        this.createRaindrops(150);
        this.createStars(100);
        this.createParticles(50);
        this.createGradient();
        
        // Start animation
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createGradient(); // Recreate gradient on resize
    }

    createGradient() {
        // Create a gradient for the lofi background
        this.gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        this.gradient.addColorStop(0, 'rgba(25, 25, 38, 1)');
        this.gradient.addColorStop(0.5, 'rgba(32, 32, 50, 1)');
        this.gradient.addColorStop(1, 'rgba(20, 20, 30, 1)');
    }

    createStars(count) {
        this.stars = [];
        for (let i = 0; i < count; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height * 0.7, // Stars only in top 70% of screen
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.5 + 0.3,
                pulse: Math.random() * 0.02 + 0.01,
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    createParticles(count) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 3 + 1,
                color: `rgba(${Math.random() * 20 + 100}, ${Math.random() * 20 + 150}, ${Math.random() * 50 + 200}, ${Math.random() * 0.3 + 0.1})`,
                speedX: Math.random() * 0.2 - 0.1,
                speedY: Math.random() * 0.2 - 0.1,
                life: Math.random() * 100 + 100
            });
        }
    }

    createRaindrops(count) {
        for (let i = 0; i < count; i++) {
            this.raindrops.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                length: Math.random() * 15 + 5, // Shorter for lofi style
                speed: Math.random() * 10 + 10, // Slower for lofi style
                thickness: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.2 + 0.1 // More transparent for lofi style
            });
        }
    }

    createLightning() {
        // Multiple branches of lightning
        const mainStartX = Math.random() * this.canvas.width;
        const mainStartY = 0;
        
        const mainLightning = this.generateLightningBranch(mainStartX, mainStartY, mainStartX + (Math.random() * 400 - 200), this.canvas.height * 0.7);
        
        // Create 2-3 branches
        const branchCount = Math.floor(Math.random() * 2) + 2;
        const branches = [mainLightning];
        
        for (let i = 0; i < branchCount; i++) {
            // Pick a random point from the main branch to start a new branch
            const branchPoint = Math.floor(Math.random() * (mainLightning.length - 2)) + 1;
            const startX = mainLightning[branchPoint].x;
            const startY = mainLightning[branchPoint].y;
            
            // Create branch with random endpoint
            const endX = startX + (Math.random() * 300 - 150);
            const endY = startY + (Math.random() * 200 + 100);
            
            if (endY < this.canvas.height) {
                branches.push(this.generateLightningBranch(startX, startY, endX, endY));
            }
        }
        
        // Create extra particles at lightning contact points
        for (let i = 0; i < 15; i++) {
            const branchIndex = Math.floor(Math.random() * branches.length);
            const pointIndex = Math.floor(Math.random() * branches[branchIndex].length);
            const point = branches[branchIndex][pointIndex];
            
            this.particles.push({
                x: point.x,
                y: point.y,
                radius: Math.random() * 4 + 2,
                color: `rgba(${Math.random() * 20 + 180}, ${Math.random() * 20 + 200}, ${Math.random() * 20 + 230}, ${Math.random() * 0.3 + 0.6})`,
                speedX: Math.random() * 4 - 2,
                speedY: Math.random() * 4 - 2,
                life: Math.random() * 30 + 20
            });
        }
        
        // Flash effect
        this.lightningFlash();
        
        this.lightning.push({
            branches: branches,
            opacity: 1,
            life: 0,
            color: Math.random() > 0.7 ? 'purple' : 'normal' // Occasional purple lightning for lofi aesthetic
        });
    }

    generateLightningBranch(startX, startY, endX, endY) {
        const points = [{x: startX, y: startY}];
        const segmentCount = Math.floor(Math.random() * 4) + 6;
        const segmentLength = (endY - startY) / segmentCount;
        
        let currentX = startX;
        let currentY = startY;
        
        for (let i = 1; i <= segmentCount; i++) {
            // Calculate displacement based on segment distance from start (more displacement in middle)
            const displacementFactor = Math.sin((i / segmentCount) * Math.PI);
            const displacement = displacementFactor * (Math.random() * 80 + 30);
            
            currentX = currentX + (Math.random() * displacement * 2 - displacement);
            currentY = startY + (segmentLength * i);
            
            points.push({x: currentX, y: currentY});
        }
        
        // Add endpoint
        points.push({x: endX, y: endY});
        return points;
    }

    lightningFlash() {
        // Create a flash effect that briefly illuminates the scene
        this.flash = 1; // Full brightness
    }

    drawStars() {
        this.stars.forEach(star => {
            const pulseValue = Math.sin(star.phase + this.time * star.pulse);
            const opacity = star.opacity + pulseValue * 0.2;
            
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            this.ctx.fill();
        });
    }

    drawParticles() {
        // Update and draw particles
        this.particles = this.particles.filter(particle => {
            particle.life -= 1;
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            if (particle.life > 0) {
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = particle.color;
                this.ctx.fill();
                return true;
            }
            return false;
        });
        
        // Add new particles occasionally
        if (Math.random() < 0.05) {
            this.createParticles(1);
        }
    }

    drawRain() {
        this.ctx.strokeStyle = 'rgba(150, 170, 230, 0.6)';
        
        this.raindrops.forEach(drop => {
            this.ctx.beginPath();
            this.ctx.moveTo(drop.x, drop.y);
            this.ctx.lineTo(drop.x, drop.y + drop.length);
            this.ctx.lineWidth = drop.thickness;
            this.ctx.globalAlpha = drop.opacity;
            this.ctx.stroke();
            
            // Move the raindrop
            drop.y += drop.speed;
            
            // Reset if off screen
            if (drop.y > this.canvas.height) {
                drop.y = 0 - drop.length;
                drop.x = Math.random() * this.canvas.width;
            }
        });
        
        this.ctx.globalAlpha = 1;
    }

    drawLightning() {
        const now = Date.now();
        
        // Check if it's time for a lightning strike
        if (now - this.lastLightning > this.lightningInterval) {
            if (Math.random() < this.lightningChance) {
                this.createLightning();
            }
            this.lastLightning = now;
        }
        
        // Draw and update existing lightning
        this.lightning = this.lightning.filter(bolt => {
            bolt.life += 0.1;
            bolt.opacity = Math.max(0, 1 - bolt.life * 2); // Fade out faster
            
            if (bolt.opacity > 0) {
                // Draw each branch
                bolt.branches.forEach(branch => {
                    // Color based on lightning type
                    const mainColor = bolt.color === 'purple' 
                                  ? `rgba(180, 100, 255, ${bolt.opacity})` 
                                  : `rgba(255, 255, 255, ${bolt.opacity})`;
                    const glowColor = bolt.color === 'purple' 
                                  ? `rgba(150, 70, 200, ${bolt.opacity * 0.6})` 
                                  : `rgba(180, 225, 255, ${bolt.opacity * 0.6})`;
                    
                    // Main bright line
                    this.ctx.beginPath();
                    this.ctx.moveTo(branch[0].x, branch[0].y);
                    
                    for (let i = 1; i < branch.length; i++) {
                        this.ctx.lineTo(branch[i].x, branch[i].y);
                    }
                    
                    this.ctx.strokeStyle = mainColor;
                    this.ctx.lineWidth = 3;
                    this.ctx.stroke();
                    
                    // Outer glow
                    this.ctx.beginPath();
                    this.ctx.moveTo(branch[0].x, branch[0].y);
                    
                    for (let i = 1; i < branch.length; i++) {
                        this.ctx.lineTo(branch[i].x, branch[i].y);
                    }
                    
                    this.ctx.strokeStyle = glowColor;
                    this.ctx.lineWidth = 8;
                    this.ctx.stroke();
                });
            }
            
            return bolt.opacity > 0;
        });
        
        // Update flash effect
        if (this.flash > 0) {
            this.flash -= 0.05;
        }
    }

    drawBackground() {
        // Base dark background with gradient
        this.ctx.fillStyle = this.gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Add flash overlay if lightning is active
        if (this.flash > 0) {
            const flashColor = this.lightning.length > 0 && this.lightning[0].color === 'purple' 
                            ? `rgba(120, 80, 160, ${this.flash * 0.2})` 
                            : `rgba(120, 160, 220, ${this.flash * 0.2})`;
            this.ctx.fillStyle = flashColor;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        
        // Add subtle vignette effect for lofi aesthetic
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, 0,
            this.canvas.width / 2, this.canvas.height / 2, this.canvas.width * 0.8
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Add noise texture for lofi effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
        for (let i = 0; i < this.canvas.width * this.canvas.height * 0.002; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const size = Math.random() * 1.5 + 0.5;
            this.ctx.fillRect(x, y, size, size);
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.time += 0.01;
        
        this.drawBackground();
        this.drawStars();
        this.drawLightning();
        this.drawRain();
        this.drawParticles();
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize the background
new ThunderstormBackground(); 
