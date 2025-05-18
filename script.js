// Custom cursor
document.addEventListener('DOMContentLoaded', () => {
    // Initialize DOM elements
    const cursor = document.querySelector('.custom-cursor');
    const loadingScreen = document.getElementById('loadingScreen');
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');
    const navLinks = document.querySelector('.nav-links');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const heroDescription = document.querySelector('.description');
    const heroSubDescription = document.querySelector('.sub-description');
    const heroName = document.querySelector('.name');
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    
    // Custom cursor movement
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    document.addEventListener('mousedown', () => {
        cursor.classList.add('click');
        setTimeout(() => {
            cursor.classList.remove('click');
        }, 300);
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxLayers.forEach(layer => {
            const speed = layer.getAttribute('data-speed');
            const yPos = -(scrolled * speed);
            layer.style.transform = `translateY(${yPos}px)`;
        });
    });
    
    // Hero section mouse move parallax
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const moveX = (e.clientX / window.innerWidth - 0.5) * 20;
            const moveY = (e.clientY / window.innerHeight - 0.5) * 20;
            
            parallaxLayers.forEach(layer => {
                const speed = layer.getAttribute('data-speed');
                const xPos = moveX * speed * 2;
                const yPos = moveY * speed * 2;
                layer.style.transform = `translate(${xPos}px, ${yPos}px)`;
            });
            
            // Also move the hero content slightly for parallax effect
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.transform = `translate(${-moveX * 0.1}px, ${-moveY * 0.1}px)`;
            }
        });
        
        // Reset position when mouse leaves
        heroSection.addEventListener('mouseleave', () => {
            parallaxLayers.forEach(layer => {
                layer.style.transform = 'translate(0px, 0px)';
            });
            
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.transform = 'translate(0px, 0px)';
            }
        });
    }
    
    // Initialize vanilla-tilt for project cards
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".tilt-card"), {
            max: 10,
            speed: 400,
            glare: true,
            "max-glare": 0.3,
            gyroscope: true
        });
    }
    
    // Enhanced Loading Screen Animation
    if (loadingScreen) {
        // Create loading particles
        const loadingParticles = document.querySelector('.loading-particles');
        
        // Create particles
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'loading-particle';
            
            // Random position
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // Random size
            const size = Math.random() * 5 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Random animation duration and delay
            const duration = Math.random() * 3 + 2;
            const delay = Math.random() * 2;
            particle.style.animation = `floatParticle ${duration}s ${delay}s infinite ease-in-out`;
            
            // Random color
            const hue = Math.random() * 30 + 240; // blue to purple range
            particle.style.backgroundColor = `hsla(${hue}, 80%, 70%, ${Math.random() * 0.5 + 0.3})`;
            
            loadingParticles.appendChild(particle);
        }
        
        // Ensure SVG letter animations are synchronized with delays
        const letter1 = document.getElementById('loading-letter-1');
        const letter2 = document.getElementById('loading-letter-2');
        const letter3 = document.getElementById('loading-letter-3');
        
        if (letter1 && letter2 && letter3) {
            // Reset animations to ensure they start fresh
            letter1.style.animation = 'none';
            letter2.style.animation = 'none';
            letter3.style.animation = 'none';
            
            // Force reflow to apply reset
            void letter1.offsetWidth;
            void letter2.offsetWidth;
            void letter3.offsetWidth;
            
            // Reapply animations with proper timing
            letter1.style.animation = 'drawLoadingLetter 3s ease forwards';
            letter2.style.animation = 'drawLoadingLetter 3s 1s ease forwards';
            letter3.style.animation = 'drawLoadingLetter 3s 2s ease forwards';
        }
        
        // Animate loading progress
        const loadingBar = document.querySelector('.loading-bar');
        let progress = 0;
        const totalProgress = 100;
        const progressStep = 5;
        const progressInterval = 120; // ms
        
        const updateProgress = () => {
            if (progress < totalProgress) {
                progress += progressStep;
                loadingBar.style.width = `${progress}%`;
                setTimeout(updateProgress, progressInterval + Math.random() * 100);
            }
        };
        
        // Start progress animation
        setTimeout(updateProgress, 500);
        
        // Hide loading screen after content is loaded
        window.addEventListener('load', () => {
            // Wait for animations to complete
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    // Start typewriter effect after loading
                    if (heroName) {
                        typewriterEffect(heroName, 0, heroName.textContent, 50);
                    }
                }, 800);
            }, 3500); // Show loading screen for at least 3.5 seconds to see the complete animation
        });
    }
    
    // Typewriter Effect
    function typewriterEffect(element, index, text, speed) {
        // Clear the element first
        if (index === 0) {
            element.textContent = '';
            element.style.borderRight = '3px solid var(--primary-color)';
        }
        
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(() => typewriterEffect(element, index, text, speed), speed);
        } else {
            // When typing is done, remove cursor and add fade-in for descriptions
            element.style.borderRight = 'none';
            
            if (heroDescription) {
                setTimeout(() => {
                    heroDescription.style.opacity = '1';
                    if (heroSubDescription) {
                        setTimeout(() => {
                            heroSubDescription.style.opacity = '1';
                            
                            // Show CTA buttons with a delay
                            const ctaButtons = document.querySelector('.cta-buttons');
                            if (ctaButtons) {
                                setTimeout(() => {
                                    ctaButtons.style.opacity = '1';
                                    ctaButtons.style.transform = 'translateY(0)';
                                }, 300);
                            }
                        }, 400);
                    }
                }, 300);
            }
        }
    }
    
    // Text scramble effect for section titles
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#_';
            this.update = this.update.bind(this);
        }
        
        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise(resolve => this.resolve = resolve);
            this.queue = [];
            
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }
        
        update() {
            let output = '';
            let complete = 0;
            
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += `<span class="scramble-text">${char}</span>`;
                } else {
                    output += from;
                }
            }
            
            this.el.innerHTML = output;
            
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
        
        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }
    
    // Apply text scramble effect to section titles when they come into view
    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const title = entry.target;
                const scramble = new TextScramble(title);
                const originalText = title.textContent;
                scramble.setText(originalText);
                titleObserver.unobserve(title);
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.section-title').forEach(title => {
        titleObserver.observe(title);
    });
    
    // Add hover effect on interactive elements (ensuring logo is excluded)
    const interactiveElements = document.querySelectorAll('a:not(.logo), button:not(.logo), .btn:not(.logo), .nav-item:not(.logo)');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursor) cursor.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            if (cursor) cursor.classList.remove('hover');
        });
    });
    
    // Scroll animations for sections
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                // Animate timeline items if this is the education section
                if (entry.target.id === 'education') {
                    const timelineItems = entry.target.querySelectorAll('.timeline-item');
                    timelineItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('animate');
                        }, index * 300);
                    });
                }
                
                // Animate project cards if this is the projects section
                if (entry.target.id === 'projects') {
                    const projectCards = entry.target.querySelectorAll('.project-card');
                    projectCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('animate');
                        }, index * 200);
                    });
                }
                
                // Animate certificates if this is the certificates section
                if (entry.target.id === 'certificates') {
                    const certItems = entry.target.querySelectorAll('.certification-item');
                    certItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('animate');
                        }, index * 150);
                    });
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Disable only the hover effects on logo, but not the initial drawing animation
    const logoLetters = document.querySelectorAll('.logo-letter');
    
    // Add active class to current section in navigation
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(navItem => {
            navItem.classList.remove('active');
            const href = navItem.getAttribute('href').substring(1);
            if (href === current) {
                navItem.classList.add('active');
            }
        });
    });
    
    // Smooth scrolling for navigation links
    navItems.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Mobile menu functionality - improved
    // Create menu overlay
    const menuOverlay = document.createElement('div');
    menuOverlay.className = 'menu-overlay';
    document.body.appendChild(menuOverlay);

    function toggleMenu() {
        navLinks.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        mobileMenuBtn.classList.toggle('open'); // Add/remove open class for animation
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        
        // Accessibility
        mobileMenuBtn.setAttribute('aria-expanded', navLinks.classList.contains('active'));
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });
        mobileMenuBtn.setAttribute('aria-label', 'Toggle menu');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.setAttribute('aria-controls', 'mobile-menu');
        
        menuOverlay.addEventListener('click', toggleMenu);
        
        // Add close button to mobile menu for better UX
        const closeButton = document.createElement('button');
        closeButton.className = 'close-menu-btn';
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        closeButton.setAttribute('aria-label', 'Close menu');
        
        const menuHeader = document.createElement('div');
        menuHeader.className = 'menu-header';
        const menuTitle = document.createElement('h3');
        menuTitle.textContent = 'Menu';
        
        menuHeader.appendChild(menuTitle);
        menuHeader.appendChild(closeButton);
        
        // Insert at the beginning of navLinks
        if (navLinks.firstChild) {
            navLinks.insertBefore(menuHeader, navLinks.firstChild);
        } else {
            navLinks.appendChild(menuHeader);
        }
        
        closeButton.addEventListener('click', toggleMenu);
    }

    // Close menu when clicking a nav item
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            toggleMenu();
        }
    });
    
    // Handle resize events - show/hide mobile menu based on screen width
    window.addEventListener('resize', () => {
        // If viewport becomes larger than mobile breakpoint and menu is open, close it
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            toggleMenu();
        }
        
        // On mobile, reduce animations and background effects for better performance
        if (window.innerWidth <= 768) {
            // Reduce background animation elements
            const canvas = document.querySelector('#background-animation canvas');
            if (canvas) {
                canvas.style.opacity = '0.6';
            }
        } else {
            const canvas = document.querySelector('#background-animation canvas');
            if (canvas) {
                canvas.style.opacity = '1';
            }
        }
    });

    // Hide custom cursor on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        if (cursor) cursor.style.display = 'none';
    }
    
    // Project card hover effect
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('hover');
        });
        
        card.addEventListener('mouseleave', () => {
            card.classList.remove('hover');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Create a back-to-top button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTopBtn);

    // Show/hide back-to-top button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    // Scroll to top when button is clicked
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}); 
