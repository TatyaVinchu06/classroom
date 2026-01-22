document.addEventListener('DOMContentLoaded', () => {

    // --- MOCK DATA ---
    const doubtsData = [
        {
            id: 1, title: 'How does BST deletion work?', 
            desc: 'I am confused about the case where the node has two children. Do we replace with predecessor or successor?\n\nI tried implementing it using the successor but I am getting an infinite loop in my recursive call.',
            subject: 'CS301', tags: ['bst', 'tree', 'algorithms'],
            author: 'Rohan Sharma', time: '2 hours ago',
            votes: 12, answers: 1, resolved: true,
            comments: [
                { author: 'Dr. Gupta', text: 'You typically replace it with the Inorder Successor (smallest value in the right subtree).\n\nIf the node has two children, find the min value in the right subtree, copy the value, and then recursively delete that min node.', accepted: true, time: '1 hour ago' }
            ]
        },
        {
            id: 2, title: 'CSS Flexbox centering issue', 
            desc: 'justify-content: center is not working on my div. It stays on the left. I have set display: flex on the container.',
            subject: 'CS302', tags: ['css', 'flexbox', 'frontend'],
            author: 'Om Bhamare', time: '5 hours ago',
            votes: 5, answers: 0, resolved: false,
            comments: []
        }
    ];

    let currentDoubts = [...doubtsData];
    let activeFilter = 'all';

    // --- RENDER LIST ---
    renderDoubts();

    function renderDoubts() {
        const container = document.getElementById('doubtsList');
        container.innerHTML = '';

        let filtered = currentDoubts;
        if (activeFilter === 'unanswered') filtered = currentDoubts.filter(d => d.answers === 0);
        if (activeFilter === 'resolved') filtered = currentDoubts.filter(d => d.resolved);

        filtered.forEach(d => {
            const card = document.createElement('div');
            card.className = 'doubt-card';
            card.innerHTML = `
                <div class="vote-box">
                    <span class="vote-count">${d.votes}</span>
                    <span class="vote-label">Votes</span>
                    ${d.resolved ? '<i class="fas fa-check-circle" style="color:#10b981; margin-top:5px; font-size:1.2rem;"></i>' : ''}
                </div>
                <div class="doubt-main">
                    <div class="doubt-title">${d.title}</div>
                    <div class="doubt-desc">${d.desc}</div>
                    <div class="tags-row">
                        ${d.tags.map(t => `<span class="tag-pill">#${t}</span>`).join('')}
                    </div>
                </div>
            `;
            card.onclick = () => openDetail(d);
            container.appendChild(card);
        });
    }

    // --- FILTERS ---
    document.querySelectorAll('.filter-pill').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.dataset.filter;
            renderDoubts();
        });
    });

    // --- RENDER DETAIL VIEW (WITH RICH EDITOR) ---
    const overlay = document.getElementById('detailOverlay');
    const detailContent = document.getElementById('detailContent');

    window.openDetail = (d) => {
        // 1. Generate Answers
        const answersHTML = d.comments.map(c => `
            <div class="answer-item ${c.accepted ? 'accepted' : ''}">
                <div class="big-vote-box">
                    <button class="vote-btn"><i class="fas fa-caret-up"></i></button>
                    <span class="big-score">${c.accepted ? 5 : 1}</span>
                    <button class="vote-btn"><i class="fas fa-caret-down"></i></button>
                    ${c.accepted ? '<i class="fas fa-check" style="color:#10b981; font-size:1.5rem; margin-top:10px;"></i>' : ''}
                </div>
                
                <div class="answer-content" style="flex:1;">
                    ${c.accepted ? '<div class="accepted-badge"><i class="fas fa-check-circle"></i> Accepted Solution</div>' : ''}
                    
                    <div style="font-size:1rem; line-height:1.6; color:#334155; margin-bottom:1.5rem; white-space: pre-wrap;">${c.text}</div>
                    
                    <div class="user-signature">
                        <span class="asked-time">Answered ${c.time}</span>
                        <div class="user-row">
                            <div class="user-avatar" style="background:${c.accepted ? '#10b981' : '#64748b'}">${c.author.charAt(0)}</div>
                            <div>
                                <span class="user-name" style="color:${c.accepted ? '#047857' : '#334155'}">${c.author}</span>
                                <span class="user-role">Faculty</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // 2. Generate Full Layout
        detailContent.innerHTML = `
            <div class="question-section">
                <div class="big-vote-box">
                    <button class="vote-btn"><i class="fas fa-caret-up"></i></button>
                    <span class="big-score">${d.votes}</span>
                    <button class="vote-btn"><i class="fas fa-caret-down"></i></button>
                    <button style="border:none; background:none; color:#cbd5e1; margin-top:10px;"><i class="fas fa-star"></i></button>
                </div>
                
                <div style="flex:1;">
                    <h1 class="q-title-lg">${d.title}</h1>
                    <div class="tags-row" style="margin-bottom:1.5rem;">
                        ${d.tags.map(t => `<span class="tag-pill">#${t}</span>`).join('')}
                    </div>
                    
                    <div class="q-text-lg">${d.desc}</div>

                    <div class="user-signature" style="background:#e0f2fe; border-color:#bae6fd;">
                        <span class="asked-time">Asked ${d.time}</span>
                        <div class="user-row">
                            <div class="user-avatar" style="background:#0284c7;">${d.author.charAt(0)}</div>
                            <div>
                                <span class="user-name" style="color:#0284c7;">${d.author}</span>
                                <span class="user-role">Student (ID: 4022)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <h3 class="answers-header">${d.answers} Answers</h3>
            ${answersHTML}

            <div class="reply-section">
                <h4 style="margin-bottom:15px; color:#0f172a; font-size:1.1rem;">Your Answer</h4>
                
                <div class="editor-container">
                    <div class="editor-toolbar">
                        <i class="fas fa-bold" title="Bold"></i>
                        <i class="fas fa-italic" title="Italic"></i>
                        <i class="fas fa-link" title="Link"></i>
                        <i class="fas fa-code" title="Code Block"></i>
                        <i class="fas fa-list-ul" title="List"></i>
                        <i class="fas fa-image" title="Image"></i>
                    </div>
                    <textarea class="reply-textarea" placeholder="Type your detailed solution here... Use Markdown for code blocks."></textarea>
                </div>
                
                <button class="post-btn">Post Your Answer</button>
            </div>
        `;
        
        overlay.classList.add('active');
    };

    document.getElementById('closeDetail').onclick = () => overlay.classList.remove('active');

    // --- MODAL HANDLING ---
    const askModal = document.getElementById('askModal');
    document.getElementById('askBtn').onclick = () => askModal.classList.add('active');
    document.querySelectorAll('.close-modal').forEach(b => b.onclick = () => askModal.classList.remove('active'));
});