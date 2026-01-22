document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Select DOM Elements ---
    const wrapper = document.querySelector('.form-wrapper');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.getElementById('togglePassword');
    const loginBtn = document.getElementById('loginBtn');
    const errorMsg = document.getElementById('error-msg');
    
    // --- 2. Mascot Elements (Critical for movement) ---
    const pupils = document.getElementById('pupils');
    // We select the first eye-white to calculate the center point
    const eyeRef = document.querySelector('.eye-white'); 

    // Debugging: Check if elements were found
    if (!pupils || !eyeRef) {
        console.error("Mascot elements not found! Check your HTML IDs/Classes.");
        return; 
    }

    // --- 3. MOUSE TRACKING LOGIC ---
    const handleMouseMove = (e) => {
        // A. Check if we are in "Password Mode" (Hidden eyes)
        // If the wrapper has this class, we STOP moving the eyes.
        if (wrapper.classList.contains('password-mode')) {
            return; 
        }

        // B. Get the position of the eye on the screen
        const rect = eyeRef.getBoundingClientRect();
        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height / 2;
        
        // C. Calculate the Angle between Mouse and Eye
        const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
        
        // D. Calculate Distance (Clamped)
        // This '15' controls how "far" the eyes move. Lower = more movement.
        const maxMove = 10; 
        const dist = Math.min(maxMove, Math.hypot(e.clientX - eyeCenterX, e.clientY - eyeCenterY) / 15);
        
        // E. Move the pupils
        const x = Math.cos(angle) * dist;
        const y = Math.sin(angle) * dist;
        
        pupils.style.transform = `translate(${x}px, ${y}px)`;
    };
    
    // Attach event to the entire Window to catch all movement
    window.addEventListener('mousemove', handleMouseMove);


    // --- 4. INPUT EVENTS (When to hide eyes) ---

    // Password Focus -> Add Class to Hide Eyes
    passwordInput.addEventListener('focus', () => {
        wrapper.classList.add('password-mode');
        pupils.style.transform = 'translate(0, 0)'; // Reset eyes to center
    });

    // Password Blur -> Remove Class (Unless text is visible)
    passwordInput.addEventListener('blur', () => {
        wrapper.classList.remove('password-mode');
    });

    // Email Focus -> Ensure Eyes are Visible
    emailInput.addEventListener('focus', () => {
        wrapper.classList.remove('password-mode');
        errorMsg.style.display = 'none';
    });


    // --- 5. PASSWORD TOGGLE ---
    toggleBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        toggleBtn.classList.toggle('fa-eye');
        toggleBtn.classList.toggle('fa-eye-slash');

        // If showing text, eyes should see (remove password-mode)
        if (type === 'text') {
            wrapper.classList.remove('password-mode');
        } else {
            // Only cover eyes if user is currently clicked inside the box
            if (document.activeElement === passwordInput) {
                wrapper.classList.add('password-mode');
            }
        }
    });

// --- 6. LOGIN BUTTON ---
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const pass = passwordInput.value;
        
        // Mock Password Check
        if (pass === 'core123') {
            
            // 1. Visual Feedback (User sees it worked)
            errorMsg.style.display = 'none';
            loginBtn.innerText = "Redirecting...";
            loginBtn.style.background = "#10b981"; // Green color
            
            // 2. Play Sound (Optional, wrapped in safety check)
            const successSound = document.getElementById('success-sound');
            if(successSound) {
                successSound.volume = 0.3;
                successSound.play().catch(() => {}); // Catch error if browser blocks it
            }

            // 3. THE REDIRECT (This is the important part)
            setTimeout(() => {
                window.location.href = 'dashboard.html'; 
            }, 800); // 800ms delay so they see the green button/hear sound

        } else {
            // Error State
            wrapper.classList.remove('password-mode'); 
            errorMsg.style.display = 'block';
            errorMsg.innerText = "Incorrect credentials. Try 'core123'.";
        }
    });
});