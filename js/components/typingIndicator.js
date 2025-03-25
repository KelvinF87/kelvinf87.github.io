export function showTypingIndicator(chatLog, contextPanel, isSplitView) {
  const typingElement = document.createElement("div");
  typingElement.id = "typing-indicator";
  typingElement.classList.add("bot-message", "mb-4");

  typingElement.innerHTML = `
    <div class="flex items-start">
      <div class="w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold mr-3">
        K
      </div>
      <div class="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
        <div class="flex space-x-1">
          <div class="typing-dot w-2 h-2 bg-gray-500 rounded-full"></div>
          <div class="typing-dot w-2 h-2 bg-gray-500 rounded-full"></div>
          <div class="typing-dot w-2 h-2 bg-gray-500 rounded-full"></div>
        </div>
      </div>
    </div>
  `;

  if (isSplitView) {
    contextPanel.appendChild(typingElement);
    contextPanel.scrollTop = contextPanel.scrollHeight;
  } else {
    chatLog.appendChild(typingElement);
    chatLog.scrollTop = chatLog.scrollHeight;
  }
}

// Remove typing indicator
export function removeTypingIndicator(chatLog, contextPanel, isSplitView) {
  const typingIndicator = document.getElementById("typing-indicator");
  if (typingIndicator) {
    typingIndicator.remove();
  }
}