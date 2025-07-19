// runs when clicks the extension icon.

document.addEventListener('DOMContentLoaded', function () {
    const apiKeyInput = document.getElementById('apiKey');
    const saveButton = document.getElementById('saveKey');
    const statusDiv = document.getElementById('status');
    const closeButton = document.getElementById('close-btn');

    // check for API Key
    chrome.storage.sync.get(['geminiApiKey'], function (result) {
        if (result.geminiApiKey) {
            apiKeyInput.value = result.geminiApiKey;
            statusDiv.textContent = 'API Key is loaded.';
            statusDiv.style.color = 'green';
        } else {
            statusDiv.textContent = 'API Key not set.';
            statusDiv.style.color = 'red';
        }
    });

    // save API Key
    saveButton.addEventListener('click', function () {
        const apiKey = apiKeyInput.value.trim();
        
        if (apiKey) {
            // Save the key to Chrome's synchronized storage
            chrome.storage.sync.set({ 'geminiApiKey': apiKey }, function () {
                statusDiv.textContent = 'API Key saved successfully!';
                statusDiv.style.color = 'green';
                setTimeout(() => { statusDiv.textContent = ''; }, 3000);
            });
        } else {
            statusDiv.textContent = 'Please enter a valid API key.';
            statusDiv.style.color = 'red';
        }
    });

    // close the popup
    closeButton.addEventListener('click', function () {
        window.close();
    });
});