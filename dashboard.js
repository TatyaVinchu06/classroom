document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. MOCK DATA (Matches the UI) ---
    const data = {
        stats: [
            { label: 'Pending Assignments', value: 4, icon: 'fa-layer-group', color: 'blue' },
            { label: 'Completed This Week', value: 12, icon: 'fa-check-circle', color: 'green' },
            { label: 'Upcoming Events', value: 3, icon: 'fa-calendar-day', color: 'gold' }
        ],
        deadlines: [
            { title: 'Data Structures Lab 5', subject: 'CS301', due: 'Tomorrow, 11:59 PM', progress: 80, urgency: 'high' },
            { title: 'Web Development Project', subject: 'CS302', due: 'Jan 28, 2026', progress: 60, urgency: 'medium' },
            { title: 'Database Schema Design', subject: 'CS304', due: 'Feb 02, 2026', progress: 25, urgency: 'low' }
        ],
        feed: [
            { title: 'New Assignment Posted', desc: 'Prof. Sharma added "Binary Search Tree"', time: '2 hours ago', icon: 'fa-plus-circle' },
            { title: 'Notes Uploaded', desc: 'Unit 3: Normalization PDFs are available.', time: '5 hours ago', icon: 'fa-file-alt' },
            { title: 'Club Event', desc: 'Robotics Club meeting at 5 PM today.', time: '1 day ago', icon: 'fa-users' }
        ]
    };

    // --- 2. RENDER STATS ---
    const statsRow = document.getElementById('stats-row');
    data.stats.forEach(stat => {
        const div = document.createElement('div');
        div.className = 'stat-card';
        div.innerHTML = `
            <div class="icon-box ${stat.color}"><i class="fas ${stat.icon}"></i></div>
            <div class="stat-info">
                <h3>${stat.value}</h3>
                <p>${stat.label}</p>
            </div>
        `;
        statsRow.appendChild(div);
    });

    // --- 3. RENDER DEADLINES ---
    const deadlinesList = document.getElementById('deadlines-list');
    data.deadlines.forEach(item => {
        const urgencyColor = item.urgency === 'high' ? 'red' : (item.urgency === 'medium' ? 'orange' : 'green');
        
        const div = document.createElement('div');
        div.className = 'deadline-card';
        div.innerHTML = `
            <div class="task-icon"><i class="fas fa-laptop-code"></i></div>
            <div class="task-content">
                <h4>${item.title}</h4>
                <div class="task-meta">
                    <span><span class="urgency-dot ${urgencyColor}"></span> ${item.due}</span>
                    <span>• ${item.subject}</span>
                </div>
                <div class="progress-track">
                    <div class="progress-fill" style="width: ${item.progress}%; background: ${item.urgency === 'high' ? '#ef4444' : '#003366'}"></div>
                </div>
            </div>
        `;
        deadlinesList.appendChild(div);
    });

    // --- 4. RENDER FEED ---
    const feedContainer = document.getElementById('activity-feed');
    data.feed.forEach(item => {
        const div = document.createElement('div');
        div.className = 'feed-item';
        div.innerHTML = `
            <div class="feed-icon"><i class="fas ${item.icon}"></i></div>
            <div class="feed-text">
                <h4>${item.title}</h4>
                <p>${item.desc}</p>
                <span class="time">${item.time}</span>
            </div>
        `;
        feedContainer.appendChild(div);
    });

    // --- 5. LOGOUT LOGIC ---
    document.querySelector('.logout-btn').addEventListener('click', () => {
        if(confirm("Are you sure you want to logout?")) {
            window.location.href = 'index.html';
        }
    });
});