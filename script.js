// Custom cursor
document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.custom-cursor');
    
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

    // Local storage for profile settings
    const profileSettings = document.getElementById('profileSettings');
    const profilePic = document.querySelector('.profile-pic');
    const saveBtn = document.querySelector('.save-btn');
    const profileImageInput = document.getElementById('profileImageInput');
    const uploadBtn = document.querySelector('.upload-btn');
    const settingsProfileImage = document.getElementById('settingsProfileImage');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');

    // Load profile data from localStorage if it exists
    if (localStorage.getItem('profileData')) {
        const profileData = JSON.parse(localStorage.getItem('profileData'));
        
        if (profileData.name) profileName.value = profileData.name;
        if (profileData.email) profileEmail.value = profileData.email;
        if (profileData.image) settingsProfileImage.src = profileData.image;
    }

    // Profile settings toggle
    if (profilePic) {
        profilePic.addEventListener('click', () => {
            profileSettings.classList.toggle('active');
        });
    }

    // Save settings
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const profileData = {
                name: profileName.value,
                email: profileEmail.value,
                image: settingsProfileImage.src
            };
            
            localStorage.setItem('profileData', JSON.stringify(profileData));
            profileSettings.classList.remove('active');
        });
    }

    // Image upload
    if (uploadBtn && profileImageInput) {
        uploadBtn.addEventListener('click', () => {
            profileImageInput.click();
        });
        
        profileImageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    settingsProfileImage.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
}); 