class ThunderstormBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.stars = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.isScrolling = false;
        this.scrollTimeout = null;
        this.scrollParticles = [];
        this.gradient = null;
        this.time = 0;
        this.maxParticles = 40; // Limit max particles
        this.maxScrollParticles = 20; // Limit max scroll particles
        this.isMobile = window.innerWidth <= 768; // Check for mobile device
        
        // Reduce limits for mobile devices
        if (this.isMobile) {
            this.maxParticles = 20;
            this.maxScrollParticles = 10;
        }
        
        this.init();
    }

    init() {
        // Set canvas size
        this.resize();
        window.addEventListener('resize', () => {
            this.resize();
            
            // Update mobile flag and adjust particle limits
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth <= 768;
            
            // If device type changed, update limits
            if (wasMobile !== this.isMobile) {
                if (this.isMobile) {
                    this.maxParticles = 20;
                    this.maxScrollParticles = 10;
                } else {
                    this.maxParticles = 40;
                    this.maxScrollParticles = 20;
                }
            }
        });
        
        // Add canvas to background
        document.getElementById('background-animation').appendChild(this.canvas);
        
        // Create initial elements - fewer on mobile
        const starCount = this.isMobile ? 50 : 100;
        const particleCount = this.isMobile ? 20 : 40;
        
        this.createStars(starCount);
        this.createParticles(particleCount);
        this.createGradient();
        
        // Track mouse movement for interactive effects - less frequent on mobile
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            // Create particles on mouse move occasionally - reduced chance on mobile
            const chance = this.isMobile ? 0.02 : 0.05;
            if (Math.random() < chance) {
                this.createMouseParticles(1);
            }
        });
        
        // Track scrolling for particle effects - fewer particles on mobile
        window.addEventListener('scroll', () => {
            this.isScrolling = true;
            
            // Only create scroll particles if we're under the limit
            if (this.scrollParticles.length < this.maxScrollParticles) {
                const count = this.isMobile ? 1 : 3;
                this.createScrollParticles(count);
            }
            
            // Reset scrolling state after timeout
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = setTimeout(() => {
                this.isScrolling = false;
            }, 100);
        });
        
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
        // Only add particles if we're under the limit
        const availableSlots = this.maxParticles - this.particles.length;
        const actualCount = Math.min(count, availableSlots);
        
        for (let i = 0; i < actualCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2.5 + 0.5, // Slightly smaller
                color: `rgba(${Math.random() * 20 + 100}, ${Math.random() * 20 + 150}, ${Math.random() * 50 + 200}, ${Math.random() * 0.2 + 0.1})`, // Lower opacity
                speedX: Math.random() * 0.15 - 0.075, // Slower
                speedY: Math.random() * 0.15 - 0.075, // Slower
                life: Math.random() * 100 + 100
            });
        }
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
        
        // Add new particles occasionally, but respect the limit
        if (Math.random() < 0.02 && this.particles.length < this.maxParticles) { // Reduced from 0.05
            this.createParticles(1);
        }
    }

    drawBackground() {
        // Base dark background with gradient
        this.ctx.fillStyle = this.gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Add subtle vignette effect for lofi aesthetic
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, 0,
            this.canvas.width / 2, this.canvas.height / 2, this.canvas.width * 0.8
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Add noise texture for lofi effect - even more reduced on mobile
        const noiseDensity = this.isMobile ? 0.0005 : 0.001;
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
        for (let i = 0; i < this.canvas.width * this.canvas.height * noiseDensity; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const size = Math.random() * 1 + 0.5;
            this.ctx.fillRect(x, y, size, size);
        }
    }

    createMouseParticles(count) {
        // Only add particles if we're under the limit
        if (this.particles.length >= this.maxParticles) return;
        
        const availableSlots = this.maxParticles - this.particles.length;
        const actualCount = Math.min(count, availableSlots);
        
        for (let i = 0; i < actualCount; i++) {
            this.particles.push({
                x: this.mouseX + (Math.random() * 30 - 15), // Reduced radius
                y: this.mouseY + (Math.random() * 30 - 15), // Reduced radius
                radius: Math.random() * 1.5 + 0.5, // Smaller
                color: `rgba(${Math.random() * 20 + 160}, ${Math.random() * 20 + 140}, ${Math.random() * 50 + 200}, ${Math.random() * 0.3 + 0.2})`, // Lower opacity
                speedX: Math.random() * 0.8 - 0.4, // Slower
                speedY: Math.random() * 0.8 - 0.4, // Slower
                life: Math.random() * 20 + 15 // Shorter life
            });
        }
    }
    
    createScrollParticles(count) {
        // Only add particles if we're under the limit
        const currentLength = this.scrollParticles.length;
        if (currentLength >= this.maxScrollParticles) return;
        
        const availableSlots = this.maxScrollParticles - currentLength;
        const actualCount = Math.min(count, Math.ceil(availableSlots / 2));
        
        for (let i = 0; i < actualCount; i++) {
            // Left side particles
            if (this.scrollParticles.length < this.maxScrollParticles) {
                this.scrollParticles.push({
                    x: Math.random() * this.canvas.width * 0.2, // Reduced from 0.3
                    y: Math.random() * this.canvas.height,
                    radius: Math.random() * 2 + 0.5, // Smaller
                    color: `rgba(${Math.random() * 20 + 160}, ${Math.random() * 20 + 140}, ${Math.random() * 50 + 200}, ${Math.random() * 0.3 + 0.1})`, // Lower opacity
                    speedX: Math.random() * 0.7 + 0.3, // Slower
                    speedY: Math.random() * 1.5 - 0.75, // Slower
                    life: Math.random() * 40 + 15 // Shorter life
                });
            }
            
            // Right side particles
            if (this.scrollParticles.length < this.maxScrollParticles) {
                this.scrollParticles.push({
                    x: this.canvas.width - (Math.random() * this.canvas.width * 0.2),
                    y: Math.random() * this.canvas.height,
                    radius: Math.random() * 2 + 0.5,
                    color: `rgba(${Math.random() * 20 + 160}, ${Math.random() * 20 + 140}, ${Math.random() * 50 + 200}, ${Math.random() * 0.3 + 0.1})`,
                    speedX: -(Math.random() * 0.7 + 0.3),
                    speedY: Math.random() * 1.5 - 0.75,
                    life: Math.random() * 40 + 15
                });
            }
        }
    }
    
    drawScrollParticles() {
        // Update and draw scroll particles
        this.scrollParticles = this.scrollParticles.filter(particle => {
            particle.life -= 1;
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Fade out as they get closer to center
            const distanceFromCenterX = Math.abs(particle.x - this.canvas.width/2) / (this.canvas.width/2);
            const opacity = distanceFromCenterX * 0.3; // Reduced opacity
            
            if (particle.life > 0) {
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                
                // Extract RGB from color and create new color with calculated opacity
                const rgbMatch = particle.color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/);
                if (rgbMatch) {
                    const [_, r, g, b] = rgbMatch;
                    this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
                } else {
                    this.ctx.fillStyle = particle.color;
                }
                
                this.ctx.fill();
                return true;
            }
            return false;
        });
        
        // Add new particles while scrolling, but respect limits
        if (this.isScrolling && Math.random() < 0.1 && this.scrollParticles.length < this.maxScrollParticles) { // Reduced from 0.2
            this.createScrollParticles(1); // Reduced from 2
        }
    }

    animate() {
        // Slow down animation frame rate on mobile for better performance
        if (this.isMobile) {
            this.time += 0.005; // Half speed on mobile
        } else {
            this.time += 0.01;
        }
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawBackground();
        this.drawStars();
        this.drawParticles();
        this.drawScrollParticles();
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize the background
document.addEventListener('DOMContentLoaded', () => {
    new ThunderstormBackground();
});
