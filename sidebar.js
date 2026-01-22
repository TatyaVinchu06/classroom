document.addEventListener('DOMContentLoaded', () => {
    const sidebarContainer = document.getElementById('sidebar-container');
    
    if (sidebarContainer) {
        
        // --- 1. EMBEDDED STYLES (Global Layout Fixes) ---
        const styleFix = `
        <style>
            /* 1. SIDEBAR STYLE */
            .sidebar {
                width: 260px;
                background: #003366; /* Your Brand Blue */
                color: white;
                display: flex;
                flex-direction: column;
                padding: 2rem 1.5rem;
                position: fixed;
                top: 0;
                left: 0;
                height: 100vh;
                z-index: 1000; /* Ensure it stays on top */
                overflow-y: auto;
                font-family: 'Segoe UI', sans-serif;
                box-shadow: 4px 0 10px rgba(0,0,0,0.1);
            }

            /* 2. CRITICAL FIX: PUSH MAIN CONTENT TO THE RIGHT */
            /* This forces dashboard, assignments, etc. to respect the sidebar */
            .main-content {
                margin-left: 260px !important;
                width: calc(100% - 260px) !important;
                min-height: 100vh;
            }

            /* Header & Logo */
            .sidebar-header { display: flex; align-items: center; gap: 12px; margin-bottom: 2.5rem; }
            .logo-icon { font-size: 1.5rem; color: #FFD700; }
            .sidebar-header h2 { font-weight: 800; font-size: 1.6rem; margin: 0; letter-spacing: 1px; }
            
            /* Nav Items */
            .nav-group { margin-bottom: 1.5rem; }
            .group-label { 
                font-size: 0.7rem; font-weight: 700; color: rgba(255,255,255,0.5); 
                margin-bottom: 0.8rem; padding-left: 10px; letter-spacing: 1px; 
            }
            
            .nav-item {
                display: flex;
                align-items: center;
                padding: 12px 15px;
                border-radius: 12px;
                color: rgba(255,255,255,0.7);
                text-decoration: none;
                transition: 0.2s;
                margin-bottom: 5px;
            }
            .nav-item:hover { background: rgba(255,255,255,0.1); color: white; transform: translateX(3px); }
            
            /* Active State */
            .nav-item.active { 
                background: white; 
                color: #003366; 
                font-weight: 700; 
                box-shadow: 0 4px 15px rgba(0,0,0,0.15); 
            }
            
            /* Fixed Icon Alignment */
            .nav-item i {
                width: 30px !important; 
                text-align: center;
                font-size: 1.1rem;
                margin-right: 10px;
                display: inline-block;
            }
            
            /* Footer */
            .sidebar-footer { margin-top: auto; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); }
            .user-mini-profile { display: flex; align-items: center; gap: 10px; }
            .avatar { 
                width: 40px; height: 40px; background: rgba(255,255,255,0.2); 
                border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; 
            }
            .info { flex: 1; overflow: hidden; }
            .info .name { display: block; font-weight: 600; font-size: 0.9rem; white-space: nowrap; }
            .info .role { font-size: 0.75rem; opacity: 0.7; }
            .logout-btn { background: none; border: none; color: rgba(255,255,255,0.6); cursor: pointer; font-size: 1.1rem; }
            .logout-btn:hover { color: #ff6b6b; }
        </style>
        `;

        // --- 2. THE HTML CONTENT ---
        const sidebarHTML = `
        <aside class="sidebar">
            <div class="sidebar-header">
                <div class="logo-icon"><i class="fas fa-cube"></i></div>
                <h2>CORE</h2>
            </div>
            
            <nav class="sidebar-nav">
                <div class="nav-group">
                    <p class="group-label">ACADEMICS</p>
                    
                    <a href="dashboard.html" class="nav-item" id="nav-dashboard">
                        <i class="fas fa-home"></i> <span>Dashboard</span>
                    </a>
                    
                    <a href="assignments.html" class="nav-item" id="nav-assignments">
                        <i class="fas fa-code"></i> <span>Assignments</span>
                    </a>

                    <a href="workspace.html" class="nav-item" id="nav-workspace">
                        <i class="fas fa-laptop-code"></i> <span>Code Editor</span>
                    </a>

                    <a href="resources.html" class="nav-item" id="nav-resources">
                        <i class="fas fa-book"></i> <span>Resources</span>
                    </a>
                                      
                    <a href="#" class="nav-item" id="nav-doubts">
                        <i class="fas fa-question-circle"></i> <span>Doubts</span>
                    </a>
                </div>

                <div class="nav-group">
                    <p class="group-label">CAMPUS</p>
                    <a href="#" class="nav-item" id="nav-notices">
                        <i class="fas fa-bullhorn"></i> <span>Notices</span>
                    </a>
                    <a href="#" class="nav-item" id="nav-events">
                        <i class="fas fa-calendar-alt"></i> <span>Events</span>
                    </a>
                    <a href="#" class="nav-item" id="nav-clubs">
                        <i class="fas fa-users"></i> <span>Clubs</span>
                    </a>
                </div>
            </nav>

            <div class="sidebar-footer">
                <div class="user-mini-profile">
                    <div class="avatar">O</div>
                    <div class="info">
                        <span class="name">Om Bhamare</span>
                        <span class="role">Student ID: 4022</span>
                    </div>
                    <button class="logout-btn" onclick="if(confirm('Logout?')) window.location.href='index.html'">
                        <i class="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            </div>
        </aside>
        `;

        // 3. Inject Styles + HTML
        sidebarContainer.innerHTML = styleFix + sidebarHTML;

        // 4. Highlight Logic
        const currentPage = window.location.pathname.split("/").pop();
        
        // Handle "root" or index page access differently if needed, defaults to dashboard
        if(currentPage === '' || currentPage === 'index.html') return; // Don't highlight on login

        // Clean Active States
        const allLinks = document.querySelectorAll('.nav-item');
        allLinks.forEach(link => link.classList.remove('active'));

        // Set Active State
        if (currentPage === 'dashboard.html') document.getElementById('nav-dashboard')?.classList.add('active');
        else if (currentPage === 'assignments.html') document.getElementById('nav-assignments')?.classList.add('active');
        else if (currentPage === 'workspace.html') document.getElementById('nav-workspace')?.classList.add('active');
        else if (currentPage === 'resources.html') document.getElementById('nav-resources')?.classList.add('active');
    }
});