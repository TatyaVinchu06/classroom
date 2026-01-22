// --- 1. VIRTUAL FILE SYSTEM (Mock Data) ---
const files = {
    'index.html': {
        language: 'html',
        content: `<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>Hello Campus!</h1>
        <p>Edit this text to see changes.</p>
        <button id="btn">Click Me</button>
    </div>
    <script src="script.js"></script>
</body>
</html>`
    },
    'style.css': {
        language: 'css',
        content: `body { 
    background: #f0f2f5; 
    font-family: sans-serif; 
    display: flex; 
    justify-content: center; 
    align-items: center; 
    height: 100vh; 
}
.container { 
    background: white; 
    padding: 2rem; 
    border-radius: 10px; 
    box-shadow: 0 4px 10px rgba(0,0,0,0.1); 
    text-align: center;
}
h1 { color: #003366; }
button { 
    padding: 10px 20px; 
    background: #007acc; 
    color: white; 
    border: none; 
    border-radius: 5px; 
    cursor: pointer; 
}`
    },
    'script.js': {
        language: 'javascript',
        content: `document.getElementById('btn').addEventListener('click', () => {
    alert('Code Running Successfully!');
    console.log("Button clicked!");
});`
    }
};

let activeFileName = 'index.html';
let editorInstance = null;

// --- 2. INITIALIZE EDITOR ---
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.36.1/min/vs' }});

require(['vs/editor/editor.main'], function () {
    // Create Editor
    editorInstance = monaco.editor.create(document.getElementById('monaco-editor-root'), {
        value: files[activeFileName].content,
        language: files[activeFileName].language,
        theme: 'vs-dark',
        automaticLayout: true,
        fontSize: 14,
        minimap: { enabled: false }
    });

    // Handle Content Change (Auto-save simulation)
    editorInstance.onDidChangeModelContent(() => {
        files[activeFileName].content = editorInstance.getValue();
        document.getElementById('saveStatus').innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Saving...';
        setTimeout(() => {
            document.getElementById('saveStatus').innerHTML = '<i class="fas fa-check-circle"></i> Saved';
        }, 1000);
    });

    renderFileTree();
    renderTabs();
    runCode(); // Initial Run
});

// --- 3. UI RENDERING ---
function renderFileTree() {
    const tree = document.getElementById('fileTree');
    tree.innerHTML = '';
    
    Object.keys(files).forEach(fileName => {
        const item = document.createElement('div');
        item.className = `file-item ${fileName === activeFileName ? 'active' : ''}`;
        
        // Icon logic
        let icon = 'fa-file';
        if(fileName.endsWith('.html')) icon = 'fa-html5';
        if(fileName.endsWith('.css')) icon = 'fa-css3-alt';
        if(fileName.endsWith('.js')) icon = 'fa-js';
        
        item.innerHTML = `<i class="fab ${icon} file-icon"></i> ${fileName}`;
        
        item.onclick = () => switchFile(fileName);
        tree.appendChild(item);
    });
}

function renderTabs() {
    const bar = document.getElementById('tabBar');
    bar.innerHTML = `
        <div class="tab active">
            <i class="fab fa-${activeFileName.split('.')[1] === 'js' ? 'js' : activeFileName.split('.')[1] === 'html' ? 'html5' : 'css3-alt'}"></i> 
            ${activeFileName}
            <span class="tab-close">×</span>
        </div>
    `;
}

// --- 4. LOGIC FUNCTIONS ---
function switchFile(fileName) {
    // 1. Save current content to memory
    files[activeFileName].content = editorInstance.getValue();
    
    // 2. Switch active file
    activeFileName = fileName;
    
    // 3. Update Editor
    editorInstance.setValue(files[fileName].content);
    monaco.editor.setModelLanguage(editorInstance.getModel(), files[fileName].language);
    
    // 4. Update UI
    renderFileTree();
    renderTabs();
}

// --- 5. RUN CODE (The Magic) ---
document.getElementById('runBtn').addEventListener('click', runCode);

function runCode() {
    const previewPane = document.getElementById('viewPreview');
    const terminalPane = document.getElementById('viewTerminal');
    
    // Check which view is active
    if(previewPane.classList.contains('active')) {
        // WEB PREVIEW LOGIC
        const html = files['index.html'].content;
        const css = files['style.css'].content;
        const js = files['script.js'].content;
        
        const combinedSource = `
            <html>
                <head>
                    <style>${css}</style>
                </head>
                <body>
                    ${html}
                    <script>${js}<\/script>
                </body>
            </html>
        `;
        
        const iframe = document.getElementById('previewFrame');
        iframe.srcdoc = combinedSource;
        
    } else {
        // TERMINAL SIMULATION
        const terminal = document.getElementById('terminalOutput');
        terminal.innerHTML += `<span class="term-line system">> Executing ${activeFileName}...</span>`;
        
        setTimeout(() => {
            terminal.innerHTML += `<span class="term-line success">Build Successful (20ms)</span>`;
            if(files[activeFileName].language === 'javascript') {
                terminal.innerHTML += `<span class="term-line">> [Log] Button clicked event listener attached.</span>`;
            }
        }, 800);
    }
}

// --- 6. TAB SWITCHING (Preview vs Terminal) ---
document.querySelectorAll('.panel-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active
        document.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.panel-content').forEach(c => c.classList.remove('active'));
        
        // Add active
        tab.classList.add('active');
        const viewId = tab.dataset.view; // 'preview' or 'terminal'
        document.getElementById(viewId === 'preview' ? 'viewPreview' : 'viewTerminal').classList.add('active');
        
        // Trigger run if switching to preview
        if(viewId === 'preview') runCode();
    });
});