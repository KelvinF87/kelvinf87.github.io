import { initTheme } from "./theme.js";
import * as authService from "./services/authService.js";
import * as userService from "./services/userService.js";
import { API_ENDPOINT } from "./config/api.js";
import { escapeHTML } from "./utils/helpers.js";
import {
    displayUserMessage,
    displayBotMessage,
    createUserMessageElement,
} from "./components/message.js";
import {
    showTypingIndicator,
    removeTypingIndicator,
} from "./components/typingIndicator.js";

document.addEventListener("DOMContentLoaded", async () => {
    // DOM Elements
    const chatLog = document.getElementById("chat-log");
    const messageForm = document.getElementById("message-form");
    const messageInput = document.getElementById("message-input");
    const mainContent = document.getElementById("main-content");
    const splitViewTemplate = document.getElementById("split-view-template");
    const splitMessageForm = document.getElementById("split-message-form");
    const splitMessageInput = document.getElementById("split-message-input");
    const contextPanel = document.getElementById("context-panel");
    const codePanel = document.getElementById("code-panel");
    const copyCodeBtn = document.getElementById("copy-code-btn");
    const userNameSpan = document.getElementById("user-name");
    const userNameSpan2 = document.getElementById("user-name2");
    const profilePicImg = document.getElementById("profile-pic");
    const logoutLink = document.getElementById('logout-link');
    const settingsLink = document.querySelector('a[href="settings.html"]'); // Get the settings link
    
    const messagelog = "🇪🇸 Por favor, inicie sesión para enviar mensajes.\n" +
        "🇫🇷 Veuillez vous connecter pour envoyer des messages.\n" +
        "🇩🇪 Bitte melden Sie sich an, um Nachrichten zu senden.\n" +
        "🇮🇹 Per favore, accedi per inviare messaggi.\n" +
        "🇺🇸 Please log in to send messages.";
    // State
    let isSplitView = false;
    let lastCodeBlock = null;
    
    // Theme Initialization
    initTheme();
    
    // Load user info from token
    await loadUserInfo();

    // Configure marked.js for markdown rendering
    const marked = window.marked;
    const hljs = window.hljs;

    marked.setOptions({
        highlight: (code, lang) => {
            if (lang && hljs.getLanguage(lang)) {
                return hljs.highlight(code, { language: lang }).value;
            }
            return hljs.highlightAuto(code).value;
        },
        breaks: true,
        gfm: true,
    });

    // Handle message submission (for both normal and split and verify session)
    async function handleMessageSubmit(e, input) {
        e.preventDefault();
        const messageText = input.value.trim();
        if (messageText === "") return;

        const token = localStorage.getItem("authToken");
        if (!token) {
            console.warn("User not logged in. Cannot send message.");
            displayBotMessage(
                messagelog,
                chatLog,
                contextPanel,
                isSplitView,
                switchToSplitView,
                updateCodePanel
            );
            return;
        }

        //Before all this do the message with this and verifi session.
        try {
            await userService.verifyToken(token); // Verify if session is active
            displayUserMessage(messageText, chatLog, contextPanel, isSplitView); // Display user message
            input.value = "";
            sendMessageToAPI(messageText); // Send message to API
        } catch (error) {
            console.error("Session verification failed. Redirecting to login.", error);
            localStorage.removeItem("authToken"); // Clear the token
            window.location.href = "login.html";
        }
    }

    // Normal view message form
    messageForm.addEventListener("submit", (e) => {
        handleMessageSubmit(e, messageInput);
    });

    // Split view message form
    splitMessageForm.addEventListener("submit", (e) => {
        handleMessageSubmit(e, splitMessageInput);
    });

    // Send message to API
    async function sendMessageToAPI(messageText) {
        const token = localStorage.getItem("authToken");
        if (!token) {
            console.warn("User not logged in. Cannot send message.");
            displayBotMessage(
                messagelog,
                chatLog,
                contextPanel,
                isSplitView,
                switchToSplitView,
                updateCodePanel
            );
            return;
        }

        showTypingIndicator(chatLog, contextPanel, isSplitView); // Show indicator

        try {
            const response = await fetch(API_ENDPOINT + "/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: "user",
                            content: messageText,
                        },
                        {
                            role: "system",
                            content:
                                "Respond with helpful, concise information. Use markdown for formatting when appropriate.",
                        },
                    ],
                }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    // Token might be invalid or expired
                    displayBotMessage(
                        "Your session has expired. Please log in again.",
                        chatLog,
                        contextPanel,
                        isSplitView,
                        switchToSplitView,
                        updateCodePanel
                    );
                    localStorage.removeItem("authToken");
                    window.location.href = "login.html"; // Redirect to login
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            //Try to get all the message at once
            const data = await response.json();

            // Display bot response
            if (data.choices && data.choices.length > 0) {
                const botResponse = data.choices[0].message.content;
                displayBotMessage(
                    botResponse,
                    chatLog,
                    contextPanel,
                    isSplitView,
                    switchToSplitView,
                    updateCodePanel
                );
             
            } else {
                displayBotMessage(
                    "✓",
                    chatLog,
                    contextPanel,
                    isSplitView,
                    switchToSplitView,
                    updateCodePanel
                );
            }
        } catch (error) {
            console.error("Error:", error);
            removeTypingIndicator(chatLog, contextPanel, isSplitView);
            displayBotMessage(
                "✓",
                chatLog,
                contextPanel,
                isSplitView,
                switchToSplitView,
                updateCodePanel
            );
        } finally {
            //This part is to remove when the proccess ends
            removeTypingIndicator(chatLog, contextPanel, isSplitView); // Remove indicator
        }
    }

    function switchToSplitView(messageElement, codeBlocks) {
        isSplitView = true;

        // Clone all existing messages to context panel
        const allMessages = chatLog.querySelectorAll(".user-message, .bot-message");
        allMessages.forEach((msg) => {
            const clone = msg.cloneNode(true);
            contextPanel.appendChild(clone);
        });

        // Update code panel with code blocks
        updateCodePanel(codeBlocks);

        // Show split view
        mainContent.innerHTML = splitViewTemplate.innerHTML;
        mainContent.classList.remove("normal-view");
        mainContent.classList.add("split-view-container");

        // Re-get elements that were replaced
        const splitMessageForm = document.getElementById("split-message-form");
        const splitMessageInput = document.getElementById("split-message-input");
        const contextPanel = document.getElementById("context-panel");
        const codePanel = document.getElementById("code-panel");
        const copyCodeBtn = document.getElementById("copy-code-btn");

        // Add event listeners for the new elements
        splitMessageForm.addEventListener("submit", (e) => {
            handleMessageSubmit(e, splitMessageInput);
        });

        copyCodeBtn.addEventListener("click", copyCodeToClipboard);

        // Focus the input
        splitMessageInput.focus();
    }

    // Update code panel with new code blocks
    function updateCodePanel(codeBlocks) {
        // Clear existing code
        codePanel.innerHTML = "";

        // Get the last code block
        lastCodeBlock = codeBlocks[codeBlocks.length - 1];

        // Create a container for the code
        const codeContainer = document.createElement("div");
        codeContainer.classList.add("bg-gray-800", "rounded", "p-4", "text-white");

        // Get the parent pre element
        const preElement = lastCodeBlock.parentElement;

        // Clone the pre element to preserve formatting
        const preClone = preElement.cloneNode(true);
        codeContainer.appendChild(preClone);

        // Add to code panel
        codePanel.appendChild(codeContainer);
    }

    // Copy code to clipboard
    function copyCodeToClipboard() {
        if (lastCodeBlock) {
            const codeText = lastCodeBlock.textContent;
            navigator.clipboard
                .writeText(codeText)
                .then(() => {
                    // Show success message
                    const originalText = copyCodeBtn.textContent;
                    copyCodeBtn.textContent = "Copied!";
                    setTimeout(() => {
                        copyCodeBtn.textContent = originalText;
                    }, 2000);
                })
                .catch((err) => {
                    console.error("Failed to copy code: ", err);
                });
        }
    }

    // Load User information and display
    async function loadUserInfo() {
        try {
            const token = localStorage.getItem("authToken");
            if (token) {
                //Check if valid token if not logout
                try {
                    await userService.verifyToken(token)
                } catch (error) {
                    localStorage.removeItem("authToken");
                    window.location.href = "login.html";
                    return
                }
                const user = await userService.verifyToken(token);

                // Check if user is undefined or null
                if (!user) {
                    console.warn("User is null or undefined. Token might be invalid.");
                    // Hide the settings link
                    if (settingsLink) {
                        settingsLink.style.display = 'none';
                    }
                    return; // Exit if the user data is not valid
                }
                // Show Setting in localStorage
                if (settingsLink) {
                    settingsLink.style.display = '';
                }

                // Check if the profilePicImg element exists before setting its src
                if (profilePicImg) {
                    profilePicImg.src = user.profilePic || "default-profile-pic.png"; // Set the profile picture
                } else {
                    console.warn("profilePicImg element not found in the DOM.");
                }
                // Check if the userNameSpan element exists before setting its textContent
                if (userNameSpan) {
                    userNameSpan.textContent = user.name || "Unknown User"; // Set the user name
                } else {
                    console.warn("userNameSpan element not found in the DOM.");
                }
                // Check if the userNameSpan element exists before setting its textContent
                if (userNameSpan2) {
                    userNameSpan2.textContent = user.name || "Unknown User"; // Set the user name
                } else {
                    console.warn("userNameSpan element not found in the DOM.");
                }

                document.getElementById('user-info').classList.remove('hidden');
                document.getElementById('auth-links').classList.add('hidden');

            } else {
                // Handle the case where the user is not logged in
                console.warn("User not logged in.");
                // Hide the settings link
                if (settingsLink) {
                    settingsLink.style.display = 'none';
                }
                document.getElementById('user-info').classList.add('hidden');
                document.getElementById('auth-links').classList.remove('hidden');

                return;
            }
        } catch (error) {
            // Handle errors loading user info
            console.error("Error loading user info:", error);
            // Hide the settings link in case of an error
            if (settingsLink) {
                settingsLink.style.display = 'none';
            }

            document.getElementById('user-info').classList.add('hidden');
            document.getElementById('auth-links').classList.remove('hidden');
        }
    }
    // Function to handle logout
    function logout(e) {
        e.preventDefault(); // Prevent default anchor behavior
        localStorage.removeItem('authToken'); // Remove the token
        if (settingsLink) {
            settingsLink.style.display = 'none';
        }

        document.getElementById('user-info').classList.add('hidden');
        document.getElementById('auth-links').classList.remove('hidden');
        window.location.href = 'index.html'; // Redirect to the index page (or login page)
    }

    //Attach eventlistener on load
    if (logoutLink) {
        logoutLink.addEventListener('click', logout);
    } else {
        console.warn("logoutLink element not found in the DOM.");
    }
    // Focus input on load
    messageInput.focus();
});