import { escapeHTML } from "../utils/helpers.js";

// Display user message in both views
export function displayUserMessage(message, chatLog, contextPanel, isSplitView) {
    const messageElement = createUserMessageElement(message);
    chatLog.appendChild(messageElement);

    // Añadir la clase 'opacity-100' y 'translate-y-0' después de un breve retardo para activar la animación
    setTimeout(() => {
        messageElement.classList.remove('opacity-0', 'translate-y-5');
        messageElement.classList.add('opacity-100', 'translate-y-0');
    }, 10);


    // If in split view, also add to context panel
    if (isSplitView) {
        const contextMessageElement = createUserMessageElement(message);
        contextPanel.appendChild(contextMessageElement);
    }

    scrollToBottom(chatLog, contextPanel, isSplitView);
}

// Create user message element
export function createUserMessageElement(message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add(
        "user-message",
        "mb-4",
        "opacity-0",       // Inicialmente invisible
        "translate-y-5",    // Inicialmente desplazado hacia abajo (20px = 5 * 4px)
        "transition-opacity", // Activa la transición para la opacidad
        "transition-transform", // Activa la transición para la transformación
        "duration-300",     // Duración de la animación: 300ms
        "ease-out"         // Función de temporización: ease-out
    );

    messageElement.innerHTML = `
        <div class="flex items-start justify-end">
            <div class="bg-blue-600 text-white p-3 rounded-lg max-w-[80%]">
                <p>${escapeHTML(message)}</p>
            </div>
            <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold ml-3">
                U
            </div>
        </div>
    `;

    return messageElement;
}

// Display bot message with markdown support
export function displayBotMessage(message, chatLog, contextPanel, isSplitView, switchToSplitView, updateCodePanel) {
    const messageElement = document.createElement("div");
    messageElement.classList.add(
        "bot-message",
        "mb-4",
        "opacity-0",      // Inicialmente invisible
        "scale-90",        // Inicialmente escalado al 90%
        "transition-opacity",// Activa la transición para la opacidad
        "transition-transform",// Activa la transición para la transformación
        "duration-300",    // Duración de la animación: 300ms
        "ease-out"        // Función de temporización: ease-out
    );
    // Render markdown to HTML
    const renderedContent = marked.parse(message);

    messageElement.innerHTML = `
    <div class="flex items-start">
      <div class="w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold mr-3">
        K
      </div>
      <div class="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg max-w-[80%] markdown-content">
        ${renderedContent}
      </div>
    </div>
  `;

    chatLog.appendChild(messageElement);
    setTimeout(() => {
        messageElement.classList.remove('opacity-0', 'scale-90');
        messageElement.classList.add('opacity-100', 'scale-100');
    }, 10);
    // Apply syntax highlighting to code blocks
    const codeBlocks = messageElement.querySelectorAll("pre code");
    codeBlocks.forEach((block) => {
        hljs.highlightElement(block);
    });

    // Check if we should switch to split view
    if (codeBlocks.length > 0 && !isSplitView) {
        switchToSplitView(messageElement, codeBlocks);
    } else if (isSplitView) {
        // Add to context panel
        const contextMessageElement = document.createElement("div");
        contextMessageElement.classList.add("bot-message", "mb-4");
        contextMessageElement.innerHTML = messageElement.innerHTML;
        contextPanel.appendChild(contextMessageElement);

        // Update code panel with new code blocks
        if (codeBlocks.length > 0) {
            updateCodePanel(codeBlocks);
        }
    }

    scrollToBottom(chatLog, contextPanel, isSplitView);
}

function scrollToBottom(chatLog, contextPanel, isSplitView) {
    if (isSplitView) {
        contextPanel.scrollTop = contextPanel.scrollHeight;
    } else {
        chatLog.scrollTop = chatLog.scrollHeight;
    }
}