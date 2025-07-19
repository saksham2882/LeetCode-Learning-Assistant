// --------------- This script is injected into the LeetCode problem page. ------------------

// isUIRunning helps to only inject UI once.
let isUIRunning = false;
let panel;

function main() {
    if (isUIRunning) return;

    // find area to inject button
    const targetArea = document.querySelector('div.flex.items-center.gap-4');
    if (targetArea) {
        const analyzeBtn = document.createElement('button');
        analyzeBtn.textContent = 'Analyze Problem';
        analyzeBtn.id = 'analyze-btn';
        analyzeBtn.onclick = togglePanel;
        targetArea.appendChild(analyzeBtn);

        // inject panel
        fetch(chrome.runtime.getURL('panel.html'))
            .then(response => response.text())
            .then(html => {
                document.body.insertAdjacentHTML('beforeend', html);
                panel = document.getElementById('panel');
                setupPanelBtn();
            }).catch(err => console.error('Failed to load panel HTML:', err));

        isUIRunning = true;
    }
}

// toggle panel
function togglePanel() {
    if (!panel) return;
    panel.classList.toggle('visible');
}

// setup panel button
function setupPanelBtn() {
    const closeBtn = document.getElementById('close-btn');
    closeBtn.addEventListener('click', togglePanel);

    const revealBtn = document.querySelectorAll('.btn');
    revealBtn.forEach(button => {
        button.addEventListener('click', handleRevealBtn);
    });

    const retryBtns = document.querySelectorAll('.btn-retry');
    retryBtns.forEach(button => {
        button.addEventListener('click', handleRevealBtn);
    });
}


// handle reveal button click
function handleRevealBtn(event) {
    const button = event.target;
    const stage = button.dataset.stage;

    let problemTitle = '';
    let problemDescription = '';

    // find title using different methods
    const titleSelectors = [
        '.text-title-large a', 'div[data-cy="question-title"]', '.mr-2.text-label-1'
    ];
    let title = null;
    for (const selector of titleSelectors) {
        title = document.querySelector(selector);
        if (title) {
            problemTitle = title.innerText;
            break;
        }
    }

    // find description element
    const descSelectors = [
        'div[data-track-load="description_content"]',
        'div[class*="elfjS"]',
        'div.prose',
        'div[class^="description__"]',
        'div[class*="question-content"]'
    ];
    let description = null;
    for (const selector of descSelectors) {
        description = document.querySelector(selector);
        if (description) {
            problemDescription = description.innerText;
            break;
        }
    }

    if (!problemTitle || !problemDescription) {
        console.error("Error Info:", {
            titleFound: !!problemTitle,
            descriptionFound: !!problemDescription,
            url: window.location.href
        });
        alert("LeetCode Assistant Error: Could not find the problem title or description on the page. LeetCode may have updated its layout. Please check the browser console for more details.");

        // try again
        const revealBtn = document.querySelector(`.btn[data-stage="${stage}"]`);
        if(revealBtn) {
            revealBtn.textContent = `Reveal ${stage.charAt(0).toUpperCase() + stage.slice(1)}`;
            revealBtn.disabled = false;
        }
        return;
    }


    const problemText = `Title: ${problemTitle}\n\nDescription:\n${problemDescription}`;

    // --- hide retry and show loading ---
    const retryBtn = document.querySelector(`.btn-retry[data-stage="${stage}"]`);
    if (retryBtn) {
        retryBtn.style.display = 'none';
    }
    const revealBtn = document.querySelector(`.btn[data-stage="${stage}"]`);
    if (revealBtn) {
        revealBtn.textContent = 'Loading...';
        revealBtn.disabled = true;
        revealBtn.style.display = 'inline-block';
    }

    // send request to background.js
    chrome.runtime.sendMessage({
        type: 'getAnalysis',
        stage: stage,
        problem: problemText
    });
}


// receive response from background.js script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'analysisResult') {
        const { stage, content } = message;

        const contentDiv = document.getElementById(`${stage}-content`);
        const button = document.querySelector(`.btn[data-stage="${stage}"]`);
        const retryBtn = document.querySelector(`.btn-retry[data-stage="${stage}"]`);

        if (contentDiv && button && retryBtn) {
            if (content.startsWith('Error:')) {
                contentDiv.innerHTML = `<p class="error-message">${content}</p>`;
                contentDiv.style.display = 'block';
                button.style.display = 'none';
                retryBtn.style.display = 'inline-block';
            } else {
                contentDiv.innerHTML = formatMarkdown(content);
                contentDiv.style.display = 'block';
                button.style.display = 'none';
                retryBtn.style.display = 'none';
            }
        }
    }
});


// ---  markdown formatting  ---
function formatMarkdown(text) {
    let Text = text.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
        const language = lang || 'plaintext';
        return `<pre><code class="language-${language}">${code.trim()}</code></pre>`;
    });

    // Headings
    Text = Text.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    Text = Text.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    Text = Text.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold text
    Text = Text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Unordered list (grouped)
    Text = Text.replace(/(?:^|\n)[*-] (.*?)(?=\n|$)/g, (_, item) => `<li>${item}</li>`);
    Text = Text.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');
    Text = Text.replace(/<\/ul>\s*<ul>/g, '');

    // Ordered list (grouped)
    Text = Text.replace(/(?:^|\n)\d+\. (.*?)(?=\n|$)/g, (_, item) => `<li>${item}</li>`);
    Text = Text.replace(/(<li>[\s\S]*?<\/li>)/g, '<ol>$1</ol>');
    Text = Text.replace(/<\/ol>\s*<ol>/g, '');

    // Paragraphs
    Text = Text.split('\n').map(p => {
        if (p.trim() === '' || p.startsWith('<h') || p.startsWith('<ul') || p.startsWith('<ol') || p.startsWith('<pre')) {
            return p;
        }
        return `<p>${p}</p>`;
    }).join('');

    return Text;
}


// detect changes in the page
const detect = new MutationObserver((mutations) => {
    if (window.location.href.includes('/problems/') && !document.getElementById('analyze-btn')) {
        // delay for load completely
        setTimeout(main, 1000);
    }
});
detect.observe(document.body, { childList: true, subtree: true });


// run Extension
setTimeout(main, 1500);