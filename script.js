// Custom cursor
document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.custom-cursor');
    const loadingScreen = document.getElementById('loadingScreen');
    
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
    
    // Loading dots animation
    if (loadingScreen) {
        const dots = document.querySelectorAll('.dot');
        let currentDot = 0;
        
        // Function to animate dots in sequence
        const animateDots = () => {
            // Reset all dots
            dots.forEach(dot => dot.classList.remove('active'));
            
            // Activate current dot
            dots[currentDot].classList.add('active');
            
            // Move to next dot, loop back to first if needed
            currentDot = (currentDot + 1) % dots.length;
            
            // Continue animation while loading screen is visible
            if (loadingScreen.style.display !== 'none') {
                setTimeout(animateDots, 500); // Change dot every 500ms
            }
        };
        
        // Start animation
        animateDots();
        
        // Simplified loading screen
        window.addEventListener('load', () => {
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 800);
            }, 1500); // 1.5 seconds load time
        });
    }
    
    // Add hover effect on interactive elements (ensuring logo is excluded)
    const interactiveElements = document.querySelectorAll('a:not(.logo), button:not(.logo), .btn:not(.logo), .nav-item:not(.logo)');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });
    
    // Disable only the hover effects on logo, but not the initial drawing animation
    const logoLetters = document.querySelectorAll('.logo-letter');
    
    // Add active class to current section in navigation
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');
    
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
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}); 
