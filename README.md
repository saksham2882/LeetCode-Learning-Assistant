# LeetCode Learning Assistant 🚀

![LeetCode Assistant Icon](/screenshots/banner.png)  
_A Chrome extension to supercharge your LeetCode problem-solving with AI-powered guidance._

---
## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Browser Support](#browser-support)
- [Prerequisites](#prerequisites)
- [Screenshots](#screenshots)
- [How It Works](#how-it-works)
- [Installation](#installation)
  - [API Key Setup](#api-key-setup)
  - [Using in LeetCode](#using-in-leetcode)
- [File Structure](#file-structure)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)

---

## Demo 🎥

Check out a quick demo on youtube! 

<a href="https://youtu.be/OhWyguzOLOg?si=HWSQhsuwXnn7AH2F">
  <img src="/screenshots/demo-img.png" alt="Demo Video" width="100%">
</a>

<br>

---

## Project Overview

The **LeetCode Learning Assistant** is a Chrome extension designed to enhance your LeetCode problem-solving experience. It integrates directly into LeetCode problem pages, providing a sleek, sliding panel with **AI-powered** guidance using the **Gemini 2.5 Flash** API. <br>
From high-level hints to complete Java solutions and complexity analysis, this tool supports coders at all levels with a structured, step-by-step learning path. Its modern UI, robust error handling, and secure API key management make it a must-have for mastering coding challenges.

---
## Features

- **Seamless Integration :** Adds an "Analyze Problem" button on LeetCode problem pages.

- **Structured Guidance :**
    - **Hints :** 3-4 concise, numbered hints to spark logical thinking without revealing solutions.
    - **Algorithmic Approach :** Outlines the optimal data structure and algorithm with numbered steps.
    -  **Pseudocode :** Language-agnostic pseudocode in numbered steps for clarity.
    -  **Solution :** Complete, well-commented Java code with a flow explanation.
    -  **Complexity Analysis :** Time and space complexity with concise reasoning.
      
- **Modern UI :** Responsive sliding panel with custom scrollbar and syntax-highlighted code.

- **Secure API Key Storage :** Save your Gemini API key via the extension popup.
  
- **Robust Error Handling :** Clear error messages and retry logic for API failures.
  
- **Formatted Responses :** Markdown-formatted output with proper code blocks for readability.

---
## Browser Support

The extension is fully tested and supported on:
- **Google Chrome**
- **Microsoft Edge**

It also work on other Chromium-based browsers (e.g., **Brave**, **Opera**), but official support to Chrome and Edge.

---
## Prerequisites

Before installing, ensure you have:
- **Google Chrome** or **Microsoft Edge** (latest version recommended).
- A valid **Gemini API key** from [Google AI Studio](https://aistudio.google.com/).

---
## Screenshots

| Image | Description |
|-------|-------------|
| ![Extension Popup](/screenshots/popup-btn.PNG) | Shows the extension icon and API key settings popup. |
| ![Analyze Button](/screenshots/analyze-btn.PNG) | Displays the "Analyze Problem" button on a LeetCode problem page. |
| ![Assistant Panel](/screenshots/panel.png) | Shows the main sliding panel of the LeetCode Learning Assistant. |
| ![Generated Content](/screenshots/hint.png) | Displays AI-generated content (e.g., hints or code) in the panel. |

---
## How It Works

- ### API Key Setup
1. Click the **extension icon** in the browser toolbar to open the **API Key** popup.
2. Enter your **Gemini API key** in the input field.
3. Click **"Save Key"** to store the key securely.
4. Verify the confirmation message (green for success, red for errors).

- ### Using in LeetCode
1. Navigate to a LeetCode problem page (e.g., `https://leetcode.com/problems/two-sum/`).
2. Click the **"Analyze Problem"** button to open the sliding assistant panel.
3. Use the **"Reveal"** buttons to access:
   - **Hints :** 3-4 short hints to guide your thinking.
   - **Approach :** Data structure and algorithm details.
   - **Pseudocode :** Step-by-step pseudocode for the optimal solution.
   - **Solution :** Java code with comments and explanation.
   - **Complexity :** Time and space complexity analysis.
4. Click the close button (×) to hide the panel.

---
## Installation

Follow these steps to set up the extension:

1. Clone or Download the Repository:
   ```bash
   git clone https://github.com/saksham2882/LeetCode-Learning-Assistant.git
   ```
   Or download and extract the ZIP file.

2. Open Extensions Page:
   - **Chrome**: Go to `chrome://extensions/`.
   - **Edge**: Go to `edge://extensions/`.

3. Enable Developer Mode:
   - Toggle "Developer mode" (top-right) to ON.

4. Load Unpacked Extension:
   - Click "Load unpacked" and select the `leetcode-learning-assistant` folder.

5. Set API Key:
   - Click the extension icon in the browser toolbar.
   - Enter your Gemini API key in the popup and click "Save Key".

6. Verify Setup:
   - Visit a LeetCode problem page (e.g., `https://leetcode.com/problems/two-sum/`).
   - Confirm the "Analyze Problem" button appears.

---
## File Structure

```
leetcode-assistant/
├── background.js          # Service worker for Gemini API calls
├── content_script.js      # Injects UI and handles LeetCode page interactions
├── icons/                 # Extension icons
├── screenshots/           # screenshots
├── manifest.json          # Extension configuration
├── panel.html             # HTML for the assistant panel
├── popup.html             # HTML for the API key settings popup
├── popup.js               # Logic for the popup
└── styles.css             # Styles for the button and panel
```

---
## Technologies Used

| Technology | Description |
|------------|-------------|
| HTML5  | Structures the popup and assistant panel UI. |
| CSS3   | Styles the UI with responsive design and animations. |
| JavaScript | Powers the extension’s logic and API communication. |
| Gemini 2.5 Flash Model API | Generates AI-powered hints, approaches, pseudocode, solutions, and complexity analysis. |
| Chrome Extension APIs | Enables storage (`chrome.storage`), messaging (`chrome.runtime`), and tab interactions (`chrome.tabs`). |

---
## Contributing

We welcome contributions to enhance the LeetCode Learning Assistant! To contribute:

1. Fork the Repository:
   ```bash
   git fork https://github.com/saksham2882/LeetCode-Learning-Assistant.git
   ```
2. Create a Feature Branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make Changes: Implement your feature or bug fix.

4. Test Locally:
   - Load the updated extension in Chrome/Edge via "Load unpacked".
   - Test on multiple LeetCode problems to ensure compatibility.
5. Commit and Push:
   ```bash
   git commit -m "Add your feature description"
   git push origin feature/your-feature-name
   ```
6. Submit a Pull Request: Open a PR on GitHub with a detailed description of changes.
7. Report Issues: Open an issue for bugs or feature suggestions.



---
