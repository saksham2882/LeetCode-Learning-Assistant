// Main Content Generation 

// Listen messages from the content_script.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'getAnalysis') {
        
        chrome.storage.sync.get(['geminiApiKey'], function (result) {
            if (!result.geminiApiKey) {
                chrome.tabs.sendMessage(sender.tab.id, {
                    type: 'analysisResult',
                    stage: request.stage,
                    content: 'ERROR: API Key not set. Please set it in the extension popup.'
                });
                return;
            }
            callGeminiAPI(request.problem, request.stage, result.geminiApiKey, sender.tab.id);
        });
        return true;
    }
});


// delay for loading the content
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// --- Gemini API Call ---
async function callGeminiAPI(problem, stage, apiKey, tabId) {
    const model = 'gemini-2.5-flash';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const prompt = generatePrompt(problem, stage);

    const maxRetries = 3;
    let lastError = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "contents": [{ "parts": [{ "text": prompt }] }],
                    "safetySettings": [
                        { "category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE" },
                        { "category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE" },
                        { "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE" },
                        { "category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE" }
                    ]
                })
            });


            // Errors:
            if (response.status === 429) {
                chrome.tabs.sendMessage(tabId, {
                    type: 'analysisResult',
                    stage: stage,
                    content: 'You have exceeded the daily request limit for this model. Please try again tomorrow.'
                });
                return;
            }
            if (response.status === 503) {
                lastError = new Error(`Service Unavailable (503). The server might be temporarily overloaded.`);
                if (attempt < maxRetries) {
                    console.warn(`Attempt ${attempt} failed. Retrying in 2 seconds...`);
                    await sleep(2000);
                    continue;
                }
            }
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }


            // response
            const data = await response.json();
            if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0].text) {
                if (data.candidates && data.candidates[0].finishReason === 'SAFETY') {
                    throw new Error('Response was blocked for safety reasons.');
                }
                throw new Error('Invalid response structure from Gemini API.');
            }

            // validContent response
            const validContent = data.candidates[0].content.parts[0].text;
            chrome.tabs.sendMessage(tabId, {
                type: 'analysisResult',
                stage: stage,
                content: validContent
            });
            return;

        } catch (error) {
            lastError = error;
            console.error(`Gemini API call attempt ${attempt} failed:`, error);
        }
    }

    chrome.tabs.sendMessage(tabId, {
        type: 'analysisResult',
        stage: stage,
        content: `Error: Failed to get analysis after ${maxRetries} attempts. ${lastError.message}`
    });
}


// ----- Prompts ------
function generatePrompt(problem, stage) {
    const baseInstruction = `You are an expert DSA teacher helping a student understand a LeetCode problem.
                                Always follow these rules:
                                - Be beginner-friendly and short.
                                - Do NOT over explain.
                                - Use markdown format (### Headings, bullet points, numbered lists).
                                - Focus only on the **Optimal Approach**.
                                - Keep answers to-the-point and 4-6 lines max.
                                - Avoid long paragraphs and stories.
                            LeetCode Problem: ${problem}
                            `;
    switch (stage) {
        case 'hints':
            return baseInstruction + `  ### 💡 Quick Hints
                                        Give only **2-3 hints**, each in **1 short sentence**:
                                        - Hint should guide the user without revealing the solution.
                                        - Avoid mentioning any algorithm or data structure directly.
                                        - Just help the user "think in the right direction".
                                    `;
        case 'approach':
            return baseInstruction + `  ### 🧠 Optimal Approach (Only)
                                        Describe the **optimal algorithm in 4 points max**:
                                        - What is the idea?
                                        - Why is this the best approach?
                                        - Which technique does it use (like two-pointer, hashmap etc)?
                                        - Why is it efficient?
                                        ✅ Keep it under 4-5 lines.
                                        ❌ Don't write code.
                                    `;
        case 'pseudo':
            return baseInstruction + `  ### 📋 Pseudo Code (Optimal Only)
                                        Write **simple pseudo-code** using English + java code-style keywords.
                                        - Use plain steps like:
                                            - \`function()\`
                                            - \`if condition:\`
                                            - \`for each element in array:\`
                                        - Keep it **under 6 lines**, don't explain each line.
                                        ✅ Format it using a markdown code block.
                                    `;
        case 'solution':
            return baseInstruction + `  ### ✅ Java Code (Optimal Only)
                                        Give clean, **simple** Java code in 10-15 lines max.
                                        - Add only **1-2 important comments**, no over commenting.
                                        - Use good variable names.
                                        - After code, write **a short 3-step explanation**.
                                        ✅ Format the code in a markdown block \`\`\`js
                                    `;
        case 'complexity':
            return baseInstruction + `  ### ⏱ Complexity (Time & Space)
                                        Tell just:
                                        - **Time Complexity:** O(...)
                                        - **Space Complexity:** O(...)
                                        Then give a **2-3 line reason** for each. Don’t go into depth.
                                        ✅ Keep it point wise, no paragraphs.
                                    `;
        default:
            return baseInstruction + "Give a short, helpful, pointwise explanation to guide the user.";
    }
}