document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const chatLog = document.getElementById("chat-log")
    const messageForm = document.getElementById("message-form")
    const messageInput = document.getElementById("message-input")
    const themeToggle = document.getElementById("theme-toggle")
    const mainContent = document.getElementById("main-content")
    const splitViewTemplate = document.getElementById("split-view-template")
    const splitMessageForm = document.getElementById("split-message-form")
    const splitMessageInput = document.getElementById("split-message-input")
    const contextPanel = document.getElementById("context-panel")
    const codePanel = document.getElementById("code-panel")
    const copyCodeBtn = document.getElementById("copy-code-btn")
  
    // State
    let isSplitView = false
    let lastCodeBlock = null
  
    // API Endpoint - Replace with your actual endpoint
    const API_ENDPOINT = "https://serviairemote.onrender.com/chat"
    // const API_ENDPOINT = "http://localhost:3000/api/chat"
  
    // Theme Toggle
    function initTheme() {
      if (
        localStorage.theme === "dark" ||
        (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  
    themeToggle.addEventListener("click", () => {
      if (document.documentElement.classList.contains("dark")) {
        document.documentElement.classList.remove("dark")
        localStorage.theme = "light"
      } else {
        document.documentElement.classList.add("dark")
        localStorage.theme = "dark"
      }
    })
  
    initTheme()
  
    // Configure marked.js for markdown rendering
    const marked = window.marked
    const hljs = window.hljs
  
    marked.setOptions({
      highlight: (code, lang) => {
        if (lang && hljs.getLanguage(lang)) {
          return hljs.highlight(code, { language: lang }).value
        }
        return hljs.highlightAuto(code).value
      },
      breaks: true,
      gfm: true,
    })
  
    // Handle message submission (for both normal and split view)
    function handleMessageSubmit(e, input) {
      e.preventDefault()
      const messageText = input.value.trim()
      if (messageText === "") return
  
      // Display user message
      displayUserMessage(messageText)
      input.value = ""
  
      // Show typing indicator
      showTypingIndicator()
  
      // Send message to API
      sendMessageToAPI(messageText)
    }
  
    // Normal view message form
    messageForm.addEventListener("submit", (e) => {
      handleMessageSubmit(e, messageInput)
    })
  
    // Split view message form
    splitMessageForm.addEventListener("submit", (e) => {
      handleMessageSubmit(e, splitMessageInput)
    })
  
    // Send message to API
    async function sendMessageToAPI(messageText) {
      try {
        const response = await fetch(API_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: messageText,
              },
              {
                role: "system",
                content: "Respond with helpful, concise information. Use markdown for formatting when appropriate.",
              },
            ],
          }),
        })
  
        // Remove typing indicator
        removeTypingIndicator()
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
  
        const data = await response.json()
  
        // Display bot response
        if (data.choices && data.choices.length > 0) {
          const botResponse = data.choices[0].message.content
          displayBotMessage(botResponse)
        } else {
          displayBotMessage("No response received from the assistant.")
        }
      } catch (error) {
        console.error("Error:", error)
        removeTypingIndicator()
        displayBotMessage("Error communicating with the server. Please try again later.")
      }
    }
  
    // Display user message in both views
    function displayUserMessage(message) {
      const messageElement = createUserMessageElement(message)
      chatLog.appendChild(messageElement)
  
      // If in split view, also add to context panel
      if (isSplitView) {
        const contextMessageElement = createUserMessageElement(message)
        contextPanel.appendChild(contextMessageElement)
      }
  
      scrollToBottom()
    }
  
    // Create user message element
    function createUserMessageElement(message) {
      const messageElement = document.createElement("div")
      messageElement.classList.add("user-message", "mb-4")
  
      messageElement.innerHTML = `
        <div class="flex items-start justify-end">
          <div class="bg-blue-600 text-white p-3 rounded-lg max-w-[80%]">
            <p>${escapeHTML(message)}</p>
          </div>
          <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold ml-3">
            U
          </div>
        </div>
      `
  
      return messageElement
    }
  
    // Display bot message with markdown support
    function displayBotMessage(message) {
      const messageElement = document.createElement("div")
      messageElement.classList.add("bot-message", "mb-4")
  
      // Render markdown to HTML
      const renderedContent = marked.parse(message)
  
      messageElement.innerHTML = `
        <div class="flex items-start">
          <div class="w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold mr-3">
            v
          </div>
          <div class="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg max-w-[80%] markdown-content">
            ${renderedContent}
          </div>
        </div>
      `
  
      chatLog.appendChild(messageElement)
  
      // Apply syntax highlighting to code blocks
      const codeBlocks = messageElement.querySelectorAll("pre code")
      codeBlocks.forEach((block) => {
        hljs.highlightElement(block)
      })
  
      // Check if we should switch to split view
      if (codeBlocks.length > 0 && !isSplitView) {
        switchToSplitView(messageElement, codeBlocks)
      } else if (isSplitView) {
        // Add to context panel
        const contextMessageElement = document.createElement("div")
        contextMessageElement.classList.add("bot-message", "mb-4")
        contextMessageElement.innerHTML = messageElement.innerHTML
        contextPanel.appendChild(contextMessageElement)
  
        // Update code panel with new code blocks
        if (codeBlocks.length > 0) {
          updateCodePanel(codeBlocks)
        }
      }
  
      scrollToBottom()
    }
  
    // Switch to split view
    function switchToSplitView(messageElement, codeBlocks) {
      isSplitView = true
  
      // Clone all existing messages to context panel
      const allMessages = chatLog.querySelectorAll(".user-message, .bot-message")
      allMessages.forEach((msg) => {
        const clone = msg.cloneNode(true)
        contextPanel.appendChild(clone)
      })
  
      // Update code panel with code blocks
      updateCodePanel(codeBlocks)
  
      // Show split view
      mainContent.innerHTML = splitViewTemplate.innerHTML
      mainContent.classList.remove("normal-view")
      mainContent.classList.add("split-view-container")
  
      // Re-get elements that were replaced
      const splitMessageForm = document.getElementById("split-message-form")
      const splitMessageInput = document.getElementById("split-message-input")
      const contextPanel = document.getElementById("context-panel")
      const codePanel = document.getElementById("code-panel")
      const copyCodeBtn = document.getElementById("copy-code-btn")
  
      // Add event listeners for the new elements
      splitMessageForm.addEventListener("submit", (e) => {
        handleMessageSubmit(e, splitMessageInput)
      })
  
      copyCodeBtn.addEventListener("click", copyCodeToClipboard)
  
      // Focus the input
      splitMessageInput.focus()
    }
  
    // Update code panel with new code blocks
    function updateCodePanel(codeBlocks) {
      // Clear existing code
      codePanel.innerHTML = ""
  
      // Get the last code block
      lastCodeBlock = codeBlocks[codeBlocks.length - 1]
  
      // Create a container for the code
      const codeContainer = document.createElement("div")
      codeContainer.classList.add("bg-gray-800", "rounded", "p-4", "text-white")
  
      // Get the parent pre element
      const preElement = lastCodeBlock.parentElement
  
      // Clone the pre element to preserve formatting
      const preClone = preElement.cloneNode(true)
      codeContainer.appendChild(preClone)
  
      // Add to code panel
      codePanel.appendChild(codeContainer)
    }
  
    // Copy code to clipboard
    function copyCodeToClipboard() {
      if (lastCodeBlock) {
        const codeText = lastCodeBlock.textContent
        navigator.clipboard
          .writeText(codeText)
          .then(() => {
            // Show success message
            const originalText = copyCodeBtn.textContent
            copyCodeBtn.textContent = "Copied!"
            setTimeout(() => {
              copyCodeBtn.textContent = originalText
            }, 2000)
          })
          .catch((err) => {
            console.error("Failed to copy code: ", err)
          })
      }
    }
  
    // Show typing indicator
    function showTypingIndicator() {
      const typingElement = document.createElement("div")
      typingElement.id = "typing-indicator"
      typingElement.classList.add("bot-message", "mb-4")
  
      typingElement.innerHTML = `
        <div class="flex items-start">
          <div class="w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold mr-3">
            v
          </div>
          <div class="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
            <div class="flex space-x-1">
              <div class="typing-dot w-2 h-2 bg-gray-500 rounded-full"></div>
              <div class="typing-dot w-2 h-2 bg-gray-500 rounded-full"></div>
              <div class="typing-dot w-2 h-2 bg-gray-500 rounded-full"></div>
            </div>
          </div>
        </div>
      `
  
      if (isSplitView) {
        contextPanel.appendChild(typingElement)
        contextPanel.scrollTop = contextPanel.scrollHeight
      } else {
        chatLog.appendChild(typingElement)
        chatLog.scrollTop = chatLog.scrollHeight
      }
    }
  
    // Remove typing indicator
    function removeTypingIndicator() {
      const typingIndicator = document.getElementById("typing-indicator")
      if (typingIndicator) {
        typingIndicator.remove()
      }
    }
  
    // Scroll to bottom of chat
    function scrollToBottom() {
      if (isSplitView) {
        contextPanel.scrollTop = contextPanel.scrollHeight
      } else {
        chatLog.scrollTop = chatLog.scrollHeight
      }
    }
  
    // Escape HTML to prevent XSS
    function escapeHTML(text) {
      const div = document.createElement("div")
      div.textContent = text
      return div.innerHTML
    }
  
    // Focus input on load
    messageInput.focus()
  })
  
  