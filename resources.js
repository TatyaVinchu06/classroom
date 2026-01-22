document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. MOCK DATA (Subjects & Resources) ---
    const subjects = [
        { id: 'cs301', code: 'CS301', name: 'Data Structures' },
        { id: 'cs302', code: 'CS302', name: 'Web Development' },
        { id: 'cs304', code: 'CS304', name: 'Database Systems' }
    ];

    const resourcesData = [
        {
            id: 1, title: 'Unit 1: Arrays & Linked Lists', type: 'pdf', subject: 'cs301', unit: 'Unit 1',
            date: 'Jan 10', size: '2.4 MB', views: 45,
            url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
        },
        {
            id: 2, title: 'Stack Implementation Tutorial', type: 'video', subject: 'cs301', unit: 'Unit 1',
            date: 'Jan 12', size: '15 Mins', views: 120, thumbnail: 'https://img.youtube.com/vi/I37kGX-nZEg/mqdefault.jpg',
            embed: 'https://www.youtube.com/embed/I37kGX-nZEg'
        },
        {
            id: 3, title: 'Trees and Graphs Overview', type: 'ppt', subject: 'cs301', unit: 'Unit 2',
            date: 'Jan 15', size: '4.1 MB', views: 30
        },
        {
            id: 4, title: 'Sorting Algorithms Cheat Sheet', type: 'link', subject: 'cs301', unit: 'Unit 3',
            date: 'Jan 20', size: 'External', views: 89, url: 'https://www.geeksforgeeks.org/sorting-algorithms/'
        }
    ];

    // State
    let activeSubject = 'cs301';
    let activeType = 'all';

    // --- 2. INITIALIZE ---
    renderSubjects();
    renderResources();

    // --- 3. RENDER FUNCTIONS ---
    function renderSubjects() {
        const container = document.getElementById('subjectTabs');
        container.innerHTML = subjects.map(sub => `
            <div class="subject-tab ${sub.id === activeSubject ? 'active' : ''}" onclick="switchSubject('${sub.id}')">
                <span class="subject-code">${sub.code}</span>
                <span class="subject-name">${sub.name}</span>
            </div>
        `).join('');
    }

    window.switchSubject = (id) => {
        activeSubject = id;
        renderSubjects();
        renderResources();
    };

    function renderResources() {
        const container = document.getElementById('resourcesContainer');
        container.innerHTML = '';

        // Filter Data
        const filtered = resourcesData.filter(r => 
            r.subject === activeSubject && 
            (activeType === 'all' || r.type === activeType)
        );

        if (filtered.length === 0) {
            container.innerHTML = `<div class="empty-state" style="text-align:center; padding:3rem; color:#94a3b8;">
                <i class="fas fa-folder-open" style="font-size:3rem; margin-bottom:1rem;"></i>
                <p>No resources found for this filter.</p>
            </div>`;
            return;
        }

        // Group by Unit (Simple grouping logic)
        const units = {};
        filtered.forEach(r => {
            if (!units[r.unit]) units[r.unit] = [];
            units[r.unit].push(r);
        });

        // Generate HTML
        Object.keys(units).forEach(unitName => {
            const section = document.createElement('div');
            section.className = 'unit-section'; // Expanded by default
            
            section.innerHTML = `
                <div class="unit-header" onclick="this.parentElement.classList.toggle('collapsed')">
                    <div class="unit-title">
                        <i class="fas fa-chevron-down chevron"></i>
                        ${unitName}
                    </div>
                    <span class="unit-count">${units[unitName].length} items</span>
                </div>
                <div class="unit-content">
                    ${units[unitName].map(item => createCardHTML(item)).join('')}
                </div>
            `;
            container.appendChild(section);
        });
    }

    function createCardHTML(item) {
        let icon = 'fa-file';
        if (item.type === 'pdf') icon = 'fa-file-pdf';
        if (item.type === 'video') icon = 'fa-play-circle';
        if (item.type === 'ppt') icon = 'fa-file-powerpoint';
        if (item.type === 'link') icon = 'fa-link';

        // Thumbnail Logic
        let thumbContent = `<i class="fas ${icon} fa-3x"></i>`;
        if (item.thumbnail) thumbContent = `<img src="${item.thumbnail}">`;

        return `
            <div class="resource-card" onclick="openPreview('${item.id}')">
                <div class="card-thumbnail">
                    ${thumbContent}
                    <span class="type-badge">${item.type}</span>
                </div>
                <div class="card-body">
                    <div class="res-title">${item.title}</div>
                    <div class="res-meta">
                        <span>${item.date}</span>
                        <span>${item.size}</span>
                        <span><i class="fas fa-eye"></i> ${item.views}</span>
                    </div>
                </div>
            </div>
        `;
    }

    // --- 4. INTERACTIONS ---

    // Filter Pills
    document.querySelectorAll('.filter-pill').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeType = btn.dataset.type;
            renderResources();
        });
    });

    // View Toggle
    const gridBtn = document.getElementById('gridBtn');
    const listBtn = document.getElementById('listBtn');
    const resContainer = document.getElementById('resourcesContainer');

    gridBtn.onclick = () => {
        resContainer.classList.remove('list-view');
        gridBtn.classList.add('active'); listBtn.classList.remove('active');
    };
    listBtn.onclick = () => {
        resContainer.classList.add('list-view');
        listBtn.classList.add('active'); gridBtn.classList.remove('active');
    };

    // --- 5. MODAL LOGIC ---
    
    // Upload Modal
    const uploadModal = document.getElementById('uploadModal');
    document.getElementById('uploadBtn').onclick = () => uploadModal.classList.add('active');
    
    // Type Toggle inside Upload
    const typeSelect = document.getElementById('resourceType');
    typeSelect.onchange = () => {
        if(typeSelect.value === 'pdf') {
            document.getElementById('fileInputGroup').classList.remove('hidden');
            document.getElementById('urlInputGroup').classList.add('hidden');
        } else {
            document.getElementById('fileInputGroup').classList.add('hidden');
            document.getElementById('urlInputGroup').classList.remove('hidden');
        }
    };

    // Preview Modal
    const previewModal = document.getElementById('previewModal');
    
    window.openPreview = (id) => {
        const item = resourcesData.find(r => r.id == id);
        if (!item) return;

        // If Link, just open new tab
        if(item.type === 'link') {
            window.open(item.url, '_blank');
            return;
        }

        const body = document.getElementById('previewContent');
        document.getElementById('previewTitle').innerText = item.title;
        previewModal.classList.add('active');

        // Logic for different types
        if(item.type === 'video') {
            body.innerHTML = `<iframe src="${item.embed}" allowfullscreen></iframe>`;
        } else if (item.type === 'pdf') {
            body.innerHTML = `<iframe src="${item.url}"></iframe>`;
        } else {
            body.innerHTML = `<div style="text-align:center; padding:2rem; color:#64748b">
                <i class="fas fa-file-download fa-3x" style="margin-bottom:1rem"></i>
                <p>Preview not available for this file type.</p>
            </div>`;
        }
    };

    // Close Modals
    document.querySelectorAll('.close-modal, .modal-overlay').forEach(el => {
        el.addEventListener('click', (e) => {
            if (e.target === el || el.classList.contains('close-modal') || el.parentElement.classList.contains('close-modal')) {
                uploadModal.classList.remove('active');
                previewModal.classList.remove('active');
                document.getElementById('previewContent').innerHTML = ''; // Stop video
            }
        });
    });
}); 