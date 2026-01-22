document.addEventListener('DOMContentLoaded', () => {
    const sidebarContainer = document.getElementById('sidebar-container');
    
    if (sidebarContainer) {
        // 1. Define the Sidebar HTML
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
                    
                    <a href="#" class="nav-item" id="nav-resources">
                        <i class="fas fa-book"></i> <span>Resources</span>
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
                    <div class="avatar">R</div>
                    <div class="info">
                        <span class="name">Rohan Sharma</span>
                        <span class="role">Student ID: 4022</span>
                    </div>
                    <button class="logout-btn" onclick="window.location.href='index.html'"><i class="fas fa-sign-out-alt"></i></button>
                </div>
            </div>
        </aside>
        `;

        // 2. Inject the HTML
        sidebarContainer.innerHTML = sidebarHTML;

        // 3. Highlight the Active Link Logic
        const currentPage = window.location.pathname.split("/").pop(); // Get filename (e.g. 'dashboard.html')
        
        // Remove 'active' from all first
        const allLinks = document.querySelectorAll('.nav-item');
        allLinks.forEach(link => link.classList.remove('active'));

        // Add 'active' based on page name
        if (currentPage === 'dashboard.html') document.getElementById('nav-dashboard').classList.add('active');
        else if (currentPage === 'assignments.html') document.getElementById('nav-assignments').classList.add('active');
        else if (currentPage === 'workspace.html') document.getElementById('nav-workspace').classList.add('active');
    }
});