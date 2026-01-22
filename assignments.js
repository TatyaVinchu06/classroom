document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. MOCK DATA ---
    const mockAssignments = [
        { 
            id: 1, title: 'Data Structures Lab 5', subject: 'CS301', type: 'Lab',
            deadline: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
            submission: { status: 'draft' }
        },
        { 
            id: 2, title: 'Database Schema Design', subject: 'CS302', type: 'Theory',
            deadline: new Date(Date.now() - 100000000).toISOString(), // Past (Overdue)
            submission: { status: 'not_started' }
        },
        { 
            id: 3, title: 'Web Dev Project', subject: 'CS303', type: 'Project',
            deadline: new Date(Date.now() + 600000000).toISOString(), // Next Week
            submission: { status: 'not_started' }
        },
        { 
            id: 4, title: 'Array Operations', subject: 'CS301', type: 'Lab',
            deadline: new Date(Date.now() - 864000000).toISOString(), 
            submission: { status: 'graded', marks: 18, max: 20 }
        }
    ];

    // --- 2. STATE ---
    let assignments = [];
    let activeFilter = 'all';

    // --- 3. INIT ---
    // Simulate Network Request
    setTimeout(() => {
        assignments = mockAssignments;
        renderAssignments(); 
        // FIX: removed the broken line that tried to hide the missing loader
    }, 1000); 

    // --- 4. RENDER LOGIC ---
    const renderAssignments = () => {
        const container = document.getElementById('assignmentsList');
        
        // A. FILTERING
        let filtered = assignments.filter(a => {
            if (activeFilter === 'all') return true;
            if (activeFilter === 'pending') return a.submission.status === 'draft' || a.submission.status === 'not_started';
            if (activeFilter === 'submitted') return a.submission.status === 'submitted' || a.submission.status === 'graded';
            if (activeFilter === 'overdue') return new Date(a.deadline) < new Date() && a.submission.status !== 'submitted' && a.submission.status !== 'graded';
            return true;
        });

        // B. GROUPING
        const groups = { overdue: [], dueSoon: [], upcoming: [], submitted: [], graded: [] };
        const now = new Date();

        filtered.forEach(a => {
            const deadline = new Date(a.deadline);
            const status = a.submission.status;
            const hoursLeft = (deadline - now) / (1000 * 60 * 60);

            if (status === 'graded') groups.graded.push(a);
            else if (status === 'submitted') groups.submitted.push(a);
            else if (deadline < now) groups.overdue.push(a);
            else if (hoursLeft <= 48) groups.dueSoon.push(a);
            else groups.upcoming.push(a);
        });

        // C. HTML GENERATION
        container.innerHTML = ''; // This clears the skeleton loader

        const renderSection = (title, items, variant) => {
            if (items.length === 0) return;
            
            const section = document.createElement('div');
            section.className = `assignment-section section-${variant}`;
            section.innerHTML = `
                <div class="section-header">
                    <h2>${title}</h2>
                    <span class="count-badge">${items.length}</span>
                </div>
            `;
            
            items.forEach(item => {
                const card = createCard(item);
                section.appendChild(card);
            });
            container.appendChild(section);
        };

        renderSection('🔴 Overdue', groups.overdue, 'overdue');
        renderSection('🟡 Due Soon', groups.dueSoon, 'duesoon');
        renderSection('Upcoming', groups.upcoming, 'normal');
        renderSection('✅ Submitted', groups.submitted, 'submitted');
        renderSection('⭐ Graded', groups.graded, 'graded');

        if (container.innerHTML === '') {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>All caught up!</h3>
                    <p>No assignments found.</p>
                </div>
            `;
        }
    };

    // --- 5. CARD CREATOR ---
    const createCard = (item) => {
        const div = document.createElement('div');
        div.className = 'assignment-card';
        
        let btnConfig = { text: 'Start', class: 'btn-primary', icon: 'fa-play' };
        if (item.submission.status === 'graded') btnConfig = { text: `${item.submission.marks}/${item.submission.max}`, class: 'btn-info', icon: 'fa-star' };
        else if (new Date(item.deadline) < new Date()) btnConfig = { text: 'Late Submit', class: 'btn-danger', icon: 'fa-exclamation' };
        else if (item.submission.status === 'draft') btnConfig = { text: 'Continue', class: 'btn-primary', icon: 'fa-pen' };

        const due = new Date(item.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        div.innerHTML = `
            <div class="card-left">
                <div class="card-header">
                    <span class="subject-badge">${item.subject}</span>
                    <span class="type-badge">${item.type}</span>
                </div>
                <h3 class="card-title">${item.title}</h3>
                <div class="card-meta">
                    <span>Due: ${due}</span>
                </div>
            </div>
            <div class="card-action">
                <button class="btn ${btnConfig.class}">
                    <i class="fas ${btnConfig.icon}"></i> ${btnConfig.text}
                </button>
            </div>
        `;
        return div;
    };

    // --- 6. EVENT LISTENERS ---
    const tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeFilter = tab.dataset.filter;
            renderAssignments();
        });
    });
});